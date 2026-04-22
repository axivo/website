/**
 * @fileoverview Blog collection binding.
 *
 * Binds the generic post collection helpers in Post.jsx to the blog
 * collection descriptor. Exports a Blog component wrapping Posts, a
 * Tags wrapper, and helpers for the blog landing and tag pages.
 */

import { meta } from '@axivo/website/blog'
import { cloudflare } from '@axivo/website/global'
import {
  getPostPageMap,
  getPosts,
  getTags as genericGetTags,
  Posts,
  renderIndexPage as genericRenderIndexPage,
  Tags as GenericTags,
  Title
} from './Post'

const collection = {
  contentPrefix: `src/content/${meta.source.path}/`,
  describe: meta.source.describe,
  metadataKey: cloudflare.bucket.metadata.blog,
  routePath: `/${meta.source.path}`,
  sectionId: meta.source.path,
  sectionPath: '',
  sectionTitle: meta.source.title,
  tagsSectionTitle: meta.source.title,
  template: 'blog'
}

const Blog = props => <Posts collection={collection} {...props} />
const getBlogPageMap = () => getPostPageMap(collection)
const getEntries = () => getPosts(collection)
const getTags = () => genericGetTags(collection)
const renderIndexPage = date => genericRenderIndexPage(collection, date)
const Tags = () => <GenericTags collection={collection} />

export {
  Blog,
  collection as blogCollection,
  getBlogPageMap,
  getEntries,
  getTags,
  renderIndexPage,
  Tags,
  Title
}
