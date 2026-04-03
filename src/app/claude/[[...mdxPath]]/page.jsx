/**
 * @fileoverview Dynamic page handler for the claude section.
 *
 * Serves all Nextra content pages through the catch-all route and
 * handles dynamic tag pages by intercepting reflections/tags/{tag}
 * paths. Tag pages render through the same Wrapper component as
 * MDX content, using MDX components for consistent heading styling.
 */

import { Breadcrumb, getEntries, getTags, PostCard } from '@axivo/website'
import reflectionStyles from '../../../components/Reflection.module.css'
import { subsite } from '@axivo/website/claude'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import '../../(home)/page.css'

const components = getMDXComponents()
const nextraStaticParams = generateStaticParamsFor('mdxPath')
const Wrapper = components.wrapper

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
 * otherwise delegates to Nextra's importPage metadata.
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
 * Checks if the path matches a tag page route.
 *
 * @param {string[]} path - URL path segments
 * @returns {boolean} True if path is reflections/tags/{tag}
 */
function isTagPage(path) {
  return path[0] === 'reflections' && path[1] === 'tags' && path[2]
}

/**
 * Main page component for the claude section catch-all route.
 * Routes tag pages to renderTagPage, splash pages to full-width layout,
 * and all other pages to the standard Nextra docs wrapper.
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
