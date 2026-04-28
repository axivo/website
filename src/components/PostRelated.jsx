/**
 * @fileoverview PostRelated component for entry pages.
 *
 * Renders a section heading and a CardGrid of FeatureCard entries
 * computed by `getRelated` from `Post.jsx`. Returns null when no
 * related entries exist so empty sections do not render. Uses the
 * same visual treatment as the Featured sections so related entries
 * feel like a curated destination block at the bottom of an entry.
 */

import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import { CardGrid, FeatureCard, useMDXComponents as getMDXComponents } from '@axivo/website'
import { Icon } from './mdx/Icon'
import { createDispatch } from './mdx/renderers/node'
import styles from './PostRelated.module.css'

/**
 * Builds the markdown body for a related entry card. Combines the
 * formatted entry date and description into a single bold-prefixed
 * string ready to parse through the MDX pipeline.
 *
 * @param {object} entry - Collection entry with frontMatter
 * @returns {string} Markdown string for the card body
 */
function formatBody(entry) {
  const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  const date = dateFormat.format(new Date(entry.frontMatter.date))
  return `**${date}** — ${entry.frontMatter.description || ''}`
}

/**
 * Section displaying related entries at the bottom of an entry page.
 *
 * @param {object} props
 * @param {object[]} props.entries - Related entries to display
 * @param {string} props.title - Section heading text
 * @returns {import('react').ReactElement|null} Related section or null
 */
function PostRelated({ entries, title }) {
  if (entries.length < 2) {
    return null
  }
  const components = getMDXComponents()
  const dispatch = createDispatch()
  return (
    <div className={styles.related}>
      <components.h2><Icon name="go/GoTelescope" size={36} />&nbsp;{title}</components.h2>
      <CardGrid>
        {entries.map(entry => (
          <FeatureCard href={entry.route} key={entry.route} title={entry.frontMatter.title}>
            <SafeMdxRenderer
              components={components}
              mdast={unified().use(remarkParse).use(remarkMdx).parse(formatBody(entry))}
              renderNode={dispatch}
            />
          </FeatureCard>
        ))}
      </CardGrid>
    </div>
  )
}

export { PostRelated }
