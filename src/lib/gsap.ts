import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Registering here — and only here — keeps plugin setup out of components
   and guarantees it has run before any animation module is used. */
gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/** Breakpoints shared by `gsap.matchMedia()` and the React-side hooks. */
export const MEDIA = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  /** Everything below desktop — simplified motion. */
  belowDesktop: '(max-width: 1023px)',
  motionOk: '(prefers-reduced-motion: no-preference)',
} as const

export { gsap, ScrollTrigger }
