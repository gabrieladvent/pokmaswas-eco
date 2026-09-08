import { MEDIA, gsap } from '@/lib/gsap'
import { createWordReveal } from './textAnimations'

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

  tl.fromTo(
    q('[data-ocean-image]'),
    { opacity: 0 },
    { opacity: 0.55, ease: 'none', duration: 2 },
    0.6,
  )

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
    tl.fromTo(
      q('[data-final-image]'),
      { filter: 'blur(14px)' },
      { filter: 'blur(0px)', ease: 'none', duration: 1.6 },
      0,
    )

    tl.to(q('[data-final-copy]'), { yPercent: -10, ease: 'none', duration: 1 }, 1.4)
  })
}
