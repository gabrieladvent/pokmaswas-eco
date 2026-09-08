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

export function photo(id: string, width: number, quality = 72): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export function photoSrcSet(id: string, widths: readonly number[] = [640, 1024, 1600, 2400]): string {
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(', ')
}

export function formatActivityDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function activityYear(iso: string): string {
  return iso.slice(0, 4)
}
