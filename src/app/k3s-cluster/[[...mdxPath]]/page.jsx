/**
 * @fileoverview Dynamic page handler for the k3s-cluster section.
 *
 * Delegates to the shared page factory bound to the k3s-cluster source.
 * The section ships only bundled MDX (no R2-backed collection), so the
 * factory is invoked without a collection descriptor.
 */

import { meta } from '@axivo/website/cluster'
import { renderPage } from '@axivo/website/page'
import '../../(home)/page.css'

const { generateMetadata, generateStaticParams, Page } = renderPage({
  source: meta.source
})

export { generateMetadata, generateStaticParams, Page as default }
