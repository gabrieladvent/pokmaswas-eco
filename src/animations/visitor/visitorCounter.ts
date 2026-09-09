import { gsap, prefersReducedMotion } from '@/lib/gsap'

const formatter = new Intl.NumberFormat('id-ID')

export function formatVisitorNumber(value: number): string {
  return formatter.format(Math.round(value))
}

/**
 * Lama hitungan menyesuaikan besar angkanya.
 *
 * Menghitung 0→8 selama satu detik penuh terlihat janggal; 0→12.847 dalam
 * separuh detik terlewat begitu saja. Basis logaritmik membuat keduanya
 * terasa sama wajar.
 */
export function countUpDuration(value: number): number {
  const magnitude = Math.log10(Math.max(value, 1))
  return Math.min(Math.max(0.45 + magnitude * 0.3, 0.45), 1.3)
}

export interface CountUpOptions {
  readonly duration?: number
  readonly delay?: number
  /** Mulai saat elemen masuk viewport, bukan saat dipasang. */
  readonly onEnter?: boolean
}

/**
 * Menghitung naik menuju sebuah angka.
 *
 * Nilainya ditulis langsung ke `textContent` lewat tween GSAP pada objek
 * perantara — bukan lewat state React. Menaikkan state tiap frame akan
 * merender ulang seluruh cabang komponen enam puluh kali per detik demi
 * satu deret angka.
 *
 * Saat pengunjung meminta gerak dikurangi, angkanya langsung ditulis final.
 */
export function createCountUp(element: HTMLElement, value: number, options: CountUpOptions = {}): void {
  const { duration = countUpDuration(value), delay = 0, onEnter = false } = options

  if (prefersReducedMotion()) {
    element.textContent = formatVisitorNumber(value)
    return
  }

  const counter = { value: 0 }
  element.textContent = formatVisitorNumber(0)

  gsap.to(counter, {
    value,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = formatVisitorNumber(counter.value)
    },
    ...(onEnter
      ? {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            // Sekali saja: menghitung ulang tiap kali bagian ini dilewati
            // membuatnya terasa seperti hiasan, bukan sebuah fakta.
            toggleActions: 'play none none none',
          },
        }
      : {}),
  })
}

/**
 * Riak yang menyebar di belakang angka — gerak air, bukan pendar dasbor.
 */
export function createStatsRipple(root: Element): void {
  const rings = root.querySelectorAll<HTMLElement>('[data-visitor-ripple]')
  if (rings.length === 0) return

  gsap.fromTo(
    rings,
    { scale: 0.6, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.6,
      ease: 'expo.out',
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: 'top 85%', toggleActions: 'play none none none' },
    },
  )
}

/** Masuknya seluruh blok statistik. */
export function createStatsReveal(root: Element): void {
  const blocks = root.querySelectorAll<HTMLElement>('[data-visitor-block]')
  if (blocks.length === 0) return

  gsap.from(blocks, {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.14,
    scrollTrigger: { trigger: root, start: 'top 84%', toggleActions: 'play none none none' },
  })
}
