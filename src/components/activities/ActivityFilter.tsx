import { activityFilters } from '@/data/activities'
import { cn } from '@/lib/utils'
import type { ActivityFilterValue } from '@/data/activities'

export interface ActivityFilterProps {
  readonly value: ActivityFilterValue
  readonly onChange: (value: ActivityFilterValue) => void
  readonly counts: Readonly<Record<string, number>>
}

/**
 * Filter kategori.
 *
 * Dibuat sebagai baris teks bergaris bawah, bukan tombol berkotak, agar
 * tetap terbaca editorial dan tidak berubah menjadi UI dasbor.
 */
export function ActivityFilter({ value, onChange, counts }: ActivityFilterProps) {
  return (
    <div
      role="group"
      aria-label="Saring kegiatan berdasarkan kategori"
      className="flex flex-wrap items-center gap-x-7 gap-y-3"
    >
      {activityFilters.map((filter) => {
        const isActive = filter === value
        const count = counts[filter] ?? 0

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={cn(
              'group relative pb-2 font-body text-sm transition-colors duration-300',
              isActive ? 'text-turquoise' : 'text-deep/50 hover:text-deep',
            )}
          >
            {filter}
            <span
              aria-hidden="true"
              className="ml-1.5 align-super text-[0.625rem] tracking-wider opacity-60"
            >
              {count}
            </span>
            {/* Garis bawah tumbuh dari kiri — satu transform, tanpa layout. */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-px origin-left bg-turquoise transition-transform duration-500 ease-[var(--ease-out-expo)]',
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
