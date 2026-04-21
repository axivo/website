/**
 * @fileoverview Dynamic page handler for the claude section.
 *
 * Delegates to the shared subsite page factory bound to the claude
 * subsite and reflections collection descriptors. Serves all Nextra
 * content pages through the catch-all route and handles reflections
 * entries, index pages, and tag pages via the collection descriptor.
 */

import { subsite } from '@axivo/website/claude'
import { createPage } from '@axivo/website/page'
import { reflectionsCollection } from '@axivo/website/reflections'
import '../../(home)/page.css'

const { generateMetadata, generateStaticParams, Page } = createPage({
  collection: reflectionsCollection,
  subsite
})

export { generateMetadata, generateStaticParams, Page as default }
