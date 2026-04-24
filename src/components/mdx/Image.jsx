/**
 * @fileoverview Theme-aware image component with optional card template.
 *
 * Renders images with automatic light/dark theme switching when given
 * an object source. Supports a "card" template that wraps the image
 * in a styled card with optional caption content via children.
 */

import Link from 'next/link'
import { cloudflare } from '@axivo/website/global'
import styles from './Image.module.css'

const cdnPattern = /^\/(?:claude\/reflections|blog)\/\d{4}\/\d{2}\//

/**
 * Theme-aware image with optional card layout.
 *
 * @param {object} props
 * @param {string} props.alt - Image alt text
 * @param {import('react').ReactNode} [props.children] - Caption content for card template
 * @param {string} [props.href] - Optional link destination
 * @param {string|{dark: string, light: string}} props.src - Image path or theme-aware paths
 * @param {import('react').CSSProperties} [props.style] - Container inline styles
 * @param {import('react').CSSProperties} [props.styleImage] - Image inline styles
 * @param {string} [props.template] - Layout template ("card" for card styling)
 */
function Image({ alt, children, href, src, style, styleImage, template }) {
  const image = renderImage(src, alt, styleImage)
  if (template === 'card') {
    const isExternal = href?.startsWith('http')
    const Tag = href ? Link : 'div'
    const linkProps = href ? { href, ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }) } : {}
    return (
      <Tag {...linkProps} className={styles.card} style={style}>
        {image}
        {children && <div className={styles.caption}>{children}</div>}
      </Tag>
    )
  }
  return image
}

/**
 * Renders a theme-aware image element.
 *
 * @param {string|{dark: string, light: string}} src - Image path or theme-aware paths
 * @param {string} alt - Image alt text
 * @param {import('react').CSSProperties} [imageStyle] - Optional image inline styles
 * @returns {import('react').ReactNode}
 */
function renderImage(src, alt, imageStyle) {
  if (typeof src === 'string') {
    const resolved = cdnPattern.test(src) ? `${cloudflare.bucket.url}${src}` : src
    return <img alt={alt} className={styles.image} src={resolved} style={imageStyle} />
  }
  const dark = cdnPattern.test(src.dark) ? `${cloudflare.bucket.url}${src.dark}` : src.dark
  const light = cdnPattern.test(src.light) ? `${cloudflare.bucket.url}${src.light}` : src.light
  return (
    <>
      <img alt={alt} className={`${styles.image} ${styles.light}`} src={light} style={imageStyle} />
      <img alt={alt} className={`${styles.image} ${styles.dark}`} src={dark} style={imageStyle} />
    </>
  )
}

export { Image }
