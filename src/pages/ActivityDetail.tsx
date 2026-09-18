import { useCallback, useRef, useState } from 'react'

import { ArrowLeft, ArrowRight, Images } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import {
  createChapterHeadingReveal,
  createChapterReveal,
  createDetailHeroParallax,
  createStoryImageReveal,
  createStoryParallax,
} from '@/animations/activities'
import { createRevealAnimation } from '@/animations'
import { ActivityCard } from '@/components/activities/ActivityCard'
import { ActivityChapter } from '@/components/activities/ActivityChapter'
import { ActivityImage } from '@/components/activities/ActivityImage'
import { ActivityLightbox } from '@/components/activities/ActivityLightbox'
import { Container } from '@/components/common/Container'
import { PageMeta } from '@/components/common/PageMeta'
import { Section } from '@/components/common/Section'
import { findActivityBySlug, relatedActivities } from '@/data/activities'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn, formatActivityDate } from '@/lib/utils'

export default function ActivityDetail() {
  const { slug } = useParams<{ slug: string }>()
  const activity = findActivityBySlug(slug)

  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)

  const [photoIndex, setPhotoIndex] = useState<number | null>(null)

  useScrollAnimation(heroRef, (root) => {
    createDetailHeroParallax(root)
  })

  useScrollAnimation(
    storyRef,
    (root) => {
      createRevealAnimation(root)
      createChapterHeadingReveal(root)
      createChapterReveal(root)
      createStoryImageReveal(root)
      createStoryParallax(root)
    },
    [slug],
  )

  const handleClose = useCallback(() => setPhotoIndex(null), [])

  if (!activity) {
    return (
      <Section tone="deep" className="flex min-h-[70svh] items-center">
        <PageMeta
          title="Catatan tidak ditemukan — Pokmaswas San Dominggo"
          description="Kegiatan yang Anda cari mungkin sudah dipindahkan atau tautannya keliru."
        />
        <Container width="default" className="text-center">
          <p className="font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase">
            404
          </p>
          <h1 className="mt-6 text-title text-offwhite">Catatan ini tidak ditemukan.</h1>
          <p className="mx-auto mt-6 max-w-md font-body text-lead text-offwhite/60">
            Kegiatan yang Anda cari mungkin sudah dipindahkan atau tautannya keliru.
          </p>
          <Link
            to="/#kegiatan"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-seafoam px-7 py-4 font-body text-[0.9375rem] font-medium text-deep"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Kembali ke daftar kegiatan
          </Link>
        </Container>
      </Section>
    )
  }

  const related = relatedActivities(activity)
  const photoCount = (activity.gallery?.length ?? 0) + 1

  return (
    <>
      {/*
        Tautan kegiatan paling sering dibagikan lewat pesan singkat, dan
        yang muncul di sana adalah judul serta deskripsi halaman ini —
        bukan judul beranda.
      */}
      <PageMeta
        title={`${activity.title} — Pokmaswas San Dominggo`}
        description={activity.excerpt}
      />

      {/* Hero */}
      <section
        ref={heroRef}
        aria-labelledby="detail-title"
        className="relative flex min-h-[86svh] items-end overflow-hidden bg-deep"
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div data-detail-hero-image className="absolute inset-0 scale-[1.12]">
            <img
              src={activity.coverImage}
              alt=""
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/55 to-deep/35" />
          {/* Scrim atas: navbar transparan berada di atas foto ini, dan
              foto sampul tidak selalu gelap di bagian atasnya. */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep/75 to-transparent" />
          <div data-detail-hero-scrim className="absolute inset-0 bg-deep opacity-0" />
        </div>

        <Container width="wide" className="relative pt-32 pb-20">
          <div data-detail-hero-copy className="max-w-4xl">
            <Link
              to="/#kegiatan"
              className="mb-10 inline-flex items-center gap-2 font-body text-[0.6875rem] tracking-[0.24em] text-seafoam uppercase transition-colors hover:text-white"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Field Journal
            </Link>

            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[0.6875rem] tracking-[0.24em] uppercase">
              <time dateTime={activity.date} className="text-offwhite/70">
                {formatActivityDate(activity.date)}
              </time>
              <span aria-hidden="true" className="text-offwhite/30">
                /
              </span>
              <span className="text-seafoam">{activity.category}</span>
            </p>

            <h1
              id="detail-title"
              className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-offwhite"
            >
              {activity.title}
            </h1>

            {activity.location ? (
              <p className="mt-7 font-body text-lead text-offwhite/70">{activity.location}</p>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Cerita */}
      <Section tone="light">
        <Container width="wide">
          <div ref={storyRef}>
            <p data-reveal className="max-w-2xl font-body text-lead leading-[1.75] text-deep/70">
              {activity.excerpt}
            </p>

            <div className="mt-20 space-y-24 lg:space-y-32">
              {activity.chapters.map((chapter, index) => {
                const imageFirst = index % 2 === 1

                return (
                  <div
                    key={chapter.id}
                    className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
                  >
                    <div
                      className={cn(
                        'lg:col-span-6',
                        imageFirst ? 'lg:col-start-7' : 'lg:col-start-1',
                      )}
                    >
                      <ActivityChapter
                        chapter={chapter}
                        index={index}
                        showInlinePhoto={false}
                        headingLevel={2}
                      />
                    </div>

                    {chapter.image ? (
                      <div
                        className={cn(
                          'lg:col-span-6 lg:row-start-1',
                          imageFirst ? 'lg:col-start-1' : 'lg:col-start-7',
                        )}
                      >
                        <ActivityImage
                          src={chapter.image}
                          alt={chapter.imageAlt ?? ''}
                          sizes="(min-width: 1024px) 46vw, 90vw"
                          className="aspect-3/4"
                        />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {photoCount > 1 ? (
              <div data-reveal className="mt-24 border-t border-deep/10 pt-10">
                <button
                  type="button"
                  onClick={() => setPhotoIndex(0)}
                  className="inline-flex items-center gap-2.5 rounded-full border border-deep/15 px-6 py-4 font-body text-sm text-deep/70 transition-colors duration-300 hover:border-turquoise/50 hover:text-turquoise"
                >
                  <Images aria-hidden="true" className="size-4" />
                  Lihat {photoCount} foto dari kegiatan ini
                </button>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* Kegiatan berikutnya */}
      {related.length > 0 ? (
        <Section tone="sand">
          <Container width="wide">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-heading max-w-[14ch] text-deep">Kegiatan Berikutnya</h2>
              <Link
                to="/#kegiatan"
                className="group inline-flex items-center gap-2 font-body text-sm font-medium text-deep/60 transition-colors hover:text-turquoise"
              >
                Semua catatan lapangan
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ActivityCard key={item.id} activity={item} variant="preview" headingLevel={3} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {photoIndex !== null ? (
        <ActivityLightbox
          activity={activity}
          index={photoIndex}
          onClose={handleClose}
          onNavigate={setPhotoIndex}
        />
      ) : null}
    </>
  )
}
