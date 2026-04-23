/**
 * @fileoverview OpenNext configuration for Cloudflare Workers deployment.
 *
 * Configures the OpenNext adapter with an R2-backed incremental cache so
 * dynamic page renders persist across Worker invocations. The cache shares
 * the content bucket under the `cache` prefix configured via
 * NEXT_INC_CACHE_R2_PREFIX. Old build entries are purged post-deploy.
 */

import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

export default defineCloudflareConfig({
  enableCacheInterception: true,
  incrementalCache: r2IncrementalCache
})
