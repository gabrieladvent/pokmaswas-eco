import { cn } from '@/lib/utils'
import type { ActivityChapter } from '@/types'

export interface ActivityProgressProps {
  readonly chapters: readonly ActivityChapter[]
  readonly className?: string
}

/**
 * Penanda posisi di dalam cerita: `01 / 05` beserta nama babnya.
 *
 * Seluruh label dirender bertumpuk sejak awal dan hanya yang aktif yang
 * ditampilkan, digerakkan atribut `data-active` dari `createActivityStory`.
 * Dengan begitu tidak ada teks yang perlu ditulis ulang saat menggulir —
 * jadi tidak ada state React, dan tidak ada render ulang.
 */
export function ActivityProgress({ chapters, className }: ActivityProgressProps) {
  const total = String(chapters.length).padStart(2, '0')

  return (
    <div
      data-story-progress
      aria-hidden="true"
      className={cn('flex flex-col gap-4', className)}
    >
      <div className="flex items-baseline gap-2 font-body text-xs tracking-[0.2em] text-deep/45 tabular-nums">
        {/* Tumpukan angka: hanya bab aktif yang terlihat. */}
        <span className="relative inline-block w-[2ch] text-deep">
          {chapters.map((chapter, index) => (
            <span
              key={chapter.id}
              data-progress-count
              data-index={index}
              data-active={index === 0}
              className="absolute inset-0 opacity-0 transition-opacity duration-500 data-[active=true]:opacity-100"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
          {/* Menjaga lebar kotaknya tetap saat semua label absolut. */}
          <span className="invisible">00</span>
        </span>
        <span>/ {total}</span>
      </div>

      {/* Tumpukan nama bab. */}
      <span className="relative block h-5">
        {chapters.map((chapter, index) => (
          <span
            key={chapter.id}
            data-progress-title
            data-index={index}
            data-active={index === 0}
            className="absolute inset-0 translate-y-1 font-body text-[0.6875rem] tracking-[0.24em] text-turquoise uppercase opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)] data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
          >
            {chapter.title}
          </span>
        ))}
      </span>

      {/* Rel progres tipis, mengikuti posisi scroll di dalam cerita. */}
      <span aria-hidden="true" className="mt-1 block h-px w-full bg-deep/12">
        <span data-progress-bar className="block h-full w-full origin-left bg-turquoise" />
      </span>

      {/* Rel titik: satu titik per bab. */}
      <span className="flex items-center gap-2 pt-1">
        {chapters.map((chapter, index) => (
          <span key={chapter.id} className="flex items-center gap-2">
            {index > 0 ? <span className="block h-px w-4 bg-deep/15" /> : null}
            <span
              data-progress-dot
              data-index={index}
              data-active={index === 0}
              className="block size-1.5 rounded-full bg-deep/20 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] data-[active=true]:scale-[1.6] data-[active=true]:bg-turquoise"
            />
          </span>
        ))}
      </span>
    </div>
  )
}
