/**
 * @fileoverview MDX component overrides for the website.
 *
 * Replaces default Nextra components with custom implementations.
 * Blockquotes use the Callout component with GitHub alert support,
 * and h1 headings use the PageTitle component with copy-page support.
 */

import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { withGitHubAlert } from 'nextra/components'
import * as websiteComponents from '@axivo/website'
import timestamps from './src/generated/timestamps.json' with { type: 'json' }
import { Callout } from './src/components/mdx/Callout'
import { Ordered, Unordered } from './src/components/mdx/List'
import { PageTitle } from './src/components/mdx/PageTitle'
import { SourceCodeSetter } from './src/components/mdx/SourceCode'

const docsComponents = getDocsMDXComponents()
const NextraWrapper = docsComponents.wrapper

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
    ol: Ordered,
    ul: Unordered,
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
