/**
 * @fileoverview Configuration variables for the website.
 *
 * Defines global site configuration including search, analytics, domain, and profiles.
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

export const cloudflare = {
  bucket: {
    cdn: {
      prefixes: [
        'blog',
        'claude/reflections'
      ],
      url: 'https://cdn.axivo.com/public'
    },
    metadata: {
      blog: 'metadata/blog.json',
      reflections: 'metadata/reflections.json'
    },
    name: 'axivo-website'
  },
  cache: {
    prefixes: [
      '/'
    ]
  },
  kv: {
    namespace: {
      id: '48b9b8b3167243678d0b47d68f4cc4f9'
    }
  },
  zone: {
    acme: {
      environment: 'production'
    },
    subdomain: 'preview'
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
  brand: {
    name: 'AXIVO'
  },
  profile: {
    architect: {
      avatar: 'https://github.com/fmunteanu.png',
      homepage: 'https://floren.ca',
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
