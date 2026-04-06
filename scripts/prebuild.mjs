/**
 * @fileoverview Prebuild script for Cloudflare Workers deployment.
 *
 * Performs two operations:
 * 1. Unshallows the git repository to access full commit history
 * 2. Generates a timestamp map from git history for accurate
 *    "Last updated" dates, bypassing @napi-rs/simple-git which
 *    returns incorrect dates on unshallowed repositories
 *
 * Usage: node scripts/prebuild.mjs
 */

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()
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
