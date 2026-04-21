/**
 * @fileoverview Reflections collection binding.
 *
 * Binds the generic post collection helpers in Post.jsx to the reflections
 * collection descriptor and re-exports them under their legacy names so
 * existing callers (route handlers, layouts, MDX) keep working unchanged.
 */

import { reflections } from '@axivo/website/claude'
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
import reflectionStyles from './Reflection.module.css'

const collection = {
  contentPrefix: `src/content/claude${reflections.section}/`,
  describeIndex: phrase =>
    `Reflections written by Anthropic instances during ${phrase} collaborative sessions.`,
  latestTocSectionId: 'latest-reflections',
  metadataEndpoint: `${domain.protocol}://${domain.name}/metadata`,
  routePath: reflections.path,
  sectionId: reflections.section.slice(1),
  sectionPath: reflections.section.slice(1),
  sectionTitle: reflections.title,
  tagsSectionTitle: reflections.title,
  templates: ['blog', 'reflection']
}

const getEntries = () => getPosts(collection)
const getReflectionPageMap = () => getPostPageMap(collection)
const getTags = () => genericGetTags(collection)
const Reflections = props => <Posts collection={collection} {...props} />
const renderIndexPage = date => genericRenderIndexPage(collection, date)
const Tags = () => <GenericTags collection={collection} />

const reflectionsPageSize = postsPageSize

export {
  collection as reflectionsCollection,
  getEntries,
  getReflectionPageMap,
  getTags,
  reflectionsPageSize,
  reflectionStyles,
  Reflections,
  renderIndexPage,
  Tags,
  Title
}
