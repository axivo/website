/**
 * @fileoverview Prebuild script for Cloudflare Workers deployment.
 *
 * Performs three operations:
 * 1. Unshallows the git repository to access full commit history
 * 2. Generates a timestamp map from git history for accurate
 *    "Last updated" dates, bypassing @napi-rs/simple-git which
 *    returns incorrect dates on unshallowed repositories
 * 3. Generates frontmatter-only stub files from R2 object metadata
 *    for reflection entries served dynamically from R2 storage
 *
 * Usage: node scripts/prebuild.mjs
 */

import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cloudflare } from '../src/config/variables/docs.js'
import { reflections, subsite } from '../src/config/variables/claude.js'

const bucket = cloudflare.r2.bucket
const bucketMediaPrefix = `public/${subsite.path}${reflections.section}/media/`
const bucketPrefix = `src/content/${subsite.path}${reflections.section}/`
const cwd = process.cwd()
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const outputDir = join(cwd, '.next')
const outputFile = join(outputDir, 'timestamps.json')

/**
 * Gets the last commit timestamp for each tracked file using git log.
 * Uses a COMMIT: prefix delimiter to avoid ambiguity with filenames.
 *
 * @returns {object} Map of relative file paths to epoch milliseconds
 */
function getTimestamps() {
  const result = execSync(
    'git log --format="COMMIT:%at" --name-only --diff-filter=ACMR HEAD',
    { cwd, encoding: 'utf8' }
  )
  const timestamps = {}
  let currentTime = null
  for (const line of result.split('\n')) {
    if (!line) {
      continue
    }
    const match = line.match(/^COMMIT:(\d+)$/)
    if (match) {
      currentTime = Number(match[1]) * 1000
    } else if (currentTime !== null && !timestamps[line]) {
      timestamps[line] = currentTime
    }
  }
  return timestamps
}

/**
 * Builds a day index page for a reflection date directory.
 *
 * @param {string} year - Four-digit year
 * @param {string} month - Two-digit month
 * @param {string} day - Two-digit day
 * @returns {string} MDX content for day index
 */
function buildDayIndex(year, month, day) {
  const monthName = monthNames[parseInt(month, 10) - 1]
  const dayNum = parseInt(day, 10)
  return [
    '---',
    'asIndexPage: true',
    `title: ${dayNum}`,
    `seoTitle: ${monthName} ${dayNum}, ${year}`,
    'description: >-',
    `  Reflections written by Claude instances during ${monthName} ${dayNum}, ${year} collaborative sessions.`,
    '---',
    '',
    `export const date = "${year}/${month}/${day}";`,
    'import { Reflections, Title } from "@axivo/website";',
    '',
    '# <Title date={date} />',
    '',
    '{/* prettier-ignore */}',
    '<Reflections date={date}>',
    '## Reflections',
    '</Reflections>',
    ''
  ].join('\n')
}

/**
 * Builds a month index page for a reflection month directory.
 *
 * @param {string} year - Four-digit year
 * @param {string} month - Two-digit month
 * @returns {string} MDX content for month index
 */
function buildMonthIndex(year, month) {
  const monthName = monthNames[parseInt(month, 10) - 1]
  return [
    '---',
    'asIndexPage: true',
    `title: ${monthName}`,
    `seoTitle: ${monthName} ${year}`,
    'description: >-',
    `  Reflections written by Claude instances during ${monthName} ${year} collaborative sessions.`,
    '---',
    '',
    `export const date = "${year}/${month}";`,
    'import { Reflections, Title } from "@axivo/website";',
    '',
    '# <Title date={date} />',
    '',
    '{/* prettier-ignore */}',
    '<Reflections date={date}>',
    '## Reflections',
    '</Reflections>',
    ''
  ].join('\n')
}

/**
 * Builds a year index page for a reflection year directory.
 *
 * @param {string} year - Four-digit year
 * @returns {string} MDX content for year index
 */
function buildYearIndex(year) {
  return [
    '---',
    'asIndexPage: true',
    `title: "${year}"`,
    'description: >-',
    `  Reflections written by Claude instances during ${year} collaborative sessions.`,
    '---',
    '',
    `export const date = "${year}";`,
    'import { Reflections, Title } from "@axivo/website";',
    '',
    '# <Title date={date} />',
    '',
    '{/* prettier-ignore */}',
    '<Reflections date={date}>',
    '## Reflections',
    '</Reflections>',
    ''
  ].join('\n')
}

