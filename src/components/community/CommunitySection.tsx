import { useRef } from 'react'

import { createCommunityAnimation } from '@/animations'
import { Container } from '@/components/common/Container'
import { Section } from '@/components/common/Section'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { communityChain } from '@/data/community'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn, photo } from '@/lib/utils'

const BACKDROP_PHOTO = 'photo-1527004013197-933c4bb611b3'

export function CommunitySection() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createCommunityAnimation(root)
  })

  return (
    <Section tone="ocean" ref={ref} className="overflow-hidden" ariaLabel="Rantai kerja bersama">
      <div aria-hidden="true" className="absolute inset-0 opacity-15">
        <img
          src={photo(BACKDROP_PHOTO, 1800)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ocean via-ocean/90 to-deep" />

      <Container width="default" className="relative">
        <div className="max-w-3xl">
          <Eyebrow className="text-seafoam">Rantai Kerja Bersama</Eyebrow>
          <SplitHeading
            lines={['Tidak ada yang', 'bekerja sendirian.']}
            className="max-w-[15ch] text-offwhite"
          />
          <p data-reveal className="mt-8 max-w-xl font-body text-lead text-offwhite/70">
            Pengawasan laut hanya berjalan bila setiap mata rantai terhubung. Satu putus, sisanya
            ikut melemah.
          </p>
        </div>

        {/* The chain */}
        <div data-chain className="relative mt-24">
          {/* Connector. A stretched viewBox keeps the path resolution
              independent, so the dash animation works at any height. */}
          {/* The wrapper carries the height: an <svg> with `height: auto`
              falls back to its intrinsic 100px instead of stretching. */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-5 w-0.5 [mask-image:linear-gradient(to_bottom,black_88%,transparent)] lg:left-1/2 lg:-translate-x-1/2"
          >
            <svg viewBox="0 0 2 100" preserveAspectRatio="none" className="h-full w-full">
              {/* `non-scaling-stroke` keeps the 2px width honest despite the
                  extreme vertical scaling of the viewBox. */}
              <path
                d="M1 0 V100"
                className="stroke-white/12"
                strokeWidth={2}
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <path
                data-chain-path
                d="M1 0 V100"
                className="stroke-seafoam"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <ol className="relative space-y-14 lg:space-y-20">
            {communityChain.map((node, index) => {
              const isLeft = index % 2 === 0
              const isFinal = index === communityChain.length - 1

              return (
                <li
                  key={node.id}
                  data-chain-node
                  className="relative pl-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20 lg:pl-0"
                >
                  <div
                    className={cn(
                      isLeft ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2 lg:row-start-1',
                    )}
                  >
                    <div data-chain-card>
                      <p
                        aria-hidden="true"
                        className="mb-3 font-body text-[0.625rem] tracking-[0.28em] text-seafoam/60 uppercase"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h3
                        className={cn(
                          'font-display font-extrabold text-offwhite',
                          isFinal
                            ? 'text-[clamp(1.875rem,3.6vw,3rem)] text-seafoam'
                            : 'text-[clamp(1.5rem,2.4vw,2.125rem)]',
                        )}
                      >
                        {node.label}
                      </h3>
                      <p
                        className={cn(
                          'mt-4 font-body text-[0.9375rem] leading-relaxed text-offwhite/60',
                          isLeft ? 'lg:ml-auto' : '',
                          'max-w-md',
                        )}
                      >
                        {node.description}
                      </p>
                    </div>
                  </div>

                  <span
                    data-chain-dot
                    aria-hidden="true"
                    className={cn(
                      'absolute top-1 left-5 z-10 block -translate-x-1/2 rounded-full lg:left-1/2',
                      isFinal
                        ? 'size-5 bg-seafoam ring-8 ring-seafoam/15'
                        : 'size-3 bg-offwhite ring-6 ring-ocean',
                    )}
                  />
                </li>
              )
            })}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
