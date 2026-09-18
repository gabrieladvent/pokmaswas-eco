import { MEDIA, SCRUB, gsap } from '@/lib/gsap'

export interface ParallaxConfig {
  readonly distance?: number
  readonly desktopOnly?: boolean
}

export function createParallax(element: Element, config: ParallaxConfig = {}): void {
  const { distance = 14, desktopOnly = false } = config
  const mm = gsap.matchMedia()

  const build = (travel: number) => () => {
    gsap.fromTo(
      element,
      { yPercent: -travel / 2 },
      {
        yPercent: travel / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement ?? element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB.soft,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  mm.add(MEDIA.desktop, build(distance))

  if (!desktopOnly) {
    mm.add(MEDIA.tablet, build(distance * 0.6))
    mm.add(MEDIA.mobile, build(distance * 0.35))
  }
}
