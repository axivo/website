/**
 * @fileoverview R2 metadata API endpoint.
 *
 * Returns pre-built metadata manifest for R2-backed content entries.
 * Without parameters, returns all entries from the manifest.
 * With a `key` parameter, returns metadata for a single entry.
 *
 * @example
 * GET /metadata
 * GET /metadata?key=src/content/claude/reflections/2025/12/14/first-light.mdx
 */

const metadataKey = 'metadata/index.json'

/**
 * Decodes metadata fields that were encoded during upload.
 *
 * @param {Object} metadata - Raw R2 custom metadata
 * @returns {Object} Decoded metadata
 */
function decodeMetadata(metadata) {
  const result = { ...metadata }
  if (result.description) {
    result.description = decodeURIComponent(result.description)
  }
  if (result.tags) {
    try {
      result.tags = JSON.parse(result.tags)
    } catch {
      console.warn('Failed to parse tags metadata')
    }
  }
  return result
}

/**
 * Handles metadata requests.
 *
 * @param {Request} request - Incoming request
 * @returns {Promise<Response>} JSON response with metadata
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    if (key) {
      const object = await env.CONTENT_BUCKET.head(key)
      if (!object) {
        return Response.json({ error: 'Object not found' }, { status: 404 })
      }
      return Response.json(decodeMetadata(object.customMetadata))
    }
    const object = await env.CONTENT_BUCKET.get(metadataKey)
    if (!object) {
      return Response.json({ objects: [], total: 0 })
    }
    return Response.json(await object.json(), {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' }
    })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
