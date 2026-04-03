/**
 * @fileoverview PostCSS configuration for Tailwind CSS v4.
 *
 * Uses the @tailwindcss/postcss plugin for processing Tailwind directives.
 */

const postcssConfig = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}

export { postcssConfig as default }
