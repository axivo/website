/**
 * @fileoverview Collection-agnostic post data fetching and rendering.
 *
 * Provides shared helpers for any R2-backed post collection (reflections,
 * blog). Each caller binds these helpers to a collection descriptor
 * identifying its content path, route, metadata manifest, and copy.
 *
 * Collection descriptor shape:
 * - contentPrefix: R2 key prefix (e.g. 'src/content/claude/reflections/')
 * - routePath: URL path to the collection root (e.g. '/claude/reflections')
 * - sectionId: slug used for heading anchors (e.g. 'reflections')
 * - sectionTitle: human title for the section (e.g. 'Reflections')
 * - templates: array of R2 `template` metadata values to match
 * - metadataKey: R2 object key for the collection's manifest
 * - describe: function(phrase) returning SEO description for index pages
 */

import { useMDXComponents as getMDXComponents } from '@axivo/website'
import { PostCard } from './PostCard'
import { PostPage } from './PostPage'
import { TagGrid } from './Tag'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const postsPageSize = 20

const metadataCache = new Map()

/**
 * Reads a collection's metadata manifest directly from R2 via the
 * CONTENT_BUCKET binding. Avoids the HTTP self-fetch that would route
 * the request back through the Worker for no benefit. Memoizes the
 * in-flight promise by metadataKey so concurrent callers share one
 * R2 fetch for the lifetime of the process — safe because the manifest
 * is immutable within a deploy.
 *
 * @param {object} collection - Collection descriptor with metadataKey
 * @returns {Promise<object[]>} Array of R2 metadata objects
 */
