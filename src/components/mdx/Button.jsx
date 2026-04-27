/**
 * @fileoverview Button component for documentation pages.
 *
 * Wraps Nextra's Button with the project's block-level spacing so a
 * standalone `<Button>` after a paragraph sits with proper breathing
 * room. Buttons authored inline inside a paragraph (`<p>Click <Button>
 * here</Button></p>`) opt out of the top margin via a parent-aware CSS
 * rule, matching the pattern used by `./List.jsx`.
 */

import { Button as NextraButton } from 'nextra/components'
import styles from './Button.module.css'

/**
 * Button with block-level spacing when standalone.
 *
 * @param {object} props - Forwarded to nextra's Button
 * @param {string} [props.className] - Additional classes merged with the spacing class
 */
function Button({ className, ...props }) {
  const merged = className ? `${styles.button} ${className}` : styles.button
  return <NextraButton className={merged} {...props} />
}

export { Button }
