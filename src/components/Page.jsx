/**
 * @fileoverview Page handler factory for content sources with post
 * collections.
 *
 * Produces Next.js page exports (generateMetadata, generateStaticParams,
 * Page) for a content source that combines Nextra-bundled MDX pages with
 * an R2-backed post collection. Claude and blog both use this factory,
 * each passing its own source and collection descriptors.
 *
 * Factory input:
 * - source: { path, title } — content source descriptor (e.g. claude or blog)
 * - collection: collection descriptor from Post.jsx, plus:
 *   - sectionPath: URL segment under the source that triggers collection
 *     routing (e.g. 'reflections' for claude, '' for blog where the
 *     collection is the source root)
 *   - tagsSectionTitle: heading shown above post cards on tag pages
 */

import { PostCard, Subnavbar, useMDXComponents as getMDXComponents } from '@axivo/website'
import GithubSlugger from 'github-slugger'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { remarkMermaid } from '@theguild/remark-mermaid'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import { renderNode } from './mdx/renderNode'
import { filterByDate, getPosts, Posts, postsPageSize, renderIndexPage } from './Post'

const components = getMDXComponents()
const nextraStaticParams = generateStaticParamsFor('mdxPath')
const Wrapper = components.wrapper

/**
 * Extracts table of contents from an MDAST tree. Builds Nextra-compatible
 * TOC entries (depth 2-6) with slugged IDs and annotates heading nodes
 * with id properties for anchor link support.
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
      } catch {
        console.warn('Failed to parse tags metadata')
      }
    }
    return { content, metadata }
  } catch (error) {
    console.error(`R2 fetch failed for key: ${key} - ${error.message}`)
    return null
  }
}

/**
 * Parses MDX content into an AST for safe rendering.
 *
 * @param {string} mdx - Raw MDX content
 * @returns {object} MDAST root node
 */
function parseMdx(mdx) {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkMermaid)
  return processor.runSync(processor.parse(mdx))
}

/**
 * Creates Next.js page handlers (generateMetadata, generateStaticParams,
 * Page) for a content source with an R2-backed post collection.
 *
 * @param {object} config
 * @param {object} config.source - Content source descriptor with path and title
 * @param {object} config.collection - Collection descriptor with sectionPath
 * @returns {{ generateMetadata: Function, generateStaticParams: Function, Page: Function }}
 */
