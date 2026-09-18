import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

/*
 * Di peramban seluler, menyembunyikan atau memunculkan bilah alamat
 * menghitung ulang tinggi viewport dan memicu `resize`. Tanpa ini setiap
 * ScrollTrigger mengukur ulang di tengah gulir, dan bagian yang menempel
 * atau ter-scrub tersentak ke posisi baru — persis pada saat pembaca
 * sedang menggulir pelan dan paling mungkin memperhatikannya.
 */
ScrollTrigger.config({ ignoreMobileResize: true })

/**
 * Nilai `scrub` yang dipakai seluruh situs.
 *
 * `scrub: true` mengikat animasi tepat pada posisi gulir. Hasilnya benar,
 * tetapi terasa melekat pada bilah gulir. Angka kecil memberi tenggang
 * untuk menyusul, sehingga lapisan berhenti sepersekian detik setelah
 * gulir berhenti — itulah yang terbaca sebagai "mengendap", bukan
 * "berhenti mendadak".
 *
 * Dibedakan dua tingkat dengan sengaja. Latar boleh tertinggal jauh:
 * justru itu yang memberi kesan kedalaman. Teks dan tombol yang sedang
 * dibaca tidak boleh — tertinggal terlalu lama membuatnya terasa lepas
 * dari kendali pembaca.
 */
export const SCRUB = {
  /** Konten yang sedang dibaca: teks, tombol, indikator. */
  tight: 0.3,
  /** Latar, foto, parallax, dan peralihan warna. */
  soft: 0.75,
} as const

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export const MEDIA = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  belowDesktop: '(max-width: 1023px)',
  motionOk: '(prefers-reduced-motion: no-preference)',
} as const

export { gsap, ScrollTrigger }
