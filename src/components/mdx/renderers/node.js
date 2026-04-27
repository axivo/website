/**
 * @fileoverview Renderer registry passed to safe-mdx's renderNode hook.
 *
 * Each MDAST node type that needs custom rendering on the dynamic path
 * gets its own handler under `./renderers/`. The dispatcher looks up
 * the handler by `node.type` and invokes it. When no handler exists
 * or a handler returns undefined, safe-mdx falls back to its default
 * traversal.
 *
 * The dispatcher is a per-render factory: each call to `createDispatch`
 * returns a fresh dispatcher closing over the entry's precomputed code
 * blocks and a per-render counter, so the code renderer can pull
 * highlighted HTML in document order without leaking state across
 * renders. Stateless renderers (alert, image, list, table, footnotes)
 * are bound directly into the registry.
 */

import { renderAlert } from './alert'
import { renderCode } from './code'
import { renderFootnoteReference } from './footnoteReference'
import { renderFootnotesSection } from './footnotesSection'
import { renderImage } from './image'
import { renderInlineCode } from './inlineCode'
import { renderList } from './list'
import { renderListItem } from './listItem'
import { renderTable } from './table'

/**
 * Builds the per-render dispatcher. Stateless renderers run as is;
 * the code and inlineCode renderers close over the per-entry
 * highlighted arrays and incrementing indices so each node consumes
 * the next entry in document order.
 *
 * @param {object} [options]
 * @param {object[]} [options.blocks] - Precomputed fenced-block records
 * @param {object[]} [options.inline] - Precomputed inline-code records
 * @returns {(node: object, transform: (child: object) => import('react').ReactNode) => import('react').ReactNode|undefined}
 */
function createDispatch({ blocks = [], inline = [] } = {}) {
  const cursor = { blocks: 0, inline: 0 }
  const renderers = {
    blockquote: renderAlert,
    code: (node, transform) => renderCode(node, transform, blocks, cursor),
    footnoteReference: renderFootnoteReference,
    footnotesSection: renderFootnotesSection,
    image: renderImage,
    inlineCode: (node, transform) => renderInlineCode(node, transform, inline, cursor),
    list: renderList,
    listItem: renderListItem,
    table: renderTable
  }
  return function dispatch(node, transform) {
    const handler = renderers[node.type]
    return handler ? handler(node, transform) : undefined
  }
}

export { createDispatch }
