/**
 * @fileoverview Shared site configuration components.
 *
 * Provides the global footer used across all website sections.
 */

import { Footer } from 'nextra-theme-docs'

export const footer = (
  <Footer>
    <div>
      <p style={{ fontSize: '0.85rem' }}><b>Copyright © {new Date().getFullYear()} AXIVO</b></p>
      <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>All product names, logos, and brands are property of their respective owners, used for identification purposes only.</p>
    </div>
  </Footer>
)
