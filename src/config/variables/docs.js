/**
 * @fileoverview Configuration variables for the website.
 *
 * Defines allowed search engine crawlers, site domain, and repository URL.
 */

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

export const author = {
  linkedin: 'https://www.linkedin.com/in/florenmunteanu/',
  name: 'Floren Munteanu'
}

export const cloudflare = {
  r2: {
    bucket: 'axivo-website'
  }
}

export const crawlers = [
  '*'
]

export const domain = 'axivo.com'

export const repository = {
  home: 'github.com/axivo/website',
  tag: 'main'
}
