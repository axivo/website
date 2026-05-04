/**
 * @fileoverview Site-wide Link wrapper around next/link with prefetch disabled.
 *
 * Default Next.js Link behavior prefetches every viewport-visible link, which
 * cascades through React 19's resource hint API to inject `<link rel="preload">`
 * tags for images on destination routes. When the user does not navigate, the
 * browser logs unused-preload warnings.
 *
 * Setting `prefetch={false}` site-wide eliminates the warnings at the cost of
 * slightly slower first-click navigation. Callers can opt back into prefetching
 * by passing an explicit `prefetch` prop.
 */

import NextLink from 'next/link'
import { Anchor as NextraAnchor } from 'nextra/components'

/**
 * Anchor wrapper around Nextra's Anchor that defaults `prefetch` to `false`.
 *
 * @param {object} props - Forwarded to Nextra's Anchor
 * @param {boolean} [props.prefetch=false] - Override to enable prefetching for this link
 * @returns {import('react').ReactElement}
 */
function Anchor({ prefetch = false, ...props }) {
  return <NextraAnchor prefetch={prefetch} {...props} />
}

/**
 * Link wrapper around next/link that defaults `prefetch` to `false`.
 *
 * @param {object} props - Forwarded to next/link
 * @param {boolean} [props.prefetch=false] - Override to enable prefetching for this link
 * @returns {import('react').ReactElement}
 */
function Link({ prefetch = false, ...props }) {
  return <NextLink prefetch={prefetch} {...props} />
}

export { Anchor, Link }
