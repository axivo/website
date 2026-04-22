/**
 * @fileoverview Sticky subnavbar rendering breadcrumbs and Explore button.
 *
 * Positioned below Nextra's Navbar, this component creates a secondary
 * sticky bar inspired by Anthropic's claude.com layout. It reads the
 * active path from Nextra's config store and renders breadcrumb
 * navigation on the left with the Explore button on the right.
 *
 * The original Nextra breadcrumb inside the article is hidden via CSS
 * in globals.css to avoid duplication.
 */

'use client'

import cn from 'clsx'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRightIcon } from 'nextra/icons'
import { useConfig } from 'nextra-theme-docs'
import { Fragment, useEffect, useRef } from 'react'
import { GoHome } from 'react-icons/go'
import { Explore } from './Explore'
import styles from './Subnavbar.module.css'

/**
 * Sticky breadcrumb bar positioned below the main navbar.
 *
 * Renders breadcrumb navigation on the left and Explore button
 * on the right. Only visible on non-page type routes that have
 * breadcrumb content enabled.
 */
function Subnavbar({ activePath: activePathProp } = {}) {
  const { normalizePagesResult: { activePath: configActivePath, activeType } } = useConfig()
  const activePath = activePathProp ?? configActivePath
  const pathname = usePathname()
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const root = document.documentElement
    let sidebar = null
    let toc = null
    const frame = requestAnimationFrame(() => {
      if (!ref.current) {
        return
      }
      const height = ref.current.getBoundingClientRect().height
      const offset = `calc(var(--nextra-navbar-height) + ${height}px)`
      root.style.setProperty('--nextra-subnavbar-height', `${height}px`)
      root.style.setProperty('scroll-padding-top', offset)
      sidebar = document.querySelector('.nextra-sidebar')
      if (sidebar) {
        sidebar.style.top = offset
        sidebar.style.height = `calc(100dvh - var(--nextra-navbar-height) - ${height}px)`
      }
      toc = document.querySelector('.nextra-toc > div')
      if (toc) {
        toc.style.top = offset
        toc.style.maxHeight = `calc(100vh - var(--nextra-navbar-height) - ${height}px)`
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      root.style.removeProperty('--nextra-subnavbar-height')
      root.style.removeProperty('scroll-padding-top')
      if (sidebar) {
        sidebar.style.removeProperty('top')
        sidebar.style.removeProperty('height')
      }
      if (toc) {
        toc.style.removeProperty('top')
        toc.style.removeProperty('max-height')
      }
    }
  }, [pathname])
  if (!activePath?.length || (!activePathProp && activeType === 'page')) {
    return null
  }
  return (
    <div ref={ref} className={cn('nextra-border nextra-subnavbar x:bg-nextra-bg/70', styles.subnavbar)}>
      <div className={styles.container}>
        <div className={cn(styles.breadcrumb, 'x:text-gray-600 x:dark:text-gray-400 x:contrast-more:text-gray-700 x:contrast-more:dark:text-gray-100')}>
          <GoHome size={18} className={styles.icon} />
          {activePath.map((item, index, arr) => {
            const nextItem = arr[index + 1]
            const href = nextItem
              ? 'frontMatter' in item
                ? item.route
                : item.children?.[0]?.route === nextItem.route
                  ? ''
                  : item.children?.[0]?.route || ''
              : ''
            const ComponentToUse = href ? NextLink : 'span'
            return (
              <Fragment key={item.route + item.name}>
                {index > 0 && (
                  <ArrowRightIcon
                    height="14"
                    className={styles.separator}
                  />
                )}
                <ComponentToUse
                  className={cn(
                    styles.item,
                    nextItem
                      ? cn(styles.itemLink, href && 'x:hover:text-black x:dark:hover:text-gray-200')
                      : cn(styles.itemActive, 'x:text-black x:dark:text-gray-100'),
                    href && 'x:focus-visible:nextra-focus x:ring-inset'
                  )}
                  title={typeof item.title === 'string' ? item.title : undefined}
                  {...(href && { href, prefetch: false })}
                >
                  {item.title}
                </ComponentToUse>
              </Fragment>
            )
          })}
        </div>
        <Explore />
      </div>
    </div>
  )
}

export { Subnavbar }
