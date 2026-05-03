/**
 * @fileoverview llms.txt index for AI consumers.
 *
 * Emits a spec-compliant `llms.txt` file with one section per top-level
 * area of the site. Each section lists the area's landing page first
 * ("Home"), followed by the immediate subsections derived from the
 * page map. Section names use the canonical `meta.source.title`
 * configured per area; subsection titles flow from `_meta.js` via
 * Nextra's normalized page map (resolved by `extractPages`). Deep
 * content (individual blog posts, reflections, wiki pages) is reached
 * by following the section landing links.
 *
 * Uses force-static to support Next.js static export.
 *
 * @example
 * GET /llms.txt
 */

import { getPageMap } from 'nextra/page-map'
import { meta as blog } from '@axivo/website/blog'
import { meta as claude } from '@axivo/website/claude'
import { meta as cluster } from '@axivo/website/cluster'
import { domain, meta as website, repository } from '@axivo/website/global'
import { extractPages } from '@axivo/website/sitemap'
import { stripMarkdown } from '@axivo/website/page'

export const dynamic = 'force-static'

/**
 * Generates the complete llms.txt body.
 *
 * @returns {Promise<string>} Markdown body
 */
async function buildBody() {
  const [homePages, blogPages, claudePages, clusterPages] = await Promise.all([
    getPageMap('/').then(extractPages).catch(() => []),
    getPageMap(`/${blog.source.path}`).then(extractPages).catch(() => []),
    getPageMap(`/${claude.source.path}`).then(extractPages).catch(() => []),
    getPageMap(`/${cluster.source.path}`).then(extractPages).catch(() => [])
  ])
  const summary = stripMarkdown(homePages.find(page => page.route === '/')?.description ?? '')
  const lines = [
    `# ${website.brand.name}`,
    '',
    summary,
    '',
    formatSection(blog.source.title, sectionPages(blogPages, `/${blog.source.path}`)),
    formatSection(claude.source.title, sectionPages(claudePages, `/${claude.source.path}`)),
    formatSection(cluster.source.title, sectionPages(clusterPages, `/${cluster.source.path}`)),
    '## Contact',
    '',
    `- Architect: [${website.profile.architect.name}](${website.profile.architect.homepage})`,
    `- Website: [${domain.protocol}://${domain.name}](${domain.protocol}://${domain.name})`,
    `- Repository: [https://${repository.home}](https://${repository.home})`,
    `- Sitemap: [${domain.protocol}://${domain.name}/sitemap.xml](${domain.protocol}://${domain.name}/sitemap.xml)`,
    '',
    '## Last updated',
    '',
    new Date().toISOString().slice(0, 10),
    ''
  ]
  return lines.join('\n')
}

/**
 * Builds the absolute canonical URL for a route under the configured
 * domain. llms.txt links canonical URLs so AI consumers receive the
 * fully-rendered HTML, which strips MDX scaffolding and resolves
 * components into clean prose suitable for ingestion.
 *
 * @param {string} route - Site route path (e.g. '/claude/wiki')
 * @returns {string} Absolute canonical URL
 */
function buildPageUrl(route) {
  return `${domain.protocol}://${domain.name}${route}`
}

/**
 * Formats a single page as a spec-canonical bulleted line.
 *
 * @param {{ description: string, hidden: boolean, route: string, title: string }} page
 * @returns {string} Markdown bullet line
 */
function formatPage(page) {
  return `- [${page.title}](${buildPageUrl(page.route)}): ${stripMarkdown(page.description)}`
}

/**
 * Formats a named section with a heading and page lines. Returns an
 * empty string when the section has no pages so empty sections do
 * not pollute the output.
 *
 * @param {string} title - Section heading text
 * @param {Array<{ description: string, hidden: boolean, route: string, title: string }>} pages
 * @returns {string} Section block, or empty string when no pages
 */
function formatSection(title, pages) {
  if (pages.length === 0) {
    return ''
  }
  return [`## ${title}`, '', ...pages.map(formatPage), ''].join('\n')
}

/**
 * Returns the section's landing page first, followed by its immediate
 * subsections in alphabetical order. Subsections are pages whose route
 * sits exactly one segment below the section root. Pages without a
 * description are filtered so each emitted line is meaningful, and
 * subsections marked `display: 'hidden'` in `_meta.js` are excluded
 * (the section root itself is always included regardless of the
 * hidden flag, since navbar-style hiding does not apply to llms.txt).
 *
 * @param {Array<{ description: string|undefined, hidden: boolean, route: string, title: string }>} pages
 * @param {string} sectionPath - Section root path (e.g. '/claude')
 * @returns {Array<{ description: string, hidden: boolean, route: string, title: string }>}
 */
function sectionPages(pages, sectionPath) {
  const root = pages.find(page => page.route === sectionPath && page.description)
  const rootDepth = sectionPath.split('/').filter(Boolean).length
  const subsections = pages
    .filter(page => {
      if (!page.description || page.hidden) {
        return false
      }
      if (!page.route.startsWith(`${sectionPath}/`)) {
        return false
      }
      const segments = page.route.split('/').filter(Boolean)
      return segments.length === rootDepth + 1
    })
    .sort((a, b) => a.title.localeCompare(b.title))
  return root ? [root, ...subsections] : subsections
}

/**
 * Handles llms.txt requests.
 *
 * @returns {Promise<Response>} Markdown response
 */
export async function GET() {
  const body = await buildBody()
  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8'
    }
  })
}
