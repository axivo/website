/**
 * @fileoverview Explore dropdown component for page actions.
 *
 * Renders an "Explore" dropdown in the Subnavbar with options to copy
 * the page as Markdown or open it in Claude. Uses hover-to-open and
 * click-to-toggle behavior inspired by Anthropic's claude.com design.
 *
 * The built-in CopyPage button is disabled via copyPageButton={false}
 * on each site's Layout component. This component is rendered in the
 * Subnavbar.
 */

'use client'

import cn from 'clsx'
import { useCopy } from 'nextra/hooks'
import { ArrowRightIcon, ClaudeIcon, CopyIcon, LinkArrowIcon } from 'nextra/icons'
import { useConfig } from 'nextra-theme-docs'
import { useEffect, useRef, useState } from 'react'
import styles from './Explore.module.css'
import { useSourceCode } from './SourceCode'

/**
 * Explore dropdown with page actions: copy as Markdown and open in Claude.
 *
 * Opens on hover, toggles on click, closes when mouse leaves.
 *
 * To disable on a specific page, set copyPage: false in _meta.js:
 *
 * @example
 * export default {
 *   'page-name': {
 *     theme: {
 *       copyPage: false
 *     }
 *   }
 * }
 */
function Explore() {
  const { normalizePagesResult: { activeThemeContext } } = useConfig()
  const { copy } = useCopy()
  const sourceCode = useSourceCode()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    if (!open) return
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])
  if (activeThemeContext.copyPage === false) {
    return null
  }
  function handleCopy() {
    if (sourceCode) {
      copy(sourceCode)
    }
    setOpen(false)
  }
  function handleClaude() {
    const query = `Please read ${location.href} so we can explore this topic together.`
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(query)}`,
      '_blank'
    )
    setOpen(false)
  }
  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      <button
        className={cn(styles.trigger, 'x:text-gray-600 x:dark:text-gray-400 x:hover:text-black x:dark:hover:text-gray-200 x:transition-colors')}
        onClick={() => setOpen(prev => !prev)}
        type="button"
      >
        Explore
        <ArrowRightIcon width="12" className={cn(styles.arrow, open && styles.arrowOpen)} />
      </button>
      {open && (
        <div className={cn(styles.menu, 'x:border x:border-black/5 x:dark:border-white/20 x:bg-nextra-bg')}>
          <button className={cn(styles.menuItem, 'x:transition-colors x:text-gray-800 x:dark:text-gray-100')} onClick={handleCopy} type="button">
            <CopyIcon width="16" />
            <div className={styles.menuItemText}>
              <span className={styles.menuItemTitle}>Copy Page</span>
              <span className={styles.menuItemDescription}>Copy page as Markdown for LLMs</span>
            </div>
          </button>
          <button className={cn(styles.menuItem, 'x:transition-colors x:text-gray-800 x:dark:text-gray-100')} onClick={handleClaude} type="button">
            <ClaudeIcon width="16" />
            <div className={styles.menuItemText}>
              <span className={styles.menuItemTitle}>
                Open in Claude
                <LinkArrowIcon height="1em" />
              </span>
              <span className={styles.menuItemDescription}>Ask questions about this page</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export { Explore }
