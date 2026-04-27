/**
 * @fileoverview Subpath export for Nextra's HeadPropsSchema.
 *
 * Exposes Nextra's HeadPropsSchema so callers can derive the active
 * theme defaults (background color, primary color) without duplicating
 * those values. When Nextra's defaults change in a future version, the
 * derived values follow automatically.
 */

export { HeadPropsSchema } from '../../node_modules/nextra/dist/client/components/head.js'
