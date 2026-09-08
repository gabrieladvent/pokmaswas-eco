import type { LucideIcon } from 'lucide-react'

export interface Role {
  readonly id: string
  readonly number: string
  readonly title: string
  readonly description: string
  readonly icon: LucideIcon
  readonly image: string
  readonly imageAlt: string
}
