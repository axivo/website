/**
 * @fileoverview Dynamic page handler for the claude section.
 *
 * Serves all Nextra content pages through the catch-all route and
 * handles dynamic tag pages by intercepting reflections/tags/{tag}
 * paths. Reflection entries are served from R2 storage when available,
 * falling back to bundled MDX content. Tag pages render through the
 * same Wrapper component as MDX content, using MDX components for
 * consistent heading styling.
 */

import { Breadcrumb, getEntries, getTags, PostCard, reflectionStyles, useMDXComponents as getMDXComponents } from '@axivo/website'
import GithubSlugger from 'github-slugger'
import { subsite } from '@axivo/website/claude'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import '../../(home)/page.css'

const components = getMDXComponents()
const nextraStaticParams = generateStaticParamsFor('mdxPath')
const Wrapper = components.wrapper

/**
 * Extracts table of contents from an MDAST tree.
 * Builds Nextra-compatible TOC entries (depth 2-6) with slugged IDs.
 * Annotates heading nodes with id properties for anchor link support.
 *
 * @param {object} mdast - MDAST root node
 * @returns {object[]} Array of { depth, value, id } heading entries
 */
function extractToc(mdast) {
  const slugger = new GithubSlugger()
  const headings = []
  for (const node of mdast.children) {
    if (node.type === 'heading' && node.depth >= 2 && node.depth <= 6) {
      const value = node.children.map(c => c.value || '').join('')
      const id = slugger.slug(value)
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
      headings.push({ depth: node.depth, value, id })
    }
  }
  return headings
}

/**
 * Fetches MDX content and metadata from R2 bucket.
 *
 * @param {string} key - R2 object key
 * @returns {Promise<{ content: string, metadata: object } | null>}
 */
async function fetchR2Object(key) {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    const object = await env.CONTENT_BUCKET.get(key)
    if (!object) {
      console.warn(`R2 fetch returned null for key: ${key}`)
      return null
    }
    const content = await object.text()
    const metadata = { ...object.customMetadata }
    if (metadata.description) {
      metadata.description = decodeURIComponent(metadata.description)
    }
    if (metadata.tags) {
      try {
        metadata.tags = JSON.parse(metadata.tags)
      } catch { }
    }
    return { content, metadata }
  } catch (error) {
    console.error(`R2 fetch failed for key: ${key} - ${error.message}`)
    return null
  }
}

/**
 * Checks if the path matches a tag page route.
 *
 * @param {string[]} path - URL path segments
 * @returns {boolean} True if path is reflections/tags/{tag}
 */
function isTagPage(path) {
  return path[0] === 'reflections' && path[1] === 'tags' && path[2]
}

/**
 * Parses MDX content into an AST for safe rendering.
 *
 * @param {string} mdx - Raw MDX content
 * @returns {object} MDAST root node
 */
function parseMdx(mdx) {
  return unified().use(remarkParse).use(remarkMdx).parse(mdx)
}

/**
 * Builds an activePath array for Nextra's Breadcrumb component.
 * Each item needs route, name, title, and frontMatter to match
 * Nextra's Item type from normalize-pages.
 *
 * @param {string} tag - Tag name
 * @returns {object[]} Array of path items for Breadcrumb
 */
function buildTagBreadcrumb(tag) {
  return [
    { name: 'reflections', route: `/${subsite.path}/reflections`, title: 'Reflections', frontMatter: {} },
    { name: 'tags', route: `/${subsite.path}/reflections/tags`, title: 'Tags', frontMatter: {} },
    { name: tag, route: `/${subsite.path}/reflections/tags/${tag}`, title: tag, frontMatter: {} }
  ]
}

/**
 * Generates page metadata. Returns tag title for tag pages,
 * R2 metadata for reflection entries, or Nextra importPage metadata.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<object>} Page metadata with title
 */
async function generateMetadata(props) {
  const params = await props.params
  const path = params.mdxPath || []
  if (isTagPage(path)) {
    return { title: decodeURIComponent(path[2]) }
  }
  const { metadata } = await importPage([subsite.path, ...path])
  const result = { ...metadata }
  if (result.seoTitle) {
    result.title = result.seoTitle
  }
  if (!result.description) {
    result.description = `${result.title} — ${subsite.title}`
  }
  return result
}

/**
 * Generates static params for all Nextra content pages and dynamic tag pages.
 *
 * @returns {Promise<object[]>} Array of path params for static generation
 */
async function generateStaticParams() {
  const params = await nextraStaticParams()
  const sectionParams = params
    .filter(p => p.mdxPath?.[0] === subsite.path)
    .map(p => ({ mdxPath: p.mdxPath.slice(1) }))
  const allTags = await getTags()
  const tagParams = [...new Set(allTags)].map(tag => ({
    mdxPath: ['reflections', 'tags', tag]
  }))
  return [...sectionParams, ...tagParams]
}

/**
 * Main page component for the claude section catch-all route.
 * Routes tag pages to renderTagPage, reflection entries to R2 content,
 * splash pages to full-width layout, and all other pages to the
 * standard Nextra docs wrapper.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<import('react').ReactElement>} Rendered page
 */
async function Page(props) {
  const params = await props.params
  const path = params.mdxPath || []
  if (isTagPage(path)) {
    return renderTagPage(decodeURIComponent(path[2]))
  }
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage([subsite.path, ...path])
  if (metadata.bucket) {
    const key = `src/content/${subsite.path}/${path.join('/')}.mdx`
    const result = await fetchR2Object(key)
    if (result) {
      const mdast = parseMdx(result.content)
      const r2Toc = extractToc(mdast)
      return (
        <Wrapper toc={r2Toc} metadata={result.metadata}>
          <SafeMdxRenderer mdast={mdast} components={components} />
        </Wrapper>
      )
    }
  }
  if (metadata.template === 'splash') {
    return (
      <div className="splash content-container">
        <MDXContent {...props} params={params} />
      </div>
    )
  }
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}

/**
 * Renders a tag page with breadcrumb, heading, and filtered entries.
 *
 * @param {string} tag - Tag name
 * @returns {Promise<import('react').ReactElement>} Tag page content
 */
async function renderTagPage(tag) {
  const entries = await getEntries()
  const filtered = entries.filter(entry =>
    entry.frontMatter.tags?.includes(tag)
  )
  return (
    <Wrapper toc={[]} metadata={{ title: tag }}>
      <Breadcrumb activePath={buildTagBreadcrumb(tag)} />
      <components.h1>{tag}</components.h1>
      <components.h2 className={reflectionStyles.heading}>Reflections</components.h2>
      {filtered.map(entry => (
        <PostCard key={entry.route} post={entry} />
      ))}
    </Wrapper>
  )
}

export { generateMetadata, generateStaticParams, Page as default }
