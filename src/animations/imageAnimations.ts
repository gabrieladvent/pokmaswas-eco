import { MEDIA, gsap } from '@/lib/gsap'

export interface ImageRevealConfig {
  readonly selector?: string
  readonly start?: string
  readonly stagger?: number
  readonly duration?: number
  readonly scale?: number
  readonly parallax?: boolean
  readonly distance?: number
}

export function createImageReveal(root: Element, config: ImageRevealConfig = {}): void {
  const {
    selector = '[data-reveal-frame]',
    start = 'top 85%',
    stagger = 0.12,
    duration = 1.5,
    scale = 1.18,
    parallax = true,
    distance = 14,
  } = config

  const frames = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (frame) => frame.getClientRects().length > 0,
  )
  if (frames.length === 0) return

  frames.forEach((frame, index) => {
    const image = frame.querySelector('[data-reveal-image]')

    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start, toggleActions: 'play none none none' },
      delay: index * stagger,
    })

    tl.from(frame, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration,
      ease: 'expo.out',
    })

    if (image) {
      tl.from(image, { scale, duration: duration * 1.2, ease: 'expo.out' }, 0)
    }
  })

  if (!parallax) return

  const mm = gsap.matchMedia()

  const build = (travel: number) => () => {
    for (const frame of frames) {
      const shift = frame.querySelector('[data-reveal-shift]')
      if (!shift) continue

      gsap.fromTo(
        shift,
        { yPercent: -travel / 2 },
        {
          yPercent: travel / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }
  }

  mm.add(MEDIA.desktop, build(distance))
  mm.add(MEDIA.tablet, build(distance * 0.55))
}
