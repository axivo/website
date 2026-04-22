export default {
  '*': {
    theme: {
      breadcrumb: false
    }
  },
  index: {
    display: 'hidden',
    type: 'page'
  },
  blog: {
    title: 'Blog',
    type: 'page'
  },
  projects: {
    items: {
      claude: {
        title: 'Claude Collaboration Platform',
        href: '/claude'
      },
      k3sCluster: {
        title: 'K3s Cluster',
        href: '/k3s-cluster'
      }
    },
    title: 'Projects',
    type: 'menu'
  }
}
