/**
 * @fileoverview Source code store for sharing page MDX content.
 *
 * Provides a simple module-level store that bridges the MDX wrapper
 * (which receives the raw page source code) and the Explore dropdown
 * in the Subnavbar (which needs it for the Copy Page action).
 *
 * The wrapper component in mdx-components.js calls setSourceCode,
 * and the Explore component calls useSourceCode to read it.
 */

'use client'

import { useEffect, useState } from 'react'

let currentSourceCode = ''
const listeners = new Set()

/**
 * Sets the current page's source code and notifies listeners.
 *
 * @param {string} code - Raw MDX source code
 */
function setSourceCode(code) {
  currentSourceCode = code
  listeners.forEach(fn => fn(code))
}

/**
 * Component that sets the source code when mounted.
 * Rendered inside the MDX wrapper to capture the sourceCode prop.
 *
 * @param {object} props
 * @param {string} props.sourceCode - Raw MDX source code
 */
function SourceCodeSetter({ sourceCode }) {
  useEffect(() => {
    setSourceCode(sourceCode || '')
  }, [sourceCode])
  return null
}

/**
 * Hook that returns the current page's raw MDX source code.
 * Re-renders when the source code changes.
 *
 * @returns {string} The page source code
 */
function useSourceCode() {
  const [code, setCode] = useState(currentSourceCode)
  useEffect(() => {
    listeners.add(setCode)
    setCode(currentSourceCode)
    return () => listeners.delete(setCode)
  }, [])
  return code
}

export { SourceCodeSetter, useSourceCode }
