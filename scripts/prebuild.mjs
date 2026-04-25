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
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
const iconLibraries = {
  fi: 'react-icons/fi',
  go: 'react-icons/go',
  si: 'react-icons/si'
}
const menuFile = join(generatedDir, 'menu.js')
const outputDir = join(cwd, '.next')
const timestampsFile = join(generatedDir, 'timestamps.json')
const pluralRules = new Intl.PluralRules('en-US')
const plural = (count, singular, pluralForm) => `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

/**
 * Runs the prebuild pipeline in three phases: timestamps from git history,
 * menu and icon registry from `_menu.js` files under `src/content/`, and
 * metadata manifests for R2-backed collections. Each phase logs its
 * progress and exits the process on a failure that should stop the
 * build. R2 operations are skipped when credentials are not present so
 * local builds without R2 access still complete.
 *
 * @returns {Promise<void>}
 */
async function build() {
  try {
    execSync('git fetch --unshallow', { cwd, stdio: 'pipe' })
  } catch {
    console.info('Repository already unshallowed or fully cloned')
  }
  mkdirSync(generatedDir, { recursive: true })
  mkdirSync(outputDir, { recursive: true })
  rmSync(fetchCacheDir, { force: true, recursive: true })
  try {
    const timestamps = getTimestamps()
    writeFileSync(timestampsFile, JSON.stringify(timestamps))
    console.info(`Generated timestamps for ${Object.keys(timestamps).length} files`)
  } catch (error) {
    console.error('Failed to generate timestamps:', error.message)
    process.exit(1)
  }
  try {
    const { iconCount, menuCount } = await generateMenu()
    console.info(`Generated menu registry for ${plural(iconCount, 'icon', 'icons')} and ${plural(menuCount, 'menu', 'menus')}`)
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
      return
    }
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
  } catch (error) {
    console.error('Failed R2 operations:', error.message)
  }
}

/**
 * Discovers _menu.js files under src/content/ and generates a combined
 * registry module at src/generated/menu.js. The module exports two maps:
 *
 *   - `menus` — keyed by directory path ('' for root, 'claude', etc)
 *     pointing at each _menu.js's default export.
 *   - `icons` — keyed by icon spec (e.g. 'si/SiClaude') pointing at the
 *     resolved react-icons component. Only icons actually referenced in
 *     _menu.js files are imported, keeping the bundle minimal.
 *
 * Missing files produce no import, so adding or removing a _menu.js (or
 * an icon inside one) flows through the next prebuild run with no other
 * code edits.
 *
 * @returns {Promise<{iconCount: number, menuCount: number}>}
 */
async function generateMenu() {
  const matches = await fg('**/_menu.{js,jsx,ts,tsx}', { cwd: contentDir })
  const sorted = matches.sort((a, b) => a.localeCompare(b))
  const entries = sorted.map((match, index) => {
    const key = dirname(match) === '.' ? '' : dirname(match)
    return { identifier: `menu${index}`, key, path: match }
  })
  const iconSpecs = new Set()
  for (const { path } of entries) {
    const body = readFileSync(join(contentDir, path), 'utf8')
    for (const match of body.matchAll(/icon:\s*['"]([a-z]+\/[A-Z]\w+)['"]/g)) {
      iconSpecs.add(match[1])
    }
  }
  const iconsByLibrary = {}
  for (const spec of iconSpecs) {
    const [library, name] = spec.split('/')
    if (!iconLibraries[library]) {
      console.warn(`[generateMenu] unknown icon library prefix '${library}' in spec '${spec}'`)
      continue
    }
    iconsByLibrary[library] ||= []
    iconsByLibrary[library].push(name)
  }
  const menuImports = entries
    .map(({ identifier, path }) => `import ${identifier} from '../content/${path}'`)
    .join('\n')
  const iconImports = Object.entries(iconsByLibrary)
    .map(([library, names]) => `import { ${names.sort().join(', ')} } from '${iconLibraries[library]}'`)
    .join('\n')
  const menuMap = entries
    .map(({ key, identifier }) => `  '${key}': ${identifier}`)
    .join(',\n')
  const iconMap = [...iconSpecs]
    .sort()
    .map(spec => `  '${spec}': ${spec.split('/')[1]}`)
    .join(',\n')
  const source = [
    iconImports,
    menuImports,
    '',
    `export const icons = {\n${iconMap}\n}`,
    '',
    `export const menus = {\n${menuMap}\n}`,
    ''
  ].join('\n')
  mkdirSync(generatedDir, { recursive: true })
  writeFileSync(menuFile, source)
  return { iconCount: iconSpecs.size, menuCount: entries.length }
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

await build()
