/**
 * @fileoverview OpenNext configuration for Cloudflare Workers deployment.
 *
 * Configures the OpenNext adapter with a Workers KV-backed incremental
 * cache. KV provides globally-replicated sub-5ms reads at every edge,
 * which suits the BUILD_ID-scoped cache pattern where keys are never
 * overwritten and eventual-consistency concerns don't apply.
 */

import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache'

export default defineCloudflareConfig({
  enableCacheInterception: true,
  incrementalCache: kvIncrementalCache
})
