/**
 * @fileoverview Configuration variables for the website.
 *
 * Defines global site configuration including search, analytics, domain, and profiles.
 */

import { reflections } from "./claude"

export const algolia = {
  apiKey: '94d5f62b378913a136bf09e67182dfc6',
  appId: 'Q87QW4FRL5',
  indices: [{
    name: 'axivo.com',
    searchParameters: {
      hitsPerPage: 50
    }
  }],
  maxResultsPerGroup: 50
}

export const analytics = {
  id: 'G-8N53WYKXE6'
}

export const cloudflare = {
  bucket: {
    metadata: {
      blog: 'metadata/blog.json',
      reflections: 'metadata/reflections.json'
    },
    name: 'axivo-website'
  }
}

export const crawlers = [
  '*'
]

export const domain = {
  name: process.env.NEXT_PUBLIC_DOMAIN,
  protocol: process.env.NEXT_PUBLIC_PROTOCOL
}

export const meta = {
  profile: {
    architect: {
      avatar: 'https://github.com/fmunteanu.png',
      homepage: 'https://www.linkedin.com/in/florenmunteanu/',
      name: 'Floren Munteanu'
    },
    instance: {
      avatar: 'https://github.com/claude.png',
      name: 'Claude'
    }
  }
}

export const repository = {
  home: 'github.com/axivo/website',
  tag: 'main'
}
