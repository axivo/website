/**
 * @fileoverview Next.js configuration with Nextra integration.
 *
 * Configures Nextra for MDX content, static export for Cloudflare Pages,
 * and unoptimized images for static deployment.
 */

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import nextra from 'nextra'

initOpenNextCloudflareForDev()

const withNextra = nextra({
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  search: false
})
const nextConfig = withNextra({
  reactStrictMode: true,
  redirects: async () => [
    { source: '/apple-touch-icon-precomposed.png', destination: '/apple-icon.png', permanent: true },
    { source: '/apple-touch-icon.png', destination: '/apple-icon.png', permanent: true }
  ]
})

export default nextConfig
