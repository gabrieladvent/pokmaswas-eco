import { MEDIA, SCRUB, gsap } from '@/lib/gsap'
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

  gsap.matchMedia().add(MEDIA.desktop, () => {
    gsap.fromTo(
      q('[data-about-detail]'),
      { yPercent: 10 },
      {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: SCRUB.soft },
      },
    )
  })
}

/* ------------------------------------------------------------------ *
 * Roles — vertical scroll converted to horizontal movement
 * ------------------------------------------------------------------ */

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
        end: () => `+=${overflow()}`,
        pin: true,
        scrub: SCRUB.soft,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${overflow()}`,
          // Nilainya harus sama persis dengan trek kartunya. Sebelumnya
          // bilah ini `scrub: true` sementara treknya tertinggal satu
          // detik, jadi penanda posisi menunjuk kartu yang belum tiba.
          scrub: SCRUB.soft,
        },
      })
    }

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

export function createCommunityAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)

  const path = root.querySelector<SVGPathElement>('[data-chain-path]')
  if (path) {
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
          scrub: SCRUB.soft,
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

  /*
   * Foto mekar dari tengah, bukan berbaris dari kiri atas.
   *
   * `grid: 'auto'` membuat GSAP mengukur sendiri baris dan kolomnya dari
   * posisi elemen, jadi jedanya tetap benar ketika galeri berganti dari
   * tiga kolom ke satu kolom di layar sempit — tanpa perlu memberitahu
   * jumlah kolomnya dari sini.
   */
  gsap.from(items, {
    opacity: 0,
    y: 60,
    scale: 0.96,
    duration: 1.25,
    ease: 'expo.out',
    stagger: { each: 0.07, grid: 'auto', from: 'center' },
    scrollTrigger: {
      trigger: root.querySelector('[data-gallery-grid]'),
      start: 'top 84%',
      once: true,
    },
  })

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
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: SCRUB.soft },
        },
      )
    }
  })
}
