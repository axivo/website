/**
 * @fileoverview Web App Manifest for Android Chrome and PWA installs.
 *
 * Next.js serves this at `/manifest.webmanifest` and auto-emits a
 * `<link rel="manifest">` in the document head. The icon entries
 * declare the 192x192 and 512x512 PNGs Android Chrome requires for
 * home-screen install and splash screen rendering.
 *
 * Background and theme colors are derived from Nextra's HeadPropsSchema
 * defaults so the manifest follows the active theme without duplicating
 * values. PWA splash screens use the dark background to match readers
 * whose system theme is dark.
 */

import { meta } from '@axivo/website/global'
import { HeadPropsSchema } from '@axivo/website/theme'

const themeDefaults = HeadPropsSchema.parse({})
const backgroundColor = `rgb(${themeDefaults.backgroundColor.dark})`

/**
 * Returns the web app manifest descriptor.
 *
 * @returns {import('next').MetadataRoute.Manifest} The manifest object.
 */
function manifest() {
  return {
    background_color: backgroundColor,
    display: 'standalone',
    icons: [
      { src: '/icon1.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon2.png', sizes: '512x512', type: 'image/png' }
    ],
    name: meta.brand.name,
    short_name: meta.brand.name,
    theme_color: backgroundColor
  }
}

export default manifest
