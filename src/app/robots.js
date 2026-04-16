/**
 * @fileoverview Robots configuration for search engine crawlers.
 *
 * Generates robots.txt with crawling rules and sitemap location.
 * Uses force-static to support Next.js static export.
 */

export const dynamic = 'force-static'
import { crawlers, domain } from '@axivo/website/global'

/**
 * Generates robots.txt configuration.
 *
 * @returns {object} Robots rules and sitemap URL
 */
function robots() {
  const rules = [{ userAgent: crawlers, allow: '/' }]
  if (!crawlers.includes('*')) {
    rules.push({ userAgent: '*', disallow: '/' })
  }
  return {
    rules,
    sitemap: `${domain.protocol}://${domain.name}/sitemap.xml`
  }
}

export { robots as default }
