/**
 * @fileoverview Configuration variables for the website.
 *
 * Defines allowed search engine crawlers, site domain, and repository URL.
 */

export const algolia = {
  apiKey: '51d69e02f96e27f314a79f2ca94af098',
  appId: 'UKP1GAEB9S',
  indexName: 'docs'
}

export const analytics = {
  id: 'G-8N53WYKXE6'
}

export const author = {
  linkedin: 'https://www.linkedin.com/in/florenmunteanu/',
  name: 'Floren Munteanu'
}

export const crawlers = [
  'Bingbot',
  'DuckDuckBot',
  'Googlebot',
  'Slurp'
]

export const domain = 'axivo.com'

export const repository = {
  home: 'github.com/axivo/website',
  tag: 'main'
}
