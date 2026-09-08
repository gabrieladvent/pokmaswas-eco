export type ClassValue = string | number | false | null | undefined

/** Joins class names, dropping falsy values. Small on purpose — the app
 *  has no need for the conditional-object syntax `clsx` provides. */
export function cn(...values: ClassValue[]): string {
  let out = ''
  for (const value of values) {
    if (!value && value !== 0) continue
    out = out ? `${out} ${value}` : String(value)
  }
  return out
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Builds a responsive Unsplash URL.
 *
 * Photography is served from a CDN so the repository stays light. To move
 * to self-hosted assets, drop the files into `src/assets/images/` and
 * change only this helper plus the `src` values in `src/data/`.
 */
export function photo(id: string, width: number, quality = 72): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

/** `srcset` across the widths that matter for our layouts. */
export function photoSrcSet(id: string, widths: readonly number[] = [640, 1024, 1600, 2400]): string {
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ')
}

/** Tanggal panjang bahasa Indonesia, mis. `2026-08-12` → "12 Agustus 2026". */
export function formatActivityDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/** Tahun saja — dipakai sebagai penanda di ujung timeline. */
export function activityYear(iso: string): string {
  return iso.slice(0, 4)
}
