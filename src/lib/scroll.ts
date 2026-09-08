import type Lenis from 'lenis'

/**
 * Module-level handle on the single Lenis instance.
 *
 * `useLenis` owns the lifecycle; everything else (navigation links, the
 * mobile menu, the lightbox) only needs to scroll or pause, so they read
 * the instance from here rather than threading it through props.
 */
let instance: Lenis | null = null

export function setLenis(next: Lenis | null): void {
  instance = next
}

export function getLenis(): Lenis | null {
  return instance
}

/** Scrolls to an in-page target. Falls back to native scrolling when
 *  Lenis is inactive (reduced motion, or before mount). */
export function scrollToSection(href: string): void {
  const target = document.querySelector(href)
  if (!(target instanceof HTMLElement)) return

  if (instance) {
    instance.scrollTo(target, { offset: 0, duration: 1.4 })
    return
  }

  target.scrollIntoView({ behavior: 'auto', block: 'start' })
}

/** Freezes scrolling behind overlays (mobile menu, lightbox). */
export function lockScroll(): void {
  instance?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll(): void {
  instance?.start()
  document.documentElement.style.overflow = ''
}
