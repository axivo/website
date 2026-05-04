/**
 * @fileoverview Root layout for the website.
 *
 * Provides the HTML shell, global metadata, and shared styles
 * for all pages across every section.
 */

import { GoogleAnalytics } from '@next/third-parties/google'
import { Head } from 'nextra/components'
import { ViewTransition } from 'react'
import { domain, google, meta } from '@axivo/website/global'
import { inter, jetbrainsMono } from '@axivo/website/fonts'
import { ThemeProvider, ThemeScript } from '@axivo/website'
import '../styles/globals.css'

const metadata = {
  metadataBase: new URL(`${domain.protocol}://${domain.name}`),
  title: {
    template: `%s - ${meta.brand.name}`
  },
  description: 'Imagine. Create.',
  applicationName: meta.brand.name,
  generator: 'Next.js',
  alternates: {
    canonical: './'
  },
  appleWebApp: {
    title: meta.brand.name
  },
  icons: {
    apple: [
      { url: '/apple-icon.png', rel: 'apple-touch-icon' },
      { url: '/apple-icon.png', rel: 'apple-touch-icon-precomposed' }
    ]
  },
  openGraph: {
    siteName: meta.brand.name,
    url: './',
    type: 'website'
  }
}

/**
 * Root HTML layout wrapping all pages.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Page content
 */
function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={[inter, jetbrainsMono].map(font => font.variable).join(' ')} suppressHydrationWarning>
      <Head>
        <ThemeScript />
      </Head>
      {google.analytics.enabled && <GoogleAnalytics gaId={google.analytics.id} />}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          storageKey="theme"
        >
          <ViewTransition>
            {children}
          </ViewTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}

export { metadata, RootLayout as default }
