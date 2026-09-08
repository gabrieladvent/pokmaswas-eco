import { useRef } from 'react'

import { createOceanTransition } from '@/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { photo } from '@/lib/utils'
import { UnderwaterFX } from './UnderwaterFX'

const UNDERWATER_PHOTO = 'photo-1530053969600-caed2596d242'

export function OceanTransition() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createOceanTransition(root)
  })

  return (
    <section
      ref={ref}
      aria-labelledby="ocean-transition-heading"
      className="relative min-h-[200svh] bg-deep"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-ocean-image className="absolute inset-0 opacity-30">
          <img
            src={photo(UNDERWATER_PHOTO, 1800)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          data-ocean-veil
          className="absolute inset-x-0 top-0 h-[120%] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]"
        />

        <UnderwaterFX />
      </div>

      <div className="sticky top-0 flex h-svh items-center justify-center">
        <div data-ocean-copy className="mx-auto w-full max-w-4xl px-6 text-center sm:px-8">
          <p className="mb-8 font-body text-[0.6875rem] tracking-[0.28em] text-white/60 uppercase">
            Dari daratan menuju laut
          </p>
          <h2 id="ocean-transition-heading" className="text-title text-white drop-shadow-lg">
            Menjaga laut dimulai dari masyarakat.
          </h2>
          <p className="mx-auto mt-8 max-w-xl font-body text-lead text-white/75">
            Aturan bisa ditulis di atas kertas, tetapi yang benar-benar menjaga laut adalah
            orang-orang yang setiap hari berada di dekatnya.
          </p>
        </div>
      </div>
    </section>
  )
}
