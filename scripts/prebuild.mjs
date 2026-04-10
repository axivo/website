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
import { existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cloudflare } from '../src/config/variables/docs.js'
import { reflections, subsite } from '../src/config/variables/claude.js'

const bucket = cloudflare.r2.bucket
const bucketMediaPrefix = `public/${subsite.path}${reflections.section}/`
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
 * Builds an index page for a reflection year, month, or day directory.
 *
 * @param {Array<string>} parts - Date parts: [year], [year, month], or [year, month, day]
 * @returns {string} MDX content for the index page
 */
function buildIndex(parts) {
  const [year, month, day] = parts
  const monthName = month ? monthNames[parseInt(month, 10) - 1] : ''
  const dayNum = day ? parseInt(day, 10) : null
  let title
  let seoTitle
  let phrase
  if (day) {
    title = `${dayNum}`
    seoTitle = `${monthName} ${dayNum}, ${year}`
    phrase = `${monthName} ${dayNum}, ${year}`
  } else if (month) {
    title = monthName
    seoTitle = `${monthName} ${year}`
    phrase = `${monthName} ${year}`
  } else {
    title = `"${year}"`
    seoTitle = null
    phrase = year
  }
  const lines = [
    '---',
    'asIndexPage: true',
    `title: ${title}`
  ]
  if (seoTitle) {
    lines.push(`seoTitle: ${seoTitle}`)
  }
  lines.push(
    'description: >-',
    `  Reflections written by Claude instances during ${phrase} collaborative sessions.`,
    '---',
    '',
    `export const date = "${parts.join('/')}";`,
    'import { Reflections, Title } from "@axivo/website";',
    '',
    '# <Title date={date} />',
    '',
    '{/* prettier-ignore */}',
    '<Reflections date={date}>',
    '## Reflections',
    '</Reflections>',
    ''
  )
  return lines.join('\n')
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
 * Removes orphaned files and empty directories under year-rooted subdirectories.
 * Only walks directories matching a four-digit year pattern, leaving any
 * sibling tracked files outside that scope untouched.
 *
 * @param {string} rootDir - Absolute path to the root directory to scan
 * @param {Set<string>} expected - Set of absolute paths that should be preserved
 * @returns {number} Number of files deleted
 */
function cleanupOrphans(rootDir, expected) {
  if (!existsSync(rootDir)) {
    return 0
  }
  let deleted = 0
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      const stats = statSync(fullPath)
      if (stats.isDirectory()) {
        walk(fullPath)
        if (!readdirSync(fullPath).length) {
          rmdirSync(fullPath)
        }
        continue
      }
      if (!expected.has(fullPath)) {
        unlinkSync(fullPath)
        deleted++
      }
    }
  }
  for (const entry of readdirSync(rootDir)) {
    if (!/^\d{4}$/.test(entry)) {
      continue
    }
    const yearDir = join(rootDir, entry)
    walk(yearDir)
    if (!readdirSync(yearDir).length) {
      rmdirSync(yearDir)
    }
  }
  return deleted
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
    return { generated: 0, deleted: 0 }
  }
  const expected = new Set()
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
    expected.add(filePath)
    count++
    const relativeKey = obj.Key.slice(bucketPrefix.length)
    const match = relativeKey.match(/^(\d{4})\/(\d{2})\/(\d{2})\//)
    if (match) {
      const [, year, month, day] = match
      indexDirs.add(`${year}/${month}/${day}`)
      indexDirs.add(`${year}/${month}`)
      indexDirs.add(year)
    }
  }
  for (const dir of indexDirs) {
    const indexPath = join(cwd, bucketPrefix, dir, 'index.mdx')
    expected.add(indexPath)
    if (existsSync(indexPath)) {
      continue
    }
    const parts = dir.split('/')
    const content = buildIndex(parts)
    mkdirSync(dirname(indexPath), { recursive: true })
    writeFileSync(indexPath, content)
    count++
  }
  const deleted = cleanupOrphans(join(cwd, bucketPrefix), expected)
  return { generated: count, deleted }
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
    return { downloaded: 0, deleted: 0 }
  }
  const expected = new Set()
  let count = 0
  for (const obj of list.Contents) {
    const filePath = join(cwd, obj.Key)
    expected.add(filePath)
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
  const deleted = cleanupOrphans(join(cwd, bucketMediaPrefix), expected)
  return { downloaded: count, deleted }
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
    const stubs = await generateR2Stubs(s3)
    const wordGenerated = stubs.generated === 1 ? 'stub' : 'stubs'
    const wordDeleted = stubs.deleted === 1 ? 'stub' : 'stubs'
    console.info(`Generated ${stubs.generated} R2 ${wordGenerated}, deleted ${stubs.deleted} orphaned R2 ${wordDeleted}`)
    const media = await downloadR2Media(s3)
    console.info(`Downloaded ${media.downloaded} R2 media, deleted ${media.deleted} orphaned media`)
  }
} catch (error) {
  console.error('Failed R2 operations:', error.message)
}
