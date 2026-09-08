import type { RefObject } from 'react'

import {
  createActivityStory,
  createStoryImageReveal,
  createStoryOutro,
  createStoryParallax,
} from '@/animations/activities'
import { useScrollAnimation } from './useScrollAnimation'

/**
 * Merangkai seluruh gerakan sebuah cerita lapangan ke satu titik pasang.
 *
 *   ActivityStory → useActivityScroll → ScrollTrigger
 *                                     → progres bab
 *                                     → reveal teks
 *                                     → pergantian gambar
 *
 * Cleanup-nya ditangani `useScrollAnimation`, yang membungkus semuanya di
 * dalam `gsap.context()`.
 */
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
