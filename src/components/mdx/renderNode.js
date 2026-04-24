/**
 * @fileoverview safe-mdx renderNode hook for dynamic MDX pages.
 *
 * Provides MDAST-level transforms that the runtime pipeline needs but
 * safe-mdx's default traversal does not supply. Currently handles GitHub
 * Flavored Markdown alert blockquotes (`> [!NOTE]`, `> [!TIP]`, and so on)
 * by detecting the marker in the first text node of a blockquote and
 * routing the node to the Callout component.
 *
 * Mirrors Nextra's `withGitHubAlert` HOC contract so the Callout
 * component receives the same children shape on bundled and dynamic
 * pages: a leading `<b>{CapitalizedName}</b>` label followed by the
 * blockquote's remaining content. Callout's `stripLabel` removes the
 * `<b>` to avoid duplicating the title bar, keeping both pipelines
 * behaviorally identical.
 *
 * Designed to compose: each rule inspects the node and returns either a
 * React element (handled) or undefined (fall through to safe-mdx default).
 */

import { createElement } from 'react'
import { Callout } from './Callout'

/**
 * Detects a GitHub alert marker in a blockquote and renders a Callout.
 * Returns undefined when the blockquote is a plain quote so safe-mdx
 * falls back to its default blockquote rendering.
 *
 * @param {object} node - MDAST blockquote node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode|undefined}
 */
function renderAlert(node, transform) {
  const firstChild = node.children?.[0]
  if (firstChild?.type !== 'paragraph' || firstChild.children?.length !== 1) {
    return undefined
  }
  const firstText = firstChild.children[0]
  if (firstText?.type !== 'text' || typeof firstText.value !== 'string') {
    return undefined
  }
  const match = firstText.value.match(/^\s*\[!(?<name>[A-Z]+)\]\s*$/)
  if (!match) {
    return undefined
  }
  const name = match.groups.name.toLowerCase()
  if (!['caution', 'important', 'note', 'tip', 'warning'].includes(name)) {
    return undefined
  }
  const capitalizedName = name[0].toUpperCase() + name.slice(1)
  const bodyChildren = node.children
    .slice(1)
    .map(child => transform(child))
    .flat()
    .filter(Boolean)
  const children = [createElement('b', { key: 0 }, capitalizedName), ...bodyChildren]
  return createElement(Callout, { type: name, children })
}

/**
 * Composed renderNode hook passed to SafeMdxRenderer. Iterates detection
 * rules in order and returns the first match. Returns undefined when no
 * rule applies so safe-mdx continues with its default MDAST traversal.
 *
 * @param {object} node - MDAST node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode|undefined}
 */
export function renderNode(node, transform) {
  if (node.type === 'blockquote') {
    return renderAlert(node, transform)
  }
  return undefined
}
