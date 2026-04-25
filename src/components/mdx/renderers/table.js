/**
 * @fileoverview Table renderer for the safe-mdx pipeline.
 *
 * MDAST tables produced by remark-gfm carry alignment metadata on the
 * `table` node and a header-row convention (the first `tableRow` child
 * is the header). safe-mdx's default handler renders every cell as a
 * `<td>` and ignores alignment, which loses both the header semantics
 * and the visual cue Nextra's Table component expects. This renderer
 * walks the table explicitly: first row becomes `<thead>` with `<th>`
 * cells, remaining rows become `<tbody>` with `<td>` cells, and the
 * align array is applied per-column as a `text-align` style.
 */

import { createElement } from 'react'
import { Table } from 'nextra/components'

/**
 * Renders an MDAST table node as a Nextra Table with proper thead/tbody
 * separation and column alignment applied to header and body cells.
 *
 * @param {object} node - MDAST table node
 * @param {(child: object) => import('react').ReactNode} transform - Child transformer
 * @returns {import('react').ReactNode}
 */
function renderTable(node, transform) {
  const align = node.align || []
  const rows = node.children || []
  const [headRow, ...bodyRows] = rows
  const renderCell = (cell, columnIndex, isHeader) => {
    const Cell = isHeader ? Table.Th : Table.Td
    const style = align[columnIndex] ? { textAlign: align[columnIndex] } : undefined
    const content = (cell.children || []).map(child => transform(child)).flat().filter(Boolean)
    return createElement(Cell, { key: columnIndex, style }, content)
  }
  const renderRow = (row, key, isHeader) =>
    createElement(
      Table.Tr,
      { key },
      (row.children || []).map((cell, columnIndex) => renderCell(cell, columnIndex, isHeader))
    )
  return createElement(
    Table,
    null,
    headRow && createElement('thead', { key: 'head' }, renderRow(headRow, 'head-row', true)),
    bodyRows.length > 0 &&
      createElement(
        'tbody',
        { key: 'body' },
        bodyRows.map((row, rowIndex) => renderRow(row, rowIndex, false))
      )
  )
}

export { renderTable }
