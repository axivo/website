/**
 * @fileoverview Dynamic Open Graph image route handler.
 *
 * Renders per-page social cards by overlaying the page's title and
 * description onto the static base image. Title and description are
 * passed as query parameters, making the route deterministic and
 * cacheable by URL across every section of the site.
 */

import { ImageResponse } from 'next/og'
import { Opengraph } from '../../components/Opengraph'

/**
 * Loads a static asset served by the Worker's own static assets binding.
 * The asset path is resolved against the Worker's request URL so it
 * fetches over HTTP within the same Worker — `file://` URLs and Node's
 * filesystem APIs do not work at Cloudflare edge runtime.
 *
 * @param {string} assetPath - Asset path under the public directory
 * @param {string} requestUrl - The current request URL used as origin
 * @returns {Promise<ArrayBuffer>} File contents as an ArrayBuffer
 */
async function loadAsset(assetPath, requestUrl) {
  const response = await fetch(new URL(assetPath, requestUrl))
  return response.arrayBuffer()
}

/**
 * Encodes an ArrayBuffer as a base64 data URL for use as a CSS
 * background-image value. Cloudflare Workers do not provide Node's
 * Buffer, so the encoding is done manually via btoa.
 *
 * @param {ArrayBuffer} buffer - Raw binary data
 * @param {string} mimeType - MIME type for the data URL prefix
 * @returns {string} data URL
 */
function toDataUrl(buffer, mimeType) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

/**
 * Generates an Open Graph image PNG composited from the static base
 * image and the title and description provided via query parameters.
 *
 * @param {Request} request - Incoming request with title and description query params
 * @returns {Promise<ImageResponse>} 1200x630 PNG response
 */
async function GET(request) {
  try {
    const url = new URL(request.url)
    const title = url.searchParams.get('title') || ''
    const description = url.searchParams.get('description') || ''
    const [base, interBold, interItalic, interRegular, jetbrainsMono] = await Promise.all([
      loadAsset('/opengraph-image.png', request.url),
      loadAsset('/fonts/Inter-Bold.ttf', request.url),
      loadAsset('/fonts/Inter-Italic.ttf', request.url),
      loadAsset('/fonts/Inter-Regular.ttf', request.url),
      loadAsset('/fonts/JetBrainsMono-Regular.ttf', request.url)
    ])
    return new ImageResponse(
      <Opengraph baseUrl={toDataUrl(base, 'image/png')} description={description} title={title} />,
      {
        fonts: [
          { data: interRegular, name: 'Inter', style: 'normal', weight: 400 },
          { data: interItalic, name: 'Inter', style: 'italic', weight: 400 },
          { data: interBold, name: 'Inter', style: 'normal', weight: 700 },
          { data: jetbrainsMono, name: 'JetBrains Mono', style: 'normal', weight: 400 }
        ],
        height: 630,
        width: 1200
      }
    )
  } catch (error) {
    console.error('[og] error', error?.message, error?.stack)
    return new Response(`OG generation failed: ${error?.message}`, { status: 500 })
  }
}

export { GET }
