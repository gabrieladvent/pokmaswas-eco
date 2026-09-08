import { useEffect, useRef } from 'react'

import { useIsDesktop, useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'

export function Cursor() {
  const isDesktop = useIsDesktop()
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reducedMotion = usePrefersReducedMotion()
  const enabled = isDesktop && hasFinePointer && !reducedMotion

  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    if (!enabled || !ring) return

    const ctx = gsap.context(() => {
      gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 })

      const moveX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
      const moveY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

      let visible = false

      const onPointerMove = (event: PointerEvent): void => {
        if (event.pointerType !== 'mouse') return
        moveX(event.clientX)
        moveY(event.clientY)

        if (!visible) {
          visible = true
          gsap.to(ring, { opacity: 1, duration: 0.3 })
        }

        const target = event.target
        const hit = target instanceof Element ? target.closest('[data-cursor]') : null
        const mode = hit instanceof HTMLElement ? hit.dataset.cursor : undefined

        ring.dataset.mode = mode ?? 'default'
        gsap.to(ring, {
          scale: mode === 'view' ? 1 : mode === 'link' ? 0.6 : 0.42,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }

      const onPointerLeave = (): void => {
        visible = false
        gsap.to(ring, { opacity: 0, duration: 0.25 })
      }

      document.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', onPointerLeave)

      return () => {
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerleave', onPointerLeave)
      }
    }, ring)

    return () => ctx.revert()
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-mode="default"
      className="group pointer-events-none fixed top-0 left-0 z-100 flex size-24 items-center justify-center rounded-full border border-seafoam/60 bg-seafoam/10 opacity-0 backdrop-blur-[1px] will-change-transform"
    >
      <span className="font-body text-[0.625rem] tracking-[0.22em] text-seafoam uppercase opacity-0 transition-opacity duration-300 group-data-[mode=view]:opacity-100">
        Lihat
      </span>
    </div>
  )
}
