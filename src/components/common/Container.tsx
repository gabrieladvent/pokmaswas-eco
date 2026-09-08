import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full'

export interface ContainerProps {
  readonly children: ReactNode
  readonly width?: ContainerWidth
  readonly className?: string
  readonly as?: ElementType
}

const WIDTHS: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[100rem]',
  full: 'max-w-none',
}

export function Container({
  children,
  width = 'default',
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-6 sm:px-8 lg:px-12', WIDTHS[width], className)}>
      {children}
    </Tag>
  )
}
