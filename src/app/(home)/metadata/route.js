/**
 * @fileoverview R2 metadata API endpoint.
 *
 * Returns pre-built metadata manifest for an R2-backed collection.
 * Without parameters, returns the reflections manifest (backward
 * compatible default). With a `collection` parameter, selects the
 * requested collection's manifest. With a `key` parameter, returns
 * metadata for a single entry regardless of collection.
 *
 * @example
 * GET /metadata
 * GET /metadata?collection=blog
 * GET /metadata?key=src/content/claude/reflections/2025/12/14/first-light.mdx
 */

import { cloudflare } from '@axivo/website/global'

const metadataKeys = {
  blog: cloudflare.bucket.metadata.blog,
  reflections: cloudflare.bucket.metadata.reflections
}

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
  const collection = searchParams.get('collection') || 'reflections'
  const metadataKey = metadataKeys[collection]
  if (!metadataKey) {
    return Response.json({ error: `Unknown collection: ${collection}` }, { status: 400 })
  }
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
    return Response.json(await object.json())
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
