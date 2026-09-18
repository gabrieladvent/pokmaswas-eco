import { useRef } from 'react'

import { createAboutAnimation } from '@/animations'
import { Container } from '@/components/common/Container'
import { RevealImage } from '@/components/common/RevealImage'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { photo, photoSrcSet } from '@/lib/utils'

const ABOUT_PHOTO = 'photo-1505142468610-359e7d316be0'
const DETAIL_PHOTO = 'photo-1468413253725-0d5181091126'

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createAboutAnimation(root)
  })

  return (
    <Section id="tentang" tone="sand" ref={ref} className="overflow-hidden">
      <Container width="wide">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Teks */}
          <div>
            <Eyebrow className="text-turquoise">Tentang Kami</Eyebrow>

            <SplitHeading
              lines={['Laut adalah bagian', 'dari kehidupan kami.']}
              reveal="mask"
              className="max-w-[14ch] text-deep"
            />

            <div data-about-body className="mt-10 max-w-xl space-y-6 font-body text-lead text-deep/70">
              <p>
                Pokmaswas San Dominggo adalah kelompok masyarakat pengawas yang tumbuh dari kampung
                di pesisir Larantuka, Flores Timur. Kami bukan lembaga yang datang dari luar — kami
                adalah warga yang setiap hari hidup berdampingan dengan laut ini.
              </p>
              <p>
                Bagi kami, laut bukan sekadar sumber penghidupan. Ia adalah halaman rumah, jalan
                menuju pulau seberang, dan warisan yang dititipkan kepada anak-anak kami. Karena itu
                menjaganya bukan tugas tambahan, melainkan bagian dari cara kami hidup.
              </p>
              <p>
                Bersama nelayan dan pemerintah, kami mengawasi, memantau, dan melaporkan apa yang
                terjadi di perairan sekitar — agar laut yang memberi hari ini masih bisa memberi
                di kemudian hari.
              </p>
            </div>
          </div>

          <div className="relative">
            <RevealImage
              src={photo(ABOUT_PHOTO, 1400)}
              srcSet={photoSrcSet(ABOUT_PHOTO, [640, 1000, 1400])}
              sizes="(min-width: 1024px) 45vw, 90vw"
              alt="Pandangan udara ombak memecah di sepanjang garis pantai berpasir"
              className="aspect-4/5 rounded-sm sm:aspect-3/4 lg:aspect-4/5"
            />

            <div
              data-about-detail
              className="absolute -bottom-10 -left-6 hidden w-44 overflow-hidden rounded-sm shadow-2xl shadow-deep/25 sm:block lg:-left-12 lg:w-56"
            >
              <img
                src={photo(DETAIL_PHOTO, 700)}
                alt="Deretan pohon kelapa di tepi pantai yang sepi"
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>

            <p
              data-about-caption
              className="mt-8 ml-auto max-w-xs font-body text-sm leading-relaxed text-deep/50 sm:text-right"
            >
              Perairan San Dominggo, Larantuka — wilayah pesisir yang menjadi ruang hidup dan ruang
              kerja masyarakat setempat.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
