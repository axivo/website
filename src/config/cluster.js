/**
 * @fileoverview Configuration variables for the k3s-cluster subsection.
 *
 * Defines section metadata, Ubuntu OS versions, and repository URLs.
 */

import { meta as globalMeta } from '@axivo/website/global'

export const meta = {
  ...globalMeta,
  os: {
    previous_version: '22.04',
    version: '24.04'
  },
  redirects: [],
  source: {
    path: 'k3s-cluster',
    title: 'K3s Cluster'
  }
}

export const repository = {
  applications: {
    home: 'github.com/axivo/k3s-applications',
    tag: 'main'
  },
  home: `github.com/axivo/${meta.source.path}`,
  tag: 'main'
}
