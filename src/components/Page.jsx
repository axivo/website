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

import { generateStaticParamsFor, importPage } from 'nextra/pages'
import GithubSlugger from 'github-slugger'
import remarkGfm from 'remark-gfm'
import { remarkMermaid } from '@theguild/remark-mermaid'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import { PostCard, Subnavbar, useMDXComponents as getMDXComponents } from '@axivo/website'
import { remarkMarkAndUnravel } from '@axivo/website/remark'
import { createDispatch } from './mdx/renderers/node'
import { createEntrySchema, JsonLd } from './JsonLd'
import { extractFootnotes } from './mdx/footnotes'
import { filterByDate, getMetadata, getPosts, getRelated, Posts, postsPageSize, renderIndexPage } from './Post'
import { PostRelated } from './PostRelated'

const components = getMDXComponents()
const nextraStaticParams = generateStaticParamsFor('mdxPath')
const Wrapper = components.wrapper

/**
 * Builds the breadcrumb trail for a tag page under a source/collection.
 *
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @param {string} tag - Tag slug
 * @returns {object[]} Breadcrumb trail entries
 */
function buildTagBreadcrumb(source, collection, tag) {
  const hasSection = collection.sectionPath.length > 0
  const root = {
    name: hasSection ? collection.sectionPath : source.path,
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

/**
 * Returns the date segments of a route path under a collection. Strips
 * the section prefix when the collection has one.
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {string[]} Date-segment slice of the path
 */
function entryDateSegments(path, collection) {
  return collection.sectionPath.length > 0 ? path.slice(1) : path
}

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
 * Tests whether a route path resolves to an individual entry under a
 * collection (year/month/day/slug shape).
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {boolean}
 */
function isEntry(path, collection) {
  if (collection.sectionPath.length > 0) {
    return path[0] === collection.sectionPath && path.length === 5 && /^\d{4}$/.test(path[1])
  }
  return path.length === 4 && /^\d{4}$/.test(path[0])
}

/**
 * Tests whether a route path resolves to a date-based index page (year,
 * year/month, or year/month/day) under a collection.
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {boolean}
 */
function isIndex(path, collection) {
  if (collection.sectionPath.length > 0) {
    return path[0] === collection.sectionPath && path.length >= 2 && path.length <= 4 && /^\d{4}$/.test(path[1])
  }
  return path.length >= 1 && path.length <= 3 && /^\d{4}$/.test(path[0])
}

/**
 * Tests whether a route path resolves to a tag page under a collection.
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {boolean}
 */
function isTagPage(path, collection) {
  if (collection.sectionPath.length > 0) {
    return path[0] === collection.sectionPath && path[1] === 'tags' && path[2]
  }
  return path[0] === 'tags' && path[1]
}

/**
 * Parses MDX content into an AST for safe rendering.
 *
 * @param {string} mdx - Raw MDX content
 * @returns {object} MDAST root node
 */
function parseMdx(mdx) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkMarkAndUnravel)
    .use(remarkGfm)
    .use(remarkMermaid)
  return processor.runSync(processor.parse(mdx))
}

/**
 * Renders the React tree for a Nextra-bundled MDX page under a source.
 * Handles the splash template, the collection-root posts injection into
 * the TOC, and the default wrapped layout.
 *
 * @param {object} props - Next.js page props
 * @param {string[]} path - Route path segments
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @returns {Promise<import('react').ReactNode>}
 */
