/**
 * @fileoverview Alert blockquote renderer for the safe-mdx pipeline.
 *
 * Detects GitHub Flavored Markdown alert markers (`> [!NOTE]`, `> [!TIP]`,
 * and so on) in the first text node of a blockquote and routes the node
 * to the Callout component. Returns undefined for plain blockquotes so
 * safe-mdx falls back to its default rendering.
 *
 * Mirrors Nextra's `withGitHubAlert` HOC contract so the Callout
 * component receives the same children shape on bundled and dynamic
 * pages: a leading `<b>{CapitalizedName}</b>` label followed by the
 * blockquote's remaining content. Callout's `stripLabel` removes the
 * `<b>` to avoid duplicating the title bar, keeping both pipelines
 * behaviorally identical.
 */

import { createElement } from 'react'
import { Callout } from '../Callout'

/**
 * Renders an MDAST blockquote as a Callout when its first text node
 * matches a GitHub alert marker. Returns undefined for non-matching
 * blockquotes so safe-mdx renders them normally.
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

export { renderAlert }
