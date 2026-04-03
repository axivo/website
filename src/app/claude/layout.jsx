/**
 * @fileoverview Root layout for the claude section.
 *
 * Wraps all claude pages in the Nextra docs theme Layout with
 * dual logo navbar (AXIVO + Claude), sidebar from page map,
 * Algolia search, and shared footer.
 */

import { footer, Search } from '@axivo/website'
import { repository, subsite } from '@axivo/website/claude'
import { Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'

const metadata = {
  title: {
    template: '%s – Claude Collaboration Platform | AXIVO'
  }
}

/**
 * Claude section layout with docs theme, dual logo navbar, and sidebar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Page content
 */
async function ClaudeLayout({ children }) {
  const navbar = (
    <Navbar
      logoLink={false}
      logo={
        <>
          <a href="/" style={{ display: 'inline-flex' }}>
            <img className="title-light" src="/home/title.svg" alt="AXIVO" width="91" height="32" />
            <img className="title-dark" src="/home/title-dark.svg" alt="AXIVO" width="91" height="32" />
          </a>
          <a className="subtitle" href={`/${subsite.path}`}>
            <img className="title-light" src="/claude/title.svg" alt="Claude" width="78" height="32" />
            <img className="title-dark" src="/claude/title-dark.svg" alt="Claude" width="78" height="32" />
          </a>
        </>
      }
      projectLink={`https://${repository.home}`}
    />
  )
  const pageMap = await getPageMap(`/${subsite.path}`)
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/${repository.tag}/content`}
      editLink={null}
      feedback={{ link: `https://${repository.home}/discussions` }}
      footer={footer}
      navbar={navbar}
      pageMap={pageMap}
      search={<Search index={subsite.path} />}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {children}
    </Layout>
  )
}

export { ClaudeLayout as default, metadata }
