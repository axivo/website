/**
 * @fileoverview Prebuild script for Cloudflare Workers deployment.
 *
 * Performs four operations:
 * 1. Unshallows the git repository to access full commit history
 * 2. Generates a timestamp map from git history for accurate
 *    "Last updated" dates, bypassing @napi-rs/simple-git which
 *    returns incorrect dates on unshallowed repositories
 * 3. Generates metadata manifests for all R2-backed collections
 * 4. Purges Cloudflare edge cache for configured route prefixes
 *
 * Usage: node scripts/prebuild.mjs
 */

import { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import Cloudflare from 'cloudflare'
import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmdirSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { meta as blog } from '../src/config/variables/blog.js'
import { meta as claude } from '../src/config/variables/claude.js'
import { cloudflare, domain } from '../src/config/variables/global.js'

const bucket = cloudflare.bucket.name
const cwd = process.cwd()
const fetchCacheDir = join(cwd, '.next', 'cache', 'fetch-cache')
const outputDir = join(cwd, '.next')
const outputFile = join(outputDir, 'timestamps.json')
const pluralRules = new Intl.PluralRules('en-US')
const plural = (count, singular, pluralForm) => `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

const collections = [
  {
    bucketPrefix: `src/content/${claude.source.path}/${claude.reflections.path}/`,
    mediaPrefix: `public/${claude.source.path}/${claude.reflections.path}/`,
    metadataKey: cloudflare.bucket.metadata.reflections,
    name: 'reflections'
  },
  {
    bucketPrefix: `src/content/${blog.source.path}/`,
    mediaPrefix: `public/${blog.source.path}/`,
    metadataKey: cloudflare.bucket.metadata.blog,
    name: 'blog'
  }
]

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
 * Generates metadata manifest and uploads it to R2.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @param {string} metadataKey - R2 key for the manifest
 * @param {Array} objects - Decoded metadata objects
 * @returns {Promise<number>} Number of metadata objects generated
 */
async function generateMetadata(s3, metadataKey, objects) {
  if (!objects.length) {
    return 0
  }
  objects.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: metadataKey,
    Body: JSON.stringify({ objects, total: objects.length }),
    ContentType: 'application/json'
  }))
  return objects.length
}

/**
 * Generates media files from R2 bucket into the public directory.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @param {string} mediaPrefix - R2 prefix for media files
 * @returns {Promise<Object>} Object with generated and deleted counts
 */
async function generateR2Media(s3, mediaPrefix) {
  const list = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: mediaPrefix
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
  const deleted = cleanupOrphans(join(cwd, mediaPrefix), expected)
  return { generated: count, deleted }
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

/**
 * Lists all objects under a prefix and enriches each with decoded R2
 * custom metadata.
 *
 * @param {S3Client} s3 - Configured S3 client
 * @param {string} bucketPrefix - R2 prefix for the collection
 * @returns {Promise<object[]>} Array of objects with metadata
 */
async function listCollectionObjects(s3, bucketPrefix) {
  const objects = []
  let continuationToken
  do {
    const list = await s3.send(new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
      Prefix: bucketPrefix
    }))
    for (const obj of (list.Contents || [])) {
      const head = await s3.send(new HeadObjectCommand({
        Bucket: bucket,
        Key: obj.Key
      }))
      const object = { key: obj.Key, ...head.Metadata }
      if (object.description) {
        object.description = decodeURIComponent(object.description)
      }
      if (object.tags) {
        try {
          object.tags = JSON.parse(object.tags)
        } catch {
          console.warn(`Failed to parse tags for ${obj.Key}`)
        }
      }
      objects.push(object)
    }
    continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined
  } while (continuationToken)
  return objects
}

/**
 * Purges Cloudflare edge cache for configured route prefixes.
 *
 * @returns {Promise<string[]|null>} Array of purged prefixes, or null if skipped or failed
 */
async function purgeCache() {
  if (process.env.NEXTJS_ENV !== 'production') {
    console.info(`Environment '${process.env.NEXTJS_ENV}' detected, skipping cache purge`)
    return null
  }
  if (!process.env.ZONE_API_TOKEN || !process.env.ZONE_ID) {
    console.info('Cloudflare credentials not found, skipping cache purge')
    return null
  }
  if (!domain.name) {
    console.info('Domain not configured, skipping cache purge')
    return null
  }
  if (!cloudflare.cache.prefixes.length) {
    return []
  }
  const prefixes = cloudflare.cache.prefixes.map(prefix => `${domain.name}${prefix}`)
  const client = new Cloudflare({ apiToken: process.env.ZONE_API_TOKEN })
  await client.cache.purge({
    zone_id: process.env.ZONE_ID,
    prefixes
  })
  return prefixes
}

try {
  execSync('git fetch --unshallow', { cwd, stdio: 'pipe' })
} catch {
  console.info('Repository already unshallowed or fully cloned')
}
mkdirSync(outputDir, { recursive: true })
rmSync(fetchCacheDir, { force: true, recursive: true })
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
    for (const collection of collections) {
      const media = await generateR2Media(s3, collection.mediaPrefix)
      console.info(`Generated ${plural(media.generated, 'media file', 'media files')}, deleted ${plural(media.deleted, 'orphaned media file', 'orphaned media files')} for ${collection.name}`)
      const objects = await listCollectionObjects(s3, collection.bucketPrefix)
      const metadata = await generateMetadata(s3, collection.metadataKey, objects)
      console.info(`Generated metadata manifest for ${plural(metadata, 'object', 'objects')} for ${collection.name}`)
    }
  }
} catch (error) {
  console.error('Failed R2 operations:', error.message)
}
try {
  const purged = await purgeCache()
  if (purged?.length) {
    console.info(`Purged cache for ${plural(purged.length, 'prefix', 'prefixes')}`)
  }
} catch (error) {
  console.error('Failed to purge cache:', error.message)
}
