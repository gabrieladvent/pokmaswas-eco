import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(next: Lenis | null): void {
  instance = next
}

export function getLenis(): Lenis | null {
  return instance
}

export function scrollToSection(href: string): void {
  const target = document.querySelector(href)
  if (!(target instanceof HTMLElement)) return

  if (instance) {
    instance.scrollTo(target, { offset: 0, duration: 1.4 })
    return
  }

  target.scrollIntoView({ behavior: 'auto', block: 'start' })
}

export function lockScroll(): void {
  instance?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll(): void {
  instance?.start()
  document.documentElement.style.overflow = ''
}
