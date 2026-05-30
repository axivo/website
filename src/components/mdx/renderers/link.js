/**
 * @fileoverview Link renderer for the safe-mdx pipeline.
 *
 * Routes MDAST `link` nodes (Markdown `[text](url)` syntax) through the
 * shared `setSource` helper so URLs matching the configured CDN prefixes
 * resolve to `cdn.axivo.com` instead of the site origin, then renders
 * through Nextra's themed `Link` so the result carries the docs theme's
 * underline and color styling. Without this, bare markdown links to
 * reflection or blog media fall through to safe-mdx's default rendering,
 * serve from the Worker with no asset at that path, and lose the in-
 * content link styling siblings expect.
 */

import { createElement } from 'react'
import { Link } from '@axivo/website'
import { setSource } from '../utils'

/**
 * Renders an MDAST link node through Nextra's themed `Link` with its URL
 * routed through `setSource`. Children are passed through `transform`
 * so nested formatting (emphasis, inline code, etc.) renders correctly
 * inside the link text.
 *
 * @param {object} node - MDAST link node
 * @param {(child: object) => import('react').ReactNode} transform - Child renderer
 * @returns {import('react').ReactNode}
 */
function renderLink(node, transform) {
  return createElement(
    Link,
    {
      href: setSource(node.url || ''),
      title: node.title || undefined
    },
    ...(node.children || []).map(transform)
  )
}

export { renderLink }
