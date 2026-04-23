/**
 * @fileoverview Deploy script for Cloudflare Workers deployment.
 *
 * Entry point for the Cloudflare build pipeline's deploy step.
 * Performs three operations in order:
 * 1. Deploys the Worker via wrangler.
 * 2. Purges Cloudflare edge cache for configured route prefixes so
 *    stale entries from the previous deploy are removed.
 * 3. Warms the Worker's caches.default by issuing parallel GET requests
 *    to hot URLs, populating the nearest edge. Smart Tiered Cache
 *    propagates the warm state to other edges on first miss.
 *
 * Cache purge and warming failures log a warning but do not fail the
 * pipeline. A failed wrangler deploy exits non-zero and fails the build.
 *
 * Usage: node scripts/deploy.mjs
 */

import Cloudflare from 'cloudflare'
import { cloudflare, domain, repository } from '../src/config/variables/global.js'
import { execSync } from 'node:child_process'

const baseUrl = `${domain.protocol}://${domain.name}`
const pluralRules = new Intl.PluralRules('en-US')
const plural = (count, singular, pluralForm) => `${count} ${pluralRules.select(count) === 'one' ? singular : pluralForm}`

/**
 * Fetches the site's sitemap and extracts URL paths up to two segments
 * deep. Uses the deployed sitemap as the authoritative source of
 * warmable pages so the hot path list stays in sync with the actual
 * site structure. Deeper content pages cache on first-visitor demand.
 * Adds essential root-level files that never change but are frequently
 * requested by crawlers and browsers.
 *
 * @returns {Promise<string[]>} Array of URL paths relative to base URL
 */
async function getCachePaths() {
  const response = await fetch(`${baseUrl}/sitemap.xml`)
  if (!response.ok) {
    throw new Error(`Sitemap fetch returned ${response.status}`)
  }
  const xml = await response.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  const sitemapPaths = urls
    .map(url => url.replace(baseUrl, '') || '/')
    .filter(path => path === '/' || path.split('/').filter(Boolean).length <= 2)
  return [
    ...sitemapPaths,
    '/apple-icon.png',
    '/claude/sitemap.xml',
    '/favicon.ico',
    '/icon.svg',
    '/robots.txt',
    '/sitemap.xml'
  ]
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

/**
 * Warms a single URL by issuing a GET request. Throws on network
 * failure; returns status and timing on success.
 *
 * @param {string} path - Path to warm, relative to base URL
 * @returns {Promise<{path: string, status: number, duration: number}>}
 */
async function warm(path) {
  const start = Date.now()
  const response = await fetch(`${baseUrl}${path}`, { method: 'GET' })
  const duration = Date.now() - start
  await response.text()
  return { path, status: response.status, duration }
}

execSync('npx wrangler deploy', { stdio: 'inherit' })
try {
  const purged = await purgeCache()
  if (purged?.length) {
    console.info(`Cache purged for ${plural(purged.length, 'prefix', 'prefixes')}`)
  }
} catch (error) {
  console.warn(`Failed to purge cache: ${error.message}`)
}
let cachePaths = []
try {
  cachePaths = await getCachePaths()
} catch (error) {
  console.warn(`Failed to fetch sitemap: ${error.message}`)
}
if (cachePaths.length) {
  console.info(`Warming ${plural(cachePaths.length, 'path', 'paths')} on ${baseUrl}`)
  const settled = await Promise.allSettled(cachePaths.map(warm))
  let succeeded = 0
  for (const [index, outcome] of settled.entries()) {
    const path = cachePaths[index]
    if (outcome.status === 'fulfilled') {
      const { status, duration } = outcome.value
      if (status >= 200 && status < 400) {
        succeeded += 1
        console.info(`Warmed '${path}' path in ${duration}ms`)
      } else {
        console.warn(`Failed to warm '${path}' path with status ${status}`)
      }
    } else {
      console.warn(`Failed to warm '${path}' path: ${outcome.reason.message}`)
    }
  }
  console.info(`Warmed ${succeeded} of ${plural(cachePaths.length, 'path', 'paths')}`)
}
