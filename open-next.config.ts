/**
 * @fileoverview OpenNext configuration for Cloudflare Workers deployment.
 *
 * Configures the OpenNext adapter with static assets incremental cache
 * to serve pre-rendered SSG pages from build assets instead of
 * re-rendering at runtime on the Workers runtime.
 */

import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

export default defineCloudflareConfig({
  enableCacheInterception: true,
  incrementalCache: staticAssetsIncrementalCache
})
