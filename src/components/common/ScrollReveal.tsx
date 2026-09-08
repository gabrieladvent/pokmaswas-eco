import { useRef } from 'react'
import type { ElementType, ReactNode } from 'react'

import { createRevealAnimation } from '@/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

export interface ScrollRevealProps {
  readonly children: ReactNode
  readonly className?: string
  readonly as?: ElementType
  readonly selector?: string
  readonly y?: number
  readonly stagger?: number
}

export function ScrollReveal({
  children,
  className,
  as: Tag = 'div',
  selector = ':scope > *',
  y = 34,
  stagger = 0.09,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollAnimation(
    ref,
    (root) => {
      createRevealAnimation(root, { selector, y, stagger })
    },
    [selector, y, stagger],
  )

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  )
}