async function renderBundledPage(props, path, source, collection) {
  const params = await props.params
  const pageModule = await importPage([source.path, ...path])
  const {
    default: MDXContent,
    toc: originalToc,
    metadata,
    sourceCode
  } = pageModule
  const toc = [...originalToc]
  const hasSection = collection.sectionPath.length > 0
  const atCollectionRoot = hasSection
    ? path.length === 1 && path[0] === collection.sectionPath
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
    const insertIndex = toc.findIndex(item => item.id === postsSectionId)
    if (insertIndex !== -1) {
      toc.splice(insertIndex + 1, 0, ...latestToc)
    }
  }
  if (metadata.template === 'splash') {
    return (
      <div className="splash">
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

/**
 * Renders the React tree for a date-based index page (year, year/month,
 * or year/month/day) under a collection.
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {Promise<import('react').ReactNode>}
 */
async function renderDateIndexPage(path, collection) {
  const date = entryDateSegments(path, collection).join('/')
  const { content, metadata, toc } = await renderIndexPage(collection, date)
  return (
    <Wrapper metadata={metadata} toc={toc}>
      {content}
    </Wrapper>
  )
}

/**
 * Renders the React tree for an entry page (individual reflection or blog
 * post). Returns null when the entry isn't found in R2.
 *
 * @param {string[]} path - Route path segments
 * @param {object} collection - Collection descriptor
 * @returns {Promise<import('react').ReactNode|null>}
 */
async function renderEntryPage(path, collection) {
  const key = `${collection.contentPrefix}${entryDateSegments(path, collection).join('/')}.mdx`
  const result = await fetchR2Object(key)
  if (!result) {
    return null
  }
  const mdast = parseMdx(result.content)
  extractFootnotes(mdast)
  const r2Toc = extractToc(mdast)
  const objects = await getMetadata(collection)
  const record = objects.find(obj => obj.key === key)
  const dispatch = createDispatch({
    blocks: record?.features?.syntax?.blocks,
    inline: record?.features?.syntax?.inline
  })
  const entryPath = entryDateSegments(path, collection)
  const entries = await getPosts(collection)
  const currentEntry = entries.find(entry => entry.route === `${collection.routePath}/${entryPath.join('/')}`)
  const related = currentEntry ? getRelated(currentEntry, entries) : []
  return (
    <>
      <JsonLd data={createEntrySchema({ collection, metadata: result.metadata, path: entryPath })} />
      <Wrapper metadata={result.metadata} toc={r2Toc}>
        <SafeMdxRenderer components={components} mdast={mdast} renderNode={dispatch} />
        <PostRelated entries={related} title={collection.relatedTitle} />
      </Wrapper>
    </>
  )
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
function renderPage({ source, collection }) {
  return {
    generateMetadata: props => resolveMetadata(props, source, collection),
    generateStaticParams: () => resolveStaticParams(source, collection),
    Page: props => resolvePage(props, source, collection)
  }
}

/**
 * Renders the React tree for a tag page under a collection.
 *
 * @param {string} tag - Tag slug
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @returns {Promise<import('react').ReactNode>}
 */
async function renderTagPage(tag, source, collection) {
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
      <Subnavbar activePath={buildTagBreadcrumb(source, collection, tag)} />
      <Wrapper metadata={{ title: tag }} toc={toc}>
        <components.h1>{tag}</components.h1>
        <Posts collection={collection} entries={filtered}>
          <components.h2 id={collection.sectionId}>{collection.tagsSectionTitle}</components.h2>
        </Posts>
      </Wrapper>
    </>
  )
}

/**
 * Resolves the page metadata for a request route under a source/collection.
 * Routes through the entry, index, tag, and bundled-page branches in turn.
 *
 * @param {object} props - Next.js page props
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @returns {Promise<object>}
 */
async function resolveMetadata(props, source, collection) {
  const params = await props.params
  const path = params.mdxPath || []
  if (isEntry(path, collection)) {
    const key = `${collection.contentPrefix}${entryDateSegments(path, collection).join('/')}.mdx`
    const result = await fetchR2Object(key)
    if (result) {
      return {
        description: result.metadata.description,
        title: result.metadata.title
      }
    }
  }
  if (isIndex(path, collection)) {
    const date = entryDateSegments(path, collection).join('/')
    const { metadata } = await renderIndexPage(collection, date)
    return metadata
  }
  if (isTagPage(path, collection)) {
    const hasSection = collection.sectionPath.length > 0
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

/**
 * Resolves the rendered page tree for a request route under a
 * source/collection. Routes through the entry, index, tag, and bundled
 * page branches in turn.
 *
 * @param {object} props - Next.js page props
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @returns {Promise<import('react').ReactNode>}
 */
async function resolvePage(props, source, collection) {
  const params = await props.params
  const path = params.mdxPath || []
  if (isEntry(path, collection)) {
    const tree = await renderEntryPage(path, collection)
    if (tree) {
      return tree
    }
  }
  if (isIndex(path, collection)) {
    return renderDateIndexPage(path, collection)
  }
  if (isTagPage(path, collection)) {
    const hasSection = collection.sectionPath.length > 0
    const tag = decodeURIComponent(hasSection ? path[2] : path[1])
    return renderTagPage(tag, source, collection)
  }
  return renderBundledPage(props, path, source, collection)
}

/**
 * Resolves the static params (prerender targets) for a source/collection.
 * Combines Nextra's discovered MDX paths under the source with the
 * R2-derived date index paths.
 *
 * @param {object} source - Content source descriptor
 * @param {object} collection - Collection descriptor
 * @returns {Promise<object[]>}
 */
async function resolveStaticParams(source, collection) {
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
  const hasSection = collection.sectionPath.length > 0
  const indexParams = [...indexDirs].map(dir => ({
    mdxPath: hasSection ? [collection.sectionPath, ...dir.split('/')] : dir.split('/')
  }))
  return [...sectionParams, ...indexParams]
}

export { renderPage }
