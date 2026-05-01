/**
 * @fileoverview Asset copy helper for the build pipeline.
 *
 * OpenNext copies `public/*` and `src/app/favicon.ico` into
 * `.open-next/assets/` for Workers Static Assets to serve. Other Next.js
 * metadata files (`apple-icon.png`, `icon.svg`, `opengraph-image.png`,
 * `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, etc.) get bundled
 * into the OpenNext server worker as route handlers, which Cloudflare's
 * zone CDN refuses to cache because they ship `cache-control: max-age=0`.
 *
 * This helper extends OpenNext's favicon special case to additional
 * metadata files declared in `meta.assets`. Static-form images are
 * copied from `src/app/`; prerendered route output is copied from each
 * route's `.body` file under `.next/server/app/`. Files end up at the
 * same path Workers Static Assets serves favicon from, so the Worker's
 * route handler is bypassed and Cloudflare caches them with its
 * default static-asset behavior.
 */

import { copyFileSync, existsSync, lstatSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { meta } from '@axivo/website/global'

/**
 * Copies declared metadata images and prerendered route output into
 * `.open-next/assets/` so Workers Static Assets serves them directly,
 * bypassing OpenNext's route handlers. Returns the number of files
 * copied so callers can log the count.
 *
 * @returns {number} Files copied
 */
function copyAssets() {
  let copied = 0
  for (const file of meta.assets.images) {
    const source = join('src/app', file)
    if (existsSync(source) && lstatSync(source).isFile()) {
      copyFileSync(source, join('.open-next/assets', file))
      copied += 1
    }
  }
  for (const file of meta.assets.pages) {
    const source = join('.next/server/app', `${file}.body`)
    if (existsSync(source) && lstatSync(source).isFile()) {
      const destination = join('.open-next/assets', file)
      mkdirSync(dirname(destination), { recursive: true })
      copyFileSync(source, destination)
      copied += 1
    }
  }
  return copied
}

export { copyAssets }
