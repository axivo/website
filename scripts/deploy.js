/**
 * @fileoverview Deploy script for Cloudflare Workers deployment.
 *
 * Entry point for the Cloudflare build pipeline's deploy step.
 * Performs three operations in order:
 * 1. Calls the currently-deployed Worker's internal purge endpoint to
 *    delete orphaned KV incremental cache entries from the previous
 *    build. The Worker uses its own binding to the KV namespace, so
 *    no API token is needed in the deploy environment — only the
 *    shared KV_PURGE_SECRET.
 * 2. Deploys the new Worker via wrangler. OpenNext's deploy step
 *    populates the KV incremental cache with the new build's
 *    prerendered pages.
 * 3. Purges Cloudflare edge cache for configured route prefixes so
 *    stale entries from the previous deploy are removed.
 *
 * Cache purge failures log a warning but do not fail the pipeline.
 * A failed wrangler deploy exits non-zero and fails the build.
 *
 * Usage: node scripts/deploy.js
 */

import { execSync } from 'node:child_process'
import Cloudflare from 'cloudflare'
import { cloudflare, domain, repository } from '../src/config/variables/global.js'

const baseUrl = `${domain.protocol}://${domain.name}`
const pluralRules = new Intl.PluralRules('en-US')
const plural = (count, singular, pluralForm) => `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

/**
 * Runs the deploy pipeline in three phases: KV cache purge through the
 * currently-deployed Worker, wrangler deploy, and edge cache purge.
 * Cache purge failures are logged but do not stop the pipeline; a
 * failed wrangler deploy exits non-zero and fails the build.
 *
 * @returns {Promise<void>}
 */
async function deploy() {
  try {
    const deleted = await purgeKvCache()
    if (deleted !== null) {
      console.info(`Remote KV cache purged for ${plural(deleted, 'asset', 'assets')}`)
    }
  } catch (error) {
    console.warn(`Failed to purge remote KV cache: ${error.message}`)
  }
  execSync('npx wrangler deploy', { stdio: 'inherit' })
  try {
    const purged = await purgeCache()
    if (purged?.length) {
      console.info(`Cloudflare cache purged for ${plural(purged.length, 'prefix', 'prefixes')}`)
    }
  } catch (error) {
    console.warn(`Failed to purge Cloudflare cache: ${error.message}`)
  }
}

/**
 * Purges Cloudflare edge cache for configured route prefixes. Skips
 * when not running in the production branch of the Workers CI build
 * environment, when Cloudflare credentials are not available, or when
 * the domain is not configured.
 *
 * @returns {Promise<string[]|null>} Array of purged prefixes, or null if skipped or failed
 */
async function purgeCache() {
  if (!process.env.WORKERS_CI_BRANCH) {
    console.info('Development environment detected, skipping cache purge')
    return null
  }
  if (process.env.WORKERS_CI_BRANCH !== repository.tag) {
    console.info(`Branch '${process.env.WORKERS_CI_BRANCH}' detected, skipping cache purge`)
    return null
  }
  if (!process.env.ZONE_CACHE_TOKEN || !process.env.ZONE_ID) {
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
  const client = new Cloudflare({ apiToken: process.env.ZONE_CACHE_TOKEN })
  await client.cache.purge({
    zone_id: process.env.ZONE_ID,
    prefixes
  })
  return prefixes
}

/**
 * Calls the currently-deployed Worker's internal purge endpoint to
 * delete every key in the KV incremental cache namespace. The Worker
 * uses its own binding to perform the deletion, so no API token is
 * needed here — only the shared KV_PURGE_SECRET both sides agree on.
 *
 * @returns {Promise<number|null>} Number of deleted keys, or null if skipped or failed
 */
async function purgeKvCache() {
  if (!process.env.KV_PURGE_SECRET) {
    console.info('KV purge secret not found, skipping KV cache purge')
    return null
  }
  const response = await fetch(`${baseUrl}/__internal/purge-kv-cache`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.KV_PURGE_SECRET}` }
  })
  if (!response.ok) {
    throw new Error(`KV purge returned ${response.status} ${response.statusText}`)
  }
  const { deleted } = await response.json()
  return deleted
}

await deploy()
