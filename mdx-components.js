/**
 * @fileoverview MDX component overrides for the website.
 *
 * Replaces default Nextra components with custom implementations.
 * Blockquotes use the Callout component with GitHub alert support,
 * and h1 headings use the PageTitle component with copy-page support.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as websiteComponents from '@axivo/website'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { withGitHubAlert } from 'nextra/components'
import { Callout } from './src/components/Callout'
import { PageTitle } from './src/components/PageTitle'
import { SourceCodeSetter } from './src/components/SourceCode'

const docsComponents = getDocsMDXComponents()
const NextraWrapper = docsComponents.wrapper

let timestamps = {}
try {
  timestamps = JSON.parse(readFileSync(join(process.cwd(), '.next/timestamps.json'), 'utf8'))
} catch {
  console.info('Timestamps not available, skipping')
}

/**
 * Returns merged MDX components with custom overrides.
 *
 * @param {object} components - Additional component overrides
 * @returns {object} Merged MDX components
 */
function useMDXComponents(components) {
  return {
    ...docsComponents,
    ...websiteComponents,
    blockquote: withGitHubAlert(
      (props) => <Callout {...props} />,
      docsComponents.blockquote
    ),
    h1: PageTitle,
    wrapper: ({ sourceCode, metadata, ...props }) => {
      const updatedMetadata = { ...metadata }
      if (metadata?.filePath && timestamps[metadata.filePath]) {
        updatedMetadata.timestamp = timestamps[metadata.filePath]
      }
      return (
        <>
          <SourceCodeSetter sourceCode={sourceCode} />
          <NextraWrapper {...props} metadata={updatedMetadata} sourceCode={sourceCode} />
        </>
      )
    },
    ...components
  }
}

export { useMDXComponents }
