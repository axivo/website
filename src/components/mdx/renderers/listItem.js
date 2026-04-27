/**
 * @fileoverview List item renderer for the safe-mdx pipeline.
 *
 * safe-mdx's default listItem handler wraps each item's leading text in
 * a <p>, including when the item also contains a nested list. The
 * canonical Nextra/MDX rendering leaves leading prose as a bare text
 * node so the nested list ends up as the only element child, picking
 * up `:first-child` margin rules. This renderer unwraps the leading
 * paragraph (when present) before delegating to safe-mdx, producing
 * the same HTML shape as the bundled MDX path for both tight items
 * (single paragraph) and loose items (paragraph followed by nested
 * blocks like sublists).
 *
 * When the node has a `checked` boolean (GFM task item), a disabled
 * checkbox is emitted before the inline content with the canonical
 * `task-list-item` class.
 */

import { createElement } from 'react'
import styles from './listItem.module.css'

/**
 * Returns the children of an MDAST listItem with the leading paragraph
 * unwrapped. If the first child is a paragraph, its inline content is
 * spliced in place of the paragraph; remaining children pass through
 * unchanged. Items without a leading paragraph (block-only items) are
 * returned as-is.
 *
 * @param {object[]} children - listItem children
 * @returns {object[]}
 */
function unwrapLeadingParagraph(children) {
  if (children.length === 0 || children[0].type !== 'paragraph') {
    return children
  }
  return [...(children[0].children || []), ...children.slice(1)]
}

/**
 * Renders an MDAST listItem node. Unwraps the leading paragraph so the
 * rendered HTML matches the bundled MDX shape, and emits a checkbox
 * before the inline content for GFM task items.
 *
 * @param {object} node - MDAST listItem node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode}
 */
function renderListItem(node, transform) {
  const isTaskItem = typeof node.checked === 'boolean'
  const children = unwrapLeadingParagraph(node.children || [])
  const rendered = children.map(child => transform(child)).flat().filter(Boolean)
  if (isTaskItem) {
    const checkbox = createElement('input', {
      checked: node.checked,
      disabled: true,
      key: 'checkbox',
      type: 'checkbox'
    })
    return createElement('li', { className: 'task-list-item' }, checkbox, ' ', ...rendered)
  }
  return createElement('li', { className: styles.item }, ...rendered)
}

export { renderListItem }
