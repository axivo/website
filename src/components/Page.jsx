/**
 * @fileoverview Page handler factory for subsites with post collections.
 *
 * Produces Next.js page exports (generateMetadata, generateStaticParams,
 * Page) for a subsite that combines Nextra-bundled MDX pages with an
 * R2-backed post collection. Claude and blog both use this factory,
 * each passing its own subsite and collection descriptors.
 *
 * Factory input:
 * - subsite: { path, title } — subsite descriptor (e.g. claude or blog)
 * - collection: collection descriptor from Post.jsx, plus:
 *   - sectionPath: URL segment under the subsite that triggers collection
 *     routing (e.g. 'reflections' for claude, '' for blog where the
 *     collection is the subsite root)
 *   - tagsSectionTitle: heading shown above post cards on tag pages
 */

import { Breadcrumb, PostCard, useMDXComponents as getMDXComponents } from '@axivo/website'
import { domain } from '@axivo/website/global'
import GithubSlugger from 'github-slugger'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import { filterByDate, getPosts, getTags, postsPageSize, renderIndexPage } from './Post'
import reflectionStyles from './Reflection.module.css'

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
  return unified().use(remarkParse).use(remarkMdx).parse(mdx)
}

/**
 * Creates Next.js page handlers (generateMetadata, generateStaticParams,
 * Page) for a subsite with an R2-backed post collection.
 *
 * @param {object} config
 * @param {object} config.subsite - Subsite descriptor with path and title
 * @param {object} config.collection - Collection descriptor with sectionPath
 * @returns {{ generateMetadata: Function, generateStaticParams: Function, Page: Function }}
 */
function createPage({ subsite, collection }) {
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
      name: hasSection ? sectionPath : subsite.path,
      route: hasSection ? collection.routePath : `/${subsite.path}`,
      title: hasSection ? collection.sectionTitle : subsite.title,
      frontMatter: {}
    }
    const tagsRoute = hasSection ? `${collection.routePath}/tags` : `/${subsite.path}/tags`
    const tagRoute = hasSection ? `${collection.routePath}/tags/${tag}` : `/${subsite.path}/tags/${tag}`
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
    return (
      <Wrapper toc={[]} metadata={{ title: tag }}>
        <Breadcrumb activePath={buildTagBreadcrumb(tag)} />
        <components.h1>{tag}</components.h1>
        <components.h2 className={reflectionStyles.heading}>{collection.tagsSectionTitle}</components.h2>
        {filtered.map(entry => (
          <PostCard key={entry.route} post={entry} />
        ))}
      </Wrapper>
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

  async function generateStaticParams() {
    const params = await nextraStaticParams()
    const sectionParams = params
      .filter(p => p.mdxPath?.[0] === subsite.path)
      .map(p => ({ mdxPath: p.mdxPath.slice(1) }))
    const response = await fetch(`${domain.protocol}://${domain.name}/metadata`)
    const { objects } = await response.json()
    const indexDirs = new Set()
    const collectionParams = objects
      .filter(obj => collection.templates.includes(obj.template))
      .map(obj => {
        const segments = obj.key
          .replace(collection.contentPrefix, '')
          .replace('.mdx', '')
          .split('/')
        const [year, month, day] = segments
        indexDirs.add(`${year}`)
        indexDirs.add(`${year}/${month}`)
        indexDirs.add(`${year}/${month}/${day}`)
        return { mdxPath: hasSection ? [sectionPath, ...segments] : segments }
      })
    const indexParams = [...indexDirs].map(dir => ({
      mdxPath: hasSection ? [sectionPath, ...dir.split('/')] : dir.split('/')
    }))
    const allTags = await getTags(collection)
    const tagParams = [...new Set(allTags)].map(tag => ({
      mdxPath: hasSection ? [sectionPath, 'tags', tag] : ['tags', tag]
    }))
    return [...sectionParams, ...collectionParams, ...indexParams, ...tagParams]
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
          <Wrapper toc={r2Toc} metadata={result.metadata}>
            <SafeMdxRenderer mdast={mdast} components={components} />
          </Wrapper>
        )
      }
    }
    if (isIndex(path)) {
      const date = entryDateSegments(path).join('/')
      const { content, metadata, toc } = await renderIndexPage(collection, date)
      return (
        <Wrapper toc={toc} metadata={metadata}>
          {content}
        </Wrapper>
      )
    }
    if (isTagPage(path)) {
      const tag = decodeURIComponent(hasSection ? path[2] : path[1])
      return renderTagPage(tag)
    }
    const pageModule = await importPage([subsite.path, ...path])
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
    if (atCollectionRoot && collection.latestTocSectionId) {
      const entries = await getPosts(collection)
      const latestToc = entries.slice(0, pageModule.reflectionsPageSize || postsPageSize).map(entry => ({
        depth: 3,
        id: entry.route.split('/').pop(),
        value: entry.frontMatter.title
      }))
      updateToc(collection.latestTocSectionId, latestToc)
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

  return { generateMetadata, generateStaticParams, Page }
}

export { createPage }
