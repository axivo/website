/**
 * @fileoverview Root layout for the k3s-cluster section.
 *
 * Wraps all k3s-cluster pages in the Nextra docs theme Layout with
 * dual logo navbar (AXIVO + K3s Cluster), sidebar from page map,
 * Algolia search, and shared footer.
 */

import { footer, Search, Subnavbar } from '@axivo/website'
import { repository, source } from '@axivo/website/k3s-cluster'
import { getPageMap } from 'nextra/page-map'
import { Layout, Navbar } from 'nextra-theme-docs'

const metadata = {
  title: {
    template: '%s – K3s Cluster | AXIVO'
  }
}

/**
 * K3s Cluster section layout with docs theme, dual logo navbar, and sidebar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Page content
 */
async function K3sClusterLayout({ children }) {
  const navbar = (
    <>
      <Navbar
        logoLink={false}
        logo={
          <>
            <a href="/" style={{ display: 'inline-flex' }}>
              <img className="title-light" src="/home/title.svg" alt="AXIVO" width="91" height="32" />
              <img className="title-dark" src="/home/title-dark.svg" alt="AXIVO" width="91" height="32" />
            </a>
            <a className="subtitle" href={`/${source.path}`}>
              <img className="title-light" src="/k3s-cluster/title.svg" alt="K3s Cluster" width="131" height="32" />
              <img className="title-dark" src="/k3s-cluster/title-dark.svg" alt="K3s Cluster" width="131" height="32" />
            </a>
          </>
        }
        projectLink={`https://${repository.home}`}
      />
      <Subnavbar />
    </>
  )
  const pageMap = await getPageMap(`/${source.path}`)
  return (
    <Layout
      copyPageButton={false}
      docsRepositoryBase={`https://${repository.home}/blob/main/content`}
      editLink={null}
      feedback={{ link: `https://${repository.home}/discussions` }}
      footer={footer}
      navbar={navbar}
      pageMap={pageMap}
      search={<Search section={source.path} />}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {children}
    </Layout>
  )
}

export { K3sClusterLayout as default, metadata }
