/**
 * @fileoverview Sitemap generator for the claude subsite.
 *
 * Collects routes from the claude section's Nextra page map and produces
 * a sitemap with URL and change frequency per route.
 */

export const dynamic = 'force-static'
import { domain } from '@axivo/website/global'
import { subsite } from '@axivo/website/claude'
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
 * Generates the sitemap for the claude subsite.
 *
 * @returns {Promise<object[]>} Sitemap entries with url and changeFrequency
 */
async function sitemap() {
  try {
    const pageMap = await getPageMap(`/${subsite.path}`)
    const routes = extractRoutes(pageMap)
    return routes
      .map((route) => ({
        url: `${domain.protocol}://${domain.name}${route}`,
        changeFrequency: 'weekly'
      }))
      .sort((a, b) => a.url.localeCompare(b.url))
  } catch (error) {
    console.error(`Sitemap error for /${subsite.path}:`, error)
    return []
  }
}

export { sitemap as default }
