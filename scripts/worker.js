/**
 * @fileoverview Worker runtime entry wrapping OpenNext with edge cache.
 *
 * Runtime entry point (not a build script). Wraps the OpenNext generated
 * handler with Cloudflare edge cache (caches.default) so GET responses
 * marked cacheable by origin are served from the edge on subsequent
 * requests, bypassing Worker execution. RSC and prefetch requests bypass
 * the cache to avoid serving HTML payloads to RSC clients.
 */

import worker from '../.open-next/worker.js'

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from '../.open-next/worker.js'

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return worker.fetch(request, env, ctx)
    }
    if (request.headers.has('rsc') || request.headers.has('next-router-prefetch')) {
      return worker.fetch(request, env, ctx)
    }
    const cache = caches.default
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    const response = await worker.fetch(request, env, ctx)
    const cacheControl = response.headers.get('cache-control') || ''
    const maxAgeMatch = cacheControl.match(/(?:^|,\s*)(?:s-maxage|max-age)\s*=\s*(\d+)/i)
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0
    const cacheable =
      response.ok &&
      maxAge > 0 &&
      !/no-store|no-cache|private/i.test(cacheControl) &&
      !response.headers.has('set-cookie')
    if (cacheable) {
      ctx.waitUntil(cache.put(request, response.clone()))
    }
    return response
  }
}
