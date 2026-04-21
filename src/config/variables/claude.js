/**
 * @fileoverview Configuration variables for the claude subsection.
 *
 * Defines the source identifier, CCP framework plugins, reflections
 * paths, repository URLs, and skill mappings.
 */

export const source = {
  path: 'claude',
  title: 'Claude Collaboration Platform'
}

export const plugins = {
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
}

export const reflections = {
  path: `/${source.path}/reflections`,
  section: '/reflections',
  title: 'Reflections'
}

export const repository = {
  home: `github.com/axivo/${source.path}`,
  reflections: {
    home: 'github.com/axivo/claude-reflections',
    tag: 'main'
  },
  tag: 'v1.2.1'
}

export const skills = {
  conversation: 'conversation-log',
  initialization: 'framework-initialization',
  methodology: 'framework-methodology',
  review: 'code-review'
}