async function fetchMetadata(collection) {
  const cached = metadataCache.get(collection.metadataKey)
  if (cached) return cached
  const promise = (async () => {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    const object = await env.CONTENT_BUCKET.get(collection.metadataKey)
    if (!object) return []
    const { objects } = await object.json()
    return objects
  })()
  promise.catch(() => metadataCache.delete(collection.metadataKey))
  metadataCache.set(collection.metadataKey, promise)
  return promise
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
 * Builds pre-normalization page map children for a collection's entries.
 * Returns year folder children matching nextra's internal page map format.
 *
 * @param {object} collection - Collection descriptor
 * @returns {Promise<object[]>} Array of year folder items (pre-normalization)
 */
async function getPostPageMap(collection) {
  const objects = await fetchMetadata(collection)
  const entries = objects.filter(obj => obj.template === collection.template)
  const tree = {}
  for (const obj of entries) {
    const segments = obj.key
      .replace(collection.contentPrefix, '')
      .replace('.mdx', '')
      .split('/')
    const [year, month, day, slug] = segments
    tree[year] ??= {}
    tree[year][month] ??= {}
    tree[year][month][day] ??= []
    const { key, ...rest } = obj
    const frontMatter = { ...rest, routePath: collection.routePath }
    tree[year][month][day].push({
      frontMatter,
      name: slug,
      route: `${collection.routePath}/${segments.join('/')}`
    })
  }
  const result = []
  const years = Object.keys(tree).sort()
  const latestYear = years[years.length - 1]
  for (const year of years) {
    const yearRoute = `${collection.routePath}/${year}`
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
          frontMatter: { asIndexPage: true, theme: { collapsed: year !== latestYear }, title: year },
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
 * Fetches all entries for a collection, sorted by date descending.
 *
 * @param {object} collection - Collection descriptor
 * @returns {Promise<object[]>} Sorted array of entries
 */
async function getPosts(collection) {
  const objects = await fetchMetadata(collection)
  return objects
    .filter(obj => obj.template === collection.template)
    .map(obj => toEntry(obj, collection.contentPrefix))
    .sort((a, b) => b.frontMatter.date.localeCompare(a.frontMatter.date))
}

/**
 * Fetches all unique tags across a collection's entries.
 *
 * @param {object} collection - Collection descriptor
 * @returns {Promise<string[]>} Array of all tags (may contain duplicates)
 */
async function getTags(collection) {
  const entries = await getPosts(collection)
  return entries.flatMap(entry => entry.frontMatter.tags || [])
}

/**
 * Renders a list of collection entries as PostCard components.
 * When limit is set, shows that many entries without pagination.
 * When limit is omitted, shows all entries with pagination (20 per page).
 *
 * @param {object} props
 * @param {object} props.collection - Collection descriptor
 * @param {import('react').ReactNode} [props.children] - Section heading
 * @param {string} [props.date] - Date filter (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @param {string} [props.limit] - Maximum entries to display (disables pagination)
 * @param {object} [props.style] - Custom styles for the container
 * @returns {Promise<import('react').ReactElement>} List of PostCard components
 */
async function Posts({ collection, children, date, entries: entriesProp, limit, style }) {
  let entries = entriesProp ?? await getPosts(collection)
  if (date) {
    entries = filterByDate(entries, date)
  }
  if (limit) {
    return (
      <div style={style}>
        {children}
        {entries.slice(0, parseInt(limit, 10)).map(entry => (
          <PostCard collection={collection} key={entry.route} post={entry} />
        ))}
      </div>
    )
  }
  const totalPages = Math.ceil(entries.length / postsPageSize)
  const cards = entries.map(entry => (
    <PostCard collection={collection} key={entry.route} post={entry} />
  ))
  return (
    <div style={style}>
      {children}
      <PostPage pageSize={postsPageSize} sectionId={collection.sectionId} totalPages={totalPages}>
        {cards}
      </PostPage>
    </div>
  )
}

/**
 * Builds metadata and content for a collection index page.
 *
 * @param {object} collection - Collection descriptor
 * @param {string} date - Date string (YYYY, YYYY/MM, or YYYY/MM/DD)
 * @returns {object} Object with content (ReactElement), metadata, and TOC
 */
async function renderIndexPage(collection, date) {
  const parts = date.split('/')
  const [year, month, day] = parts
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
    description: collection.describe(phrase),
    title: seoTitle || title
  }
  const components = getMDXComponents()
  let entries = await getPosts(collection)
  if (date) {
    entries = filterByDate(entries, date)
  }
  const toc = [
    { depth: 2, id: collection.sectionId, value: collection.sectionTitle },
    ...entries.slice(0, postsPageSize).map(entry => ({
      depth: 3,
      id: entry.route.split('/').pop(),
      value: entry.frontMatter.title
    }))
  ]
  const content = (
    <>
      <components.h1><Title date={date} /></components.h1>
      <Posts collection={collection} date={date}>
        <components.h2 id={collection.sectionId}>{collection.sectionTitle}</components.h2>
      </Posts>
    </>
  )
  return { content, metadata, toc }
}

/**
 * Renders all tags for a collection as linked pills with entry counts.
 *
 * @param {object} props
 * @param {object} props.collection - Collection descriptor
 * @returns {Promise<import('react').ReactElement>} Tag pills grid
 */
async function Tags({ collection }) {
  const allTags = await getTags(collection)
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
  const month = months[parseInt(parts[1], 10) - 1]
  if (parts.length === 2) {
    return `${month} ${parts[0]}`
  }
  return `${month} ${parseInt(parts[2], 10)}, ${parts[0]}`
}

/**
 * Converts R2 metadata object to entry shape expected by components.
 *
 * @param {object} obj - R2 metadata object with key and frontmatter fields
 * @param {string} contentPrefix - R2 key prefix to strip for route building
 * @returns {object} Entry with route and frontMatter
 */
function toEntry(obj, contentPrefix) {
  const route = '/' + obj.key.replace('src/content/', '').replace('.mdx', '')
  const { key, ...frontMatter } = obj
  return { frontMatter, route }
}

/**
 * Reorders year folders inside a normalized page map folder so the latest
 * year appears first. Works around Nextra's alphabetical sort of numeric
 * folder names, which would otherwise list older years first.
 *
 * @param {object} folder - Normalized folder returned by normalizePageMap
 * @returns {object} Same folder with year children reordered
 */
function sortYears(folder) {
  const yearPattern = /^\d{4}$/
  const years = folder.children.filter(child => yearPattern.test(child.name))
  const others = folder.children.filter(child => !yearPattern.test(child.name))
  years.sort((a, b) => b.name.localeCompare(a.name))
  folder.children = [...others, ...years]
  return folder
}

export {
  filterByDate,
  getPostPageMap,
  getPosts,
  getTags,
  Posts,
  postsPageSize,
  renderIndexPage,
  sortYears,
  Tags,
  Title
}
