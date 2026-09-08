import { useMemo } from 'react'

import { Lightbox } from '@/components/gallery/Lightbox'
import type { LightboxItem } from '@/components/gallery/Lightbox'
import { formatActivityDate } from '@/lib/utils'
import type { Activity } from '@/types'

export interface ActivityLightboxProps {
  readonly activity: Activity
  readonly index: number
  readonly onClose: () => void
  readonly onNavigate: (index: number) => void
}

/**
 * Membungkus lightbox bersama dengan bentuk data kegiatan.
 *
 * Foto sampul selalu jadi yang pertama, diikuti foto pendukungnya —
 * urutan yang sama dengan cara cerita itu dibaca.
 */
export function ActivityLightbox({
  activity,
  index,
  onClose,
  onNavigate,
}: ActivityLightboxProps) {
  const items: readonly LightboxItem[] = useMemo(
    () => [
      {
        src: activity.coverImage,
        alt: activity.coverAlt,
        caption: activity.title,
        meta: activity.location,
      },
      ...(activity.gallery ?? []).map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        caption: photo.caption ?? activity.title,
        meta: activity.location,
      })),
    ],
    [activity],
  )

  return (
    <Lightbox
      items={items}
      index={index}
      onClose={onClose}
      onNavigate={onNavigate}
      label={`${activity.title} — ${formatActivityDate(activity.date)}`}
    />
  )
}
