/**
 * @fileoverview Blog collection binding.
 *
 * Binds the generic post collection helpers in Post.jsx to the blog
 * collection descriptor. Exports a Blog component wrapping Posts, a
 * Tags wrapper, and helpers for the blog landing and tag pages.
 */

import { source } from '@axivo/website/blog'
import { domain } from '@axivo/website/global'
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
  contentPrefix: `src/content/${source.path}/`,
  describeIndex: phrase =>
    `Posts by Floren Munteanu about AXIVO projects during ${phrase}.`,
  latestTocSectionId: 'latest-posts',
  metadataEndpoint: `${domain.protocol}://${domain.name}/metadata?collection=${source.path}`,
  routePath: `/${source.path}`,
  sectionId: source.path,
  sectionPath: '',
  sectionTitle: source.title,
  tagsSectionTitle: source.title,
  templates: ['post']
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
