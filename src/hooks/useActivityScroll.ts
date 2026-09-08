import type { RefObject } from 'react'

import {
  createActivityStory,
  createStoryImageReveal,
  createStoryOutro,
  createStoryParallax,
} from '@/animations/activities'
import { useScrollAnimation } from './useScrollAnimation'

export function useActivityScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: readonly unknown[] = [],
): void {
  useScrollAnimation(
    ref,
    (root) => {
      createActivityStory(root)
      createStoryImageReveal(root)
      createStoryParallax(root)
      createStoryOutro(root)
    },
    deps,
  )
}
