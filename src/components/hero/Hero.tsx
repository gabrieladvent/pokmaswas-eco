import { useRef } from 'react'

import { ArrowDown, ArrowRight } from 'lucide-react'

import { createHeroAnimation } from '@/animations'
import { Button } from '@/components/common/Button'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { scrollToSection } from '@/lib/scroll'
import { site } from '@/data/site'
import { HeroBackground } from './HeroBackground'
import { ScrollIndicator } from './ScrollIndicator'

const HEADLINE_LINES = ['Menjaga Laut,', 'Menjaga Kehidupan.'] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createHeroAnimation(root)
  })

  return (
    <section
      id="beranda"
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-deep"
    >
      <HeroBackground />

      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-[100rem] px-6 pt-32 pb-[26vh] sm:px-8 lg:px-12"
      >
        <p
          data-hero-eyebrow
          className="mb-8 flex items-center gap-3 font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase"
        >
          <span aria-hidden="true" className="h-px w-10 bg-seafoam/50" />
          {site.address.village} · {site.address.regency}
        </p>

        <h1 id="hero-heading" data-hero-heading className="text-display max-w-[16ch] text-offwhite">
          {HEADLINE_LINES.map((line) => (
            <span key={line} className="block">
              {line.split(' ').map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                  <span data-hero-word className="inline-block">
                    {word}
                  </span>
                  {index < line.split(' ').length - 1 ? '\u00A0' : null}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          data-hero-subtitle
          className="mt-10 max-w-xl font-body text-lead text-offwhite/75"
        >
          {site.description}
        </p>

        <div data-hero-actions className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            magnetic
            icon={ArrowRight}
            onClick={() => scrollToSection('#tentang')}
            aria-label="Kenali Pokmaswas — menuju bagian tentang kami"
          >
            Kenali Pokmaswas
          </Button>
          <Button
            variant="outline"
            icon={ArrowDown}
            className="text-offwhite"
            onClick={() => scrollToSection('#peran')}
          >
            Jelajahi Perjalanan Kami
          </Button>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
