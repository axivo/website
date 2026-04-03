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
  search: false
})

const nextConfig = withNextra({
  reactStrictMode: true
})

export { nextConfig as default }
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
