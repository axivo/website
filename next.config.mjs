/**
 * @fileoverview Next.js configuration with Nextra integration.
 *
 * Configures Nextra for MDX content, static export for Cloudflare Pages,
 * and unoptimized images for static deployment.
 */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import nextra from 'nextra'
import { meta as claudeMeta } from '@axivo/website/claude'
import { meta as clusterMeta } from '@axivo/website/k3s-cluster'
import { meta as globalMeta } from '@axivo/website/global'

initOpenNextCloudflareForDev()

const withNextra = nextra({
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  search: false
})
const nextConfig = withNextra({
  experimental: {
    viewTransition: true
  },
  reactStrictMode: true,
  redirects: async () => [
    ...claudeMeta.redirects,
    ...clusterMeta.redirects,
    ...globalMeta.redirects,
    { source: '/apple-touch-icon-precomposed.png', destination: '/apple-icon.png', permanent: true },
    { source: '/apple-touch-icon.png', destination: '/apple-icon.png', permanent: true }
  ]
})

export default nextConfig
