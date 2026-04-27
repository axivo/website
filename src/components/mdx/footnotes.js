/**
 * @fileoverview MDAST preprocessor for GFM footnotes.
 *
 * remark-gfm produces footnoteReference and footnoteDefinition nodes that
 * safe-mdx silently drops. The canonical Nextra/GitHub rendering requires
 * a two-pass walk: collect all definitions, number references in document
 * order, render inline references as superscript links, and append a
 * Footnotes section at end of document containing back-references.
 *
 * This preprocessor performs that walk and mutates the MDAST tree in place:
 * tags each footnoteReference with `_footnoteIndex` (1-based), removes
 * footnoteDefinition nodes from their inline positions, and appends a
 * synthetic `html`-equivalent block node tree at the document end matching
 * mdast-util-to-hast's footer output exactly.
 */

const CLOBBER_PREFIX = 'user-content-'

/**
 * Walks the MDAST tree, collecting and numbering footnote nodes. Mutates
 * the root: removes footnoteDefinition children, tags references with
 * their 1-based index, and appends a Footnotes section if any definitions
 * were collected.
 *
 * @param {object} root - MDAST root node
 * @returns {void}
 */
function extractFootnotes(root) {
  const definitions = new Map()
  const referenceOrder = []
  const referenceCounts = new Map()
  collectDefinitions(root, definitions)
  removeDefinitions(root)
  numberReferences(root, definitions, referenceOrder, referenceCounts)
  if (referenceOrder.length === 0) {
    return
  }
  root.children.push(buildFooterSection(definitions, referenceOrder, referenceCounts))
}

/**
 * Recursively collects all footnoteDefinition nodes into the registry,
 * keyed by lowercased identifier.
 *
 * @param {object} node - MDAST node to walk
 * @param {Map<string, object>} definitions - Registry to populate
 * @returns {void}
 */
function collectDefinitions(node, definitions) {
  if (!node || !node.children) {
    return
  }
  for (const child of node.children) {
    if (child.type === 'footnoteDefinition') {
      definitions.set(child.identifier.toLowerCase(), child)
    }
    collectDefinitions(child, definitions)
  }
}

/**
 * Recursively removes footnoteDefinition nodes from the tree.
 *
 * @param {object} node - MDAST node to walk
 * @returns {void}
 */
function removeDefinitions(node) {
  if (!node || !node.children) {
    return
  }
  node.children = node.children.filter(child => child.type !== 'footnoteDefinition')
  for (const child of node.children) {
    removeDefinitions(child)
  }
}

/**
 * Recursively walks the tree, assigning each footnoteReference a 1-based
 * index based on definition order of first appearance. Tracks how many
 * times each definition is referenced.
 *
 * @param {object} node - MDAST node to walk
 * @param {Map<string, object>} definitions - Definition registry
 * @param {Array<string>} referenceOrder - Order of first reference per id
 * @param {Map<string, number>} referenceCounts - Reference count per id
 * @returns {void}
 */
function numberReferences(node, definitions, referenceOrder, referenceCounts) {
  if (!node || !node.children) {
    return
  }
  for (const child of node.children) {
    if (child.type === 'footnoteReference') {
      const id = child.identifier.toLowerCase()
      if (!definitions.has(id)) {
        continue
      }
      if (!referenceCounts.has(id)) {
        referenceOrder.push(id)
      }
      const count = (referenceCounts.get(id) || 0) + 1
      referenceCounts.set(id, count)
      child._footnoteIndex = referenceOrder.indexOf(id) + 1
      child._footnoteRereferenceIndex = count
    }
    numberReferences(child, definitions, referenceOrder, referenceCounts)
  }
}

/**
 * Builds the synthetic Footnotes section node tree appended at end of
 * document. Matches mdast-util-to-hast's output structure exactly so any
 * global CSS targeting `section.footnotes` applies.
 *
 * @param {Map<string, object>} definitions - Definition registry
 * @param {Array<string>} referenceOrder - Order of first reference per id
 * @param {Map<string, number>} referenceCounts - Reference count per id
 * @returns {object} Synthetic MDAST-compatible node tree
 */
function buildFooterSection(definitions, referenceOrder, referenceCounts) {
  const items = referenceOrder.map((id, index) => {
    const definition = definitions.get(id)
    const safeId = encodeURIComponent(id)
    const count = referenceCounts.get(id) || 1
    const backReferences = []
    for (let i = 1; i <= count; i++) {
      backReferences.push({
        type: 'link',
        url: `#${CLOBBER_PREFIX}fnref-${safeId}${i > 1 ? `-${i}` : ''}`,
        data: {
          hProperties: {
            dataFootnoteBackref: '',
            ariaLabel: `Back to reference ${index + 1}${i > 1 ? `-${i}` : ''}`,
            className: ['data-footnote-backref']
          }
        },
        children: [{ type: 'text', value: '↩' }]
      })
      if (i < count) {
        backReferences.push({ type: 'text', value: ' ' })
      }
    }
    const definitionChildren = (definition.children || []).map(child => {
      if (child.type !== 'paragraph') {
        return child
      }
      return {
        ...child,
        children: [...child.children, { type: 'text', value: ' ' }, ...backReferences]
      }
    })
    if (definitionChildren.length === 0 || definitionChildren[definitionChildren.length - 1].type !== 'paragraph') {
      definitionChildren.push({ type: 'paragraph', children: backReferences })
    }
    return {
      type: 'listItem',
      data: { hProperties: { id: `${CLOBBER_PREFIX}fn-${safeId}` } },
      children: definitionChildren
    }
  })
  return {
    type: 'footnotesSection',
    children: items
  }
}

export { extractFootnotes }
