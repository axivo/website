/**
 * @fileoverview Site-wide Link wrapper with prefetch disabled.
 *
 * Delegates to Nextra's docs theme Link, which carries the theme's link color
 * and underline styling, and itself delegates to Nextra's Anchor for hash,
 * external, and internal URL routing (including the external arrow icon).
 *
 * Default Next.js Link behavior prefetches every viewport-visible link, which
 * cascades through React 19's resource hint API to inject `<link rel="preload">`
 * tags for images on destination routes. When the user does not navigate, the
 * browser logs unused-preload warnings.
 *
 * This wrapper defaults `prefetch` to `false` site-wide to eliminate the
 * warnings at the cost of slightly slower first-click navigation. Callers can
 * opt back into prefetching by passing an explicit `prefetch` prop.
 */

import { Link as NextraLink } from 'nextra-theme-docs'

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

export { Link }
