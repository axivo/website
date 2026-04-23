/**
 * @fileoverview Page layout for the home section.
 *
 * Wraps all home pages in the Nextra docs theme Layout with
 * AXIVO logo navbar, sidebar from page map, search, and shared footer.
 */

import { footer, Navbar, NavbarMenuItems, Search, Subnavbar } from '@axivo/website'
import { meta, repository } from '@axivo/website/global'
import { getPageMap } from 'nextra/page-map'
import { Layout } from 'nextra-theme-docs'

/**
 * Home section layout with docs theme, logo navbar, and sidebar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Page content
 */
async function PageLayout({ children }) {
  const navbar = (
    <>
      <Navbar
        logo={
          <>
            <img className="title-light" src="/home/title.svg" alt={meta.brand.name} width="91" height="32" />
            <img className="title-dark" src="/home/title-dark.svg" alt={meta.brand.name} width="91" height="32" />
          </>
        }
        projectLink={`https://${repository.home}`}
      >
        <NavbarMenuItems />
      </Navbar>
      <Subnavbar />
    </>
  )
  const pageMap = await getPageMap()
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/${repository.tag}/docs/content`}
      editLink={null}
      feedback={{ link: `https://${repository.home}/discussions` }}
      footer={footer}
      navbar={navbar}
      pageMap={pageMap}
      search={<Search />}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {children}
    </Layout>
  )
}

export { PageLayout as default }
