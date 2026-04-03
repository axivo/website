/**
 * @fileoverview Robots configuration for search engine crawlers.
 *
 * Generates robots.txt with crawling rules and sitemap location.
 * Uses force-static to support Next.js static export.
 */

export const dynamic = 'force-static'
import { crawlers, domain } from '@axivo/website/docs'

/**
 * Generates robots.txt configuration.
 *
 * @returns {object} Robots rules and sitemap URL
 */
function robots() {
  return {
    rules: [
      { userAgent: crawlers, allow: '/' },
      { userAgent: '*', disallow: '/' }
    ],
    sitemap: `https://${domain}/sitemap.xml`
  }
}

export { robots as default }
