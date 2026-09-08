/** Kategori yang juga dipakai sebagai filter di `ActivityFilter`. */
export type ActivityCategory =
  | 'Pengawasan'
  | 'Monitoring'
  | 'Edukasi'
  | 'Konservasi'
  | 'Masyarakat'

export interface ActivityPhoto {
  readonly src: string
  readonly alt: string
  readonly caption?: string
}

export interface ActivityChapter {
  readonly id: string
  readonly title: string
  readonly content: readonly string[]
  readonly image?: string
  readonly imageAlt?: string
}

export interface Activity {
  readonly id: string
  readonly slug: string
  readonly date: string
  readonly title: string
  readonly category: ActivityCategory
  readonly location?: string
  readonly excerpt: string
  readonly coverImage: string
  readonly coverAlt: string
  readonly chapters: readonly ActivityChapter[]
  readonly gallery?: readonly ActivityPhoto[]
  readonly featured?: boolean
}
