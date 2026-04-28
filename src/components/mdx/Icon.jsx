/**
 * @fileoverview Icon component for MDX content.
 *
 * Resolves an icon spec like `pack/IconName` against the prebuild-generated
 * registry at `@axivo/website/menu`. The registry only contains icons
 * referenced from `_menu.js` files or from `<Icon>` usages in MDX, so
 * tree-shaking stays clean — unused icon packs never enter the bundle.
 */

import { icons } from '@axivo/website/menu'
import styles from './Icon.module.css'

/**
 * Renders a react-icons component by spec name.
 *
 * @param {object} props
 * @param {string} [props.className] - Optional class name forwarded to the icon
 * @param {string} props.name - Icon spec like `'go/GoTelescope'`
 * @param {number} [props.size] - Icon size in pixels
 * @param {import('react').CSSProperties} [props.style] - Optional inline styles
 * @returns {import('react').ReactElement|null} The icon component or null when unresolved
 */
function Icon({ className, name, size, style }) {
  const IconComponent = icons[name]
  if (!IconComponent) {
    return null
  }
  return <IconComponent className={[styles.icon, className].filter(Boolean).join(' ')} size={size} style={style} />
}

export { Icon }
