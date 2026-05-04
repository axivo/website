/**
 * @fileoverview Site-wide Anchor and Link wrappers with prefetch disabled.
 *
 * `Anchor` delegates to Nextra's Anchor, which provides hash/external/internal
 * URL routing (including the external arrow icon) without typographic styling.
 * Use it for navigation chrome — navbar items, project links, anywhere the
 * link should inherit its surrounding color and decoration.
 *
 * `Link` delegates to Nextra's docs theme Link, which wraps Anchor and adds the
 * theme's link color and underline styling. Use it for in-content links and
 * anywhere the link should be visually marked as a link.
 *
 * Default Next.js Link behavior prefetches every viewport-visible link, which
 * cascades through React 19's resource hint API to inject `<link rel="preload">`
 * tags for images on destination routes. When the user does not navigate, the
 * browser logs unused-preload warnings.
 *
 * Both wrappers default `prefetch` to `false` site-wide to eliminate the
 * warnings at the cost of slightly slower first-click navigation. Callers can
 * opt back into prefetching by passing an explicit `prefetch` prop.
 */

import { Anchor as NextraAnchor } from 'nextra/components'
import { Link as NextraLink } from 'nextra-theme-docs'

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
 * Link wrapper around Nextra's docs theme Link that defaults `prefetch` to `false`.
 *
 * @param {object} props - Forwarded to Nextra's Link
 * @param {boolean} [props.prefetch=false] - Override to enable prefetching for this link
 * @returns {import('react').ReactElement}
 */
function Link({ prefetch = false, ...props }) {
  return <NextraLink prefetch={prefetch} {...props} />
}

export { Anchor, Link }
