/**
 * @fileoverview Callout component for documentation pages.
 *
 * Renders callouts with a colored left border, icon, and label matching
 * GitHub's native alert design. Supports both direct usage and automatic
 * conversion from GitHub alert syntax via the withGitHubAlert HOC.
 * The quote type adds attributed citations with optional author link.
 */

import { Children, isValidElement } from 'react'
import { Link } from 'nextra-theme-docs'
import {
  GitHubCautionIcon,
  GitHubImportantIcon,
  GitHubNoteIcon,
  GitHubTipIcon,
  GitHubWarningIcon
} from 'nextra/icons'
import styles from './Callout.module.css'

/**
 * Icon and label configuration for each callout type.
 */
const calloutConfig = {
  caution: { icon: GitHubCautionIcon, label: 'Caution' },
  default: { icon: GitHubTipIcon, label: 'Tip' },
  error: { icon: GitHubCautionIcon, label: 'Caution' },
  important: { icon: GitHubImportantIcon, label: 'Important' },
  info: { icon: GitHubNoteIcon, label: 'Note' },
  note: { icon: GitHubNoteIcon, label: 'Note' },
  quote: { icon: QuoteIcon, label: 'Quote' },
  tip: { icon: GitHubTipIcon, label: 'Tip' },
  warning: { icon: GitHubWarningIcon, label: 'Warning' }
}

/**
 * CSS module class mapping for each callout type.
 */
const calloutStyles = {
  caution: styles.caution,
  default: styles.tip,
  error: styles.caution,
  important: styles.important,
  info: styles.note,
  note: styles.note,
  quote: styles.quote,
  tip: styles.tip,
  warning: styles.warning
}

/**
 * GitHub-style callout with colored left border, icon, and label.
 * Strips the bold label injected by withGitHubAlert HOC to prevent
 * duplicate rendering. The quote type supports author attribution.
 *
 * @param {object} props
 * @param {'caution'|'default'|'error'|'important'|'info'|'quote'|'warning'} [props.type='default'] - Callout type
 * @param {string} [props.author] - Attribution name (quote type only)
 * @param {string} [props.href] - Source URL for attribution link (quote type only)
 * @param {import('react').ReactNode} props.children - Callout body content
 */
function Callout({ type = 'default', author, href, children }) {
  const { icon: Icon, label } = calloutConfig[type] || calloutConfig.default
  const typeStyle = calloutStyles[type] || calloutStyles.default
  return (
    <div className={`${styles.callout} ${typeStyle}`}>
      <div className={styles.title}>
        <Icon />
        {label}
      </div>
      <div className={styles.body}>{stripLabel(children)}</div>
      {author && (
        <div className={styles.attribution}>
          — {href ? <Link href={href}>{author}</Link> : author}
        </div>
      )}
    </div>
  )
}

/**
 * Quotation mark icon matching callout icon sizing.
 */
function QuoteIcon() {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 2.5c-.28 0-.5.22-.5.5v5c0 .28.22.5.5.5H4v1c0 1.1-.9 2-2 2-.28 0-.5.22-.5.5s.22.5.5.5c1.66 0 3-1.34 3-3V3c0-.28-.22-.5-.5-.5h-3zm8 0c-.28 0-.5.22-.5.5v5c0 .28.22.5.5.5H12v1c0 1.1-.9 2-2 2-.28 0-.5.22-.5.5s.22.5.5.5c1.66 0 3-1.34 3-3V3c0-.28-.22-.5-.5-.5h-3z" />
    </svg>
  )
}

/**
 * Removes the bold label element injected by withGitHubAlert HOC.
 *
 * @param {import('react').ReactNode} children - Component children
 * @returns {import('react').ReactNode} Children without the HOC label
 */
function stripLabel(children) {
  const items = Children.toArray(children)
  if (items.length > 0 && isValidElement(items[0]) && items[0].type === 'b') {
    return items.slice(1)
  }
  return children
}

export { Callout }
