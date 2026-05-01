/**
 * @fileoverview Custom 404 page for the website.
 *
 * Re-exports the shared NotFound component from the website package.
 */

export const metadata = {
  alternates: {
    canonical: '/_not-found'
  }
}

export { NotFound as default } from '@axivo/website'
