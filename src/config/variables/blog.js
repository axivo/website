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
    description: phrase => `Posts about engineering decisions and SRE perspectives during ${phrase} collaborative work.`,
    entries: {
      title: 'Blog Entries'
    },
    icon: 'go/GoTelescope',
    path: 'blog',
    related: {
      title: 'Related Posts'
    },
    title: 'Blog'
  }
}

export const repository = {
  home: `github.com/axivo/${meta.source.path}`,
  tag: 'main'
}
