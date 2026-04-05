/**
 * @fileoverview MDX component overrides for the website.
 *
 * Replaces default Nextra components with custom implementations.
 * Blockquotes use the Callout component with GitHub alert support,
 * and h1 headings use the PageTitle component with copy-page support.
 */

import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { withGitHubAlert } from 'nextra/components'
import { Callout } from './src/components/Callout'
import { PageTitle } from './src/components/PageTitle'
import { SourceCodeSetter } from './src/components/SourceCode'

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
    blockquote: withGitHubAlert(
      (props) => <Callout {...props} />,
      docsComponents.blockquote
    ),
    h1: PageTitle,
    wrapper: ({ sourceCode, ...props }) => (
      <>
        <SourceCodeSetter sourceCode={sourceCode} />
        <NextraWrapper {...props} sourceCode={sourceCode} />
      </>
    ),
    ...components
  }
}

export { useMDXComponents }
