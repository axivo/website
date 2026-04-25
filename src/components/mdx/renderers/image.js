/**
 * @fileoverview Image renderer for the safe-mdx pipeline.
 *
 * Routes MDAST `image` nodes (Markdown `![alt](url)` syntax) through the
 * custom Image component so relative paths under `/claude/reflections/`
 * and `/blog/` get rewritten to `cdn.axivo.com`. Without this, bare
 * markdown image references resolve as plain `<img>` tags pointing at
 * the Worker, which has no asset to serve.
 */

import { createElement } from 'react'
import { Image } from '@axivo/website'

/**
 * Renders an MDAST image node through the custom Image component. Reads
 * the URL, alt text, and title from the node and forwards them as props.
 *
 * @param {object} node - MDAST image node
 * @returns {import('react').ReactNode}
 */
function renderImage(node) {
  return createElement(Image, {
    alt: node.alt || '',
    src: node.url || '',
    title: node.title || undefined
  })
}

export { renderImage }
