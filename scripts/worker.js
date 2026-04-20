/**
 * @fileoverview Worker runtime entry wrapping OpenNext with edge cache.
 *
 * Runtime entry point (not a build script). Wraps the OpenNext generated
 * handler with Cloudflare edge cache (caches.default) so GET responses
 * marked cacheable by origin are served from the edge on subsequent
 * requests, bypassing Worker execution. RSC and prefetch requests bypass
 * the cache to avoid serving HTML payloads to RSC clients. Cache keys
 * include the deploy BUILD_ID so each deploy naturally invalidates stale
 * entries without needing an explicit purge.
 */

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from '../.open-next/worker.js'
import worker from '../.open-next/worker.js'

let buildId

/**
 * Fetches the deploy BUILD_ID from the static assets binding once per isolate.
 * Result is cached in module scope to avoid repeated asset lookups across
 * requests served by the same Worker isolate.
 *
 * @param {Request} request - Incoming request, used to derive the asset URL origin
 * @param {object} env - Worker bindings including the ASSETS binding
 * @returns {Promise<string>} BUILD_ID string, or empty string on failure
 */
async function getBuildId(request, env) {
  if (buildId === undefined) {
    try {
      const response = await env.ASSETS.fetch(new URL('/BUILD_ID', request.url))
      buildId = response.ok ? (await response.text()).trim() : ''
    } catch {
      buildId = ''
    }
  }
  return buildId
}

/**
 * Builds a deploy-scoped cache key by appending the BUILD_ID as a query
 * parameter. Each deploy produces a unique key namespace so stale entries
 * from prior deploys remain in the cache as orphans until evicted.
 *
 * @param {Request} request - Original request to derive the URL from
 * @param {string} id - BUILD_ID to scope the cache key to
 * @returns {Request} New request with BUILD_ID appended as `__build` query param
 */
function keyFor(request, id) {
  const url = new URL(request.url)
  url.searchParams.set('__build', id)
  return new Request(url, request)
}

/**
 * Worker fetch handler. Serves cached GET/HEAD responses from caches.default
 * when available, otherwise delegates to the OpenNext handler and caches the
 * result if the origin response is marked cacheable.
 *
 * @param {Request} request - Incoming request
 * @param {object} env - Worker bindings
 * @param {ExecutionContext} ctx - Execution context passed through to OpenNext
 * @returns {Promise<Response>} Response from cache or OpenNext handler
 */
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return worker.fetch(request, env, ctx)
    }
    if (request.headers.has('rsc') || request.headers.has('next-router-prefetch')) {
      return worker.fetch(request, env, ctx)
    }
    const id = await getBuildId(request, env)
    const cache = caches.default
    const cacheKey = id ? keyFor(request, id) : request
    const cached = await cache.match(cacheKey)
    if (cached) {
      return cached
    }
    const response = await worker.fetch(request, env, ctx)
    const cacheControl = response.headers.get('cache-control') || ''
    const maxAgeMatch = cacheControl.match(/(?:^|,\s*)(?:s-maxage|max-age)\s*=\s*(\d+)/i)
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0
    const cacheable =
      maxAge > 0 &&
      response.ok &&
      !/no-store|no-cache|private/i.test(cacheControl) &&
      !response.headers.has('set-cookie')
    if (cacheable) {
      await cache.put(cacheKey, response.clone())
    }
    return response
  }
}
