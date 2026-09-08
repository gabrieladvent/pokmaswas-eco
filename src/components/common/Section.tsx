import type { ReactNode, Ref } from 'react'

import { cn } from '@/lib/utils'

export type SectionTone = 'sand' | 'light' | 'ocean' | 'deep' | 'none'

export interface SectionProps {
  readonly id?: string
  readonly children: ReactNode
  readonly tone?: SectionTone
  readonly className?: string
  readonly ref?: Ref<HTMLElement>
  readonly flush?: boolean
  readonly ariaLabel?: string
}

const TONES: Record<SectionTone, string> = {
  sand: 'bg-sand text-deep',
  light: 'bg-offwhite text-deep',
  ocean: 'bg-ocean text-offwhite',
  deep: 'bg-deep text-offwhite',
  none: '',
}

export function Section({
  id,
  children,
  tone = 'none',
  className,
  ref,
  flush = false,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'relative w-full',
        !flush && 'py-(--spacing-section)',
        TONES[tone],
        className,
      )}
    >
      {children}
    </section>
  )
}
