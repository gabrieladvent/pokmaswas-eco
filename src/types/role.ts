import type { LucideIcon } from 'lucide-react'

export interface Role {
  readonly id: string
  /** Two-digit ordinal shown as an editorial marker, e.g. `01`. */
  readonly number: string
  readonly title: string
  readonly description: string
  readonly icon: LucideIcon
  readonly image: string
  readonly imageAlt: string
}
