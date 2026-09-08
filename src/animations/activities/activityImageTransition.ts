import { MEDIA, gsap } from '@/lib/gsap'

export type ImageTransitionMode = 'fade' | 'clip'

export function transitionModeFor(index: number): ImageTransitionMode {
  return index % 2 === 0 ? 'fade' : 'clip'
}

export function transitionToVisual(
  visuals: readonly HTMLElement[],
  index: number,
  reducedEffects = false,
): void {
  const incoming = visuals[index]
  if (!incoming) return

  const mode = transitionModeFor(index)

  for (const [i, visual] of visuals.entries()) {
    if (i === index) continue
    gsap.to(visual, { opacity: 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
  }

  const image = incoming.querySelector('[data-story-visual-image]')

  if (mode === 'clip') {
    gsap.fromTo(
      incoming,
      { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.05,
        ease: 'expo.out',
        overwrite: 'auto',
      },
    )
  } else {
    gsap.fromTo(
      incoming,
      { opacity: 0 },
      { opacity: 1, duration: 0.85, ease: 'power2.out', overwrite: 'auto', clearProps: 'clipPath' },
    )
  }

  if (image) {
    gsap.fromTo(
      image,
      { scale: 1.08, ...(reducedEffects ? {} : { filter: 'blur(10px)' }) },
      {
        scale: 1,
        ...(reducedEffects ? {} : { filter: 'blur(0px)' }),
        duration: 1.4,
        ease: 'expo.out',
        overwrite: 'auto',
      },
    )
  }
}

export function primeVisualStage(visuals: readonly HTMLElement[]): void {
  visuals.forEach((visual, index) => {
    gsap.set(visual, { opacity: index === 0 ? 1 : 0, clipPath: 'inset(0% 0% 0% 0%)' })
  })
}

export function usesReducedEffects(): boolean {
  return !window.matchMedia(MEDIA.desktop).matches
}
