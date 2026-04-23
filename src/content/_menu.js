export default {
  explore: {
    action: true,
    items: {
      copyPage: {
        title: 'Copy Page',
        description: 'Copy page content as Markdown',
        action: 'copyPage',
        icon: 'si/SiMarkdown'
      },
      openInClaude: {
        title: 'Open in Claude',
        description: 'Ask questions about this page',
        action: 'openInClaude',
        icon: 'si/SiClaude'
      }
    }
  },
  projects: {
    items: {
      claude: {
        description: 'Scalable framework for Anthropic instances',
        icon: 'si/SiClaude'
      },
      k3sCluster: {
        description: 'Production-ready Kubernetes automation',
        icon: 'si/SiKubernetes'
      }
    }
  }
}
