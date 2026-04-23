/**
 * @fileoverview Prebuild script for Cloudflare Workers deployment.
 *
 * Performs three operations:
 * 1. Unshallows the git repository to access full commit history
 * 2. Generates a timestamp map from git history for accurate
 *    "Last updated" dates, bypassing @napi-rs/simple-git which
 *    returns incorrect dates on unshallowed repositories
 * 3. Generates metadata manifests for all R2-backed collections
 *
 * Cache purge and Worker warming run post-deploy in scripts/postbuild.mjs.
 *
 * Usage: node scripts/prebuild.mjs
 */

import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { config } from 'dotenv'
import fg from 'fast-glob'
import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { cloudflare } from '../src/config/variables/global.js'
import { meta as blog } from '../src/config/variables/blog.js'
import { meta as claude } from '../src/config/variables/claude.js'

const bucket = cloudflare.bucket.name
const collections = [
  {
    bucketPrefix: `src/content/${claude.source.path}/${claude.reflections.path}/`,
    metadataKey: cloudflare.bucket.metadata.reflections,
    name: claude.reflections.path
  },
  {
    bucketPrefix: `src/content/${blog.source.path}/`,
    metadataKey: cloudflare.bucket.metadata.blog,
    name: blog.source.path
  }
]
const cwd = process.cwd()
const contentDir = join(cwd, 'src/content')
const fetchCacheDir = join(cwd, '.next', 'cache', 'fetch-cache')
const generatedDir = join(cwd, 'src/generated')
const menuFile = join(generatedDir, 'menu.js')
const outputDir = join(cwd, '.next')
const outputFile = join(outputDir, 'timestamps.json')
const pluralRules = new Intl.PluralRules('en-US')
const plural = (count, singular, pluralForm) => `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

/**
 * Discovers _menu.js files under src/content/ and generates a registry
 * module at src/generated/menu.js. Each discovered file becomes a
 * static import keyed by its directory path ('' for root, 'claude', etc).
 * Missing files produce no import, so deleting a _menu.js cleanly
 * removes it from the registry on the next prebuild run.
 *
 * @returns {Promise<number>} Number of _menu.js files discovered
 */
async function generateMenu() {
  const matches = await fg('**/_menu.{js,jsx,ts,tsx}', { cwd: contentDir })
  const sorted = matches.sort((a, b) => a.localeCompare(b))
  const entries = sorted.map((match, index) => {
    const key = dirname(match) === '.' ? '' : dirname(match)
    return { key, identifier: `menu${index}`, path: match }
  })
  const imports = entries
    .map(({ identifier, path }) => `import ${identifier} from '../content/${path}'`)
    .join('\n')
  const map = entries
    .map(({ key, identifier }) => `  '${key}': ${identifier}`)
    .join(',\n')
  const source = `${imports}\n\nexport const menus = {\n${map}\n}\n`
  mkdirSync(generatedDir, { recursive: true })
  writeFileSync(menuFile, source)
  return entries.length
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
  const count = await generateMenu()
  console.info(`Generated menu registry for ${plural(count, 'menu', 'menus')}`)
} catch (error) {
  console.error('Failed to generate menu registry:', error.message)
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
      const objects = await listCollectionObjects(s3, collection.bucketPrefix)
      const metadata = await generateMetadata(s3, collection.metadataKey, objects)
      console.info(`Generated metadata manifest for ${plural(metadata, `'${collection.name}' object`, `'${collection.name}' objects`)}`)
    }
  }
} catch (error) {
  console.error('Failed R2 operations:', error.message)
}
