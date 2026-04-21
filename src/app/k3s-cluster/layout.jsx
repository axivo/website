/**
 * @fileoverview Page layout for the k3s-cluster section.
 *
 * Wraps all k3s-cluster pages in the Nextra docs theme Layout with
 * dual logo navbar (AXIVO + K3s Cluster), sidebar from page map,
 * Algolia search, and shared footer.
 */

import { footer, Search, Subnavbar } from '@axivo/website'
import { meta, repository } from '@axivo/website/k3s-cluster'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'

const metadata = {
  title: {
    template: `%s – ${meta.source.title} | ${meta.brand.name}`
  }
}

/**
 * K3s Cluster section layout with docs theme, dual logo navbar, and sidebar.
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
              <img className="title-light" src="/k3s-cluster/title.svg" alt={meta.source.title} width="131" height="32" />
              <img className="title-dark" src="/k3s-cluster/title-dark.svg" alt={meta.source.title} width="131" height="32" />
            </a>
          </>
        }
        projectLink={`https://${repository.home}`}
      />
      <Subnavbar />
    </>
  )
  const pageMap = await getPageMap(`/${meta.source.path}`)
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/main/content`}
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
