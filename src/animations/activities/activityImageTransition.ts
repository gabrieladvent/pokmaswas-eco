import { MEDIA, gsap } from '@/lib/gsap'

/** Dua cara gambar berganti, dipakai bergantian antar-bab. */
export type ImageTransitionMode = 'fade' | 'clip'

/** Bab genap memudar, bab ganjil tersingkap. Pergantian pola ini yang
 *  membuat rangkaian gambar tidak terasa seperti slideshow. */
export function transitionModeFor(index: number): ImageTransitionMode {
  return index % 2 === 0 ? 'fade' : 'clip'
}

/**
 * Memindahkan panggung gambar ke bab tertentu.
 *
 * Lapisan yang keluar selalu memudar; yang masuk boleh memudar atau
 * tersingkap lewat clip-path. Keduanya disertai skala yang mengendap,
 * sehingga gambar terasa "mendarat" alih-alih sekadar bertukar.
 *
 * `overwrite: 'auto'` penting di sini: menggulir cepat bisa memicu
 * beberapa pergantian sekaligus, dan tanpa itu tween lama akan terus
 * berjalan dan meninggalkan dua gambar setengah terlihat.
 */
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

/**
 * Menyiapkan kondisi awal panggung: bab pertama terlihat, sisanya tidak.
 *
 * Dijalankan lewat matchMedia supaya blur — yang mahal untuk GPU ponsel —
 * hanya aktif di desktop.
 */
export function primeVisualStage(visuals: readonly HTMLElement[]): void {
  visuals.forEach((visual, index) => {
    gsap.set(visual, { opacity: index === 0 ? 1 : 0, clipPath: 'inset(0% 0% 0% 0%)' })
  })
}

export function usesReducedEffects(): boolean {
  return !window.matchMedia(MEDIA.desktop).matches
}
