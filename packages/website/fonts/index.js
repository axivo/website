/**
 * @fileoverview Self-hosted font registrations.
 *
 * Loads Inter and JetBrains Mono from local TTF files via Next.js's
 * `next/font/local` pipeline. Both fonts are exported as resolved
 * font objects with `.variable` and `.className` properties ready
 * for application to the `<html>` element by the consumer layout.
 * Variable names use Nextra's `x:`-prefixed convention so the fonts
 * integrate with the docs theme without additional Tailwind wiring.
 */

import localFont from 'next/font/local'

const inter = localFont({
  display: 'swap',
  src: [
    { path: './Inter-Bold.ttf', style: 'normal', weight: '700' },
    { path: './Inter-Italic.ttf', style: 'italic', weight: '400' },
    { path: './Inter-Regular.ttf', style: 'normal', weight: '400' }
  ],
  variable: '--x-font-sans'
})

const jetbrainsMono = localFont({
  display: 'swap',
  src: [
    { path: './JetBrainsMono-Regular.ttf', style: 'normal', weight: '400' }
  ],
  variable: '--x-font-mono'
})

export { inter, jetbrainsMono }
