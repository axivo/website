/**
 * @fileoverview List renderer for the safe-mdx pipeline.
 *
 * Detects task lists (lists where any child listItem has a `checked`
 * boolean) and renders them as flush-left, no-bullet containers
 * matching the GFM/GitHub convention. Plain ordered and unordered
 * lists fall through to safe-mdx's default rendering, which routes
 * through the Ordered and Unordered components from List.jsx.
 */

import { createElement } from 'react'
import './list.module.css'

/**
 * Renders an MDAST list node as a task-list container when any child
 * is a task item (`checked` is a boolean). Returns undefined for plain
 * lists so safe-mdx's default handler runs.
 *
 * @param {object} node - MDAST list node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode|undefined}
 */
function renderList(node, transform) {
  const isTaskList = (node.children || []).some(child =>
    child.type === 'listItem' && typeof child.checked === 'boolean'
  )
  if (!isTaskList) {
    return undefined
  }
  const children = (node.children || []).map(child => transform(child)).flat().filter(Boolean)
  const Tag = node.ordered ? 'ol' : 'ul'
  return createElement(Tag, { className: 'contains-task-list' }, ...children)
}

export { renderList }
