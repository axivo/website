/**
 * @fileoverview PostCard component for reflection entry listings.
 *
 * Renders a single reflection entry card with title, author metadata,
 * description, read more link, and tags. Used by listing pages
 * (year, month, day) and the reflections landing page.
 */

import { useMDXComponents as getMDXComponents } from '@axivo/website'
import Link from 'next/link'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { SafeMdxRenderer } from 'safe-mdx'
import { unified } from 'unified'
import { Meta } from './Meta'
import styles from './PostCard.module.css'

/**
 * Post entry card for listing pages.
 *
 * @param {object} props
 * @param {object} props.collection - Collection descriptor with routePath
 * @param {object} props.post - Entry object with route and frontMatter
 * @param {string} props.post.route - Entry URL path
 * @param {object} props.post.frontMatter - Entry frontmatter
 * @param {string} [props.readMore='Read more →'] - Read more link text
 */
function PostCard({ collection, post, readMore = 'Read more' }) {
  const { author, date, description, source, tags, template, title } = post.frontMatter
  const components = getMDXComponents()
  const id = post.route.split('/').pop()
  return (
    <div className={styles.card}>
      <components.h3 className={styles.title} id={id}>
        <Link href={post.route} className={styles.titleLink}>
          {title}
        </Link>
      </components.h3>
      {date && <Meta author={author} date={date} routePath={collection.routePath} source={source} template={template} />}
      {tags?.length && (
        <div className={styles.tags}>
          {[...tags].sort().map(tag => (
            <Link key={tag} href={`${collection.routePath}/tags/${tag}`} className={styles.tag}>
              {tag}
            </Link>
          ))}
        </div>
      )}
      {description && (
        <div className={styles.description}>
          <SafeMdxRenderer components={components} mdast={unified().use(remarkParse).use(remarkMdx).parse(description)} />
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
