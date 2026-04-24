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
 * HEAD requests are internally rewritten to GET for cache lookup and
 * origin fetch, with the body stripped on return. OpenNext's generated
 * handler mishandles HEAD on cold-cache state (first hit after a purge,
 * cold PoPs), returning 503. Rewriting to GET lets HEAD populate the
 * Worker's own `caches.default` on cold miss and avoids the broken path.
 *
 * Responses with status codes in the `statusTtl` map have their
 * cache-control rewritten before being written to the edge and returned
 * upstream. OpenNext's incremental cache replays 404s with the same
 * `s-maxage=31536000` it applies to prerendered 2xx pages, which would
 * pin stale 404s at the edge for a year. The rewrite sets status-appropriate
 * TTLs (60s for 404/410, 24h for 301/308, no-store for 302/307 and 5xx)
 * and acts as a safety floor against origin cache-control misconfiguration
 * on 5xx responses.
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
const statusTtl = {
  301: 86400,
  302: 0,
  307: 0,
  308: 86400,
  404: 60,
  410: 60,
  500: 0,
  502: 0,
  503: 0,
  504: 0
}

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
 * Sets the TTL on responses whose status appears in `statusTtl` by
 * rewriting the cache-control header. OpenNext's incremental cache
 * replays prerendered 404s with the same `s-maxage=31536000` it applies
 * to 2xx pages; without this rewrite, stale 404s and transient 5xx
 * failures would pin at the edge for a year. For positive-TTL entries
 * (3xx/4xx) the origin may opt out via `no-store|no-cache|private`, but
 * 5xx (ttl === 0) always rewrites as a safety floor that origin
 * cache-control cannot override.
 *
 * @param {Response} response - Origin response
 * @returns {Response} Response with rewritten cache-control when applicable
 */
function setTtl(response) {
  const ttl = statusTtl[response.status]
  if (ttl === undefined) {
    return response
  }
  const cacheControl = response.headers.get('cache-control') || ''
  if (ttl > 0 && /no-store|no-cache|private/i.test(cacheControl)) {
    return response
  }
  const normalized = new Response(response.body, response)
  normalized.headers.set(
    'cache-control',
    ttl === 0 ? 'no-store' : `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 5}`
  )
  return normalized
}

/**
 * Strips the response body for HEAD requests while preserving status
 * and headers. HEAD is rewritten to GET upstream for cache and origin
 * lookup; the body is dropped here before returning to the client.
 *
 * @param {Response} response - Full GET response
 * @param {boolean} isHead - Whether the original request was HEAD
 * @returns {Response} Body-less response for HEAD, original otherwise
 */
function stripBody(response, isHead) {
  if (!isHead) {
    return response
  }
  return new Response(null, { status: response.status, headers: response.headers })
}

/**
 * Worker fetch handler. Serves cached GET responses from caches.default
 * when available, otherwise delegates to the OpenNext handler and caches
 * the result if the origin response is marked cacheable. HEAD requests
 * are rewritten to GET for cache lookup and origin fetch, with the body
 * stripped on return. Non-GET, non-HEAD methods bypass the cache.
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
    const isHead = request.method === 'HEAD'
    if (request.method !== 'GET' && !isHead) {
      return worker.fetch(request, env, ctx)
    }
    if (request.headers.has('rsc') || request.headers.has('next-router-prefetch')) {
      return worker.fetch(request, env, ctx)
    }
    const lookupRequest = isHead
      ? new Request(request.url, { method: 'GET', headers: request.headers })
      : request
    const id = await getBuildId(request, env)
    const cache = caches.default
    const cacheKey = id ? keyFor(lookupRequest, id) : lookupRequest
    const cached = await cache.match(cacheKey)
    if (cached) {
      return stripBody(cached, isHead)
    }
    const originResponse = await worker.fetch(lookupRequest, env, ctx)
    const response = setTtl(originResponse)
    const cacheControl = response.headers.get('cache-control') || ''
    const maxAgeMatch = cacheControl.match(/(?:^|,\s*)(?:s-maxage|max-age)\s*=\s*(\d+)/i)
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0
    const cacheable =
      maxAge > 0 &&
      (response.ok || response.status in statusTtl) &&
      !/no-store|no-cache|private/i.test(cacheControl) &&
      !response.headers.has('set-cookie')
    if (!cacheable) {
      return stripBody(response, isHead)
    }
    const normalized = new Response(response.body, response)
    normalized.headers.set('vary', 'Accept-Encoding')
    await cache.put(cacheKey, normalized.clone())
    return stripBody(normalized, isHead)
  }
}
