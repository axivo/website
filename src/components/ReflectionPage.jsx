/**
 * @fileoverview Client-side pagination for Reflections component.
 *
 * Handles page state and prev/next navigation for paginated
 * reflection entry listings. Receives serialized entries from
 * the server component and renders PostCard for the current page.
 * Updates TOC entries and scroll-spy highlighting on page change.
 */

'use client'

import { meta } from '@axivo/website/claude'
import { Children, useEffect, useRef, useState } from 'react'
import styles from './ReflectionPage.module.css'

const activeClass = 'x:text-primary-600 x:contrast-more:text-primary-600!'
const inactiveClass = 'x:text-gray-600 x:hover:text-gray-900 x:dark:text-gray-400 x:dark:hover:text-gray-300'
const linkClass = 'x:focus-visible:nextra-focus x:ms-3 x:block x:transition-colors x:subpixel-antialiased x:contrast-more:text-gray-900 x:contrast-more:underline x:contrast-more:dark:text-gray-50 x:break-words'

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
  const containerRef = useRef(null)
  const observerRef = useRef(null)
  const tocLinksRef = useRef(new Map())
  const allCards = Children.toArray(children)
  const start = (page - 1) * pageSize
  const pageCards = allCards.slice(start, start + pageSize)
  useEffect(() => {
    if (page === 1) {
      return
    }
    const sectionId = meta.reflections.path
    const reflectionsLink = document.querySelector(`a[href="#${sectionId}"]`)
    if (!reflectionsLink) {
      return
    }
    const tocList = reflectionsLink.closest('ul')
    const reflectionsItem = reflectionsLink.closest('li')
    if (!tocList || !reflectionsItem) {
      return
    }
    // Remove existing h3 entries
    const existingH3s = tocList.querySelectorAll('li > a.x\\:ms-3')
    for (const el of existingH3s) {
      el.closest('li')?.remove()
    }
    // Build new TOC entries from visible cards
    const container = containerRef.current
    if (!container) {
      return
    }
    const headings = container.querySelectorAll('h3[id]')
    const tocLinks = new Map()
    let insertAfter = reflectionsItem
    for (const h3 of headings) {
      const id = h3.getAttribute('id')
      const titleLink = h3.querySelector('a[class]')
      const value = titleLink?.textContent || h3.textContent
      const li = document.createElement('li')
      li.className = 'x:my-2 x:scroll-my-6 x:scroll-py-6'
      const a = document.createElement('a')
      a.href = `#${id}`
      a.className = `${linkClass} ${inactiveClass}`
      a.textContent = value
      li.appendChild(a)
      insertAfter.after(li)
      insertAfter = li
      tocLinks.set(id, a)
    }
    tocLinksRef.current = tocLinks
    // Set up IntersectionObserver for scroll-spy highlighting
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    const navbarHeight = getComputedStyle(document.body).getPropertyValue('--nextra-navbar-height') || '0%'
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(entry => entry.isIntersecting)
        if (visible) {
          const activeId = visible.target.id
          for (const [id, link] of tocLinksRef.current) {
            link.className = `${linkClass} ${id === activeId ? activeClass : inactiveClass}`
          }
        }
      },
      { rootMargin: `-${navbarHeight} 0% -80%` }
    )
    for (const h3 of headings) {
      observerRef.current.observe(h3)
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [page])
  const total = allCards.length
  const end = Math.min(start + pageSize, total)
  return (
    <div ref={containerRef}>
      {totalPages > 1 && (
        <p className={styles.summary}>
          ○ Showing {start + 1}–{end} of {total} reflections
        </p>
      )}
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
    </div>
  )
}

export { ReflectionPage }
