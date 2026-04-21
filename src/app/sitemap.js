/**
 * @fileoverview Sitemap generator for all website sections.
 *
 * Collects routes from each section's Nextra page map and produces
 * a sitemap with URL and change frequency per route.
 * Uses force-static to support Next.js static export.
 */

export const dynamic = 'force-static'
import { meta as blog } from '@axivo/website/blog'
import { meta as claude } from '@axivo/website/claude'
import { domain } from '@axivo/website/global'
import { meta as cluster } from '@axivo/website/k3s-cluster'
import { getPageMap } from 'nextra/page-map'

/**
 * Recursively extracts route paths from Nextra page map items.
 *
 * @param {object[]} pageMapItems - Nextra page map tree
 * @returns {string[]} Flat array of route paths
 */
function extractRoutes(pageMapItems) {
  const routes = []
  for (const item of pageMapItems) {
    if ('data' in item) continue
    if ('route' in item && !('children' in item)) {
      routes.push(item.route)
    }
    if ('children' in item) {
      if (item.children.some((child) => child.name === 'index')) {
        routes.push(item.route)
      }
      routes.push(...extractRoutes(item.children))
    }
  }
  return routes
}

/**
 * Generates the sitemap for all website sections.
 *
 * @returns {Promise<object[]>} Sitemap entries with url and changeFrequency
 */
async function sitemap() {
  const sections = ['/', `/${blog.source.path}`, `/${claude.source.path}`, `/${cluster.source.path}`]
  const routesBySection = await Promise.all(
    sections.map(async (section) => {
      try {
        const pageMap = await getPageMap(section)
        return extractRoutes(pageMap)
      } catch (error) {
        console.error(`Sitemap error for ${section}:`, error)
        return []
      }
    })
  )
  const allRoutes = [...new Set(routesBySection.flat())]
  return allRoutes
    .map((route) => ({
      url: `${domain.protocol}://${domain.name}${route === '/' ? '' : route}`,
      changeFrequency: 'weekly'
    }))
    .sort((a, b) => a.url.localeCompare(b.url))
}

export { sitemap as default }
