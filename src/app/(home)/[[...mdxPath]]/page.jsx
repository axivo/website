/**
 * @fileoverview Dynamic page handler for the home section.
 *
 * Delegates to the shared page factory bound to the home source. The
 * home section ships only bundled MDX (no R2-backed collection) and
 * claims the root path plus any top-level pages whose first segment
 * does not match a known section directory. The list of section paths
 * is sourced from the section configs so adding a new section never
 * requires updating this handler.
 */

import { meta as blog } from '@axivo/website/blog'
import { meta as claude } from '@axivo/website/claude'
import { meta as cluster } from '@axivo/website/cluster'
import { meta } from '@axivo/website/global'
import { renderPage } from '@axivo/website/page'
import '../page.css'

const { generateMetadata, generateStaticParams, Page } = renderPage({
  sections: [blog.source.path, claude.source.path, cluster.source.path],
  source: { path: '', title: meta.brand.name }
})

export { generateMetadata, generateStaticParams, Page as default }
