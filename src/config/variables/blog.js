/**
 * @fileoverview Configuration variables for the blog section.
 *
 * Defines section metadata and repository URLs for the blog
 * authored by Floren Munteanu, AXIVO's architect.
 */

import { meta as globalMeta } from '@axivo/website/global'

export const meta = {
  ...globalMeta,
  source: {
    path: 'blog',
    title: 'Blog'
  }
}

export const repository = {
  home: `github.com/axivo/${meta.source.path}`,
  tag: 'main'
}
