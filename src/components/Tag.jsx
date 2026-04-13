/**
 * @fileoverview Tags grid component for tag listing pages.
 *
 * Renders tags as content-sized pills in a 3-column grid with
 * tag name and entry count. Theme-aware styling via CSS module.
 */

import styles from './Tag.module.css'

/**
 * 3-column grid of tag pills.
 *
 * @param {object} props
 * @param {Array<[string, number]>} props.tags - Sorted array of [tag, count] pairs
 * @param {string} [props.basePath='/claude/reflections/tags'] - Base URL for tag links
 */
function TagGrid({ tags, basePath = '/claude/reflections/tags' }) {
  return (
    <div className={styles.grid}>
      {tags.map(([tag, count]) => (
        <TagItem key={tag} href={`${basePath}/${tag}`} name={tag} count={count} />
      ))}
    </div>
  )
}

/**
 * Tag pill link with name and count.
 *
 * @param {object} props
 * @param {string} props.href - Tag page URL
 * @param {string} props.name - Tag name
 * @param {number} props.count - Number of entries with this tag
 */
function TagItem({ href, name, count }) {
  return (
    <a href={href} className={styles.tag}>
      <span>{name}</span>
      <span className={styles.count}>{count}</span>
    </a>
  )
}

export { TagGrid }
