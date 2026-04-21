/**
 * @fileoverview Configuration variables for the claude subsection.
 *
 * Defines section metadata, CCP framework plugins, reflections paths,
 * repository URLs, and skill mappings.
 */

import { meta as globalMeta } from '@axivo/website/global'

export const meta = {
  ...globalMeta,
  plugins: {
    analysis: {
      review: {
        command: 'review',
        plugin: 'code-review'
      }
    },
    collaboration: {
      brainstorm: {
        command: 'brainstorm',
        plugin: 'brainstorming'
      },
      log: {
        command: 'log',
        plugin: 'conversation-log'
      }
    },
    framework: {
      init: {
        command: 'init',
        plugin: 'framework'
      },
      package: {
        command: 'package',
        plugin: 'framework'
      }
    }
  },
  reflections: {
    path: 'reflections',
    title: 'Reflections'
  },
  skills: {
    conversation: 'conversation-log',
    initialization: 'framework-initialization',
    methodology: 'framework-methodology',
    review: 'code-review'
  },
  source: {
    path: 'claude',
    title: 'Claude Collaboration Platform'
  }
}

export const repository = {
  home: `github.com/axivo/${meta.source.path}`,
  reflections: {
    home: 'github.com/axivo/claude-reflections',
    tag: 'main'
  },
  tag: 'v1.2.1'
}
