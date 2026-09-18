import { MEDIA, SCRUB, ScrollTrigger, gsap } from '@/lib/gsap'
import { createChapterHeadingReveal, createChapterReveal } from './activityReveal'
import { primeVisualStage, transitionToVisual, usesReducedEffects } from './activityImageTransition'

function syncIndexed(root: Element, selector: string, activeIndex: number): void {
  for (const element of root.querySelectorAll<HTMLElement>(selector)) {
    const index = Number.parseInt(element.dataset.index ?? '-1', 10)
    element.dataset.active = String(index === activeIndex)
  }
}

export function createActivityStory(root: HTMLElement): void {
  createChapterHeadingReveal(root)
  createChapterReveal(root)

  const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
  if (chapters.length === 0) return

  const visuals = Array.from(root.querySelectorAll<HTMLElement>('[data-story-visual]'))
  const track = root.querySelector<HTMLElement>('[data-story-chapters]')
  const bar = root.querySelector<HTMLElement>('[data-progress-bar]')
  const mm = gsap.matchMedia()

  mm.add(MEDIA.desktop, () => {
    if (visuals.length > 0) primeVisualStage(visuals)
  })

  if (bar && track) {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: track,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: SCRUB.tight,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  chapters.forEach((chapter, index) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 58%',
      end: 'bottom 58%',
      invalidateOnRefresh: true,
      onToggle: (self) => {
        chapter.dataset.active = String(self.isActive)
        if (!self.isActive) return

        syncIndexed(root, '[data-progress-count]', index)
        syncIndexed(root, '[data-progress-title]', index)
        syncIndexed(root, '[data-progress-dot]', index)

        if (visuals.length > 0 && window.matchMedia(MEDIA.desktop).matches) {
          transitionToVisual(visuals, index, usesReducedEffects())
        }
      },
    })
  })
}

export function createStoryOutro(root: HTMLElement): void {
  const q = gsap.utils.selector(root)
  const outro = root.querySelector<HTMLElement>('[data-story-outro]')
  if (!outro) return

  gsap.matchMedia().add(MEDIA.desktop, () => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: outro,
          start: 'top 85%',
          end: 'top 30%',
          scrub: SCRUB.soft,
          invalidateOnRefresh: true,
        },
      })
      .to(q('[data-story-stage]'), { opacity: 0.25, ease: 'none' }, 0)
      .fromTo(q('[data-story-tide]'), { yPercent: 100 }, { yPercent: 0, ease: 'none' }, 0)
  })

  gsap.from(outro.querySelectorAll(':scope > *'), {
    opacity: 0,
    y: 26,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: outro, start: 'top 82%', toggleActions: 'play none none none' },
  })
}

export function createActivityTimeline(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('[data-timeline-track]')
  const progress = root.querySelector<HTMLElement>('[data-timeline-progress]')

  if (track && progress) {
    gsap.fromTo(
      progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: track,
          start: 'top 72%',
          end: 'bottom 72%',
          scrub: SCRUB.tight,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-activity-item]'))

  items.forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
    })

    ScrollTrigger.create({
      trigger: item,
      start: 'top 62%',
      end: 'bottom 62%',
      invalidateOnRefresh: true,
      onToggle: (self) => {
        item.dataset.active = String(self.isActive)
      },
    })
  })
}
