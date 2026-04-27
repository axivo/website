/**
 * @fileoverview Inline code renderer for the safe-mdx pipeline.
 *
 * Inline backticks with a `{:lang}` hint (e.g. `` `let x = 1{:jsx}` ``)
 * are highlighted at prebuild time by rehype-pretty-code and stored in
 * `metadata/code.json` under the entry's `code.inline` array. This
 * renderer pulls the next entry in document order via the per-render
 * cursor and emits a Nextra `<Code>` element wrapping the precomputed
 * shiki spans.
 *
 * Inline backticks without a `{:lang}` hint are not preprocessed (the
 * cursor is only incremented when a hint is present), so they fall
 * through to safe-mdx's default `inlineCode` rendering.
 */

import { createElement } from 'react'
import { Code } from 'nextra/components'

const HINT_RE = /\{:[a-zA-Z.-]+\}$/

/**
 * Renders an inline code node. When the value carries a trailing
 * `{:lang}` hint, consumes the next precomputed inline entry and
 * emits a `<Code>` wrapping the highlighted spans. Otherwise returns
 * undefined so safe-mdx renders plain inline code via the components
 * map.
 *
 * @param {object} node - MDAST inlineCode node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer (unused)
 * @param {object[]} inline - Precomputed inline-code records
 * @param {{ inline: number }} cursor - Mutable cursor shared across renderers
 * @returns {import('react').ReactNode|undefined}
 */
function renderInlineCode(node, transform, inline, cursor) {
  if (!HINT_RE.test(node.value || '')) {
    return undefined
  }
  const item = inline[cursor.inline]
  cursor.inline += 1
  if (!item) {
    return undefined
  }
  return createElement(Code, {
    'data-language': item.lang,
    dangerouslySetInnerHTML: { __html: item.html }
  })
}

export { renderInlineCode }
