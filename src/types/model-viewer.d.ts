import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerAttributes = {
  src?: string
  alt?: string
  poster?: string
  loading?: 'lazy' | 'eager'
  'camera-controls'?: boolean | ''
  'auto-rotate'?: boolean | ''
  'rotation-per-second'?: string
  'shadow-intensity'?: string
  exposure?: string
  'interaction-prompt'?: 'auto' | 'when-focused' | 'none'
  'touch-action'?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & ModelViewerAttributes,
        HTMLElement
      >
    }
  }
}

export {}
