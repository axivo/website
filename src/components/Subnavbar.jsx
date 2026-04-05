/**
 * @fileoverview Sticky subnavbar rendering breadcrumbs and CopyPage button.
 *
 * Positioned below Nextra's Navbar, this component creates a secondary
 * sticky bar inspired by Anthropic's claude.com layout. It reads the
 * active path from Nextra's config store and renders breadcrumb
 * navigation on the left with the CopyPage button on the right.
 *
 * The original Nextra breadcrumb inside the article is hidden via CSS
 * in globals.css to avoid duplication.
 */

'use client'

import cn from 'clsx'
import NextLink from 'next/link'
import { ArrowRightIcon } from 'nextra/icons'
import { useConfig } from 'nextra-theme-docs'
import { Fragment } from 'react'
import { GoHome } from 'react-icons/go'
import { CopyPage } from './CopyPage'
import styles from './Subnavbar.module.css'

/**
 * Sticky breadcrumb bar positioned below the main navbar.
 *
 * Renders breadcrumb navigation on the left and CopyPage button
 * on the right. Only visible on non-page type routes that have
 * breadcrumb content enabled.
 */
function Subnavbar() {
  const { normalizePagesResult: { activePath, activeType } } = useConfig()
  if (activeType === 'page') {
    return null
  }
  return (
    <div className={cn('nextra-subnavbar nextra-border x:bg-nextra-bg/70', styles.subnavbar)}>
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
        <CopyPage />
      </div>
    </div>
  )
}

export { Subnavbar }
