/**
 * @fileoverview Footnotes section renderer for the safe-mdx pipeline.
 *
 * Renders the synthetic footnotesSection node appended to the document
 * by the footnotes preprocessor. Emits a <section data-footnotes> with
 * an sr-only "Footnotes" heading and an ordered list of definitions,
 * matching the canonical mdast-util-to-hast output.
 */

import { createElement } from 'react'
import './footnotesSection.module.css'

/**
 * Renders the footnotesSection as <section data-footnotes class="footnotes">.
 *
 * @param {object} node - Synthetic MDAST footnotesSection node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode}
 */
function renderFootnotesSection(node, transform) {
  const items = (node.children || []).map((child, index) => {
    const itemId = child.data?.hProperties?.id
    const rendered = (child.children || []).map(grand => transform(grand)).flat().filter(Boolean)
    return createElement('li', { id: itemId, key: index }, ...rendered)
  })
  return createElement(
    'section',
    { className: 'footnotes', 'data-footnotes': '' },
    createElement(
      'h2',
      { className: 'sr-only', id: 'footnote-label' },
      'Footnotes'
    ),
    createElement('ol', null, ...items)
  )
}

export { renderFootnotesSection }
