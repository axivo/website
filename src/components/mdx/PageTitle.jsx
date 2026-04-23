/**
 * @fileoverview Page title component that overrides Nextra's default h1 heading.
 *
 * Registered as the h1 MDX component in mdx-components.js, this component
 * renders every page's main heading and optional Meta author bar (for blog
 * template pages).
 *
 * The CopyPage button is rendered in the Subnavbar component instead.
 */

'use client'

import cn from 'clsx'
import { Meta } from '../Meta'
import styles from './PageTitle.module.css'

/**
 * Page title heading with optional Meta author bar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Heading text content
 * @param {string} [props.id] - Heading anchor id
 * @param {string} [props.className] - Additional CSS classes
 */
function PageTitle({ children, id, className, ...props }) {
  return (
    <>
      <h1 id={id} className={cn(styles.title, className)} {...props}>
        {children}
      </h1>
      <Meta />
    </>
  )
}

export { PageTitle }
