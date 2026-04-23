/**
 * @fileoverview Page layout for the claude section.
 *
 * Wraps all claude pages in the Nextra docs theme Layout with
 * dual logo navbar (AXIVO + Claude), sidebar from page map,
 * Algolia search, and shared footer.
 */

import { footer, Navbar, NavbarMenuItems, Search, Subnavbar } from '@axivo/website'
import { getReflectionPageMap, meta, repository, sortYears } from '@axivo/website/claude'
import { getPageMap, normalizePageMap } from 'nextra/page-map'
import { Layout } from 'nextra-theme-docs'

const metadata = {
  title: {
    template: `%s – ${meta.source.title} | ${meta.brand.name}`
  }
}

/**
 * Claude section layout with docs theme, dual logo navbar, and sidebar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Page content
 */
async function PageLayout({ children }) {
  const navbar = (
    <>
      <Navbar
        logoLink={false}
        logo={
          <>
            <a href="/" style={{ display: 'inline-flex' }}>
              <img className="title-light" src="/home/title.svg" alt={meta.brand.name} width="91" height="32" />
              <img className="title-dark" src="/home/title-dark.svg" alt={meta.brand.name} width="91" height="32" />
            </a>
            <a className="subtitle" href={`/${meta.source.path}`}>
              <img className="title-light" src="/claude/title.svg" alt="Claude" width="78" height="32" />
              <img className="title-dark" src="/claude/title-dark.svg" alt="Claude" width="78" height="32" />
            </a>
          </>
        }
        projectLink={`https://${repository.home}`}
      >
        <NavbarMenuItems site={meta.source.path} />
      </Navbar>
      <Subnavbar />
    </>
  )
  const pageMap = await getPageMap(`/${meta.source.path}`)
  const yearChildren = await getReflectionPageMap()
  const reflectionsFolder = pageMap.find(item => item.name === 'reflections')
  if (reflectionsFolder && yearChildren.length) {
    reflectionsFolder.children = [
      ...reflectionsFolder.children.filter(child => !/^\d{4}$/.test(child.name)),
      ...yearChildren
    ]
    const index = pageMap.indexOf(reflectionsFolder)
    pageMap[index] = sortYears(normalizePageMap(reflectionsFolder))
  }
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/${repository.tag}/content`}
      editLink={null}
      feedback={{ link: `https://${repository.home}/discussions` }}
      footer={footer}
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
