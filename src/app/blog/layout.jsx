/**
 * @fileoverview Page layout for the blog section.
 *
 * Wraps all blog pages in the Nextra docs theme Layout with AXIVO logo
 * navbar, sidebar from page map, Algolia search, and shared footer.
 */

import { getPageMap, normalizePageMap } from 'nextra/page-map'
import { Layout } from 'nextra-theme-docs'
import { Footer, Navbar, NavbarMenuItems, Search, Subnavbar } from '@axivo/website'
import { getBlogPageMap, meta, repository, sortYears } from '@axivo/website/blog'

const metadata = {
  title: {
    template: `%s – ${meta.source.title} | ${meta.brand.name}`
  }
}

/**
 * Blog section layout with docs theme, logo navbar, and sidebar.
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
  const rootPageMap = await getPageMap()
  const yearChildren = await getBlogPageMap()
  const blogFolder = rootPageMap.find(item => item.name === meta.source.path)
  if (blogFolder && yearChildren.length) {
    blogFolder.children = [
      ...blogFolder.children.filter(child => !/^\d{4}$/.test(child.name)),
      ...yearChildren
    ]
  }
  const pageMap = rootPageMap.filter(item =>
    !('name' in item) ||
    item.name === meta.source.path ||
    item.type === 'menu'
  )
  const blogIndex = pageMap.indexOf(blogFolder)
  pageMap[blogIndex] = sortYears(normalizePageMap(blogFolder))
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/${repository.tag}/content`}
      editLink={null}
      feedback={{ link: `https://${repository.home}/discussions` }}
      footer={<Footer />}
      navbar={navbar}
      pageMap={pageMap}
      search={<Search section={meta.source.path} />}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {children}
    </Layout>
  )
}

export { PageLayout as default, metadata }
