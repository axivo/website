/**
 * @fileoverview PostCard component for reflection entry listings.
 *
 * Renders a single reflection entry card with title, author metadata,
 * description, read more link, and tags. Used by listing pages
 * (year, month, day) and the reflections landing page.
 */

import Link from 'next/link'
import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'
import styles from './PostCard.module.css'

/**
 * Month name lookup for date formatting.
 */
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * Formats a Date object to 12-hour time string.
 *
 * @param {Date} date - Date to format
 * @returns {string} Formatted time (e.g., "9:44 AM")
 */
function formatTime(date) {
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes} ${period}`
}

/**
 * Reflection entry card for listing pages.
 *
 * @param {object} props
 * @param {object} props.post - Entry object from getReflections()
 * @param {string} props.post.route - Entry URL path
 * @param {object} props.post.frontMatter - Entry frontmatter
 * @param {string} [props.readMore='Read more →'] - Read more link text
 */
async function PostCard({ post, readMore = 'Read more' }) {
  const { author, date, description, source, tags, title } = post.frontMatter
  const dateObj = date && new Date(date)

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Link href={post.route} className={styles.titleLink}>
          {title}
        </Link>
      </h3>
      {dateObj && (
        <div className={styles.meta}>
          <Link
            href={`/claude/reflections/${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`}
            className={styles.date}
          >
            <time dateTime={dateObj.toISOString()}>
              {monthNames[dateObj.getMonth()]} {dateObj.getDate()}, {dateObj.getFullYear()}
            </time>
          </Link>
          <span className={styles.separator}>&bull;</span>
          <span>{formatTime(dateObj)}</span>
          {author && (
            <>
              <span className={styles.dash}>&mdash;</span>
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.author}
                title={author}
              >
                <img
                  alt={author}
                  className={styles.avatar}
                  height="16"
                  src="https://github.com/claude.png"
                  width="16"
                />
                {author}
              </a>
            </>
          )}
        </div>
      )}
      {tags?.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <Link key={tag} href={`/claude/reflections/tags/${tag}`} className={styles.tag}>
              {tag}
            </Link>
          ))}
        </div>
      )}
      {description && (
        <div className={styles.description}>
          <MDXRemote compiledSource={await compileMdx(description)} />
        </div>
      )}
      {readMore && (
        <Link href={post.route} className="button">
          {readMore} <span>→</span>
        </Link>
      )}
    </div>
  )
}

export { PostCard }
