import { useCallback, useMemo, useRef, useState } from 'react'

import { createGalleryAnimation } from '@/animations'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { galleryImages } from '@/data/gallery'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { GalleryItem } from './GalleryItem'
import { Lightbox } from './Lightbox'

export function GallerySection() {
  const ref = useRef<HTMLElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useScrollAnimation(ref, (root) => {
    createGalleryAnimation(root)
  })

  const lightboxItems = useMemo(
    () =>
      galleryImages.map((image) => ({
        src: image.src,
        alt: image.alt,
        caption: image.caption,
        meta: image.location,
      })),
    [],
  )

  const handleOpen = useCallback((index: number) => setOpenIndex(index), [])
  const handleClose = useCallback(() => setOpenIndex(null), [])
  const handleNavigate = useCallback((index: number) => setOpenIndex(index), [])

  return (
    <Section id="galeri" tone="deep" ref={ref} className="overflow-hidden">
      <Container width="wide">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-seafoam">Galeri</Eyebrow>
            <SplitHeading
              lines={['Laut yang', 'kami jaga.']}
              className="max-w-[13ch] text-offwhite"
            />
          </div>

          <p data-reveal className="max-w-sm font-body text-[0.9375rem] leading-relaxed text-offwhite/55">
            Potret perairan dan pesisir yang menjadi ruang kerja sehari-hari. Pilih salah satu foto
            untuk melihatnya lebih besar.
          </p>
        </div>

        <div
          data-gallery-grid
          className="mt-16 grid auto-rows-[9rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[11rem] lg:auto-rows-[13rem] lg:grid-cols-4 lg:gap-4"
        >
          {galleryImages.map((image, index) => (
            <GalleryItem key={image.id} image={image} index={index} onOpen={handleOpen} />
          ))}
        </div>
      </Container>

      {openIndex !== null ? (
        <Lightbox
          items={lightboxItems}
          index={openIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
          label="Galeri"
        />
      ) : null}
    </Section>
  )
}
