import { gsap, prefersReducedMotion } from '@/lib/gsap'

/**
 * Tirai sambutan surut ke atas dan memperlihatkan Hero di baliknya.
 *
 * `clip-path` dipakai, bukan menggeser panelnya, supaya Hero yang sudah
 * terpasang di bawah terlihat diam di tempat — seolah air yang surut, bukan
 * satu halaman yang tergeser oleh halaman lain.
 *
 * Isinya mulai pergi sebelum tirai bergerak, dan tirai mulai naik sebelum
 * isinya habis. Tumpang tindih itulah yang menghapus jeda mati di ujung
 * pembukaan.
 */
export function createOceanReveal(root: HTMLElement, onComplete: () => void): gsap.core.Timeline {
  if (prefersReducedMotion()) {
    // Tanpa gerakan: hilangkan saja, tanpa transisi.
    onComplete()
    return gsap.timeline()
  }

  const q = gsap.utils.selector(root)

  return gsap
    .timeline({ onComplete })
    .to(q('[data-welcome-content]'), {
      opacity: 0,
      y: -22,
      filter: 'blur(8px)',
      duration: 0.4,
      ease: 'power2.in',
    })
    .to(
      root,
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut' },
      0.12,
    )
    // Pias cahaya menyusul tepi tirai — kesannya permukaan air yang lewat.
    .to(q('[data-welcome-tide]'), { yPercent: -130, duration: 0.7, ease: 'expo.inOut' }, 0.12)
}
