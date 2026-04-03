/**
 * @fileoverview Next.js configuration with Nextra integration.
 *
 * Configures Nextra for MDX content, static export for Cloudflare Pages,
 * and unoptimized images for static deployment.
 */

import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  latex: true,
  search: false
})

const nextConfig = withNextra({
  images: { unoptimized: true },
  output: 'export',
  reactStrictMode: true
})

export { nextConfig as default }
