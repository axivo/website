/**
 * @fileoverview OpenNext configuration for Cloudflare Workers deployment.
 *
 * Configures the OpenNext adapter with an R2-backed incremental cache so
 * dynamic page renders can be cached alongside prerendered pages. The
 * cache shares the content bucket under the `cache` prefix configured
 * via NEXT_INC_CACHE_R2_PREFIX. A regional cache wraps the R2 backend
 * to serve repeat reads from Cloudflare's per-region Cache API before
 * falling through to R2.
 */

import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'

export default defineCloudflareConfig({
  enableCacheInterception: true,
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: 'long-lived' })
})
