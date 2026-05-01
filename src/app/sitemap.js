/**
 * @fileoverview Sitemap generator for all website sections.
 *
 * Walks each section's Nextra page map for bundled routes, then merges
 * R2-backed collection entries (blog, reflections) so dynamic pages
 * appear alongside static ones. Each route receives `<lastmod>` when
 * resolvable: frontmatter `lastModified` (R2 object timestamp) or
 * `date` (authored date) for entries, git-derived timestamps for
 * bundled MDX, and omitted otherwise. All timestamps render in the
 * website's configured timezone for a consistent format.
 *
 * Uses force-static to support Next.js static export.
 */

import { getPageMap } from 'nextra/page-map'
import { buildEntryTimestamps, extractRoutes, resolveBundledTimestamp } from '@axivo/website/sitemap'
import { domain } from '@axivo/website/global'
import { getEntries as getBlogEntries, meta as blog } from '@axivo/website/blog'
import { getEntries as getReflectionEntries, meta as claude } from '@axivo/website/claude'
import { meta as cluster } from '@axivo/website/cluster'
import { timestamps } from '@axivo/website'

export const dynamic = 'force-static'

/**
 * Generates the sitemap for all website sections.
 *
 * @returns {Promise<object[]>} Sitemap entries with url, lastModified, and changeFrequency
 */
async function sitemap() {
  const sections = ['/', `/${blog.source.path}`, `/${claude.source.path}`, `/${cluster.source.path}`]
  const [routesBySection, blogEntries, reflectionEntries] = await Promise.all([
    Promise.all(
      sections.map(async (section) => {
        try {
          const pageMap = await getPageMap(section)
          return extractRoutes(pageMap)
        } catch (error) {
          console.error(`Sitemap error for ${section}:`, error)
          return []
        }
      })
    ),
    getBlogEntries().catch(() => []),
    getReflectionEntries().catch(() => [])
  ])
  const entryTimestamps = {
    ...buildEntryTimestamps(blogEntries),
    ...buildEntryTimestamps(reflectionEntries)
  }
  const entryRoutes = [...blogEntries, ...reflectionEntries].map((entry) => entry.route)
  const allRoutes = [...new Set([...routesBySection.flat(), ...entryRoutes])]
  return allRoutes
    .map((route) => {
      const lastModified = entryTimestamps[route] ?? resolveBundledTimestamp(route, timestamps)
      const entry = {
        url: `${domain.protocol}://${domain.name}${route === '/' ? '' : route}`,
        changeFrequency: 'weekly'
      }
      if (lastModified) {
        entry.lastModified = lastModified
      }
      return entry
    })
    .sort((a, b) => a.url.localeCompare(b.url))
}

export { sitemap as default }
