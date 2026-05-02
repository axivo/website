/**
 * @fileoverview Opengraph component for social card image generation.
 *
 * Visual template rendered by Satori through the /og route handler to
 * produce per-page Open Graph images. All styling is inline — Satori
 * does not consume CSS modules, Tailwind classes, or CSS variables at
 * edge runtime, so this component intentionally diverges from the
 * project convention of pairing components with `.module.css` files.
 * Title and description compose onto the static base image with a
 * fade-to-white gradient that gracefully truncates long descriptions
 * regardless of content shape.
 */

/**
 * Renders the OG card layout with title and description overlaid on
 * the base image. The base image carries the AXIVO logo on the right
 * half; this component reserves the right 600px of the canvas for it
 * via the parent container's right padding.
 *
 * @param {object} props
 * @param {string} props.baseUrl - Data URL of the base PNG used as background
 * @param {string} props.description - Page description text
 * @param {string} props.title - Page title text
 * @returns {import('react').ReactElement} OG card JSX tree
 */
function Opengraph({ baseUrl, description, title }) {
  return (
    <div
      style={{
        backgroundImage: `url(${baseUrl})`,
        backgroundSize: '1200px 630px',
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter',
        height: '100%',
        justifyContent: 'center',
        paddingBottom: 0,
        paddingLeft: 114,
        paddingRight: 543,
        paddingTop: 0,
        width: '100%'
      }}
    >
      <div
        style={{
          color: '#000',
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: '-2px',
          lineHeight: 1.1
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          height: 180,
          marginTop: 12,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            color: '#333',
            columnGap: '0.28em',
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.4
          }}
        >
          {renderTokens(parseMarkdown(description))}
        </div>
        <div
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0), #fff)',
            bottom: 0,
            height: 180,
            left: 0,
            position: 'absolute',
            right: 0
          }}
        />
      </div>
    </div>
  )
}

/**
 * Tokenizes a markdown string into per-word segments by formatting
 * type. Recognizes bold (**text**), inline code (`text`), and italic
 * (_text_) in matcher priority order so underscores inside backticks
 * are not re-parsed as italic. Plain, bold, and italic runs are split
 * into one token per word so the renderer can wrap at word boundaries
 * predictably; code runs stay atomic to preserve their bordered-box
 * visual integrity. Returns a flat array of `{type, text}` segments
 * where type is one of 'bold', 'code', 'italic', or 'plain'.
 *
 * @param {string} input - Markdown source string
 * @returns {Array<{type: string, text: string}>} Token segments
 */
function parseMarkdown(input) {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(_[^_]+_)/g
  const tokens = []
  const split = (text, type) => {
    for (const word of text.split(/\s+/).filter(Boolean)) {
      tokens.push({ text: word, type })
    }
  }
  let lastIndex = 0
  let match
  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      split(input.slice(lastIndex, match.index), 'plain')
    }
    if (match[1]) {
      tokens.push({ text: match[1].slice(1, -1), type: 'code' })
    } else if (match[2]) {
      split(match[2].slice(2, -2), 'bold')
    } else if (match[3]) {
      split(match[3].slice(1, -1), 'italic')
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < input.length) {
    split(input.slice(lastIndex), 'plain')
  }
  return tokens
}

/**
 * Renders an array of markdown tokens as styled span elements suitable
 * for Satori. Each token type maps to a specific inline style.
 *
 * @param {Array<{type: string, text: string}>} tokens - Parsed tokens
 * @returns {Array<import('react').ReactElement>} Span elements
 */
function renderTokens(tokens) {
  return tokens.map((token, index) => {
    switch (token.type) {
      case 'bold':
        return <span key={index} style={{ fontWeight: 700, whiteSpace: 'pre-wrap' }}>{token.text}</span>
      case 'code':
        return <span key={index} style={{
          backgroundColor: 'rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.04)',
          borderRadius: 5,
          fontFamily: 'JetBrains Mono',
          fontSize: '0.9em',
          lineHeight: 1.4,
          padding: '2px 6px',
          whiteSpace: 'pre-wrap'
        }}>{token.text}</span>
      case 'italic':
        return <span key={index} style={{ fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>{token.text}</span>
      default:
        return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{token.text}</span>
    }
  })
}

export { Opengraph }
