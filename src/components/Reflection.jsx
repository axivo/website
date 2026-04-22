/**
 * @fileoverview Reflections collection binding.
 *
 * Binds the generic post collection helpers in Post.jsx to the reflections
 * collection descriptor and re-exports them under their legacy names so
 * existing callers (route handlers, layouts, MDX) keep working unchanged.
 */

import { meta } from '@axivo/website/claude'
import { domain } from '@axivo/website/global'
import {
  getPostPageMap,
  getPosts,
  getTags as genericGetTags,
  Posts,
  postsPageSize,
  renderIndexPage as genericRenderIndexPage,
  Tags as GenericTags,
  Title
} from './Post'

const collection = {
  contentPrefix: `src/content/${meta.source.path}/${meta.reflections.path}/`,
  describeIndex: phrase =>
    `Reflections written by Anthropic instances during ${phrase} collaborative sessions.`,
  metadataEndpoint: `${domain.protocol}://${domain.name}/metadata?collection=reflections`,
  routePath: `/${meta.source.path}/${meta.reflections.path}`,
  sectionId: meta.reflections.path,
  sectionPath: meta.reflections.path,
  sectionTitle: meta.reflections.title,
  tagsSectionTitle: meta.reflections.title,
  template: 'reflection'
}

const getEntries = () => getPosts(collection)
const getReflectionPageMap = () => getPostPageMap(collection)
const getTags = () => genericGetTags(collection)
const Reflections = props => <Posts collection={collection} {...props} />
const renderIndexPage = date => genericRenderIndexPage(collection, date)
const Tags = () => <GenericTags collection={collection} />

export {
  collection as reflectionsCollection,
  getEntries,
  getReflectionPageMap,
  getTags,
  Reflections,
  renderIndexPage,
  Tags,
  Title
}
