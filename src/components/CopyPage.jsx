/**
 * @fileoverview Custom CopyPage component replacing Nextra's built-in version.
 *
 * Nextra's default CopyPage component (nextra-theme-docs/dist/components/copy-page.js)
 * has three hardcoded dropdown options: Copy page, Open in ChatGPT, and Open in Claude.
 * There is no configuration to filter which options appear. This custom component
 * removes the ChatGPT option and keeps only Copy page and Open in Claude.
 *
 * The built-in button is disabled via copyPageButton={false} on each site's Layout
 * component. This component is rendered in the Subnavbar component.
 */

'use client'

import cn from 'clsx'
import { Button, Select } from 'nextra/components'
import { useCopy } from 'nextra/hooks'
import { ArrowRightIcon, ClaudeIcon, CopyIcon, LinkArrowIcon } from 'nextra/icons'
import { useConfig } from 'nextra-theme-docs'
import styles from './CopyPage.module.css'

/**
 * Dropdown menu options for the CopyPage button.
 */
const menuOptions = [
  {
    id: 'copy',
    name: (
      <Item
        description="Copy page as Markdown for LLMs"
        icon={CopyIcon}
        title="Copy Page"
      />
    )
  },
  {
    id: 'claude',
    name: (
      <Item
        description="Ask questions about this page"
        icon={ClaudeIcon}
        isExternal
        title="Open in Claude"
      />
    )
  }
]

/**
 * Custom replacement for Nextra's built-in CopyPage component.
 * Renders a "Copy page" button with an "Open in Claude" dropdown option.
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
function CopyPage() {
  const { normalizePagesResult: { activeThemeContext } } = useConfig()
  const { copy, isCopied } = useCopy()
  if (activeThemeContext.copyPage === false) {
    return null
  }
  function handleCopy() {
    const article = document.querySelector('article')
    if (article) {
      copy(article.innerText)
    }
  }
  function handleChange(value) {
    if (value === 'copy') {
      handleCopy()
      return
    }
    const query = `Read from ${location.href} so I can ask questions about it.`
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(query)}`,
      '_blank'
    )
  }
  return (
    <div className={cn(styles.container, 'x:text-sm x:text-gray-600 x:dark:text-gray-400')}>
      <Button
        className={() => cn(styles.button, 'x:transition-colors x:hover:text-black x:dark:hover:text-gray-200', isCopied && styles.copied)}
        onClick={handleCopy}
      >
        {isCopied ? 'Copied' : 'Copy Page'}
      </Button>
      <div className={cn(styles.dropdown, 'x:transition-colors x:hover:text-black x:dark:hover:text-gray-200')}>
        <Select
          anchor={{ to: 'bottom end', gap: 10 }}
          onChange={handleChange}
          options={menuOptions}
          selectedOption={<ArrowRightIcon width="12" className="x:rotate-90" />}
          value=""
        />
      </div>
    </div>
  )
}

/**
 * Renders a single dropdown menu item with icon, title, and description.
 *
 * @param {object} props
 * @param {import('react').ComponentType} props.icon - Icon component to render
 * @param {string} props.title - Item title
 * @param {string} props.description - Item description text
 * @param {boolean} [props.isExternal] - Whether the item links externally
 */
function Item({ icon: Icon, title, description, isExternal }) {
  return (
    <div className="x:flex x:gap-3 x:items-center">
      <Icon width="16" />
      <div className="x:flex x:flex-col">
        <span className="x:font-medium x:flex x:gap-1">
          {title}
          {isExternal && <LinkArrowIcon height="1em" />}
        </span>
        <span className="x:text-xs">{description}</span>
      </div>
    </div>
  )
}

export { CopyPage }
