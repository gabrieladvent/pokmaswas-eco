import { MEDIA, gsap } from '@/lib/gsap'
import { createWordReveal } from './textAnimations'

/**
 * The descent: sand → shallow → turquoise → deep ocean.
 *
 * The colour is driven by scroll progress rather than by discrete
 * sections, so the change is continuous — the viewer is always *between*
 * two depths, never snapping from one to the next. Everything downstream
 * of this section is dark, which is what makes the transition feel like
 * crossing a surface.
 */
export function createOceanTransition(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo(
    root,
    { backgroundColor: '#e8dcc4' },
    { backgroundColor: '#7dd3e8', ease: 'none', duration: 1 },
  )
    .to(root, { backgroundColor: '#0e7490', ease: 'none', duration: 1 })
    .to(root, { backgroundColor: '#06283d', ease: 'none', duration: 1.2 })

  // Underwater photograph surfaces as we sink into it.
  tl.fromTo(
    q('[data-ocean-image]'),
    { opacity: 0 },
    { opacity: 0.55, ease: 'none', duration: 2 },
    0.6,
  )

  // Copy holds the centre of the frame, then sinks past it.
  tl.fromTo(
    q('[data-ocean-copy]'),
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, ease: 'none', duration: 0.9 },
    0.5,
  ).to(q('[data-ocean-copy]'), { opacity: 0, y: -60, ease: 'none', duration: 0.8 }, 2.3)

  gsap.matchMedia().add(MEDIA.desktop, () => {
    tl.to(q('[data-ocean-veil]'), { yPercent: -18, ease: 'none', duration: 3 }, 0)
  })
}

/**
 * Slow push on the closing frame. Small numbers on purpose — the section
 * is the last thing before the footer and should settle, not lurch.
 */
export function createCtaTransition(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  gsap.from(q('[data-cta-content] > *'), {
    opacity: 0,
    y: 40,
    duration: 1.3,
    stagger: 0.12,
    scrollTrigger: { trigger: root, start: 'top 70%', once: true },
  })

  gsap.matchMedia().add(MEDIA.desktop, () => {
    gsap.fromTo(
      q('[data-cta-image]'),
      { yPercent: -8, scale: 1.14 },
      {
        yPercent: 8,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

/**
 * Fades the navbar from transparent to blurred once the hero is behind
 * us. Driven by ScrollTrigger state rather than a scroll listener so it
 * stays in sync with Lenis.
 */
export function createNavbarTransition(
  onChange: (scrolled: boolean) => void,
  triggerDistance = 80,
): void {
  gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: `top+=${triggerDistance} top`,
      end: 'max',
      onToggle: (self) => onChange(self.isActive),
    },
  })
}

/**
 * Kenaikan menuju permukaan — pasangan dari `createOceanTransition`.
 *
 * Cahaya tumbuh dari atas, foto perlahan menajam dari blur, dan salinan
 * ditahan di tengah sebelum akhirnya ikut naik. Semuanya ter-scrub,
 * sehingga menggulir balik benar-benar membalikkan kenaikan itu.
 */
export function createFinalTransition(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createWordReveal(root, { start: 'top 55%', stagger: 0.045 })

  gsap.from(q('[data-reveal]'), {
    opacity: 0,
    y: 26,
    duration: 1.1,
    stagger: 0.12,
    scrollTrigger: { trigger: root, start: 'top 55%', once: true },
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo(
    q('[data-final-light]'),
    { scaleY: 0.35, opacity: 0.2 },
    { scaleY: 1.15, opacity: 1, ease: 'none', duration: 2 },
    0,
  ).fromTo(
    q('[data-final-image]'),
    { opacity: 0.12, scale: 1.14 },
    { opacity: 0.42, scale: 1, ease: 'none', duration: 2.4 },
    0,
  )

  gsap.matchMedia().add(MEDIA.desktop, () => {
    // Blur → tajam hanya di desktop: memburamkan gambar seukuran layar
    // penuh mahal, dan pada layar kecil nyaris tidak terbaca.
    tl.fromTo(
      q('[data-final-image]'),
      { filter: 'blur(14px)' },
      { filter: 'blur(0px)', ease: 'none', duration: 1.6 },
      0,
    )

    // Salinan ikut naik pelan di sepertiga terakhir.
    tl.to(q('[data-final-copy]'), { yPercent: -10, ease: 'none', duration: 1 }, 1.4)
  })
}
