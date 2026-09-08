import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Eyebrow
 * ------------------------------------------------------------------ */

export interface EyebrowProps {
  readonly children: ReactNode
  /** Warna diatur di sini; garisnya mewarisi lewat `currentColor`. */
  readonly className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      data-reveal
      className={cn(
        'mb-8 flex items-center gap-3 font-body text-[0.6875rem] font-medium tracking-[0.28em] uppercase',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
      {children}
    </p>
  )
}

/* ------------------------------------------------------------------ *
 * Split heading
 * ------------------------------------------------------------------ */

export type HeadingSize = 'display' | 'title' | 'heading'
export type RevealMode = 'line' | 'word'

const SIZES: Record<HeadingSize, string> = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
}

export interface SplitHeadingProps {
  /** Satu entri per baris visual. */
  readonly lines: readonly string[]
  readonly level?: 'h1' | 'h2' | 'h3'
  readonly size?: HeadingSize
  readonly className?: string
  readonly id?: string
  /**
   * `line` mengangkat seluruh baris sekaligus; `word` memecahnya per kata
   * sehingga bisa di-stagger dan ditajamkan dari blur.
   *
   * Setiap potongan punya mask sendiri (`overflow-hidden`) — itulah yang
   * mengubah translate biasa menjadi "muncul dari bawah".
   */
  readonly reveal?: RevealMode
}

export function SplitHeading({
  lines,
  level: Heading = 'h2',
  size = 'title',
  className,
  id,
  reveal = 'line',
}: SplitHeadingProps) {
  return (
    <Heading id={id} className={cn(SIZES[size], className)}>
      {lines.map((line) =>
        reveal === 'word' ? (
          <span key={line} className="block">
            {line.split(' ').map((word, index) => (
              // Padding bawah memberi ruang untuk descender; margin negatif
              // mengembalikan tinggi baris agar rapat seperti semula.
              <span
                key={`${word}-${index}`}
                className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
              >
                <span data-word className="inline-block">
                  {word}
                </span>
                {index < line.split(' ').length - 1 ? ' ' : null}
              </span>
            ))}
          </span>
        ) : (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <span data-line className="block">
              {line}
            </span>
          </span>
        ),
      )}
    </Heading>
  )
}