function createPage({ source, collection }) {
  const sectionPath = collection.sectionPath
  const hasSection = sectionPath.length > 0

  const isEntry = path => {
    if (hasSection) {
      return path[0] === sectionPath && path.length === 5 && /^\d{4}$/.test(path[1])
    }
    return path.length === 4 && /^\d{4}$/.test(path[0])
  }

  const isIndex = path => {
    if (hasSection) {
      return path[0] === sectionPath && path.length >= 2 && path.length <= 4 && /^\d{4}$/.test(path[1])
    }
    return path.length >= 1 && path.length <= 3 && /^\d{4}$/.test(path[0])
  }

  const isTagPage = path => {
    if (hasSection) {
      return path[0] === sectionPath && path[1] === 'tags' && path[2]
    }
    return path[0] === 'tags' && path[1]
  }

  const entryDateSegments = path => (hasSection ? path.slice(1) : path)

  const buildTagBreadcrumb = tag => {
    const root = {
      name: hasSection ? sectionPath : source.path,
      route: hasSection ? collection.routePath : `/${source.path}`,
      title: hasSection ? collection.sectionTitle : source.title,
      frontMatter: {}
    }
    const tagsRoute = hasSection ? `${collection.routePath}/tags` : `/${source.path}/tags`
    const tagRoute = hasSection ? `${collection.routePath}/tags/${tag}` : `/${source.path}/tags/${tag}`
    return [
      root,
      { name: 'tags', route: tagsRoute, title: 'Tags', frontMatter: {} },
      { name: tag, route: tagRoute, title: tag, frontMatter: {} }
    ]
  }

  async function renderTagPage(tag) {
    const entries = await getPosts(collection)
    const filtered = entries.filter(entry =>
      entry.frontMatter.tags?.includes(tag)
    )
    const toc = [
      { depth: 2, id: collection.sectionId, value: collection.sectionTitle },
      ...filtered.slice(0, postsPageSize).map(entry => ({
        depth: 3,
        id: entry.route.split('/').pop(),
        value: entry.frontMatter.title
      }))
    ]
    return (
      <>
        <Subnavbar activePath={buildTagBreadcrumb(tag)} />
        <Wrapper metadata={{ title: tag }} toc={toc}>
          <components.h1>{tag}</components.h1>
          <Posts collection={collection} entries={filtered}>
            <components.h2 id={collection.sectionId}>{collection.tagsSectionTitle}</components.h2>
          </Posts>
        </Wrapper>
      </>
    )
  }

  async function generateMetadata(props) {
    const params = await props.params
    const path = params.mdxPath || []
    if (isEntry(path)) {
      const key = `${collection.contentPrefix}${entryDateSegments(path).join('/')}.mdx`
      const result = await fetchR2Object(key)
      if (result) {
        return {
          description: result.metadata.description,
          title: result.metadata.title
        }
      }
    }
    if (isIndex(path)) {
      const date = entryDateSegments(path).join('/')
      const { metadata } = await renderIndexPage(collection, date)
      return metadata
    }
    if (isTagPage(path)) {
      return { title: decodeURIComponent(hasSection ? path[2] : path[1]) }
    }
    const { metadata } = await importPage([source.path, ...path])
    const result = { ...metadata }
    if (result.seoTitle) {
      result.title = result.seoTitle
    }
    if (!result.description) {
      result.description = `${result.title} — ${source.title}`
    }
    return result
  }

  async function generateStaticParams() {
    const params = await nextraStaticParams()
    const sectionParams = params
      .filter(p => p.mdxPath?.[0] === source.path)
      .map(p => ({ mdxPath: p.mdxPath.slice(1) }))
      .filter(p => p.mdxPath[p.mdxPath.length - 1] !== 'tags')
    const response = await fetch(collection.metadataEndpoint)
    const { objects } = await response.json()
    const indexDirs = new Set()
    for (const obj of objects.filter(obj => obj.template === collection.template)) {
      const [year, month, day] = obj.key
        .replace(collection.contentPrefix, '')
        .replace('.mdx', '')
        .split('/')
      indexDirs.add(`${year}`)
      indexDirs.add(`${year}/${month}`)
      indexDirs.add(`${year}/${month}/${day}`)
    }
    const indexParams = [...indexDirs].map(dir => ({
      mdxPath: hasSection ? [sectionPath, ...dir.split('/')] : dir.split('/')
    }))
    return [...sectionParams, ...indexParams]
  }

  async function Page(props) {
    const params = await props.params
    const path = params.mdxPath || []
    if (isEntry(path)) {
      const key = `${collection.contentPrefix}${entryDateSegments(path).join('/')}.mdx`
      const result = await fetchR2Object(key)
      if (result) {
        const mdast = parseMdx(result.content)
        const r2Toc = extractToc(mdast)
        return (
          <Wrapper metadata={result.metadata} toc={r2Toc}>
            <SafeMdxRenderer components={components} mdast={mdast} renderNode={renderNode} />
          </Wrapper>
        )
      }
    }
    if (isIndex(path)) {
      const date = entryDateSegments(path).join('/')
      const { content, metadata, toc } = await renderIndexPage(collection, date)
      return (
        <Wrapper metadata={metadata} toc={toc}>
          {content}
        </Wrapper>
      )
    }
    if (isTagPage(path)) {
      const tag = decodeURIComponent(hasSection ? path[2] : path[1])
      return renderTagPage(tag)
    }
    const pageModule = await importPage([source.path, ...path])
    const {
      default: MDXContent,
      toc: originalToc,
      metadata,
      sourceCode
    } = pageModule
    const toc = [...originalToc]
    const updateToc = (sectionId, items) => {
      const index = toc.findIndex(item => item.id === sectionId)
      if (index !== -1) {
        toc.splice(index + 1, 0, ...items)
      }
    }
    const atCollectionRoot = hasSection
      ? path.length === 1 && path[0] === sectionPath
      : path.length === 0
    const postsSectionId = pageModule.postsSectionId
    if (atCollectionRoot && postsSectionId) {
      const entries = await getPosts(collection)
      const limit = pageModule.postsPageSize || postsPageSize
      const latestToc = entries.slice(0, limit).map(entry => ({
        depth: 3,
        id: entry.route.split('/').pop(),
        value: entry.frontMatter.title
      }))
      updateToc(postsSectionId, latestToc)
    }
    if (metadata.template === 'splash') {
      return (
        <div className="splash content-container">
          <MDXContent {...props} params={params} />
        </div>
      )
    }
    return (
      <Wrapper metadata={metadata} sourceCode={sourceCode} toc={toc}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    )
  }

  return { generateMetadata, generateStaticParams, Page }
}

export { createPage }
