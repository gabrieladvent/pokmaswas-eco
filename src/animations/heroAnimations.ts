import { MEDIA, gsap } from '@/lib/gsap'

/**
 * Hero punya dua gerakan yang terpisah:
 *
 * - **intro** yang berjalan sekali saat halaman dibuka, dan
 * - **scroll pass** yang sepenuhnya digerakkan posisi scrollbar (`scrub`),
 *   tidak pernah oleh timer — sehingga menggulir balik memutar mundur
 *   animasinya persis.
 *
 * Scroll pass disusun sebagai enam tahap yang tumpang tindih, bukan
 * berurutan, karena yang membuatnya terasa sinematik justru saat beberapa
 * hal bergerak bersamaan pada kecepatan berbeda.
 */
export function createHeroAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  /* ---------------------------------------------------------------- *
   * Intro
   * ---------------------------------------------------------------- */
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })

  intro
    .from(q('[data-hero-word]'), {
      yPercent: 118,
      duration: 1.5,
      stagger: 0.075,
    })
    .from(q('[data-hero-eyebrow]'), { opacity: 0, y: 18, duration: 1.1 }, 0.1)
    .from(q('[data-hero-subtitle]'), { opacity: 0, y: 26, duration: 1.2 }, 0.7)
    .from(q('[data-hero-actions] > *'), { opacity: 0, y: 22, duration: 1, stagger: 0.09 }, 0.85)
    .from(q('[data-hero-indicator]'), { opacity: 0, duration: 1 }, 1.1)
    // Lapis jauh mengendap belakangan — kesannya udara ikut menetap.
    .from(q('[data-hero-far], [data-hero-boat]'), { opacity: 0, duration: 2, stagger: 0.2 }, 0.5)
    .fromTo(
      q('[data-hero-image]'),
      { scale: 1.22 },
      { scale: 1.15, duration: 2.4, ease: 'power2.out' },
      0,
    )

  // Blur → tajam pada judul, desktop saja: mahal untuk GPU ponsel dan
  // nyaris tak terlihat pada ukuran teks kecil.
  gsap.matchMedia().add(MEDIA.desktop, () => {
    intro.from(q('[data-hero-word]'), { filter: 'blur(14px)', duration: 1.6, stagger: 0.075 }, 0)
  })

  /* ---------------------------------------------------------------- *
   * Scroll pass
   * ---------------------------------------------------------------- */
  const scroll = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  scroll
    // Tahap 1 — bingkai mengendap saat pembaca melewatinya.
    .to(q('[data-hero-image]'), { scale: 1, ease: 'none' }, 0)
    // Tahap 2 — konten pergi lebih dulu, jadi teks lepas dari bingkai.
    .to(q('[data-hero-content]'), { yPercent: -34, ease: 'none' }, 0)
    // Tahap 3 — judul memudar lebih cepat daripada subtitle dan CTA.
    .to(q('[data-hero-heading]'), { opacity: 0, ease: 'power1.in' }, 0)
    .to(q('[data-hero-subtitle], [data-hero-actions]'), { opacity: 0, ease: 'none' }, 0.05)
    .to(q('[data-hero-indicator]'), { opacity: 0, ease: 'none' }, 0)
    // Tahap 6 — air menua menjadi laut dalam.
    .to(q('[data-hero-deep]'), { opacity: 1, ease: 'none' }, 0)
    .to(q('[data-hero-overlay]'), { opacity: 0.55, ease: 'none' }, 0)

  const mm = gsap.matchMedia()

  mm.add(MEDIA.desktop, () => {
    /*
     * Tahap 4 dan 5 — kedalaman.
     *
     * Angkanya menyebar dari nyaris diam sampai cepat: pulau dan perahu di
     * kejauhan hampir tidak bergeser, atmosfer merayap, ombak depan
     * melesat. Selisih kecepatan inilah yang menciptakan kedalaman, bukan
     * besarnya masing-masing gerakan.
     */
    scroll
      .to(q('[data-hero-atmos]'), { yPercent: 6, ease: 'none' }, 0)
      .to(q('[data-hero-horizon]'), { yPercent: 12, ease: 'none' }, 0)
      .to(q('[data-hero-far]'), { yPercent: 16, ease: 'none' }, 0)
      .to(q('[data-hero-boat]'), { yPercent: 26, xPercent: -8, ease: 'none' }, 0)
      // Rotasi 0,4° — tidak pernah terbaca sebagai putaran, hanya membuat
      // ombak terasa tidak sepenuhnya kaku.
      .to(q('[data-hero-wave]'), { yPercent: -38, rotate: 0.4, ease: 'none' }, 0)
  })

  mm.add(MEDIA.belowDesktop, () => {
    // Gagasan sama, diperkecil banyak: transform murah saja.
    scroll
      .to(q('[data-hero-far]'), { yPercent: 8, ease: 'none' }, 0)
      .to(q('[data-hero-wave]'), { yPercent: -14, ease: 'none' }, 0)
  })
}
