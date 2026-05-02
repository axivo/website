/**
 * @fileoverview Custom shiki themes for code highlighting.
 *
 * Builds patched copies of the github-light and github-dark shiki
 * themes by applying the per-scope foreground overrides declared in
 * `meta.theme.overrides`. Both render paths — bundled MDX through
 * `next.config.mjs` and dynamic R2 through `scripts/prebuild.js` —
 * consume the exported themes so code blocks render identically.
 */

import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import { meta } from '@axivo/website/global'

/**
 * Returns a copy of the given shiki theme with foreground colors
 * replaced for tokenColors rules whose scope key matches an override.
 * Scope keys may be a single string or a comma-joined array; rules
 * without a match pass through unchanged.
 *
 * @param {object} base - Source shiki theme
 * @param {Record<string, string>} overrides - Scope-key to foreground-hex map
 * @returns {object} Updated theme
 */
function updateTheme(base, overrides) {
  return {
    ...base,
    name: `${base.name}-axivo`,
    tokenColors: base.tokenColors.map(rule => {
      const scopeKey = Array.isArray(rule.scope) ? rule.scope.join(',') : rule.scope
      const foreground = overrides[scopeKey]
      if (!foreground) {
        return rule
      }
      return { ...rule, settings: { ...rule.settings, foreground } }
    })
  }
}

/**
 * Hex literals are required because shiki processes themes at build
 * time in Node, where browser CSS variables do not resolve. When
 * aligning overrides with site-level design tokens, resolve the
 * Tailwind color to its hex form and place that literal in
 * `meta.theme.overrides`.
 */
const darkTheme = updateTheme(githubDark, meta.theme.overrides[githubDark.name] || {})
const lightTheme = updateTheme(githubLight, meta.theme.overrides[githubLight.name] || {})

export { darkTheme, lightTheme }
