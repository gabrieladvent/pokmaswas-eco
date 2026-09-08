import { MEDIA, gsap } from '@/lib/gsap'

export interface ParallaxConfig {
  /** Jarak tempuh dalam persen tinggi elemen. */
  readonly distance?: number
  readonly desktopOnly?: boolean
}

/**
 * Parallax vertikal ter-scrub sepanjang elemen melintasi viewport.
 *
 * Elemen diasumsikan lebih besar dari induknya yang ter-clip (biasanya
 * `inset-[-10%]` di dalam `overflow-hidden`), sehingga gerakannya tidak
 * pernah menyingkap tepi kosong.
 */
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
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  mm.add(MEDIA.desktop, build(distance))

  if (!desktopOnly) {
    // Tablet menyisakan sedikit kedalaman; ponsel kira-kira sepertiganya.
    mm.add(MEDIA.tablet, build(distance * 0.6))
    mm.add(MEDIA.mobile, build(distance * 0.35))
  }
}