/**
 * Builds a frontmatter-only stub from R2 object metadata.
 *
 * @param {object} metadata - R2 custom metadata
 * @returns {string} YAML frontmatter block
 */
function buildStub(metadata) {
  const lines = ['---']
  if (metadata.template) lines.push(`template: ${metadata.template}`)
  if (metadata.title) lines.push(`title: ${metadata.title}`)
  if (metadata.date) lines.push(`date: ${metadata.date}`)
  if (metadata.description) {
    lines.push('description: >-')
    lines.push(`  ${decodeURIComponent(metadata.description)}`)
  }
  if (metadata.author) lines.push(`author: ${metadata.author}`)
  if (metadata.source) lines.push(`source: ${metadata.source}`)
  if (metadata.tags) {
    const tags = JSON.parse(metadata.tags)
    lines.push('tags:')
    for (const tag of tags) {
      lines.push(`  - ${tag}`)
    }
  }
  lines.push('bucket: true')
  lines.push('---', '')
  return lines.join('\n')
}

/**
 * Generates frontmatter-only stub files from R2 object metadata.
 * Stubs provide Nextra page map entries for R2-backed reflection pages.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @returns {Promise<number>} Number of stubs generated
 */
async function generateR2Stubs(s3) {
  const list = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: bucketPrefix
  }))
  if (!list.Contents?.length) {
    console.info('No R2 objects found, skipping stub generation')
    return 0
  }
  const indexDirs = new Set()
  let count = 0
  for (const obj of list.Contents) {
    const filePath = join(cwd, obj.Key)
    const head = await s3.send(new HeadObjectCommand({
      Bucket: bucket,
      Key: obj.Key
    }))
    const stub = buildStub(head.Metadata)
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, stub)
    count++
    const relative = obj.Key.slice(bucketPrefix.length)
    const match = relative.match(/^(\d{4})\/(\d{2})\/(\d{2})\//)
    if (match) {
      const [, year, month, day] = match
      indexDirs.add(`${year}/${month}/${day}`)
      indexDirs.add(`${year}/${month}`)
      indexDirs.add(year)
    }
  }
  for (const dir of indexDirs) {
    const indexPath = join(cwd, bucketPrefix, dir, 'index.mdx')
    if (existsSync(indexPath)) continue
    const parts = dir.split('/')
    let content
    if (parts.length === 3) {
      content = buildDayIndex(parts[0], parts[1], parts[2])
    } else if (parts.length === 2) {
      content = buildMonthIndex(parts[0], parts[1])
    } else {
      content = buildYearIndex(parts[0])
    }
    mkdirSync(dirname(indexPath), { recursive: true })
    writeFileSync(indexPath, content)
    count++
  }
  return count
}

/**
 * Downloads media files from R2 bucket into the public directory.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @returns {Promise<number>} Number of media files downloaded
 */
async function downloadR2Media(s3) {
  const list = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: bucketMediaPrefix
  }))
  if (!list.Contents?.length) {
    return 0
  }
  let count = 0
  for (const obj of list.Contents) {
    const filePath = join(cwd, obj.Key)
    if (existsSync(filePath) && statSync(filePath).size === obj.Size) {
      continue
    }
    const response = await s3.send(new GetObjectCommand({
      Bucket: bucket,
      Key: obj.Key
    }))
    const bytes = await response.Body.transformToByteArray()
    mkdirSync(dirname(filePath), { recursive: true })
    writeFileSync(filePath, bytes)
    count++
  }
  return count
}

try {
  execSync('git fetch --unshallow', { cwd, stdio: 'pipe' })
} catch {
  console.info('Repository already unshallowed or fully cloned')
}
mkdirSync(outputDir, { recursive: true })
try {
  const timestamps = getTimestamps()
  writeFileSync(outputFile, JSON.stringify(timestamps))
  console.info(`Generated timestamps for ${Object.keys(timestamps).length} files`)
} catch (error) {
  console.error('Failed to generate timestamps:', error.message)
  process.exit(1)
}
try {
  if (!process.env.R2_ENDPOINT) {
    config({ path: join(cwd, '.dev.vars') })
  }
  if (!process.env.R2_ENDPOINT) {
    console.info('R2 credentials not found, skipping R2 operations')
  } else {
    const s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    })
    const stubCount = await generateR2Stubs(s3)
    console.info(`Generated ${stubCount} R2 stubs`)
    const mediaCount = await downloadR2Media(s3)
    console.info(`Downloaded ${mediaCount} R2 media files`)
  }
} catch (error) {
  console.error('Failed R2 operations:', error.message)
}
