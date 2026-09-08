/** Controls the tile footprint inside the editorial CSS grid. */
export type GallerySpan = 'wide' | 'tall' | 'large' | 'regular'

export interface GalleryImage {
  readonly id: string
  readonly src: string
  readonly alt: string
  readonly caption: string
  readonly location: string
  readonly span: GallerySpan
}
