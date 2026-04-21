/**
 * @fileoverview Dynamic page handler for the blog section.
 *
 * Delegates to the shared page factory bound to the blog source and
 * blog collection descriptors. Serves all Nextra content pages through
 * the catch-all route and handles blog entries, index pages, and tag
 * pages via the collection descriptor.
 */

import { meta } from '@axivo/website/blog'
import { blogCollection } from '@axivo/website/blog-posts'
import { createPage } from '@axivo/website/page'
import '../../(home)/page.css'

const { generateMetadata, generateStaticParams, Page } = createPage({
  collection: blogCollection,
  source: meta.source
})

export { generateMetadata, generateStaticParams, Page as default }
