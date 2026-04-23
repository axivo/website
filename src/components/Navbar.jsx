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

function ClientNavbar({ children, className, items }) {
  const themeConfig = useThemeConfig()
  const menu = useMenu()
  return (
    <>
      <div className={cn('x:flex x:gap-4 x:py-1.5 x:max-md:hidden', className)}>
        {items}
      </div>
      {themeConfig.search && (
        <div className="x:max-md:hidden">{themeConfig.search}</div>
      )}
      {children}
      <Button
        aria-label="Menu"
        className={({ active }) =>
          cn('nextra-hamburger x:md:hidden', active && 'x:bg-gray-400/20')
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
    'x:flex x:items-center',
    align === 'left' ? 'x:max-md:me-auto' : 'x:me-auto'
  )
  return (
    <header
      className={cn(
        'nextra-navbar x:sticky x:top-0 x:z-30 x:w-full x:bg-transparent x:print:hidden',
        'x:max-md:[.nextra-banner:not([class$=hidden])~&]:top-(--nextra-banner-height)'
      )}
    >
      <div
        className={cn(
          'nextra-navbar-blur',
          'x:absolute x:-z-1 x:size-full',
          'nextra-border x:border-b',
          'x:backdrop-blur-md x:bg-nextra-bg/70'
        )}
      />
      <nav
        style={{ height: 'var(--nextra-navbar-height)' }}
        className={cn(
          'x:mx-auto x:flex x:max-w-(--nextra-content-width) x:items-center x:gap-4 x:pl-[max(env(safe-area-inset-left),1.5rem)] x:pr-[max(env(safe-area-inset-right),1.5rem)]',
          'x:justify-end',
          className
        )}
      >
        {logoLink ? (
          <NextLink
            href={typeof logoLink === 'string' ? logoLink : '/'}
            className={cn(
              logoClass,
              'x:transition-opacity x:focus-visible:nextra-focus x:hover:opacity-75'
            )}
            aria-label="Home page"
          >
            {logo}
          </NextLink>
        ) : (
          <div className={logoClass}>{logo}</div>
        )}
        <ClientNavbar
          className={align === 'left' ? 'x:me-auto' : ''}
          items={children}
        >
          {projectLink && <Anchor href={projectLink}>{projectIcon}</Anchor>}
        </ClientNavbar>
      </nav>
    </header>
  )
}

export { Navbar }
