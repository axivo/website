/**
 * @fileoverview Fenced code block renderer for the safe-mdx pipeline.
 *
 * Looks up the precomputed shiki-highlighted HTML for this code node
 * by its document-order position in the entry. The highlighting was
 * produced at prebuild time by the rehype-pretty-code pipeline and
 * uploaded to R2 as `metadata/code.json`. The Worker fetches the
 * manifest once per cold isolate, finds the current entry's record,
 * and threads the per-entry `blocks` array through `createDispatch`
 * (see `./node.js`) which closes over a `cursor` so this renderer
 * can pull the next block in document order.
 *
 * The cursor and blocks must come from the same render: prebuild
 * walks the post-rehype HAST in document order, runtime walks the
 * MDAST through safe-mdx in document order, and remarkMermaid
 * replaces mermaid fences before safe-mdx visits them on both sides
 * of the pipeline so the indices stay aligned without explicit
 * filtering at runtime.
 *
 * On miss (manifest absent locally, content drift between prebuild
 * and runtime, or a fence newer than the last prebuild) the renderer
 * returns undefined so safe-mdx falls back to its default code
 * handler, which routes through the components map's Pre and Code
 * (Nextra's) — same chrome, no shiki tokens.
 */

import { createElement } from 'react'
import { Code, Pre } from 'nextra/components'

/**
 * Renders a fenced code block from the precomputed highlighted-HTML
 * manifest. Increments the per-render cursor on every visit so
 * subsequent code nodes consume successive entries in document order.
 *
 * @param {object} node - MDAST code node (unused, kept for handler signature)
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer (unused)
 * @param {object[]} blocks - Per-entry highlighted block records
 * @param {{ blocks: number }} cursor - Mutable cursor shared across renderers
 * @returns {import('react').ReactNode|undefined}
 */
function renderCode(node, transform, blocks, cursor) {
  const block = blocks[cursor.blocks]
  cursor.blocks += 1
  if (!block) {
    return undefined
  }
  const preProps = { 'data-language': block.lang }
  if (block.filename) {
    preProps['data-filename'] = block.filename
  }
  if (block.copy) {
    preProps['data-copy'] = ''
  }
  if (block.wordWrap) {
    preProps['data-word-wrap'] = ''
  }
  const codeProps = {
    'data-language': block.lang,
    dangerouslySetInnerHTML: { __html: block.html }
  }
  if (block.lineNumbers) {
    codeProps['data-line-numbers'] = ''
  }
  if (block.lineNumbersMaxDigits) {
    codeProps['data-line-numbers-max-digits'] = block.lineNumbersMaxDigits
  }
  return createElement(Pre, preProps, createElement(Code, codeProps))
}

export { renderCode }
