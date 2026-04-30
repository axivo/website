/**
 * @fileoverview Next.js configuration with Nextra integration.
 *
 * Configures Nextra for MDX content, static export for Cloudflare Pages,
 * and unoptimized images for static deployment.
 */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import nextra from 'nextra'
import { meta as claude } from './src/config/claude.js'
import { meta as cluster } from './src/config/cluster.js'
import { meta as website } from './src/config/global.js'

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
    ...claude.redirects,
    ...cluster.redirects,
    ...website.redirects,
    { source: '/apple-touch-icon-precomposed.png', destination: '/apple-icon.png', permanent: true },
    { source: '/apple-touch-icon.png', destination: '/apple-icon.png', permanent: true }
  ]
})

export default nextConfig
