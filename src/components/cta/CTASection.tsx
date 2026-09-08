import { useRef } from 'react'

import { ArrowRight } from 'lucide-react'

import { createCtaTransition } from '@/animations'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { scrollToSection } from '@/lib/scroll'
import { photo, photoSrcSet } from '@/lib/utils'

const CTA_PHOTO = 'photo-1559827260-dc66d52bef19'

export function CTASection() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createCtaTransition(root)
  })

  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-deep"
    >
      <div data-cta-image aria-hidden="true" className="absolute inset-[-8%] scale-[1.14]">
        <img
          src={photo(CTA_PHOTO, 2000)}
          srcSet={photoSrcSet(CTA_PHOTO, [900, 1400, 2000])}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-deep/72" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-deep via-transparent to-deep-900"
      />

      <div
        data-cta-content
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-32 text-center sm:px-8"
      >
        <p className="mb-8 font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase">
          Bergabung dalam pengawasan
        </p>

        <h2 id="cta-heading" className="text-display text-offwhite">
          Laut adalah rumah kita bersama.
        </h2>

        <p className="mx-auto mt-10 max-w-xl font-body text-lead text-offwhite/75">
          Menjaganya adalah tanggung jawab kita bersama.
        </p>

        <div className="mt-12 flex justify-center">
          <Button magnetic icon={ArrowRight} onClick={() => scrollToSection('#kontak')}>
            Hubungi Pokmaswas
          </Button>
        </div>
      </div>
    </section>
  )
}
