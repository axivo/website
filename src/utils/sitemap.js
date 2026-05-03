/**
 * @fileoverview Shared sitemap helpers for route extraction, entry
 * timestamp resolution, and W3C datetime formatting. Used by the root
 * and section-scoped sitemap routes plus the prebuild script that
 * captures R2 object timestamps into the collection manifests.
 */

/**
 * Formats a Date as a W3C datetime string in UTC with second precision
 * (e.g. `2026-04-30T01:15:27Z`). Drops the milliseconds that
 * `Date.toISOString()` adds, matching the form used by most production
 * sitemaps and avoiding any crawler that's flaky on sub-second precision.
 *
 * @param {Date} date - Timestamp to format
 * @returns {string} ISO 8601 UTC datetime, second precision
 */
function formatTimestamp(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/**
 * Builds a route → ISO timestamp map for R2-backed entries and their
 * year/month/day folder index pages. Each entry uses its frontmatter
 * `lastModified` (R2 object timestamp) when present, otherwise the
 * frontmatter `date` (authored date). Folder pages inherit the max
 * date among entries under that prefix, so a folder's `lastModified`
 * advances when a new or updated entry lands.
 *
 * @param {object[]} entries - Sorted collection entries
 * @returns {Object<string, string>} Map of route → date string
 */
function buildEntryTimestamps(entries) {
  const map = {}
  for (const entry of entries) {
    const date = entry.frontMatter.lastModified ?? entry.frontMatter.date
    if (!date) {
      continue
    }
    map[entry.route] = date
    const segments = entry.route.split('/')
    for (let i = segments.length - 1; i > 0; i--) {
      const parent = segments.slice(0, i).join('/')
      if (!parent) {
        continue
      }
      if (!map[parent] || date > map[parent]) {
        map[parent] = date
      }
    }
  }
  return map
}

/**
 * Recursively extracts addressable pages from Nextra page map items.
 * Skips folders without an `index` child (which are not addressable
 * as URLs). Title resolution mirrors Nextra's own `titlize` precedence:
 * the parent folder's `_meta.js` data title takes priority, then the
 * page's frontmatter `sidebarTitle`, then frontmatter `title`, with
 * the structural `name` as the final fallback. Each emitted page
 * carries the route, the resolved title, the frontmatter description
 * when present, and a `hidden` flag set when the parent folder's
 * `_meta.js` marks the page as `display: 'hidden'`. Consumers that
 * only need routes call `.map(p => p.route)`; consumers that need
 * authored prose read description directly; consumers building
 * navigation-style listings filter out hidden pages.
 *
 * @param {object[]} pageMapItems - Nextra page map tree
 * @param {object} [meta] - Parsed `_meta.js` data from the parent folder, keyed by item name
 * @returns {Array<{ description: string|undefined, hidden: boolean, route: string, title: string }>}
 */
function extractPages(pageMapItems, meta = {}) {
  const dataNode = pageMapItems.find(item => 'data' in item)
  const folderMeta = dataNode ? dataNode.data : meta
  const pages = []
  for (const item of pageMapItems) {
    if ('data' in item) {
      continue
    }
    const itemMeta = folderMeta[item.name]
    const hidden = itemMeta?.display === 'hidden'
    if ('route' in item && !('children' in item)) {
      const frontMatter = item.frontMatter || {}
      pages.push({
        description: frontMatter.description,
        hidden,
        route: item.route,
        title: itemMeta?.title || frontMatter.sidebarTitle || frontMatter.title || item.name
      })
      continue
    }
    if ('children' in item) {
      const indexChild = item.children.find(child => child.name === 'index')
      if (indexChild) {
        const frontMatter = indexChild.frontMatter || {}
        pages.push({
          description: frontMatter.description,
          hidden,
          route: item.route,
          title: itemMeta?.title || frontMatter.sidebarTitle || frontMatter.title || item.name
        })
      }
      pages.push(...extractPages(item.children.filter(child => child.name !== 'index')))
    }
  }
  return pages
}

/**
 * Resolves a bundled MDX route's last-modified timestamp from the
 * git-derived timestamps map. Tries `<route>.mdx` first, then
 * `<route>/index.mdx` for section roots, and returns null when neither
 * source file is tracked.
 *
 * @param {string} route - Site route path (e.g. '/claude/wiki')
 * @param {Object<string, number>} timestamps - Path → epoch ms map
 * @returns {string|null} ISO 8601 UTC datetime, or null when not resolvable
 */
function resolveBundledTimestamp(route, timestamps) {
  const base = route === '/' ? 'src/content/index' : `src/content${route}`
  const candidates = [`${base}.mdx`, `${base}/index.mdx`]
  for (const candidate of candidates) {
    const epoch = timestamps[candidate]
    if (epoch) {
      return formatTimestamp(new Date(epoch))
    }
  }
  return null
}

export { buildEntryTimestamps, extractPages, formatTimestamp, resolveBundledTimestamp }
