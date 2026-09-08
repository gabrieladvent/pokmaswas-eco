import { MEDIA, gsap } from '@/lib/gsap'

export interface TextRevealConfig {
  readonly selector?: string
  readonly stagger?: number
  readonly start?: string
  readonly duration?: number
  readonly blur?: boolean
  readonly trigger?: Element
}

export function createLineReveal(root: Element, config: TextRevealConfig = {}): void {
  const { selector = '[data-line]', stagger = 0.1, start = 'top 78%', duration = 1.35 } = config
  const lines = root.querySelectorAll(selector)
  if (lines.length === 0) return

  gsap.from(lines, {
    yPercent: 115,
    duration,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger: config.trigger ?? root, start, once: true },
  })
}

export function createWordReveal(root: Element, config: TextRevealConfig = {}): void {
  const {
    selector = '[data-word]',
    stagger = 0.055,
    start = 'top 80%',
    duration = 1.25,
    blur = true,
  } = config

  const words = root.querySelectorAll(selector)
  if (words.length === 0) return

  const trigger = config.trigger ?? root

  const base = {
    yPercent: 108,
    duration,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger, start, once: true },
  } as const

  const mm = gsap.matchMedia()

  if (blur) {
    mm.add(MEDIA.desktop, () => {
      gsap.from(words, { ...base, filter: 'blur(12px)', opacity: 0 })
    })

    mm.add(MEDIA.belowDesktop, () => {
      gsap.from(words, base)
    })
    
    return
  }

  gsap.from(words, base)
}
