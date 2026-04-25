/**
 * @fileoverview List item renderer for the safe-mdx pipeline.
 *
 * safe-mdx's default listItem handler wraps every item's content in a
 * <p> even when the item is "tight" (single paragraph, no nested blocks),
 * which produces visibly taller lists than the canonical Nextra rendering.
 * This renderer unwraps the inner paragraph so tight items render their
 * inline children directly inside <li>, matching Nextra exactly. Items
 * with nested blocks (loose lists) keep their paragraph wrappers.
 *
 * When the node has a `checked` boolean (GFM task item), a disabled
 * checkbox is emitted before the inline content with the canonical
 * `task-list-item` class.
 */

import { createElement } from 'react'
import styles from './listItem.module.css'

/**
 * Renders an MDAST listItem node. Unwraps single-paragraph content for
 * tight items and emits a checkbox for task items.
 *
 * @param {object} node - MDAST listItem node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode}
 */
function renderListItem(node, transform) {
  const isTaskItem = typeof node.checked === 'boolean'
  const children = node.children || []
  const isTight = children.length === 1 && children[0].type === 'paragraph'
  const rendered = isTight
    ? (children[0].children || []).map(inner => transform(inner)).flat().filter(Boolean)
    : children.map(child => transform(child)).flat().filter(Boolean)
  if (isTaskItem) {
    const checkbox = createElement('input', {
      checked: node.checked,
      disabled: true,
      key: 'checkbox',
      type: 'checkbox'
    })
    return createElement(
      'li',
      { className: `${styles.item} task-list-item` },
      checkbox,
      ' ',
      ...rendered
    )
  }
  return createElement('li', { className: styles.item }, ...rendered)
}

export { renderListItem }
