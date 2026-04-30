/**
 * @fileoverview Sitemap generator for the claude source.
 *
 * Walks the `/claude` page map for bundled routes and merges in the
 * R2-backed reflections collection so daily entries appear alongside
 * static pages. Timestamp resolution mirrors the root sitemap:
 * frontmatter `lastModified` or `date` for entries, git-derived
 * timestamps for bundled MDX, omitted for pure code routes.
 */

import { getPageMap } from 'nextra/page-map'
import { timestamps } from '@axivo/website'
import { getEntries as getReflectionEntries, meta } from '@axivo/website/claude'
import { domain } from '@axivo/website/global'
import {
  buildEntryTimestamps,
  extractRoutes,
  resolveBundledTimestamp
} from '@axivo/website/sitemap'

export const dynamic = 'force-static'

/**
 * Generates the sitemap for the claude source.
 *
 * @returns {Promise<object[]>} Sitemap entries with url, lastModified, and changeFrequency
 */
async function sitemap() {
  const [pageMapRoutes, reflectionEntries] = await Promise.all([
    getPageMap(`/${meta.source.path}`)
      .then(extractRoutes)
      .catch((error) => {
        console.error(`Sitemap error for /${meta.source.path}:`, error)
        return []
      }),
    getReflectionEntries().catch(() => [])
  ])
  const entryTimestamps = buildEntryTimestamps(reflectionEntries)
  const entryRoutes = reflectionEntries.map((entry) => entry.route)
  const allRoutes = [...new Set([...pageMapRoutes, ...entryRoutes])]
  return allRoutes
    .map((route) => {
      const lastModified = entryTimestamps[route] ?? resolveBundledTimestamp(route, timestamps)
      const entry = {
        url: `${domain.protocol}://${domain.name}${route}`,
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
