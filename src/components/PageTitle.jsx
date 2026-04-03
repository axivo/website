/**
 * @fileoverview Page title component that overrides Nextra's default h1 heading.
 *
 * Registered as the h1 MDX component in mdx-components.js, this component
 * renders every page's main heading, optional Meta author bar (for blog
 * template pages), and the custom CopyPage button. The h1 classes are
 * replicated from Nextra's createHeading("h1") in
 * nextra-theme-docs/dist/mdx-components/heading.js to preserve the original styling.
 *
 * CopyPage is kept as a separate component so it can be reused independently
 * and disabled per-page via copyPage: false in _meta.js theme config.
 */

'use client'

import { CopyPage } from './CopyPage'
import { Meta } from './Meta'

/**
 * Page title heading with optional Meta author bar and CopyPage button.
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
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Meta />
        <CopyPage />
      </div>
    </>
  )
}

export { PageTitle }
