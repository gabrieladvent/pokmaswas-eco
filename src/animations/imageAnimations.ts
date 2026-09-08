import { MEDIA, gsap } from '@/lib/gsap'

export interface ImageRevealConfig {
  readonly selector?: string
  readonly start?: string
  readonly stagger?: number
  readonly duration?: number
  /** Skala awal gambar di dalam bingkai. */
  readonly scale?: number
  /** Tambahkan parallax scrub pada `[data-reveal-shift]`. */
  readonly parallax?: boolean
  readonly distance?: number
}

/**
 * Reveal gambar: tirai membuka dari bawah sementara gambar di dalamnya
 * mengendap dari over-scale.
 *
 * Dua gerakan ini berjalan bersamaan tetapi pada elemen berbeda —
 * clip-path di bingkai, scale di gambar — sehingga terbaca seperti rana
 * kamera, bukan sekadar fade.
 */
export function createImageReveal(root: Element, config: ImageRevealConfig = {}): void {
  const {
    selector = '[data-reveal-frame]',
    start = 'top 85%',
    stagger = 0.12,
    duration = 1.5,
    scale = 1.18,
    parallax = true,
    distance = 14,
  } = config

  /*
   * Hanya bingkai yang benar-benar dirender.
   *
   * Sebagian bingkai disembunyikan pada breakpoint tertentu (mis. foto
   * inline timeline yang `lg:hidden`). Elemen `display: none` berukuran
   * nol, sehingga start dan end ScrollTrigger-nya jatuh di titik yang
   * sama dan sudah terlewati — semuanya langsung terpicu, lalu `once`
   * membuat mereka membunuh dirinya sendiri sementara ScrollTrigger masih
   * mengiterasi daftarnya, dan refresh berikutnya membaca entri kosong.
   */
  const frames = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (frame) => frame.getClientRects().length > 0,
  )
  if (frames.length === 0) return

  frames.forEach((frame, index) => {
    const image = frame.querySelector('[data-reveal-image]')

    const tl = gsap.timeline({
      // `toggleActions` alih-alih `once`: hasilnya sama — sekali jalan,
      // tidak pernah mundur — tetapi trigger-nya tidak membunuh dirinya
      // sendiri, jadi daftar ScrollTrigger tidak berubah saat diiterasi.
      scrollTrigger: { trigger: frame, start, toggleActions: 'play none none none' },
      delay: index * stagger,
    })

    tl.from(frame, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration,
      ease: 'expo.out',
    })

    if (image) {
      tl.from(image, { scale, duration: duration * 1.2, ease: 'expo.out' }, 0)
    }
  })

  if (!parallax) return

  const mm = gsap.matchMedia()

  const build = (travel: number) => () => {
    for (const frame of frames) {
      const shift = frame.querySelector('[data-reveal-shift]')
      if (!shift) continue

      gsap.fromTo(
        shift,
        { yPercent: -travel / 2 },
        {
          yPercent: travel / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }
  }

  mm.add(MEDIA.desktop, build(distance))
  mm.add(MEDIA.tablet, build(distance * 0.55))
  // Ponsel tidak mendapat parallax gambar sama sekali: biayanya nyata,
  // hasilnya nyaris tidak terlihat pada layar setinggi itu.
}
