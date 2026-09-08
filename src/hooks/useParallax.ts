import type { RefObject } from 'react'

import { createParallax } from '@/animations/parallaxAnimations'
import { useScrollAnimation } from './useScrollAnimation'

export interface ParallaxOptions {
  /** Total travel in percent of the element's own height. */
  readonly distance?: number
  /** Skip on small screens, where heavy parallax costs more than it gives. */
  readonly desktopOnly?: boolean
}

/**
 * Gives an element a scrubbed vertical parallax tied to its own scroll
 * progress. Reduced-motion and cleanup are handled by `useScrollAnimation`.
 */
export function useParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: ParallaxOptions = {},
): void {
  const { distance = 14, desktopOnly = false } = options

  useScrollAnimation(
    ref,
    (root) => {
      createParallax(root, { distance, desktopOnly })
    },
    [distance, desktopOnly],
  )
}
