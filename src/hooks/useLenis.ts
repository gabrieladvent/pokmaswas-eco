import { useEffect } from 'react'

import Lenis from 'lenis'

import { ScrollTrigger, gsap } from '@/lib/gsap'
import { setLenis } from '@/lib/scroll'
import { usePrefersReducedMotion } from './useMediaQuery'

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
      syncTouch: false,
    })

    setLenis(lenis)

    const onScroll = (): void => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number): void => {
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
