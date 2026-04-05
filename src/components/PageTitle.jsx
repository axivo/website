/**
 * @fileoverview Page title component that overrides Nextra's default h1 heading.
 *
 * Registered as the h1 MDX component in mdx-components.js, this component
 * renders every page's main heading and optional Meta author bar (for blog
 * template pages). The h1 classes are replicated from Nextra's
 * createHeading("h1") in nextra-theme-docs/dist/mdx-components/heading.js
 * to preserve the original styling.
 *
 * The CopyPage button is rendered in the Subnavbar component instead.
 */

'use client'

import { Meta } from './Meta'

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
      <h1
        id={id}
        className={`x:tracking-tight x:text-slate-900 x:dark:text-slate-100 x:font-bold x:mt-2 x:text-4xl${className ? ` ${className}` : ''}`}
        {...props}
      >
        {children}
      </h1>
      <Meta />
    </>
  )
}

export { PageTitle }
