/**
 * @fileoverview Variable rendering component for MDX content.
 *
 * Provides a flexible inline element that renders as code, a link, or plain
 * text depending on the props provided. Used in MDX pages to consistently
 * format variable names, code references, and linked terms.
 */

import { Link } from 'nextra-theme-docs'

/**
 * Renders children as inline code, a link, or plain text.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Content to render
 * @param {boolean} [props.code] - Render as inline code
 * @param {string} [props.href] - Render as a link to this URL
 */
function Var({ children, code, href }) {
  if (code) {
    if (href) {
      return <code className="nextra-code"><Link href={href}>{children}</Link></code>
    }
    return <code className="nextra-code">{children}</code>
  }
  if (href) {
    return <Link href={href}>{children}</Link>
  }
  return <>{children}</>
}

export { Var }
