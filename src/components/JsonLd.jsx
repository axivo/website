/**
 * @fileoverview JSON-LD structured data for entry pages.
 *
 * Emits Schema.org `BlogPosting` (blog) or `Article` (reflection)
 * markup for each entry so Google can produce rich results. Field
 * selection follows Google's documented recommendations for Article
 * structured data: author, datePublished, headline, image.
 *
 * Author profiles come from `meta.profile.architect` (blog) and
 * `meta.profile.instance` (reflection); the schema image is the OG
 * file convention served at `/opengraph-image.png`.
 */

import { domain, meta } from '@axivo/website/global'

/**
 * Builds the Schema.org Article or BlogPosting object for an entry.
 *
 * @param {object} args
 * @param {object} args.collection - Collection descriptor
 * @param {string} args.collection.routePath - Collection route prefix
 * @param {string} args.collection.template - Collection template (blog, reflection)
 * @param {object} args.metadata - R2 custom metadata for the entry
 * @param {string} args.metadata.date - ISO 8601 publication timestamp
 * @param {string} args.metadata.title - Entry title
 * @param {string[]} args.path - Date-based route segments for the entry
 * @returns {object} Schema.org BlogPosting or Article
 */
function createEntrySchema({ collection, metadata, path }) {
  const baseUrl = `${domain.protocol}://${domain.name}`
  const isBlog = collection.template === 'blog'
  const profile = isBlog ? meta.profile.architect : meta.profile.instance
  const url = `${baseUrl}${collection.routePath}/${path.join('/')}`
  return {
    '@context': 'https://schema.org',
    '@type': isBlog ? 'BlogPosting' : 'Article',
    author: createPersonSchema(profile),
    datePublished: metadata.date,
    headline: metadata.title,
    image: `${baseUrl}/opengraph-image.png`,
    mainEntityOfPage: url,
    url
  }
}

/**
 * Builds a Schema.org Person object for an author profile.
 *
 * @param {object} profile - Profile descriptor from `meta.profile`
 * @param {string} profile.homepage - Canonical URL identifying the person
 * @param {string} profile.name - Display name
 * @returns {object} Schema.org Person
 */
function createPersonSchema(profile) {
  return {
    '@type': 'Person',
    name: profile.name,
    url: profile.homepage
  }
}

/**
 * Renders a JSON-LD structured data script tag. Replaces `<` with its
 * unicode escape `<` to prevent XSS injection through metadata
 * fields that may contain HTML-like characters.
 *
 * @param {object} props
 * @param {object} props.data - Schema.org object to serialize
 * @returns {import('react').ReactElement}
 */
function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export { createEntrySchema, JsonLd }
