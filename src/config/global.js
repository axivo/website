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

export const cloudflare = {
  analytics: {
    enabled: true,
    token: '45bf7ada7d7f4a59abf6afaf6c87205c'
  },
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

export const google = {
  analytics: {
    enabled: false,
    id: 'G-8N53WYKXE6'
  }
}

export const meta = {
  assets: [
    { destination: '/claude/sitemap.xml', source: '.next/server/app/claude/sitemap.xml.body' },
    { destination: '/fonts/Inter-Bold.ttf', source: 'packages/website/fonts/Inter-Bold.ttf' },
    { destination: '/fonts/Inter-Italic.ttf', source: 'packages/website/fonts/Inter-Italic.ttf' },
    { destination: '/fonts/Inter-Regular.ttf', source: 'packages/website/fonts/Inter-Regular.ttf' },
    { destination: '/fonts/JetBrainsMono-Regular.ttf', source: 'packages/website/fonts/JetBrainsMono-Regular.ttf' },
    { destination: '/apple-icon.png', source: 'src/app/apple-icon.png' },
    { destination: '/icon.svg', source: 'src/app/icon.svg' },
    { destination: '/icon1.png', source: 'src/app/icon1.png' },
    { destination: '/icon2.png', source: 'src/app/icon2.png' },
    { destination: '/manifest.webmanifest', source: '.next/server/app/manifest.webmanifest.body' },
    { destination: '/opengraph-image.png', source: 'src/app/opengraph-image.png' },
    { destination: '/robots.txt', source: '.next/server/app/robots.txt.body' },
    { destination: '/sitemap.xml', source: '.next/server/app/sitemap.xml.body' }
  ],
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
      homepage: 'https://www.anthropic.com/claude',
      name: 'Claude'
    }
  },
  redirects: [
    { source: '/apple-touch-icon-precomposed.png', destination: '/apple-icon.png', permanent: true },
    { source: '/apple-touch-icon.png', destination: '/apple-icon.png', permanent: true }
  ],
  theme: {
    overrides: {
      'github-dark': {
        // Sets var(--x-color-slate-200) color for string tokens
        'string,punctuation.definition.string,string punctuation.section.embedded source': '#e2e8f0'
      },
      'github-light': {
        // Sets var(--x-color-slate-700) color for string tokens
        'string,punctuation.definition.string,string punctuation.section.embedded source': '#314158'
      }
    }
  },
  ttl: {
    301: 86400,
    302: 0,
    307: 0,
    308: 86400,
    404: 60,
    410: 60,
    500: 0,
    502: 0,
    503: 0,
    504: 0
  }
}

export const repository = {
  home: 'github.com/axivo/website',
  tag: 'main'
}
