/**
 * @fileoverview R2 metadata API endpoint.
 *
 * Returns custom metadata for R2-backed content entries.
 * Without parameters, lists all entries with metadata.
 * With a `key` parameter, returns metadata for a single entry.
 *
 * @example
 * GET /metadata
 * GET /metadata?key=src/content/claude/reflections/2025/12/14/first-light.mdx
 */

const contentPrefix = 'src/content/'

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
    const list = await env.CONTENT_BUCKET.list({ prefix: contentPrefix, include: ['customMetadata'] })
    const results = (list.objects || [])
      .filter(obj => obj.key.endsWith('.mdx'))
      .map(obj => ({
        key: obj.key,
        ...decodeMetadata(obj.customMetadata || {})
      }))
    return Response.json({ objects: results, total: results.length })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
