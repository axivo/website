/**
 * @fileoverview Configuration variables for the k3s-cluster subsite.
 *
 * Defines the subsite identifier, Ubuntu OS versions, and repository URLs.
 */

export const subsite = {
  path: 'k3s-cluster',
  title: 'K3s Cluster'
}

export const os = {
  previous_version: '22.04',
  version: '24.04'
}

export const repository = {
  applications: {
    home: 'github.com/axivo/k3s-applications',
    tag: 'main'
  },
  home: `github.com/axivo/${subsite.path}`,
  tag: 'main'
}
