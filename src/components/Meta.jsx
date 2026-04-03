/**
 * @fileoverview Meta component for blog template pages.
 *
 * Displays entry metadata (date, time, author) below the page title on
 * blog entries. Only renders when the page frontmatter includes
 * template: 'blog'. Reads metadata from Nextra's activeMetadata via
 * useConfig(). Integrated through the PageTitle component.
 */

'use client'

import { useConfig } from 'nextra-theme-docs'
import styles from './Meta.module.css'

/**
 * Month name lookup for date formatting.
 */
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * Author metadata bar for blog template pages.
 * Renders date (linked to day page), time, and author with avatar
 * (linked to GitHub source file).
 *
 * @returns {import('react').ReactElement|null} Author bar or null for non-blog pages
 */
function Meta() {
  const { normalizePagesResult: { activeMetadata } } = useConfig()
  if (activeMetadata?.template !== 'blog') {
    return null
  }
  const { date: dateStr, author, source } = activeMetadata
  if (!dateStr) {
    return null
  }
  const date = new Date(dateStr)
  const day = date.getDate()
  const dayPadded = day.toString().padStart(2, '0')
  const month = monthNames[date.getMonth()]
  const monthPadded = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const dayPath = `/claude/reflections/${year}/${monthPadded}/${dayPadded}`
  return (
    <div className={styles.container}>
      <a href={dayPath} className={styles.date}>
        {month} {day}, {year}
      </a>
      <span className={styles.separator}>&middot;</span>
      <span>{formatTime(date)}</span>
      {author && (
        <>
          <span className={styles.dash}>&mdash;</span>
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.author}
            title={author}
          >
            <img
              alt={author}
              className={styles.avatar}
              src="https://github.com/claude.png"
              width="16"
              height="16"
            />
            {author}
          </a>
        </>
      )}
    </div>
  )
}

/**
 * Formats a Date object to 12-hour time string.
 *
 * @param {Date} date - Date to format
 * @returns {string} Formatted time (e.g., "9:44 AM")
 */
function formatTime(date) {
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${period}`
}

export { Meta }
