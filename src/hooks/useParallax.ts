import type { RefObject } from 'react'

import { createParallax } from '@/animations/parallaxAnimations'
import { useScrollAnimation } from './useScrollAnimation'

export interface ParallaxOptions {
  readonly distance?: number
  readonly desktopOnly?: boolean
}

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
