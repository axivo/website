/**
 * @fileoverview Global footer component.
 *
 * Wraps Nextra's Footer with copyright notice and trademark disclaimer
 * displayed across all website sections. Uses `meta.brand.name` so
 * brand changes flow from config without touching the component.
 */

import { Footer as NextraFooter } from 'nextra-theme-docs'
import { meta } from '@axivo/website/global'
import styles from './Footer.module.css'

/**
 * Site-wide footer with copyright and trademark notice.
 *
 * @returns {import('react').ReactElement}
 */
function Footer() {
  return (
    <NextraFooter>
      <div>
        <p className={styles.copyright}>Copyright © {new Date().getFullYear()} {meta.brand.name}</p>
        <p className={styles.disclaimer}>All product names, logos, and brands are property of their respective owners, used for identification purposes only.</p>
      </div>
    </NextraFooter>
  )
}

export { Footer }
