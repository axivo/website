/**
 * @fileoverview Feature card components for landing pages.
 *
 * CardGrid provides a responsive two-column grid layout.
 * FeatureCard renders an individual card with title, description, and optional
 * image. Cards can be static or linked, determined by the href prop.
 */

import Link from 'next/link'
import { Image } from './Image'
import styles from './FeatureCard.module.css'

/**
 * Responsive two-column grid container for FeatureCard components.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - FeatureCard elements
 */
function CardGrid({ children }) {
  return <div className={styles.grid}>{children}</div>
}

/**
 * Feature card with title, description, and optional image.
 * Renders as a link when href is provided, otherwise as a static div.
 * When template="hero", renders with horizontal layout (text left, image right).
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Card body content
 * @param {string} [props.href] - Optional link destination
 * @param {string|{dark: string, light: string}} [props.image] - Image path or theme-aware paths
 * @param {import('react').CSSProperties} [props.style] - Optional card inline styles
 * @param {import('react').CSSProperties} [props.styleBody] - Optional body inline styles
 * @param {import('react').CSSProperties} [props.styleContainer] - Optional image container inline styles
 * @param {import('react').CSSProperties} [props.styleTitle] - Optional title inline styles
 * @param {number} [props.span] - Number of grid columns to span (default 1)
 * @param {string} [props.template] - Optional layout template ("hero" for horizontal layout)
 * @param {string} props.title - Card heading
 */
function FeatureCard({ children, href, image, span, style, styleBody, styleContainer, styleTitle, template, title }) {
  const isExternal = href?.startsWith('http')
  const isHero = template === 'hero'
  const Tag = href ? Link : 'div'
  const linkProps = href ? { href, ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }) } : {}
  const spanStyle = span ? { ...style, gridColumn: `span ${span}` } : style
  if (isHero) {
    return (
      <Tag {...linkProps} className={styles.cardHero} style={spanStyle}>
        <div className={styles.textHero}>
          <p className={styles.title} style={styleTitle}>{title}</p>
          <div className={styles.body} style={styleBody}>{children}</div>
        </div>
        {image && (
          <div className={styles.imageHero} style={styleContainer}>
            <Image src={image} alt={title} />
          </div>
        )}
      </Tag>
    )
  }
  return (
    <Tag {...linkProps} className={styles.card} style={spanStyle}>
      <p className={styles.title} style={styleTitle}>{title}</p>
      <div className={styles.body} style={styleBody}>{children}</div>
      {image && (
        <div className={styles.image} style={styleContainer}>
          <Image src={image} alt={title} />
        </div>
      )}
    </Tag>
  )
}

export { CardGrid, FeatureCard }
