/**
 * @fileoverview Dynamic page handler for the home section.
 *
 * Serves all Nextra content pages through the catch-all route.
 * Splash pages render full-width, all others use the standard
 * docs wrapper with table of contents and sidebar.
 */

import { useMDXComponents as getMDXComponents } from '@axivo/website'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import '../page.css'

const components = getMDXComponents()
const Wrapper = components.wrapper

/**
 * Generates static params for all Nextra content pages.
 *
 * @returns {Promise<object[]>} Array of path params for static generation
 */
async function generateStaticParams() {
  const params = await generateStaticParamsFor('mdxPath')()
  return [{ mdxPath: [] }, ...params]
}

/**
 * Generates page metadata from Nextra's importPage.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<object>} Page metadata with title
 */
async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  if (metadata.seoTitle) {
    return { ...metadata, title: metadata.seoTitle }
  }
  return metadata
}

/**
 * Main page component for the home section catch-all route.
 * Routes splash pages to full-width layout, all others to the
 * standard Nextra docs wrapper.
 *
 * @param {object} props - Next.js page props
 * @returns {Promise<import('react').ReactElement>} Rendered page
 */
async function Page(props) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)
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

export { generateMetadata, generateStaticParams, Page as default }
