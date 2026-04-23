/**
 * @fileoverview Hero banner component for landing pages.
 *
 * Renders a full-width hero section with a gradient title, tagline content,
 * and a theme-aware image using the shared Image component.
 *
 * Used on each site's landing page as the primary above-the-fold element.
 * Children can include any content: text, links, buttons.
 */

import { Image } from './mdx/Image'
import styles from './Hero.module.css'

/**
 * Hero banner with title, tagline, and theme-aware image.
 *
 * @param {object} props
 * @param {string} [props.title] - Hero heading text
 * @param {string|{dark: string, light: string}} [props.image] - Image path or theme-aware paths
 * @param {object} [props.style] - Custom styles for the hero container
 * @param {object} [props.styleContainer] - Custom styles for the image container
 * @param {object} [props.styleImage] - Custom styles for the image element
 * @param {string} [props.template] - Image layout template ("card" for card styling)
 * @param {import('react').ReactNode} props.children - Tagline content below the title
 */
function Hero({ title, image, style, styleContainer, styleImage, template, children }) {
  return (
    <div className={styles.hero} style={style}>
      <div className={`${styles.content} ${styles.container}`}>
        <div className={title ? styles.text : styles.textCompact}>
          {title && <h1 className={styles.title}>{title}</h1>}
          <div className={styles.tagline}>{children}</div>
        </div>
        {image && (
          <div className={styles.image} style={styleContainer}>
            <Image src={image} alt={title || ''} styleImage={styleImage} template={template} />
          </div>
        )}
      </div>
    </div>
  )
}

export { Hero, styles as HeroStyles }
