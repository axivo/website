/**
 * @fileoverview Subnavbar-mounted action menu for the current page.
 *
 * Reads action menus (entries marked action: true) from the root
 * _menu.js registry. For each item, wires its `action` name to a
 * handler that uses Nextra's page-source and copy hooks. Delegates
 * rendering to NavbarMenu.
 *
 * Returns null when the current page opts out via
 * theme: { copyPage: false } in its _meta.js entry.
 */

'use client'

import { useCopy } from 'nextra/hooks'
import { useConfig } from 'nextra-theme-docs'
import { menus } from '@axivo/website/menu'
import { NavbarMenu } from './NavbarMenu'
import { useSourceCode } from './mdx/SourceCode'

function ExploreMenu() {
  const { normalizePagesResult: { activeThemeContext } } = useConfig()
  const { copy } = useCopy()
  const sourceCode = useSourceCode()
  if (activeThemeContext.copyPage === false) return null
  const actions = {
    copyPage: {
      handler: () => sourceCode && copy(sourceCode),
      external: false
    },
    openInClaude: {
      handler: () => {
        const query = `Please read ${location.href} so we can explore this topic together.`
        window.open(`https://claude.ai/new?q=${encodeURIComponent(query)}`, '_blank')
      },
      external: true
    }
  }
  const rootMenu = menus[''] || {}
  const actionMenus = Object.entries(rootMenu).filter(([, menu]) => menu.action === true)
  return actionMenus.map(([name, menu]) => {
    const items = Object.values(menu.items || {}).map(item => {
      const action = actions[item.action]
      return {
        ...item,
        onClick: action?.handler,
        external: action?.external
      }
    })
    return (
      <NavbarMenu
        key={name}
        title={name.charAt(0).toUpperCase() + name.slice(1)}
        items={items}
      />
    )
  })
}

export { ExploreMenu }
