/**
 * @fileoverview Root layout for the website.
 *
 * Provides the HTML shell, global metadata, and shared styles
 * for all pages across every section.
 */

import { analytics, domain } from '@axivo/website/docs'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Head } from 'nextra/components'
import '../styles/globals.css'

export const metadata = {
  metadataBase: new URL(`https://${domain}`),
  title: {
    template: '%s - AXIVO'
  },
  description: 'Imagine. Create.',
  applicationName: 'AXIVO',
  generator: 'Next.js',
  openGraph: {
    siteName: 'AXIVO',
    type: 'website'
  },
  appleWebApp: {
    title: 'AXIVO'
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId={analytics.id} />
    </html>
  )
}

export { RootLayout as default }
