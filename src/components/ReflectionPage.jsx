/**
 * @fileoverview Client-side pagination for Reflections component.
 *
 * Handles page state and prev/next navigation for paginated
 * reflection entry listings. Receives serialized entries from
 * the server component and renders PostCard for the current page.
 */

'use client'

import { Children, useState } from 'react'
import styles from './ReflectionPage.module.css'

/**
 * Paginated reflection entries with prev/next navigation.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Pre-rendered PostCard components
 * @param {number} props.pageSize - Entries per page
 * @param {number} props.totalPages - Total number of pages
 */
function ReflectionPage({ children, pageSize, totalPages }) {
  const [page, setPage] = useState(1)
  const allCards = Children.toArray(children)
  const start = (page - 1) * pageSize
  const pageCards = allCards.slice(start, start + pageSize)
  return (
    <>
      {pageCards}
      {totalPages > 1 && (
        <div className={styles.container}>
          <div>
            {page > 1 && (
              <a className="button" onClick={() => setPage(page - 1)} style={{ cursor: 'pointer' }}>
                <span className="prev">←</span> Previous
              </a>
            )}
          </div>
          <span className={styles.page}>
            {page} / {totalPages}
          </span>
          <div className={styles.trailing}>
            {page < totalPages && (
              <a className="button" onClick={() => setPage(page + 1)} style={{ cursor: 'pointer' }}>
                Next <span>→</span>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export { ReflectionPage }
