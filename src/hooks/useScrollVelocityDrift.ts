import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

import { gsap } from '@/lib/gsap'
import { subscribeScrollVelocity } from '@/lib/scrollVelocity'
import { usePrefersReducedMotion } from './useMediaQuery'

export interface ScrollVelocityDriftConfig {
  /** Pergeseran maksimum dalam piksel pada kecepatan gulir penuh. */
  readonly shift?: number
  /** Peregangan maksimum: 0.05 berarti 5% pada kecepatan penuh. */
  readonly stretch?: number
}

/**
 * Menggeser dan meregangkan sebuah lapisan mengikuti kecepatan gulir.
 *
 * Dipakai untuk lapisan suasana air — gelembung, partikel, berkas
 * cahaya. Menggulir cepat menyeret air ikut bergerak, lalu air itu
 * mengendap kembali begitu gulir berhenti. Arah gesernya berlawanan
 * dengan arah gulir, seperti benda tersuspensi yang tertinggal.
 *
 * Yang digerakkan hanya `y` dan `scaleY` pada satu wadah, bukan tiap
 * partikel: partikelnya sudah punya animasi `transform` sendiri dari CSS
 * dan menimpanya di sini akan mematikan animasi tersebut.
 *
 * Foto tidak pernah menjadi sasaran. Meregangkan foto dokumentasi demi
 * efek gulir akan mengubah apa yang tampak terjadi di lapangan.
 */
export function useScrollVelocityDrift(
  ref: RefObject<HTMLElement | null>,
  { shift = 26, stretch = 0.045 }: ScrollVelocityDriftConfig = {},
): void {
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || reducedMotion) return

    // `quickTo` menyiapkan satu tween yang dipakai ulang; menyetel target
    // baru tiap frame lewat `gsap.to` akan membuat tween baru setiap kali.
    const driftTo = gsap.quickTo(element, 'y', { duration: 0.85, ease: 'power3.out' })
    const stretchTo = gsap.quickTo(element, 'scaleY', { duration: 0.85, ease: 'power3.out' })

    const unsubscribe = subscribeScrollVelocity((velocity) => {
      driftTo(-velocity * shift)
      stretchTo(1 + Math.abs(velocity) * stretch)
    })

    return () => {
      unsubscribe()
      gsap.killTweensOf(element)
      gsap.set(element, { clearProps: 'transform' })
    }
  }, [ref, reducedMotion, shift, stretch])
}
