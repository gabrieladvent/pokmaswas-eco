import { VisitorNumber } from './VisitorNumber'
import { cn } from '@/lib/utils'

export interface VisitorCounterProps {
  readonly value: number | null
  readonly label: string
  readonly caption: string
  readonly className?: string
}

/**
 * Satu angka statistik beserta riaknya.
 *
 * Bila `value` bernilai `null`, layanan penghitung sedang tidak terjangkau.
 * Yang tampil hanyalah keterangannya — tanpa galat, tanpa angka nol yang
 * menyesatkan.
 */
export function VisitorCounter({ value, label, caption, className }: VisitorCounterProps) {
  return (
    <article data-visitor-block className={cn('relative', className)}>
      {/* Riak: lingkaran yang menyebar di belakang angka. */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-6 -top-10 h-56">
        <span
          data-visitor-ripple
          className="absolute top-1/2 left-16 block size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-seafoam/15"
        />
        <span
          data-visitor-ripple
          className="absolute top-1/2 left-16 block size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-seafoam/10"
        />
        <span
          data-visitor-ripple
          className="absolute top-1/2 left-16 block size-88 -translate-x-1/2 -translate-y-1/2 rounded-full border border-seafoam/[0.06]"
        />
      </div>

      <p className="relative font-display text-[clamp(3rem,7vw,5.5rem)] leading-none font-extrabold text-offwhite">
        {value === null ? (
          <span aria-hidden="true" className="text-offwhite/25">
            —
          </span>
        ) : (
          <VisitorNumber value={value} />
        )}
      </p>

      <p className="relative mt-6 font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase">
        {label}
      </p>

      <p className="relative mt-3 max-w-xs font-body text-[0.9375rem] leading-relaxed text-offwhite/55">
        {caption}
      </p>
    </article>
  )
}
