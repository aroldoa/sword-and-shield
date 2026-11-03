import {createElement, type ComponentType, type ReactNode} from 'react'

/** Show a remote image URL in Studio list/document previews. */
export function urlMedia(
  url?: string | null,
  Fallback?: ComponentType | ReactNode,
): ReactNode {
  if (url) {
    return createElement('img', {
      src: url,
      alt: '',
      style: {objectFit: 'contain', width: '100%', height: '100%'},
    })
  }
  if (!Fallback) return undefined
  if (typeof Fallback === 'function') {
    return createElement(Fallback as ComponentType)
  }
  return Fallback
}
