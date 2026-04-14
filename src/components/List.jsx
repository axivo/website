/**
 * @fileoverview List components for documentation pages.
 *
 * Overrides nextra's default ordered and unordered list components
 * with custom indentation and spacing.
 */

import styles from './List.module.css'

/**
 * Ordered list with custom indentation.
 *
 * @param {object} props - HTML ol attributes
 */
function Ordered(props) {
  return <ol className={styles.ordered} {...props} />
}

/**
 * Unordered list with custom indentation.
 *
 * @param {object} props - HTML ul attributes
 */
function Unordered(props) {
  return <ul className={styles.unordered} {...props} />
}

export { Ordered, Unordered }
