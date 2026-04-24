/**
 * @fileoverview Root layout for the website.
 *
 * Provides the HTML shell, global metadata, and shared styles
 * for all pages across every section.
 */

import { Head } from 'nextra/components'
import { GoogleAnalytics } from '@next/third-parties/google'
import { analytics, domain } from '@axivo/website/global'
import '../styles/globals.css'

export const metadata = {
  metadataBase: new URL(`${domain.protocol}://${domain.name}`),
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
  },
  icons: {
    apple: [
      { url: '/apple-icon.png', rel: 'apple-touch-icon' },
      { url: '/apple-icon.png', rel: 'apple-touch-icon-precomposed' }
    ]
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
      <GoogleAnalytics gaId={analytics.id} />
      <body>
        {children}
      </body>
    </html>
  )
}

export { RootLayout as default }
