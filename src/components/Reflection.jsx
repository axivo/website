/**
 * @fileoverview Reflections component and data fetching.
 *
 * Provides the Reflections component that renders a list of reflection
 * entries using PostCard. Fetches R2 metadata to collect blog
 * template entries, sorted by date descending.
 *
 * Usage:
 * - <Reflections /> — all entries, paginated (20 per page)
 * - <Reflections limit='20' /> — last 20 entries, no pagination
 * - <Reflections date='2025' /> — all 2025 entries, paginated
 * - <Reflections date='2025/11' /> — all November 2025 entries, paginated
 * - <Reflections date='2025/11/17' /> — all entries for that day, paginated
 */

import { useMDXComponents as getMDXComponents } from '@axivo/website'
import { reflections } from '@axivo/website/claude'
import { domain } from '@axivo/website/global'
import { PostCard } from './PostCard'
import { ReflectionPage } from './ReflectionPage'
import { TagGrid } from './Tag'
import styles from './Reflection.module.css'

const reflectionsPageSize = 20

/**
 * Converts R2 metadata object to entry shape expected by components.
 *
 * @param {object} obj - R2 metadata object with key and frontmatter fields
 * @returns {object} Entry with route and frontMatter
 */
function toEntry(obj) {
  const route = '/' + obj.key.replace('src/content/', '').replace('.mdx', '')
  const { key, ...frontMatter } = obj
  return { frontMatter, route }
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
    const [year, month, day] = entry.frontMatter.date.split('T')[0].split('-')
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
 * Fetches metadata objects from the metadata endpoint.
 *
 * @returns {Promise<object[]>} Array of R2 metadata objects
 */
async function fetchMetadata() {
  const response = await fetch(`${domain.protocol}://${domain.name}/metadata`)
  const { objects } = await response.json()
  return objects
}

/**
 * Fetches all reflection entries from metadata endpoint, sorted by date descending.
 *
 * @returns {Promise<object[]>} Sorted array of reflection entries
 */
async function getEntries() {
  const objects = await fetchMetadata()
  return objects
    .filter(obj => obj.template === 'blog')
    .map(toEntry)
    .sort((a, b) => b.frontMatter.date.localeCompare(a.frontMatter.date))
}

/**
 * Builds pre-normalization page map children for reflection entries.
 * Returns year folder children matching nextra's internal page map format.
 *
 * @returns {Promise<object[]>} Array of year folder items (pre-normalization)
 */
async function getReflectionPageMap() {
  const objects = await fetchMetadata()
  const entries = objects.filter(obj => obj.template === 'blog')
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const tree = {}
  for (const obj of entries) {
    const segments = obj.key
      .replace('src/content/claude/reflections/', '')
      .replace('.mdx', '')
      .split('/')
    const [year, month, day, slug] = segments
    tree[year] ??= {}
    tree[year][month] ??= {}
    tree[year][month][day] ??= []
    const { key, ...frontMatter } = obj
    tree[year][month][day].push({
      frontMatter,
      name: slug,
      route: `${reflections.path}/${segments.join('/')}`
    })
  }
  const result = []
  for (const year of Object.keys(tree).sort()) {
    const yearRoute = `${reflections.path}/${year}`
    const monthFolders = []
    for (const month of Object.keys(tree[year]).sort()) {
      const monthRoute = `${yearRoute}/${month}`
      const monthName = months[parseInt(month, 10) - 1]
      const dayFolders = []
      for (const day of Object.keys(tree[year][month]).sort()) {
        const dayRoute = `${monthRoute}/${day}`
        const dayNum = parseInt(day, 10)
        dayFolders.push({
          name: day,
          route: dayRoute,
          children: [
            {
              frontMatter: { asIndexPage: true, title: `${dayNum}` },
              name: 'index',
              route: dayRoute
            },
            ...tree[year][month][day]
          ]
        })
      }
      monthFolders.push({
        name: month,
        route: monthRoute,
        children: [
          {
            frontMatter: { asIndexPage: true, title: monthName },
            name: 'index',
            route: monthRoute
          },
          ...dayFolders
        ]
      })
    }
    result.push({
      name: year,
      route: yearRoute,
      children: [
        {
          frontMatter: { asIndexPage: true, theme: { collapsed: false }, title: year },
          name: 'index',
          route: yearRoute
        },
        ...monthFolders
      ]
    })
  }
  return result
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
  const totalPages = Math.ceil(entries.length / reflectionsPageSize)
  const cards = entries.map(entry => (
    <PostCard key={entry.route} post={entry} />
  ))
  return (
    <div className={styles.container} style={style}>
      {children}
      <ReflectionPage pageSize={reflectionsPageSize} totalPages={totalPages}>
        {cards}
      </ReflectionPage>
    </div>
  )
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
  const month = months[parseInt(parts[1], 10) - 1]
  if (parts.length === 2) {
    return `${month} ${parts[0]}`
  }
  return `${month} ${parseInt(parts[2], 10)}, ${parts[0]}`
}

/**
 * Builds metadata and content for a reflection index page.
 *
 * @param {string} date - Date string (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @returns {object} Object with content (ReactElement) and metadata
 */
async function renderIndexPage(date) {
  const parts = date.split('/')
  const [year, month, day] = parts
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const monthName = month ? months[parseInt(month, 10) - 1] : ''
  const dayNum = day ? parseInt(day, 10) : null
  let title
  let seoTitle
  let phrase
  if (day) {
    title = `${dayNum}`
    seoTitle = `${monthName} ${dayNum}, ${year}`
    phrase = `${monthName} ${dayNum}, ${year}`
  } else if (month) {
    title = monthName
    seoTitle = `${monthName} ${year}`
    phrase = `${monthName} ${year}`
  } else {
    title = year
    seoTitle = null
    phrase = year
  }
  const metadata = {
    asIndexPage: true,
    description: `Reflections written by Anthropic instances during ${phrase} collaborative sessions.`,
    title: seoTitle || title
  }
  const components = getMDXComponents()
  let entries = await getEntries()
  if (date) {
    entries = filterByDate(entries, date)
  }
  const toc = [
    { depth: 2, id: reflections.section.slice(1), value: reflections.title },
    ...entries.slice(0, reflectionsPageSize).map(entry => ({
      depth: 3,
      id: entry.route.split('/').pop(),
      value: entry.frontMatter.title
    }))
  ]
  const content = (
    <>
      <components.h1><Title date={date} /></components.h1>
      <Reflections date={date}>
        <components.h2 id={reflections.section.slice(1)}>{reflections.title}</components.h2>
      </Reflections>
    </>
  )
  return { content, metadata, toc }
}

export { getEntries, getReflectionPageMap, getTags, reflectionsPageSize, Reflections, renderIndexPage, Tags, Title }
