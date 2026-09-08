import { useCallback, useMemo, useRef, useState } from 'react'

import { createActivityTimeline } from '@/animations/activities'
import { createRevealAnimation, createWordReveal } from '@/animations'
import { Container } from '@/components/common/Container'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import {
  ACTIVITY_FILTER_ALL,
  activities,
  featuredActivity,
  timelineActivities,
} from '@/data/activities'
import type { ActivityFilterValue } from '@/data/activities'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { ActivityFilter } from './ActivityFilter'
import { ActivityLightbox } from './ActivityLightbox'
import { ActivityStory } from './ActivityStory'
import { ActivityTimeline } from './ActivityTimeline'

/** Berapa bab yang ditampilkan di beranda sebelum pembaca ditawari
 *  halaman ceritanya sendiri. Cukup untuk terasa seperti cerita, tidak
 *  cukup untuk membuat beranda jadi sepanjang artikel. */
const CHAPTERS_ON_LANDING = 3

/**
 * Field journal Pokmaswas.
 *
 * Naskah panjang ditangani berlapis, bukan dipotong:
 *
 *   1. beranda — ringkasan dan beberapa bab pertama sebagai cerita sticky
 *   2. tautan  — "Baca Cerita Lengkap"
 *   3. halaman — `/kegiatan/:slug` dengan naskah utuh
 *
 * Dengan begitu bagian ini tetap terasa seperti dokumenter tanpa membuat
 * beranda memanjang mengikuti panjang tulisan.
 */
export function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [filter, setFilter] = useState<ActivityFilterValue>(ACTIVITY_FILTER_ALL)
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [photoIndex, setPhotoIndex] = useState(0)

  useScrollAnimation(sectionRef, (root) => {
    createRevealAnimation(root)
    createWordReveal(root)
  })

  // Dibangun ulang saat filter berubah: DOM-nya berganti, jadi seluruh
  // ScrollTrigger perlu diukur ulang.
  useScrollAnimation(
    timelineRef,
    (root) => {
      createActivityTimeline(root)
    },
    [filter],
  )

  const counts = useMemo(() => {
    const result: Record<string, number> = { [ACTIVITY_FILTER_ALL]: activities.length }
    for (const activity of activities) {
      result[activity.category] = (result[activity.category] ?? 0) + 1
    }
    return result
  }, [])

  const visibleActivities = useMemo(
    () =>
      filter === ACTIVITY_FILTER_ALL
        ? timelineActivities
        : timelineActivities.filter((activity) => activity.category === filter),
    [filter],
  )

  const openActivity = useMemo(
    () => activities.find((activity) => activity.slug === openSlug),
    [openSlug],
  )

  const handleOpenGallery = useCallback((slug: string) => {
    setOpenSlug(slug)
    setPhotoIndex(0)
  }, [])

  const handleClose = useCallback(() => setOpenSlug(null), [])

  // Tanpa `overflow-hidden` di sini: panggung gambar cerita memakai
  // `position: sticky`, yang mati begitu salah satu induknya meng-clip.
  return (
    <Section id="kegiatan" tone="light" ref={sectionRef}>
      <Container width="wide">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-turquoise">Field Journal</Eyebrow>
            <SplitHeading
              lines={['Jejak Kegiatan', 'Kami.']}
              reveal="word"
              className="max-w-[13ch] text-deep"
            />
          </div>

          <p data-reveal className="max-w-sm font-body text-[0.9375rem] leading-relaxed text-deep/55">
            Catatan dari lapangan, ditulis menurut waktunya. Bukan laporan, melainkan cerita tentang
            apa yang benar-benar dikerjakan di pesisir.
          </p>
        </div>

        {featuredActivity ? (
          <div className="mt-20 border-t border-deep/10 pt-16">
            <ActivityStory
              activity={featuredActivity}
              maxChapters={CHAPTERS_ON_LANDING}
              onOpenGallery={handleOpenGallery}
            />
          </div>
        ) : null}

        <div className="mt-24 border-t border-deep/10 pt-10">
          <p
            data-reveal
            className="mb-8 font-body text-[0.6875rem] tracking-[0.24em] text-deep/40 uppercase"
          >
            Catatan lainnya
          </p>
          <ActivityFilter value={filter} onChange={setFilter} counts={counts} />
        </div>

        <div ref={timelineRef}>
          {visibleActivities.length > 0 ? (
            <ActivityTimeline activities={visibleActivities} />
          ) : (
            <p className="mt-16 font-body text-deep/50">
              Belum ada kegiatan lain pada kategori ini.
            </p>
          )}
        </div>
      </Container>

      {openActivity ? (
        <ActivityLightbox
          activity={openActivity}
          index={photoIndex}
          onClose={handleClose}
          onNavigate={setPhotoIndex}
        />
      ) : null}
    </Section>
  )
}
