/**
 * @fileoverview Video component using Plyr player.
 *
 * Renders media using the Plyr player with support for HTML5 video,
 * HTML5 audio, YouTube, and Vimeo embeds. Plyr is dynamically imported
 * to avoid SSR issues with document access.
 */

'use client'

import { useEffect, useRef } from 'react'
import 'plyr/dist/plyr.css'
import styles from './Video.module.css'

/**
 * Plyr controls configuration matching minimalist layout.
 */
const plyrControls = [
  'play-large',
  'play',
  'progress',
  'duration',
  'mute',
  'volume',
  'settings',
  'airplay',
  'pip',
  'fullscreen'
]

/**
 * Media player component wrapping Plyr for HTML5 video/audio and embeds.
 *
 * @param {object} props
 * @param {string} props.src - Source URL, path, or embed ID
 * @param {string} [props.provider] - Media provider: "youtube" or "vimeo"
 * @param {'video'|'audio'} [props.type='video'] - Media type
 * @param {boolean} [props.autoplay=false] - Whether to autoplay
 * @param {boolean} [props.controls=true] - Whether to show player controls
 * @param {string} [props.crossOrigin] - CORS setting: "anonymous" or "use-credentials"
 * @param {boolean} [props.loop=false] - Whether to loop
 * @param {boolean} [props.muted=false] - Whether to mute
 * @param {boolean} [props.playsInline=true] - Whether to play inline on mobile
 * @param {string} [props.preload='auto'] - Preload behavior: "none", "metadata", or "auto"
 */
function Video({
  src,
  provider,
  type = 'video',
  autoplay = false,
  controls = true,
  crossOrigin,
  loop = false,
  muted = false,
  playsInline = true,
  preload = 'auto'
}) {
  const ref = useRef(null)
  const playerRef = useRef(null)
  useEffect(() => {
    let mounted = true
    if (ref.current && !playerRef.current) {
      import('plyr').then(({ default: Plyr }) => {
        if (mounted && ref.current) {
          playerRef.current = new Plyr(ref.current, { controls: plyrControls })
        }
      })
    }
    return () => {
      mounted = false
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])
  if (type === 'audio') {
    return (
      <div className={styles.container}>
        <audio
          ref={ref}
          autoPlay={autoplay}
          controls={controls}
          crossOrigin={crossOrigin}
          loop={loop}
          muted={muted}
          preload={preload}
        >
          <source src={src} />
        </audio>
      </div>
    )
  }
  if (['youtube', 'vimeo'].includes(provider)) {
    return (
      <div className={styles.container}>
        <div ref={ref} data-plyr-provider={provider} data-plyr-embed-id={src} />
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <video
        ref={ref}
        autoPlay={autoplay}
        controls={controls}
        crossOrigin={crossOrigin}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

export { Video }
