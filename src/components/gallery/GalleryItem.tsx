import { Maximize2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { GalleryImage, GallerySpan } from '@/types'

const SPANS: Record<GallerySpan, string> = {
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  regular: 'col-span-1 row-span-1',
}

export interface GalleryItemProps {
  readonly image: GalleryImage
  readonly index: number
  readonly onOpen: (index: number) => void
}

export function GalleryItem({ image, index, onOpen }: GalleryItemProps) {
  return (
    <button
      type="button"
      data-gallery-item
      data-cursor="view"
      onClick={() => onOpen(index)}
      aria-label={`Perbesar foto: ${image.caption}`}
      className={cn(
        'group relative block overflow-hidden rounded-sm bg-deep text-left',
        SPANS[image.span],
      )}
    >
      <div data-gallery-image className="absolute inset-[-8%]">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <span
        aria-hidden="true"
        className="absolute top-4 right-4 flex size-9 translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        <Maximize2 className="size-4" />
      </span>

      <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="font-display text-base font-bold text-offwhite">{image.caption}</p>
        <p className="mt-1 font-body text-[0.6875rem] tracking-[0.2em] text-seafoam/80 uppercase">
          {image.location}
        </p>
      </div>

      <span aria-hidden="true" className="block h-full w-full" />
    </button>
  )
}
