/**
 * @fileoverview Renders the list of items inside the navbar.
 *
 * Walks Nextra's top-level page map for order and structure. For each
 * type: 'menu' entry, merges enrichment from the passed menu config
 * (description, icon) and delegates to NavbarMenu. For plain pages,
 * renders an anchor with active-page detection.
 */

'use client'

import cn from 'clsx'
import { Anchor } from 'nextra/components'
import { useFSRoute } from 'nextra/hooks'
import { useConfig } from 'nextra-theme-docs'
import { menus } from '../generated/menu'
import { NavbarMenu } from './NavbarMenu'

const linkClass = cn(
  'x:text-sm x:contrast-more:text-gray-700 x:contrast-more:dark:text-gray-100 x:whitespace-nowrap',
  'x:text-gray-600 x:hover:text-black x:dark:text-gray-400 x:dark:hover:text-gray-200',
  'x:ring-inset x:transition-colors'
)

function isMenu(page) {
  return page.type === 'menu'
}

function NavbarMenuItems({ site = '' }) {
  const menu = menus[site] || {}
  const items = useConfig().normalizePagesResult.topLevelNavbarItems
  const pathname = useFSRoute()
  return items.map((page, index, arr) => {
    if ('display' in page && page.display === 'hidden') return null
    if (isMenu(page)) {
      const enrichment = menu[page.name]
      if (enrichment) {
        for (const key of Object.keys(page.items || {})) {
          if (!enrichment.items?.[key]) {
            console.warn(`[NavbarMenuItems] _meta.js "${page.name}.${key}" has no match in _menu.js`)
          }
        }
      }
      const menuItems = Object.entries(page.items || {}).map(([key, item]) => ({
        ...item,
        ...(enrichment?.items?.[key] || {})
      }))
      return (
        <NavbarMenu
          key={page.name}
          title={page.title}
          items={menuItems}
        />
      )
    }
    const href =
      ('frontMatter' in page ? page.route : page.firstChildRoute) ||
      page.href ||
      page.route
    const isCurrentPage =
      href === pathname ||
      (pathname.startsWith(page.route + '/') &&
        arr.every(item => !('href' in item) || item.href !== pathname)) ||
      undefined
    return (
      <Anchor
        href={href}
        key={page.name}
        className={cn(
          linkClass,
          'x:aria-[current]:font-medium x:aria-[current]:subpixel-antialiased x:aria-[current]:text-current'
        )}
        aria-current={isCurrentPage}
      >
        {page.title}
      </Anchor>
    )
  })
}

export { NavbarMenuItems }
