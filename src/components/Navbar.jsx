/**
 * @fileoverview Navbar shell replacing Nextra's default navbar.
 *
 * Provides the structural frame — sticky header, logo, search, project
 * link, hamburger. Item rendering is delegated to NavbarMenuItems,
 * injected by the layout as a child with its site-specific menu config.
 */

'use client'

import cn from 'clsx'
import NextLink from 'next/link'
import { Anchor, Button } from 'nextra/components'
import { GitHubIcon, MenuIcon } from 'nextra/icons'
import { setMenu, useMenu, useThemeConfig } from 'nextra-theme-docs'
import styles from './Navbar.module.css'

function ClientNavbar({ children, className, items }) {
  const themeConfig = useThemeConfig()
  const menu = useMenu()
  return (
    <>
      <div className={cn(styles.items, className)}>
        {items}
      </div>
      {themeConfig.search && (
        <div className={styles.search}>{themeConfig.search}</div>
      )}
      {children}
      <Button
        aria-label="Menu"
        className={({ active }) =>
          cn('nextra-hamburger', styles.hamburger, active && styles.hamburgerActive)
        }
        onClick={() => setMenu(prev => !prev)}
      >
        <MenuIcon height="24" className={cn({ open: menu })} />
      </Button>
    </>
  )
}

const defaultProjectIcon = <GitHubIcon height="24" aria-label="Project repository" />

function Navbar({
  align = 'right',
  children,
  className,
  logo,
  logoLink = true,
  projectIcon = defaultProjectIcon,
  projectLink
}) {
  const logoClass = cn(
    styles.logo,
    align === 'left' ? styles.logoMarginMobile : styles.logoMargin
  )
  return (
    <header className={cn('nextra-navbar', styles.header)}>
      <div className={cn('nextra-navbar-blur', 'nextra-border', styles.blur)} />
      <nav className={cn(styles.nav, className)}>
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className={cn('nextra-focus', logoClass, styles.logoLink)}
            aria-label="Home page"
          >
            {logo}
          </NextLink>
        ) : (
          <div className={logoClass}>{logo}</div>
        )}
        <ClientNavbar
          className={align === 'left' ? styles.itemsAlignLeft : ''}
          items={children}
        >
          {projectLink && <Anchor href={projectLink}>{projectIcon}</Anchor>}
        </ClientNavbar>
      </nav>
    </header>
  )
}

export { Navbar }
