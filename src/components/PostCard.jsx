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
import { Meta } from './Meta'
import styles from './PostCard.module.css'

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
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <Link href={post.route} className={styles.titleLink}>
          {title}
        </Link>
      </h3>
      {date && <Meta author={author} date={date} source={source} />}
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
