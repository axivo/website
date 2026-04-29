/**
 * @fileoverview Next.js configuration with Nextra integration.
 *
 * Configures Nextra for MDX content, static export for Cloudflare Pages,
 * and unoptimized images for static deployment.
 */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import nextra from 'nextra'
import { meta as claudeMeta } from './src/config/variables/claude.js'
import { meta as clusterMeta } from './src/config/variables/cluster.js'
import { meta as globalMeta } from './src/config/variables/global.js'

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
