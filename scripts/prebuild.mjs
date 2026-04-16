/**
 * @fileoverview Prebuild script for Cloudflare Workers deployment.
 *
 * Performs three operations:
 * 1. Unshallows the git repository to access full commit history
 * 2. Generates a timestamp map from git history for accurate
 *    "Last updated" dates, bypassing @napi-rs/simple-git which
 *    returns incorrect dates on unshallowed repositories
 * 3. Generates metadata manifest from R2 object metadata
 *
 * Usage: node scripts/prebuild.mjs
 */

import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cloudflare } from '../src/config/variables/docs.js'
import { reflections, subsite } from '../src/config/variables/claude.js'

const bucket = cloudflare.bucket.name
const bucketMediaPrefix = `public/${subsite.path}${reflections.section}/`
const bucketPrefix = `src/content/${subsite.path}${reflections.section}/`
const cwd = process.cwd()
const outputDir = join(cwd, '.next')
const outputFile = join(outputDir, 'timestamps.json')

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
 * Generates media files from R2 bucket into the public directory.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @returns {Promise<Object>} Object with generated and deleted counts
 */
async function generateR2Media(s3) {
  const list = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: bucketMediaPrefix
  }))
  if (!list.Contents?.length) {
    return { generated: 0, deleted: 0 }
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
  return { generated: count, deleted }
}

/**
 * Generates metadata manifest and uploads it to R2.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @param {Array} metadata - Decoded metadata entries
 * @returns {Promise<number>} Number of metadata entries generated
 */
async function generateMetadata(s3, metadata) {
  if (!metadata.length) {
    return 0
  }
  const objects = metadata.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: 'metadata/objects.json',
    Body: JSON.stringify({ objects, total: objects.length }),
    ContentType: 'application/json'
  }))
  return objects.length
}

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
    const pluralRules = new Intl.PluralRules('en-US')
    const plural = (count, singular, plural) => `${count} ${pluralRules.select(count) === 'one' ? singular : plural}`
    const media = await generateR2Media(s3)
    console.info(`Generated ${plural(media.generated, 'media file', 'media files')}, deleted ${plural(media.deleted, 'orphaned media file', 'orphaned media files')}`)
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: bucketPrefix
    }))
    const metadataEntries = []
    for (const obj of (list.Contents || [])) {
      const head = await s3.send(new HeadObjectCommand({
        Bucket: bucket,
        Key: obj.Key
      }))
      const entry = { key: obj.Key, ...head.Metadata }
      if (entry.description) {
        entry.description = decodeURIComponent(entry.description)
      }
      if (entry.tags) {
        try {
          entry.tags = JSON.parse(entry.tags)
        } catch {
          console.warn(`Failed to parse tags for ${obj.Key}`)
        }
      }
      metadataEntries.push(entry)
    }
    const metadata = await generateMetadata(s3, metadataEntries)
    console.info(`Generated metadata manifest with ${plural(metadata, 'entry', 'entries')}`)
  }
} catch (error) {
  console.error('Failed R2 operations:', error.message)
}
