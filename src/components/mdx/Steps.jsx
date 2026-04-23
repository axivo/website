/**
 * @fileoverview Steps component for documentation pages.
 *
 * Wraps a set of markdown headings as visual steps. Supports numbered
 * circles (default) matching nextra's built-in Steps, or empty bullets
 * for parallel items where sequence does not apply.
 */

import cn from 'clsx'
import { useId } from 'react'
import styles from './Steps.module.css'

/**
 * Steps wrapper rendering headings as numbered or bulleted items.
 *
 * @param {object} props
 * @param {'number'|'bullet'} [props.format='number'] - Marker style
 * @param {string} [props.className] - Additional class names
 * @param {import('react').CSSProperties} [props.style] - Inline styles
 * @param {import('react').ReactNode} props.children - Heading content
 */
function Steps({ format = 'number', className, style, children, ...props }) {
  const id = useId().replaceAll(':', '')
  return (
    <div
      className={cn(
        'nextra-steps x:ms-4 x:mb-12 x:border-s x:border-gray-200 x:ps-6',
        'x:dark:border-neutral-800',
        format === 'bullet' && styles.bullet,
        className
      )}
      style={{ ...style, '--counter-id': id }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Steps }
