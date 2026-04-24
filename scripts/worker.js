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
 *
 * Exposes an internal `/__internal/purge-kv-cache` route guarded by the
 * KV_PURGE_SECRET shared secret. When called with the correct bearer
 * token, the Worker uses its NEXT_INC_CACHE_KV binding to list and
 * delete every key in the OpenNext incremental cache namespace. This
 * avoids needing an API token in the deploy environment.
 */

import worker from '../.open-next/worker.js'

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from '../.open-next/worker.js'

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
 * Lists and deletes every key in the OpenNext incremental cache KV
 * namespace via the Worker's own binding. Paginates through list results
 * and fires concurrent deletes per page. Authenticated by a shared
 * secret passed in the Authorization header.
 *
 * @param {Request} request - Incoming request
 * @param {object} env - Worker bindings including NEXT_INC_CACHE_KV and KV_PURGE_SECRET
 * @returns {Promise<Response>} JSON response with the number of deleted keys, or 403 on auth failure
 */
async function purgeKvCache(request, env) {
  const expected = env.KV_PURGE_SECRET
  const provided = request.headers.get('authorization')
  if (!expected || provided !== `Bearer ${expected}`) {
    return new Response('forbidden', { status: 403 })
  }
  let cursor
  let deleted = 0
  do {
    const list = await env.NEXT_INC_CACHE_KV.list({ cursor })
    await Promise.all(list.keys.map(k => env.NEXT_INC_CACHE_KV.delete(k.name)))
    deleted += list.keys.length
    cursor = list.list_complete ? undefined : list.cursor
  } while (cursor)
  return Response.json({ deleted })
}

/**
 * Worker fetch handler. Serves cached GET responses from caches.default
 * when available, otherwise delegates to the OpenNext handler and caches the
 * result if the origin response is marked cacheable. Non-GET requests
 * bypass the cache to match Cache API semantics (only GET is cacheable).
 *
 * @param {Request} request - Incoming request
 * @param {object} env - Worker bindings
 * @param {ExecutionContext} ctx - Execution context passed through to OpenNext
 * @returns {Promise<Response>} Response from cache or OpenNext handler
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    if (url.pathname === '/__internal/purge-kv-cache' && request.method === 'POST') {
      return purgeKvCache(request, env)
    }
    if (request.method !== 'GET') {
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
