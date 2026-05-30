/**
 * @fileoverview Shared utilities for MDX media components.
 *
 * Small helpers used by Image and Video for source handling and other
 * shared media concerns. Add new functions here when they're scoped to
 * MDX components and don't warrant their own file.
 */

import { cloudflare } from '@axivo/website/global'

const cdnPattern = new RegExp(
  `^/(?:${cloudflare.bucket.cdn.prefixes.join('|')})/\\d{4}/\\d{2}/[^/]+\\.[a-z0-9]+$`,
  'i'
)

/**
 * Resolves a media source path through the CDN when it matches one of
 * the configured content prefixes (`cloudflare.bucket.cdn.prefixes`)
 * followed by the YYYY/MM/ media convention and a trailing file
 * extension. Internal page links under the same prefixes (e.g.,
 * `/claude/reflections/2025/12/13`) lack an extension and pass through
 * unchanged so they resolve on the site origin.
 *
 * @param {string} src - Source path or URL
 * @returns {string} Resolved URL
 */
function setSource(src) {
  if (typeof src !== 'string') {
    return src
  }
  return cdnPattern.test(src) ? `${cloudflare.bucket.cdn.url}${src}` : src
}

export { setSource }
