import { useEffect } from 'react'

import Lenis from 'lenis'

import { ScrollTrigger, gsap } from '@/lib/gsap'
import { setLenis } from '@/lib/scroll'
import { usePrefersReducedMotion } from './useMediaQuery'

/**
 * Owns the single Lenis instance.
 *
 * Two details matter for correctness:
 *
 * 1. Lenis is driven by GSAP's ticker rather than its own RAF loop, so
 *    scroll position and animation frames are always in the same tick —
 *    without this, scrubbed ScrollTriggers visibly lag the page.
 * 2. `ScrollTrigger.update` is subscribed to Lenis' scroll event, since
 *    Lenis moves content with transforms that ScrollTrigger cannot
 *    observe through native scroll events alone.
 *
 * When the visitor asks for reduced motion we never construct Lenis at
 * all — native scrolling stays untouched.
 */
export function useLenis(): void {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null)
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Touch devices keep their native scrolling: it feels better and
      // avoids fighting the browser's own momentum.
      syncTouch: false,
    })

    setLenis(lenis)

    const onScroll = (): void => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number): void => {
      // GSAP's ticker reports seconds, Lenis expects milliseconds.
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      setLenis(null)
    }
  }, [reducedMotion])
}
