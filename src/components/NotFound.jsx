/**
 * @fileoverview Theme-aware 404 page component.
 *
 * Renders the standard "404 | This page could not be found." message
 * matching Next.js default styling, with colors inherited from
 * Nextra's theme system instead of OS prefers-color-scheme.
 */

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - var(--nextra-navbar-height))'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 500 }}>404</h1>
      <div style={{
        borderLeft: '1px solid currentColor',
        height: '2rem',
        margin: '0 1.25rem',
        opacity: 0.3
      }} />
      <p style={{ fontSize: '0.875rem' }}>This page could not be found.</p>
    </div>
  )
}

export { NotFound }
