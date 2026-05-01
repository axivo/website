/**
 * @fileoverview DocSearch component for Algolia-powered search.
 *
 * Replaces Nextra's built-in Pagefind search with Algolia DocSearch,
 * providing a full-featured search modal with keyboard shortcuts,
 * recent searches, and result highlighting.
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDocSearchKeyboardEvents } from '@docsearch/react'
import { createPortal } from 'react-dom'
import '@docsearch/css'
import { algolia } from '@axivo/website/global'
import styles from './Search.module.css'

/**
 * Removes UTM tracking parameters from a link element.
 *
 * @param {string} selector - CSS selector for the target link
 */
function removeTracking(selector) {
  const link = document.querySelector(selector)
  if (link) {
    const url = new URL(link.href)
    url.search = ''
    link.href = url.toString()
  }
}

/**
 * Algolia DocSearch with a custom trigger button styled to match Nextra.
 * Lazy-loads the modal on first open and removes tracking parameters
 * from the Algolia logo link.
 *
 * @param {Object} props
 * @param {string} [props.section] - Section name for faceted search scoping
 */
function Search({ section } = {}) {
  const config = section
    ? { ...algolia, indices: algolia.indices.map(index => ({
        ...index,
        searchParameters: { ...index.searchParameters, facetFilters: [`section:${section}`] }
      }))}
    : algolia
  const [isOpen, setIsOpen] = useState(false)
  const [DocSearchModal, setDocSearchModal] = useState(null)
  const searchButtonRef = useRef(null)
  const onOpen = useCallback(() => {
    import('@docsearch/react').then(({ DocSearchModal: Modal }) => {
      setDocSearchModal(() => Modal)
      setIsOpen(true)
    })
  }, [])
  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  useEffect(() => {
    if (!isOpen) {
      return
    }
    const timer = setTimeout(() => {
      removeTracking('.DocSearch-Logo a')
    }, 0)
    return () => clearTimeout(timer)
  }, [isOpen])
  useDocSearchKeyboardEvents({
    isOpen,
    onClose,
    onOpen,
    searchButtonRef,
  })
  return (
    <>
      <button
        aria-label="Search"
        className={styles.button}
        onClick={onOpen}
        ref={searchButtonRef}
        type="button"
      >
        <span className={styles.placeholder}>Search…</span>
        <kbd className={styles.shortcut}>/</kbd>
      </button>
      {isOpen && DocSearchModal && createPortal(
        <DocSearchModal
          {...config}
          initialScrollY={window.scrollY}
          onClose={onClose}
        />,
        document.body
      )}
    </>
  )
}

export { Search }
