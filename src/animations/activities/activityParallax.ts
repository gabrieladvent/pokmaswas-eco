import { MEDIA, gsap } from '@/lib/gsap'

/**
 * Parallax untuk gambar bercerita.
 *
 * Menggeser `[data-parallax-shift]` di dalam bingkainya yang ter-clip.
 * Elemen di dalamnya dibuat lebih besar dari bingkai, jadi gerakan ini
 * tidak pernah menyingkap tepi kosong.
 */
export function createStoryParallax(root: Element, selector = '[data-parallax]'): void {
  const frames = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    // Elemen `display: none` berukuran nol; membuat ScrollTrigger untuknya
    // menghasilkan start dan end di titik yang sama.
    (frame) => frame.getClientRects().length > 0,
  )
  if (frames.length === 0) return

  const mm = gsap.matchMedia()

  const build = (travel: number) => () => {
    for (const frame of frames) {
      const shift = frame.querySelector('[data-parallax-shift]') ?? frame
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

  mm.add(MEDIA.desktop, build(14))
  mm.add(MEDIA.tablet, build(8))
  // Ponsel tidak mendapat parallax gambar: biayanya nyata, hasilnya nyaris
  // tidak terlihat pada layar setinggi itu.
}

/** Dorongan lambat pada hero halaman kegiatan. */
export function createDetailHeroParallax(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  gsap.matchMedia().add(MEDIA.desktop, () => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(q('[data-detail-hero-image]'), { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
      .to(q('[data-detail-hero-copy]'), { yPercent: -28, opacity: 0.15, ease: 'none' }, 0)
      .to(q('[data-detail-hero-scrim]'), { opacity: 1, ease: 'none' }, 0)
  })
}
