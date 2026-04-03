/**
 * @fileoverview Reflections component and data fetching.
 *
 * Provides the Reflections component that renders a list of reflection
 * entries using PostCard. Queries Nextra's page map to collect blog
 * template entries, sorted by date descending.
 *
 * Usage:
 * - <Reflections /> — all entries, paginated (20 per page)
 * - <Reflections limit='20' /> — last 20 entries, no pagination
 * - <Reflections date='2025' /> — all 2025 entries, paginated
 * - <Reflections date='2025/11' /> — all November 2025 entries, paginated
 * - <Reflections date='2025/11/17' /> — all entries for that day, paginated
 */

import { reflections } from '@axivo/website/claude'
import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { PostCard } from './PostCard'
import { ReflectionPage } from './ReflectionPage'
import { TagGrid } from './Tag'
import styles from './Reflection.module.css'

const components = getMDXComponents()

/**
 * Default number of entries per page.
 */
const pageSize = 20

/**
 * Recursively collects leaf entries from nested page map directories.
 *
 * @param {object[]} items - Page map items to traverse
 * @returns {object[]} Flat array of entries with frontMatter
 */
function collectEntries(items) {
  const entries = []
  for (const item of items) {
    if (item.children) {
      entries.push(...collectEntries(item.children))
    } else if (item.frontMatter?.template === 'blog') {
      entries.push(item)
    }
  }
  return entries
}

/**
 * Filters entries by date prefix.
 *
 * @param {object[]} entries - Entries to filter
 * @param {string} date - Date filter (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @returns {object[]} Filtered entries
 */
function filterByDate(entries, date) {
  const parts = date.split('/')
  return entries.filter(entry => {
    const d = new Date(entry.frontMatter.date)
    const year = String(d.getFullYear())
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    if (parts.length === 1) {
      return year === parts[0]
    }
    if (parts.length === 2) {
      return year === parts[0] && month === parts[1]
    }
    return year === parts[0] && month === parts[1] && day === parts[2]
  })
}

/**
 * Fetches all reflection entries sorted by date descending.
 *
 * @returns {Promise<object[]>} Sorted array of reflection entries
 */
async function getEntries() {
  const { directories } = normalizePages({
    list: await getPageMap(reflections.path),
    route: reflections.path
  })
  return collectEntries(directories)
    .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date))
}

/**
 * Renders a list of reflection entries as PostCard components.
 * When limit is set, shows that many entries without pagination.
 * When limit is omitted, shows all entries with pagination (20 per page).
 *
 * @param {object} props
 * @param {import('react').ReactNode} [props.children] - Section heading (MDX heading for TOC registration)
 * @param {string} [props.date] - Date filter (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @param {string} [props.limit] - Maximum entries to display (disables pagination)
 * @param {object} [props.style] - Custom styles for the container
 * @returns {Promise<import('react').ReactElement>} List of PostCard components
 */
async function Reflections({ children, date, limit, style }) {
  let entries = await getEntries()
  if (date) {
    entries = filterByDate(entries, date)
  }
  if (limit) {
    return (
      <div className={styles.container} style={style}>
        {children}
        {entries.slice(0, parseInt(limit, 10)).map(entry => (
          <PostCard key={entry.route} post={entry} />
        ))}
      </div>
    )
  }
  const totalPages = Math.ceil(entries.length / pageSize)
  const cards = entries.map(entry => (
    <PostCard key={entry.route} post={entry} />
  ))
  return (
    <div className={styles.container} style={style}>
      {children}
      <ReflectionPage pageSize={pageSize} totalPages={totalPages}>
        {cards}
      </ReflectionPage>
    </div>
  )
}

/**
 * Fetches all unique tags from reflection entries.
 *
 * @returns {Promise<string[]>} Array of all tags (may contain duplicates)
 */
async function getTags() {
  const entries = await getEntries()
  return entries.flatMap(entry => entry.frontMatter.tags || [])
}

/**
 * Renders all tags as linked pills with entry counts.
 *
 * @returns {Promise<import('react').ReactElement>} Tag pills grid
 */
async function Tags() {
  const allTags = await getTags()
  const tagCounts = Object.create(null)
  for (const tag of allTags) {
    tagCounts[tag] ??= 0
    tagCounts[tag] += 1
  }
  const sorted = Object.entries(tagCounts).sort((a, b) => a[0].localeCompare(b[0]))
  return <TagGrid tags={sorted} />
}

/**
 * Returns the ordinal suffix for a day number.
 *
 * @param {number} day - Day of the month
 * @returns {string} Day with ordinal suffix (e.g., "1st", "2nd", "3rd", "4th")
 */
function ordinal(day) {
  if (day > 3 && day < 21) {
    return `${day}th`
  }
  const suffixes = ['th', 'st', 'nd', 'rd']
  return `${day}${suffixes[day % 10] || 'th'}`
}

/**
 * Formats a date string for display as a page title.
 * Accepts YYYY, YYYY/MM, or YYYY/MM/DD formats.
 *
 * @param {object} props
 * @param {string} props.date - Date string (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @returns {string} Formatted title
 */
function Title({ date }) {
  const parts = date.split('/')
  if (parts.length === 1) {
    return parts[0]
  }
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  if (parts.length === 2) {
    return months[parseInt(parts[1], 10) - 1]
  }
  return ordinal(parseInt(parts[2], 10))
}

export { getEntries, getTags, Reflections, Tags, Title }
