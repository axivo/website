/**
 * @fileoverview Dynamic page handler for the k3s-cluster section.
 *
 * Serves all Nextra content pages through the catch-all route.
 * Splash pages render full-width, all others use the standard
 * docs wrapper with table of contents and sidebar.
 */

import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { meta } from '@axivo/website/k3s-cluster'
import { useMDXComponents as getMDXComponents } from '@axivo/website'
import '../../(home)/page.css'

const components = getMDXComponents()
const Wrapper = components.wrapper

/**
 * Generates page metadata from Nextra's importPage.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<object>} Page metadata with title
 */
async function generateMetadata(props) {
  const params = await props.params
  const path = params.mdxPath || []
  const { metadata } = await importPage([meta.source.path, ...path])
  const result = { ...metadata }
  if (result.seoTitle) {
    result.title = result.seoTitle
  }
  if (!result.description) {
    result.description = `${result.title} — ${meta.source.title}`
  }
  return result
}

/**
 * Generates static params for all Nextra content pages.
 *
 * @returns {Promise<object[]>} Array of path params for static generation
 */
async function generateStaticParams() {
  const params = await generateStaticParamsFor('mdxPath')()
  return params
    .filter(p => p.mdxPath?.[0] === meta.source.path)
    .map(p => ({ mdxPath: p.mdxPath.slice(1) }))
}

/**
 * Main page component for the k3s-cluster section catch-all route.
 * Routes splash pages to full-width layout, all others to the
 * standard Nextra docs wrapper.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<import('react').ReactElement>} Rendered page
 */
async function Page(props) {
  const params = await props.params
  const path = params.mdxPath || []
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage([meta.source.path, ...path])
  if (metadata.template === 'splash') {
    return (
      <div className="splash">
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

export { generateMetadata, generateStaticParams, Page as default }
