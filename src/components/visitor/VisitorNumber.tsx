import { useEffect, useRef } from 'react'

import { createCountUp, formatVisitorNumber } from '@/animations/visitor'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export interface VisitorNumberProps {
  readonly value: number
  readonly className?: string
  /** `viewport` menunggu bagiannya terlihat; `immediate` mulai begitu
   *  `active` menjadi benar. */
  readonly trigger?: 'viewport' | 'immediate'
  /** Untuk pemicu `immediate`: kapan hitungannya boleh mulai. */
  readonly active?: boolean
  readonly duration?: number
}

/**
 * Angka yang berhitung naik. Hanya itu tugasnya.
 *
 * Nilai akhirnya juga dirender sebagai teks tersembunyi supaya pembaca
 * layar mendengar angka yang benar sekali saja, alih-alih mengeja setiap
 * nilai antara saat hitungan berjalan.
 */
export function VisitorNumber({
  value,
  className,
  trigger = 'viewport',
  active = true,
  duration = 2,
}: VisitorNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (trigger === 'immediate' && !active) return

    const ctx = gsap.context(() => {
      createCountUp(element, value, { duration, onEnter: trigger === 'viewport' })
    }, element)

    return () => ctx.revert()
  }, [value, trigger, active, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      <span className="sr-only">{formatVisitorNumber(value)}</span>
      <span ref={ref} aria-hidden="true">
        {formatVisitorNumber(0)}
      </span>
    </span>
  )
}
