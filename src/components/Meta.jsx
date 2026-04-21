/**
 * @fileoverview Meta component for reflection entry metadata.
 *
 * Displays date, time, and author below entry titles. Used by both
 * PageTitle (entry pages) and PostCard (listing pages). When no props
 * are provided, reads from Nextra's activeMetadata via useConfig().
 */

'use client'

import { meta } from '@axivo/website/global'
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
 * Formats parsed time to 12-hour time string.
 *
 * @param {number} hours - Hours (0-23)
 * @param {string} minutes - Minutes (zero-padded)
 * @returns {string} Formatted time (e.g., "9:44 AM")
 */
function formatTime(hours, minutes) {
  const period = hours >= 12 ? 'PM' : 'AM'
  const formatHours = hours % 12 || 12
  return `${formatHours}:${minutes} ${period}`
}

/**
 * Entry metadata bar with date, time, and author.
 *
 * @param {object} [props]
 * @param {string} [props.author] - Author name
 * @param {string} [props.date] - ISO date string
 * @param {string} [props.routePath] - Collection route path for date link (e.g. '/blog', '/claude/reflections')
 * @param {string} [props.source] - GitHub source URL
 * @param {string} [props.template] - Entry template (blog, reflection)
 * @returns {import('react').ReactElement|null} Metadata bar or null
 */
function Meta({ author, date, routePath, source, template } = {}) {
  if (!date) {
    const { normalizePagesResult: { activeMetadata } } = useConfig()
    if (!['blog', 'reflection'].includes(activeMetadata?.template)) {
      return null
    }
    ({ author, date, routePath, source, template } = activeMetadata)
  }
  if (!date) {
    return null
  }
  const [datePart, timePart] = date.split('T')
  const [year, monthPadded, dayPadded] = datePart.split('-')
  const [hours, minutes] = timePart.split(':')
  const month = monthNames[parseInt(monthPadded, 10) - 1]
  const day = parseInt(dayPadded, 10)
  const isBlog = template === 'blog'
  const dayPath = `${routePath}/${year}/${monthPadded}/${dayPadded}`
  const profile = isBlog ? meta.profile.architect : meta.profile.instance
  const authorHref = isBlog ? profile.homepage : source
  return (
    <div className={styles.container}>
      <a href={dayPath} className={styles.date}>
        {month} {day}, {year}
      </a>
      <span className={styles.separator}>&middot;</span>
      <span>{formatTime(parseInt(hours, 10), minutes)}</span>
      {author && (
        <>
          <span className={styles.dash}>&mdash;</span>
          <a
            href={authorHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.author}
          >
            <img
              alt={author}
              className={styles.avatar}
              src={profile.avatar}
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

export { Meta }
