import { MEDIA, gsap, prefersReducedMotion } from '@/lib/gsap'

/**
 * Babak pertama: nama kelompok tersusun dari kegelapan.
 *
 * Huruf naik satu per satu dengan jeda rapat — cukup untuk terbaca sebagai
 * gerakan, tidak sampai terbaca sebagai mesin tik. Babak ini tidak menunggu
 * apa pun; ia berjalan begitu halaman dipasang, sementara permintaan ke
 * layanan penghitung berlangsung di belakangnya.
 */
export function createWelcomeIntro(root: HTMLElement): gsap.core.Timeline {
  const q = gsap.utils.selector(root)

  if (prefersReducedMotion()) {
    gsap.set(q('[data-welcome-letter], [data-welcome-sub], [data-welcome-standby]'), {
      opacity: 1,
      y: 0,
      yPercent: 0,
    })
    return gsap.timeline()
  }

  return gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(q('[data-welcome-letter]'), { yPercent: 115, duration: 0.75, stagger: 0.028 })
    .from(q('[data-welcome-sub]'), { opacity: 0, y: 10, duration: 0.55 }, 0.22)
    .from(q('[data-welcome-rule]'), { scaleX: 0, duration: 0.65, ease: 'power3.inOut' }, 0.28)
    .from(q('[data-welcome-standby]'), { opacity: 0, duration: 0.45 }, 0.4)
}

export interface WelcomeGreetingOptions {
  /** `false` ketika layanan penghitung tidak terjangkau; sapaannya tetap
   *  muncul, hanya tanpa nomor. */
  readonly hasNumber: boolean
  readonly onComplete: () => void
}

/**
 * Babak kedua, dan sengaja bertumpuk dengan babak pertama.
 *
 * Alih-alih menunggu nama kelompok selesai lalu menggantinya, nama itu
 * meredup dan sedikit mengecil **sementara** sapaan naik ke tempatnya —
 * seperti fokus kamera yang berpindah, bukan seperti dua layar yang
 * bertukar. Itulah yang membuat pembukaannya terasa satu gerakan, dan
 * itu pula yang memangkas durasinya hampir separuh.
 *
 * Nomor pengunjung tersingkap dari balik mask sambil menajam dari blur,
 * lalu ditahan hanya selama hitungannya naik. Tidak ada jeda mati.
 */
export function createWelcomeGreeting(
  root: HTMLElement,
  { hasNumber, onComplete }: WelcomeGreetingOptions,
): gsap.core.Timeline {
  const q = gsap.utils.selector(root)

  if (prefersReducedMotion()) {
    gsap.set(q('[data-welcome-standby]'), { opacity: 0 })
    gsap.set(
      q(
        '[data-welcome-greeting], [data-welcome-label], [data-welcome-number], [data-welcome-enter], [data-welcome-number-rule], [data-welcome-enter-line]',
      ),
      { opacity: 1, y: 0, scale: 1, scaleX: 1, scaleY: 1, filter: 'none', clipPath: 'none' },
    )
    // Tetap ada jeda baca, hanya tanpa gerakan sama sekali.
    return gsap.timeline({ onComplete }).to({}, { duration: hasNumber ? 1.4 : 0.9 })
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete })

  tl.to(q('[data-welcome-standby]'), {
    opacity: 0,
    y: -14,
    duration: 0.3,
    ease: 'power2.in',
  })
    // Tarikan fokus: nama kelompok mundur, tidak menghilang.
    .to(q('[data-welcome-brand]'), { scale: 0.93, opacity: 0.45, duration: 0.8 }, 0)
    .to(q('[data-welcome-rule]'), { opacity: 0.25, duration: 0.5 }, 0)
    .from(q('[data-welcome-greeting]'), { opacity: 0, y: 20, duration: 0.55 }, 0.1)

  if (hasNumber) {
    tl.from(q('[data-welcome-label]'), { opacity: 0, y: 12, duration: 0.45 }, 0.22)
      .from(
        q('[data-welcome-number]'),
        {
          opacity: 0,
          scale: 1.14,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.75,
        },
        0.3,
      )
      // Garis rambut ditarik di bawah angka begitu ia mendarat.
      .from(q('[data-welcome-number-rule]'), { scaleX: 0, duration: 0.6 }, 0.62)
      // Ditahan hanya selama hitungannya naik.
      .to({}, { duration: 0.2 })
      .from(q('[data-welcome-enter]'), { opacity: 0, y: 12, duration: 0.45 }, '>-0.28')
  } else {
    tl.from(q('[data-welcome-enter]'), { opacity: 0, y: 12, duration: 0.45 }, 0.45)
  }

  // Garis tegak yang menarik pandangan turun, menyambung ke penanda gulir
  // milik Hero yang muncul sesaat kemudian.
  tl.from(q('[data-welcome-enter-line]'), { scaleY: 0, duration: 0.5 }, '>-0.3')

  // Blur hanya di desktop: memburamkan teks sebesar ini mahal untuk GPU
  // ponsel, dan pada layar kecil nyaris tidak terbaca.
  gsap.matchMedia().add(MEDIA.desktop, () => {
    if (!hasNumber) return
    tl.from(q('[data-welcome-number]'), { filter: 'blur(14px)', duration: 0.9 }, 0.4)
  })

  return tl
}
