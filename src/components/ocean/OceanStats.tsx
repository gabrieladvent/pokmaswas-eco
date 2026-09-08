import { useRef } from 'react'

import { createStatsAnimation } from '@/animations'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { SplitHeading } from '@/components/common/SectionHeading'
import { oceanStats } from '@/data/stats'
import { useParallax } from '@/hooks/useParallax'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { photo } from '@/lib/utils'

const BACKDROP_PHOTO = 'photo-1551244072-5d12893278ab'

export function OceanStats() {
  const ref = useRef<HTMLElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useScrollAnimation(ref, (root) => {
    createStatsAnimation(root)
  })
  useParallax(backdropRef, { distance: 12, desktopOnly: true })

  return (
    <Section tone="deep" ref={ref} className="overflow-hidden" ariaLabel="Ringkasan kerja Pokmaswas">
      <div ref={backdropRef} aria-hidden="true" className="absolute inset-[-10%] opacity-25">
        <img
          src={photo(BACKDROP_PHOTO, 1800)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-deep via-deep/85 to-deep" />

      <Container width="wide" className="relative">
        <SplitHeading
          lines={['Empat hal yang', 'kami pegang.']}
          size="heading"
          className="max-w-[18ch] text-offwhite"
        />

        <div data-stats-grid className="mt-20 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {oceanStats.map((stat) => (
            <article key={stat.id} data-stat className="relative pt-8 pr-6 lg:pt-10">
              <span
                data-stat-rule
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block h-px bg-gradient-to-r from-seafoam/70 to-transparent"
              />
              <p
                aria-hidden="true"
                className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none font-extrabold text-seafoam/85"
              >
                {stat.marker}
              </p>
              <h3 className="mt-6 font-display text-xl font-bold text-offwhite">{stat.label}</h3>
              <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-offwhite/55">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        {/*
          Honesty note: these are markers, not measurements. Kept visible
          so the page never implies figures the group has not published.
        */}
        <p className="mt-16 max-w-2xl border-l border-white/12 pl-5 font-body text-xs leading-relaxed text-offwhite/40">
          Angka pada bagian ini adalah penanda urutan, bukan data statistik. Data resmi akan
          ditampilkan di sini setelah tersedia dan terverifikasi.
        </p>
      </Container>
    </Section>
  )
}
