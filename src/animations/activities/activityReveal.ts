import { MEDIA, gsap } from '@/lib/gsap'

export function createChapterReveal(root: Element): void {
  const blocks = root.querySelectorAll<HTMLElement>('[data-chapter-block]')
  if (blocks.length === 0) return

  const mm = gsap.matchMedia()

  const build = (blur: boolean) => () => {
    for (const block of blocks) {
      gsap.from(block, {
        opacity: 0,
        y: 30,
        ...(blur ? { filter: 'blur(8px)' } : {}),
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }
  }

  mm.add(MEDIA.desktop, build(true))
  mm.add(MEDIA.belowDesktop, build(false))
}

export function createChapterHeadingReveal(root: Element): void {
  const headings = root.querySelectorAll<HTMLElement>('[data-chapter-heading]')

  for (const heading of headings) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: heading, start: 'top 86%', toggleActions: 'play none none none' },
    })

    tl.from(heading.querySelector('[data-chapter-index]'), {
      opacity: 0,
      x: -14,
      duration: 0.7,
      ease: 'power3.out',
    })
      .from(
        heading.querySelector('[data-chapter-rule]'),
        { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.inOut' },
        0.05,
      )
      .from(
        heading.querySelector('[data-chapter-name]'),
        { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out' },
        0.12,
      )
  }
}

export function createStoryImageReveal(root: Element, selector = '[data-parallax]'): void {
  const frames = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (frame) => frame.getClientRects().length > 0,
  )

  for (const frame of frames) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: 'top 88%', toggleActions: 'play none none none' },
    })

    tl.from(frame, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' }).from(
      frame.querySelector('img'),
      { scale: 1.16, duration: 1.6, ease: 'expo.out' },
      0,
    )
  }
}
