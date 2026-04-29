/**
 * @fileoverview Client boundary wrapper around next-themes ThemeProvider.
 *
 * Re-exports next-themes' ThemeProvider behind an explicit `'use client'`
 * boundary so its injected pre-paint script serializes into the SSR HTML.
 * Importing next-themes directly into a server layout breaks that injection
 * in the App Router, producing first-paint flicker on cold loads.
 */

'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Pre-paint theme resolution executed in the browser before first paint.
 * Reads the stored preference from `localStorage`, falls back to system
 * preference via `prefers-color-scheme`, and applies `class="dark"` and
 * `color-scheme` on `<html>` synchronously.
 *
 * Serialized via `.toString()` and rendered inside `<script>` so the
 * source stays readable while shipping as a compact IIFE.
 */
function setTheme() {
  try {
    const stored = localStorage.getItem('theme') || 'system'
    const isDark =
      stored === 'dark' ||
      (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.style.colorScheme = 'light'
    }
  } catch (e) {}
}

/**
 * Inline pre-paint script that resolves the theme from localStorage and
 * `prefers-color-scheme`, then sets `class="dark"` and `color-scheme` on
 * `<html>` synchronously before first paint. Must be rendered inside
 * `<head>` to run before the browser paints the body.
 *
 * Mirrors the IIFE next-themes injects via its ThemeProvider — duplicated
 * here only to control placement, since next-themes renders its script
 * inside `<body>`, after the browser has already begun painting.
 *
 * @returns {import('react').ReactElement} Inline script element
 */
function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: `(${setTheme})()` }} />
}

/**
 * Thin pass-through around next-themes' ThemeProvider.
 *
 * @param {object} props - Provider props forwarded to next-themes
 * @param {import('react').ReactNode} props.children - Page content
 * @returns {import('react').ReactElement} Themed children
 */
function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { ThemeProvider, ThemeScript }
