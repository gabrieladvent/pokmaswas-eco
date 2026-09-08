import { useEffect, useRef } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'

/**
 * Tarikan magnetik ringan ke arah kursor.
 *
 * Digerakkan `gsap.quickTo` — satu tween yang dipakai ulang tiap frame,
 * bukan state React, jadi menggerakkan tetikus tidak pernah memicu render.
 *
 * Hanya aktif untuk penunjuk presisi: pada layar sentuh tidak ada kursor
 * untuk ditarik, dan efeknya justru membuat ketukan terasa meleset.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const ctx = gsap.context(() => {
      const moveX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' })
      const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' })

      const onMove = (event: PointerEvent): void => {
        const rect = element.getBoundingClientRect()
        moveX((event.clientX - (rect.left + rect.width / 2)) * strength)
        moveY((event.clientY - (rect.top + rect.height / 2)) * strength)
      }

      const onLeave = (): void => {
        moveX(0)
        moveY(0)
      }

      element.addEventListener('pointermove', onMove, { passive: true })
      element.addEventListener('pointerleave', onLeave)

      return () => {
        element.removeEventListener('pointermove', onMove)
        element.removeEventListener('pointerleave', onLeave)
      }
    }, element)

    return () => ctx.revert()
  }, [strength])

  return ref
}
