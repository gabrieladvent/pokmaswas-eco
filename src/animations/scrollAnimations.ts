import { MEDIA, gsap } from '@/lib/gsap'
import { createImageReveal } from './imageAnimations'
import { createLineReveal, createWordReveal } from './textAnimations'

/* ------------------------------------------------------------------ *
 * Generic reveal
 * ------------------------------------------------------------------ */

export interface RevealConfig {
  readonly selector?: string
  readonly y?: number
  readonly stagger?: number
  readonly start?: string
}

/**
 * Fades and lifts elements as they enter. Used by `ScrollReveal` and as
 * the baseline for sections that need nothing more elaborate.
 */
export function createRevealAnimation(root: Element, config: RevealConfig = {}): void {
  const { selector = '[data-reveal]', y = 34, stagger = 0.09, start = 'top 82%' } = config
  const targets = selector ? root.querySelectorAll(selector) : [root]
  if (targets.length === 0) return

  gsap.from(targets, {
    opacity: 0,
    y,
    duration: 1.15,
    ease: 'power3.out',
    stagger,
    scrollTrigger: { trigger: root, start, once: true },
  })
}

/* ------------------------------------------------------------------ *
 * About — text reveal against a clip-path image
 * ------------------------------------------------------------------ */

export function createAboutAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)
  createImageReveal(root, { distance: 16 })

  gsap.from(q('[data-about-body] > *'), {
    opacity: 0,
    y: 28,
    duration: 1.1,
    stagger: 0.12,
    scrollTrigger: { trigger: q('[data-about-body]'), start: 'top 84%', once: true },
  })

  // Detail yang menimpa datang setelah bingkai utama terbuka, sehingga
  // terbaca sebagai lapisan kedua, bukan bagian dari gambar yang sama.
  gsap.from(q('[data-about-detail]'), {
    opacity: 0,
    y: 40,
    scale: 0.94,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('[data-reveal-frame]'), start: 'top 62%', once: true },
  })

  gsap.from(q('[data-about-caption]'), {
    opacity: 0,
    y: 20,
    duration: 1,
    scrollTrigger: { trigger: q('[data-about-caption]'), start: 'top 92%', once: true },
  })

  // Lapis ketiga: detail bergerak sedikit berlawanan arah dari bingkai
  // utama, yang membuat keduanya terbaca berada pada jarak berbeda.
  gsap.matchMedia().add(MEDIA.desktop, () => {
    gsap.fromTo(
      q('[data-about-detail]'),
      { yPercent: 10 },
      {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  })
}

/* ------------------------------------------------------------------ *
 * Roles — vertical scroll converted to horizontal movement
 * ------------------------------------------------------------------ */

/**
 * Pins the section and translates the track sideways by exactly the
 * amount that overflows the viewport, so the last card lands flush.
 *
 * Desktop only. Below `lg` the component renders a plain vertical stack
 * (see `RolesSection`), which is both cheaper and easier to use on touch.
 */
export function createRolesAnimation(root: HTMLElement): void {
  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)
  createWordReveal(root)

  const mm = gsap.matchMedia()

  mm.add(MEDIA.desktop, () => {
    const track = root.querySelector<HTMLElement>('[data-roles-track]')
    const progress = root.querySelector<HTMLElement>('[data-roles-progress]')
    if (!track) return

    const overflow = (): number => Math.max(0, track.scrollWidth - window.innerWidth)

    const tween = gsap.to(track, {
      x: () => -overflow(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        // Matching scroll distance to pixel distance keeps the sideways
        // speed equal to the reader's scroll speed — that is what makes
        // it feel natural rather than sticky.
        end: () => `+=${overflow()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${overflow()}`, scrub: true },
      })
    }

    // Cards drift in slightly as they approach the centre of the frame.
    for (const card of track.querySelectorAll<HTMLElement>('[data-role-card]')) {
      gsap.from(card.querySelector('[data-role-body]'), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left 88%',
          once: true,
        },
      })
    }
  })

  mm.add(MEDIA.belowDesktop, () => {
    createRevealAnimation(root, { selector: '[data-role-card]', y: 40, stagger: 0.12 })
  })
}

/* ------------------------------------------------------------------ *
 * Ocean statistics
 * ------------------------------------------------------------------ */

/**
 * Markers rise in sequence. Deliberately no counter animation: the values
 * in `data/stats.ts` are editorial markers, not measured figures. Add one
 * here only once real numbers exist.
 */
export function createStatsAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)

  gsap.from(q('[data-stat]'), {
    opacity: 0,
    y: 56,
    duration: 1.2,
    stagger: 0.14,
    scrollTrigger: { trigger: q('[data-stats-grid]'), start: 'top 82%', once: true },
  })

  gsap.from(q('[data-stat-rule]'), {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 1.4,
    ease: 'power3.inOut',
    stagger: 0.14,
    scrollTrigger: { trigger: q('[data-stats-grid]'), start: 'top 82%', once: true },
  })
}

/* ------------------------------------------------------------------ *
 * Community — the chain draws itself
 * ------------------------------------------------------------------ */

/**
 * The connecting line is a real SVG path drawn with a dash offset tied to
 * scroll progress; nodes then pop in one by one as the line reaches them.
 */
export function createCommunityAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)

  const path = root.querySelector<SVGPathElement>('[data-chain-path]')
  if (path) {
    /*
     * The path lives in a viewBox stretched non-uniformly, so
     * `getTotalLength()` reports user units (100) while
     * `vector-effect: non-scaling-stroke` makes the dash pattern resolve
     * in screen pixels. The rendered height is therefore the only value
     * that lines the two up — and it has to be re-read on refresh, since
     * the chain's height changes with the viewport.
     */
    const dashLength = (): number => path.getBoundingClientRect().height || path.getTotalLength()

    gsap.fromTo(
      path,
      { strokeDashoffset: dashLength },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: q('[data-chain]'),
          start: 'top 72%',
          end: 'bottom 82%',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: () => gsap.set(path, { strokeDasharray: dashLength() }),
        },
      },
    )

    gsap.set(path, { strokeDasharray: dashLength() })
  }

  for (const node of root.querySelectorAll<HTMLElement>('[data-chain-node]')) {
    gsap
      .timeline({ scrollTrigger: { trigger: node, start: 'top 80%', once: true } })
      .from(node.querySelector('[data-chain-dot]'), {
        scale: 0,
        opacity: 0,
        duration: 0.75,
        ease: 'back.out(2.2)',
      })
      .from(
        node.querySelector('[data-chain-card]'),
        { opacity: 0, y: 30, duration: 1 },
        0.08,
      )
  }
}

/* ------------------------------------------------------------------ *
 * Gallery
 * ------------------------------------------------------------------ */

export function createGalleryAnimation(root: HTMLElement): void {
  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)

  const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
  if (items.length === 0) return

  gsap.from(items, {
    opacity: 0,
    y: 60,
    duration: 1.2,
    stagger: 0.08,
    scrollTrigger: {
      trigger: root.querySelector('[data-gallery-grid]'),
      start: 'top 84%',
      once: true,
    },
  })

  // Hanyutan pelan di dalam tiap bingkai: potongannya bergerak, ubinnya
  // tidak — sehingga grid tetap rapi sementara isinya terasa hidup.
  gsap.matchMedia().add(MEDIA.desktop, () => {
    for (const item of items) {
      const image = item.querySelector<HTMLElement>('[data-gallery-image]')
      if (!image) continue
      gsap.fromTo(
        image,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }
  })
}
