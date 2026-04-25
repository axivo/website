/**
 * @fileoverview Footnote reference renderer for the safe-mdx pipeline.
 *
 * Renders a footnoteReference MDAST node as a superscript link to its
 * definition in the document's Footnotes section, matching the canonical
 * mdast-util-to-hast output. The 1-based index is precomputed by the
 * footnotes preprocessor and stored on `node._footnoteIndex`.
 */

import { createElement } from 'react'

const CLOBBER_PREFIX = 'user-content-'

/**
 * Renders a footnoteReference as <sup><a>N</a></sup>.
 *
 * @param {object} node - MDAST footnoteReference node
 * @returns {import('react').ReactNode|undefined}
 */
function renderFootnoteReference(node) {
  if (typeof node._footnoteIndex !== 'number') {
    return undefined
  }
  const safeId = encodeURIComponent(node.identifier.toLowerCase())
  const rereferenceSuffix = node._footnoteRereferenceIndex > 1
    ? `-${node._footnoteRereferenceIndex}`
    : ''
  const link = createElement(
    'a',
    {
      'aria-describedby': 'footnote-label',
      'data-footnote-ref': '',
      href: `#${CLOBBER_PREFIX}fn-${safeId}`,
      id: `${CLOBBER_PREFIX}fnref-${safeId}${rereferenceSuffix}`
    },
    String(node._footnoteIndex)
  )
  return createElement('sup', null, link)
}

export { renderFootnoteReference }
