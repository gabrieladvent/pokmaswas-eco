import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Eyebrow
 * ------------------------------------------------------------------ */

export interface EyebrowProps {
  readonly children: ReactNode
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

/**
 * Cara judul ini masuk.
 *
 * Pilihannya bukan soal selera: tiap bagian memakai watak yang berbeda
 * supaya pembaca tidak melihat gerakan yang sama berulang kali sepanjang
 * halaman. Lihat `src/animations/reveals.ts`.
 *
 * - `line` — baris terangkat dari balik tepinya sendiri.
 * - `word` — kata demi kata, untuk judul yang ingin dibaca perlahan.
 * - `mask` — tersingkap mendatar, seperti air surut dari batu.
 * - `depth` — datang dari kejauhan, kabur lalu jernih.
 */
export type RevealMode = 'line' | 'word' | 'mask' | 'depth'

const SIZES: Record<HeadingSize, string> = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
}

export interface SplitHeadingProps {
  readonly lines: readonly string[]
  readonly level?: 'h1' | 'h2' | 'h3'
  readonly size?: HeadingSize
  readonly className?: string
  readonly id?: string
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
      {lines.map((line) => {
        if (reveal === 'mask' || reveal === 'depth') {
          // Keduanya menganimasikan barisnya utuh — `clip-path` pada mask,
          // skala dan blur pada depth — jadi tidak perlu dipecah lebih
          // kecil, dan tidak butuh pembungkus `overflow-hidden`.
          return (
            <span
              key={line}
              {...(reveal === 'mask' ? { 'data-mask': '' } : { 'data-depth': '' })}
              className="block"
            >
              {line}
            </span>
          )
        }

        return reveal === 'word' ? (
          <span key={line} className="block">
            {line.split(' ').map((word, index) => (
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
        )
      })}
    </Heading>
  )
}
