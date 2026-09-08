import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { hasFullStory } from '@/data/activities'
import { cn, formatActivityDate } from '@/lib/utils'
import type { Activity } from '@/types'
import { ActivityImage } from './ActivityImage'

export interface ActivityCardProps {
  readonly activity: Activity
  readonly index?: number
  /** Ditampilkan bila kegiatan ini membuka tahun baru di timeline. */
  readonly yearMarker?: string
  /**
   * `timeline` — satu baris di dalam timeline vertikal.
   * `preview` — kartu untuk "Kegiatan Berikutnya" di akhir sebuah cerita.
   */
  readonly variant?: 'timeline' | 'preview'
}

/**
 * Satu kegiatan dalam bentuk ringkas.
 *
 * Status aktif tidak disimpan di React: `createActivityTimeline` menulis
 * atribut `data-active` langsung ke DOM saat baris melintasi viewport, dan
 * seluruh penekanan visual di bawah ini bereaksi lewat CSS.
 *
 * Hanya kegiatan yang punya dua bab atau lebih yang ditautkan ke halaman
 * ceritanya — sisanya cukup dengan ringkasan, tanpa tautan yang membawa ke
 * halaman nyaris kosong.
 */
export function ActivityCard({
  activity,
  index = 0,
  yearMarker,
  variant = 'timeline',
}: ActivityCardProps) {
  const linked = hasFullStory(activity)

  if (variant === 'preview') {
    const body = (
      <>
        <ActivityImage
          src={activity.coverImage}
          alt={activity.coverAlt}
          sizes="(min-width: 1024px) 30vw, 80vw"
          className="aspect-4/3"
          hoverScale
        />
        <div className="mt-5">
          <p className="font-body text-[0.6875rem] tracking-[0.2em] text-turquoise uppercase">
            {activity.category}
          </p>
          <h4 className="mt-3 flex items-start gap-2 font-display text-xl leading-snug font-bold text-deep transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
            {activity.title}
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-deep/35 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </h4>
          <p className="mt-2 font-body text-xs text-deep/45">
            {formatActivityDate(activity.date)}
          </p>
        </div>
      </>
    )

    return linked ? (
      <Link
        to={`/kegiatan/${activity.slug}`}
        data-cursor="link"
        className="group block"
        data-activity-preview
      >
        {body}
      </Link>
    ) : (
      <div className="group block" data-activity-preview>
        {body}
      </div>
    )
  }

  const title = (
    <h3
      className={cn(
        'font-display text-[clamp(1.375rem,2.4vw,2rem)] leading-tight font-extrabold text-deep',
        'transition-transform duration-500 ease-[var(--ease-out-expo)]',
        'group-hover:translate-x-2 group-data-[active=true]:translate-x-2',
      )}
    >
      {activity.title}
    </h3>
  )

  return (
    <li data-activity-item data-active="false" className="group relative pl-14 sm:pl-20 lg:pl-24">
      {yearMarker ? (
        <p
          aria-hidden="true"
          className="absolute -top-9 left-0 font-display text-sm font-bold tracking-[0.2em] text-turquoise/60"
        >
          {yearMarker}
        </p>
      ) : null}

      <span
        data-activity-dot
        aria-hidden="true"
        className={cn(
          'absolute top-2 left-[1.4rem] z-10 block size-3 -translate-x-1/2 rounded-full bg-deep/20 sm:left-8 lg:left-10',
          'ring-4 ring-offwhite transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)]',
          'group-hover:scale-[1.4] group-hover:bg-turquoise',
          'group-data-[active=true]:scale-[1.4] group-data-[active=true]:bg-turquoise',
        )}
      />

      {/* Baris indeks editorial: tanggal di kolom sendiri, naskah di
          tengah, foto kecil di ujung — supaya lebar halaman terpakai
          alih-alih menyisakan separuh kolom kosong. */}
      <article className="pb-16 lg:grid lg:grid-cols-[9rem_minmax(0,1fr)_13rem] lg:items-start lg:gap-10 lg:pb-24">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-[0.6875rem] tracking-[0.2em] uppercase lg:flex-col lg:gap-2">
          <time dateTime={activity.date} className="text-deep/45">
            {formatActivityDate(activity.date)}
          </time>
          <span aria-hidden="true" className="text-deep/20 lg:hidden">
            /
          </span>
          <span className="text-turquoise">{activity.category}</span>
        </div>

        <div>
          <div>
          {linked ? (
            <Link to={`/kegiatan/${activity.slug}`} data-cursor="link" className="inline-block">
              {title}
            </Link>
          ) : (
            title
          )}
        </div>

          <p className="mt-4 font-body text-[0.9375rem] leading-relaxed text-deep/60">
            {activity.excerpt}
          </p>

          {activity.location ? (
            <p className="mt-5 font-body text-xs text-deep/45">
              <span className="tracking-[0.2em] text-deep/30 uppercase">Lokasi</span>
              <span className="mx-2 text-deep/20">·</span>
              {activity.location}
            </p>
          ) : null}

          <div data-inline-photo className="mt-7 lg:hidden">
            <ActivityImage
              src={activity.coverImage}
              alt={activity.coverAlt}
              sizes="(min-width: 1024px) 0px, 90vw"
              className="aspect-4/3"
            />
          </div>

          {linked ? (
            <Link
              to={`/kegiatan/${activity.slug}`}
              data-cursor="link"
              className="mt-6 inline-flex items-center gap-2 font-body text-sm font-medium text-deep/60 transition-colors duration-300 hover:text-turquoise"
            >
              Baca cerita lengkap
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>

        {/* Foto kecil di ujung baris, desktop saja — versi selebar layar
            sudah ditampilkan di dalam kolom naskah. */}
        <div className="hidden lg:block">
          <ActivityImage
            src={activity.coverImage}
            alt=""
            sizes="(min-width: 1024px) 13rem, 0px"
            className="aspect-square"
            hoverScale
          />
        </div>
      </article>

      <span className="sr-only">{`Kegiatan ke-${index + 1}`}</span>
    </li>
  )
}
