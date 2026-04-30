/**
 * @fileoverview Reusable dropdown menu for the navbar and subnavbar.
 *
 * Accepts a title and a list of items. Each item has a title and optional
 * description, icon, href, and onClick. Items with href render as links;
 * items with onClick render as buttons. The component handles click-outside
 * dismissal and arrow rotation.
 */

'use client'

import cn from 'clsx'
import NextLink from 'next/link'
import { ArrowRightIcon, LinkArrowIcon } from 'nextra/icons'
import { useEffect, useRef, useState } from 'react'
import { icons } from '@axivo/website/menu'
import styles from './NavbarMenu.module.css'

function resolveIcon(spec) {
  if (!spec) {
    return null
  }
  if (typeof spec !== 'string') {
    return spec
  }
  return icons[spec] ?? null
}

function NavbarMenu({ title, items }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    if (!open) {
      return
    }
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])
  function renderItem(item, index) {
    const Icon = resolveIcon(item.icon)
    const isExternal = item.external || (item.href && /^https?:\/\//.test(item.href))
    const content = (
      <>
        {Icon && <Icon size={item.description ? 24 : 16} />}
        <div className={styles.menuItemText}>
          <span className={styles.menuItemTitle}>
            {item.title}
            {isExternal && <LinkArrowIcon height="1em" />}
          </span>
          {item.description && (
            <span className={styles.menuItemDescription}>{item.description}</span>
          )}
        </div>
      </>
    )
    const className = cn(styles.menuItem, 'x:transition-colors x:text-gray-800 x:dark:text-gray-100')
    if (item.href) {
      return (
        <NextLink
          className={className}
          href={item.href}
          key={index}
          onClick={() => setOpen(false)}
          {...(isExternal && { target: '_blank', rel: 'noreferrer' })}
        >
          {content}
        </NextLink>
      )
    }
    return (
      <button
        className={className}
        key={index}
        onClick={() => {
          item.onClick?.()
          setOpen(false)
        }}
        type="button"
      >
        {content}
      </button>
    )
  }
  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={cn(styles.trigger, 'x:text-gray-600 x:dark:text-gray-400 x:hover:text-black x:dark:hover:text-gray-200 x:transition-colors')}
        onClick={() => setOpen(prev => !prev)}
        type="button"
      >
        {title}
        <ArrowRightIcon width="12" className={cn(styles.arrow, open && styles.arrowOpen)} />
      </button>
      {open && (
        <div className={cn(styles.menu, 'x:border x:border-black/5 x:dark:border-white/20 x:bg-nextra-bg')}>
          {items.map(renderItem)}
        </div>
      )}
    </div>
  )
}

export { NavbarMenu }
