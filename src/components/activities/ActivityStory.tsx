import { ArrowRight, Images } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useActivityScroll } from '@/hooks/useActivityScroll'
import { cn, formatActivityDate } from '@/lib/utils'
import type { Activity } from '@/types'
import { useRef } from 'react'
import { ActivityChapter } from './ActivityChapter'
import { ActivityProgress } from './ActivityProgress'

export interface ActivityStoryProps {
  readonly activity: Activity
  /** Beranda hanya menampilkan beberapa bab pertama; sisanya di halaman
   *  ceritanya sendiri. Biarkan kosong untuk menampilkan semuanya. */
  readonly maxChapters?: number
  readonly onOpenGallery?: (slug: string) => void
}

/**
 * Cerita lapangan dengan panggung gambar yang menempel.
 *
 * Di desktop kolom kanan diam (`position: sticky`) sementara naskah di
 * kiri bergulir; gambar dan indikator progres berganti mengikuti bab yang
 * sedang dilewati. Naskah panjang jadi terasa seperti diikuti, bukan
 * ditumpuk — satu bab pada satu waktu, dengan gambar yang menjelaskannya.
 *
 * Di bawah `lg` panggung sticky tidak dipakai sama sekali: setiap bab
 * membawa fotonya sendiri dan semuanya tersusun ke bawah, yang lebih masuk
 * akal untuk layar sempit dan jauh lebih murah dijalankan.
 */
export function ActivityStory({ activity, maxChapters, onOpenGallery }: ActivityStoryProps) {
  const ref = useRef<HTMLDivElement>(null)

  const chapters =
    maxChapters === undefined ? activity.chapters : activity.chapters.slice(0, maxChapters)
  const hiddenChapters = activity.chapters.length - chapters.length
  const photoCount = (activity.gallery?.length ?? 0) + 1

  useActivityScroll(ref, [activity.slug, chapters.length])

  return (
    <div data-story ref={ref}>
      {/* Kepala jurnal */}
      <header className="max-w-3xl">
        <p
          data-reveal
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[0.6875rem] tracking-[0.24em] uppercase"
        >
          <span className="text-turquoise">Catatan Lapangan</span>
          <span aria-hidden="true" className="text-deep/20">
            /
          </span>
          <time dateTime={activity.date} className="text-deep/50">
            {formatActivityDate(activity.date)}
          </time>
          {activity.location ? (
            <>
              <span aria-hidden="true" className="text-deep/20">
                /
              </span>
              <span className="text-deep/50">{activity.location}</span>
            </>
          ) : null}
        </p>

        <h3
          data-reveal
          className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.02] font-extrabold text-deep"
        >
          {activity.title}
        </h3>

        <p data-reveal className="mt-7 max-w-2xl font-body text-lead text-deep/65">
          {activity.excerpt}
        </p>
      </header>

      {/* Badan cerita */}
      {/* Tanpa `items-start`: kolom panggung harus ikut setinggi baris grid,
          karena kotak sticky di dalamnya hanya bisa menempel sepanjang
          induknya. Dengan `items-start` kolomnya sependek isinya dan
          gambar ikut tergulir pergi. */}
      <div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div data-story-chapters className="lg:col-span-6">
          {chapters.map((chapter, index) => (
            <ActivityChapter key={chapter.id} chapter={chapter} index={index} />
          ))}
        </div>

        {/* Panggung gambar yang menempel */}
        <div data-story-stage data-sticky-panel className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[13vh]">
            {/* Tinggi dipatok ke viewport, bukan rasio: kotak sticky harus muat
                utuh bersama indikator progres di bawahnya, kalau tidak
                indikatornya terdorong keluar layar. */}
            <div className="relative h-[58vh] min-h-[26rem] overflow-hidden rounded-sm bg-sand-soft">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  data-story-visual
                  data-index={index}
                  // Bab pertama sudah terlihat sejak awal, sehingga panggung
                  // tetap benar bila animasi tidak pernah berjalan.
                  className={cn('absolute inset-0', index === 0 ? 'opacity-100' : 'opacity-0')}
                >
                  <img
                    data-story-visual-image
                    src={chapter.image ?? activity.coverImage}
                    alt={chapter.imageAlt ?? activity.coverAlt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    sizes="(min-width: 1024px) 44vw, 0px"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}

              {/* Pasang naik saat cerita ditutup — lihat `createStoryOutro`. */}
              <div
                data-story-tide
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-full translate-y-full bg-gradient-to-t from-deep via-ocean/85 to-transparent"
              />
            </div>

            <ActivityProgress chapters={chapters} className="mt-7" />
          </div>
        </div>
      </div>

      {/* Penutup cerita */}
      <div data-story-outro className="mt-4 border-t border-deep/10 pt-10 lg:mt-0">
        {hiddenChapters > 0 ? (
          <p className="font-body text-sm text-deep/50">
            Masih ada {hiddenChapters} bab lagi dalam catatan ini.
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to={`/kegiatan/${activity.slug}`}
            data-cursor="link"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-deep px-7 py-4 font-body text-[0.9375rem] font-medium text-offwhite transition-[background-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-turquoise"
          >
            Baca Cerita Lengkap
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            />
          </Link>

          {onOpenGallery && photoCount > 1 ? (
            <button
              type="button"
              onClick={() => onOpenGallery(activity.slug)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-deep/15 px-6 py-4 font-body text-sm text-deep/70 transition-colors duration-300 hover:border-turquoise/50 hover:text-turquoise"
            >
              <Images aria-hidden="true" className="size-4" />
              Lihat {photoCount} foto
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
