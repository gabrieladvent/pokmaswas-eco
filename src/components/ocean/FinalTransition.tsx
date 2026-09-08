import { useRef } from 'react'

import { createFinalTransition } from '@/animations'
import { SplitHeading } from '@/components/common/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { photo } from '@/lib/utils'
import { UnderwaterFX } from './UnderwaterFX'

const ASCENT_PHOTO = 'photo-1559825481-12a05cc00344'

/**
 * Kenaikan.
 *
 * Setelah kegiatan lapangan dan masyarakat, perjalanan kembali ke laut —
 * kali ini menghadap ke atas. Kolom cahaya dari permukaan tumbuh mengikuti
 * scroll, jadi bagian ini terbaca sebagai naik menuju terang, kebalikan
 * dari `OceanTransition` yang membawa pembaca turun.
 *
 * Sama seperti transisi turun, salinannya ditahan di kotak sticky setinggi
 * viewport, dan lapis dekoratif ter-clip di wadahnya sendiri agar sticky
 * tetap bekerja.
 */
export function FinalTransition() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createFinalTransition(root)
  })

  return (
    <section
      ref={ref}
      aria-labelledby="final-transition-heading"
      className="relative min-h-[185svh] bg-deep"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-final-image className="absolute inset-[-8%] opacity-25">
          <img
            src={photo(ASCENT_PHOTO, 1800)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Cahaya permukaan — tumbuh dari atas seiring pembaca naik. */}
        <div
          data-final-light
          className="absolute inset-x-0 top-0 h-[85%] origin-top bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(153,246,228,0.3),transparent_70%)]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-deep via-deep/40 to-deep" />

        <UnderwaterFX />
      </div>

      <div className="sticky top-0 flex h-svh items-center justify-center">
        <div data-final-copy className="mx-auto w-full max-w-5xl px-6 text-center sm:px-8">
          <p
            data-reveal
            className="mb-9 font-body text-[0.6875rem] tracking-[0.28em] text-seafoam/80 uppercase"
          >
            Konservasi · Masa depan
          </p>

          <SplitHeading
            id="final-transition-heading"
            lines={['Apa yang kita jaga hari ini,', 'akan menjadi kehidupan esok.']}
            reveal="word"
            className="text-white drop-shadow-lg"
          />

          <p data-reveal className="mx-auto mt-10 max-w-xl font-body text-lead text-white/70">
            Bukan hasil yang bisa dilihat dalam semusim. Tetapi setiap pengawasan hari ini
            menentukan apa yang masih tersisa untuk mereka yang datang kemudian.
          </p>
        </div>
      </div>
    </section>
  )
}
