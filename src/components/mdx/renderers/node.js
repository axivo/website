/**
 * @fileoverview Renderer registry passed to safe-mdx's renderNode hook.
 *
 * Each MDAST node type that needs custom rendering on the dynamic path
 * gets its own handler under `./renderers/`. The dispatcher looks up the
 * handler by `node.type` and invokes it. When no handler exists or a
 * handler returns undefined, safe-mdx falls back to its default
 * traversal.
 *
 * Each handler is a pure function `(node, transform) => ReactNode | undefined`
 * that never reaches across other handlers. Adding a new node type means
 * adding one file under `./renderers/` and one entry to the registry.
 */

import { renderAlert } from './alert'
import { renderFootnoteReference } from './footnoteReference'
import { renderFootnotesSection } from './footnotesSection'
import { renderImage } from './image'
import { renderList } from './list'
import { renderListItem } from './listItem'
import { renderTable } from './table'

const renderers = {
  blockquote: renderAlert,
  footnoteReference: renderFootnoteReference,
  footnotesSection: renderFootnotesSection,
  image: renderImage,
  list: renderList,
  listItem: renderListItem,
  table: renderTable
}

/**
 * Looks up the registered handler for a node type and invokes it. Returns
 * undefined when no handler is registered or when the handler defers to
 * safe-mdx's default rendering.
 *
 * @param {object} node - MDAST node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode|undefined}
 */
function dispatch(node, transform) {
  const handler = renderers[node.type]
  return handler ? handler(node, transform) : undefined
}

export { dispatch }
