import { MEDIA, gsap } from '@/lib/gsap'

/**
 * Reveal untuk naskah panjang.
 *
 * Dianimasikan **per blok paragraf**, bukan per kata atau per huruf.
 * Memecah paragraf panjang menjadi puluhan elemen bergerak membuat teks
 * sulit diikuti — persis kebalikan dari yang kita inginkan pada bagian
 * yang memang untuk dibaca.
 *
 * Reveal-nya dipicu sekali dan berjalan cepat, bukan ter-scrub. Opasitas
 * yang ter-scrub berarti teks setengah transparan selama pembaca masih
 * membacanya; scrub disimpan untuk gambar dan indikator progres, yang
 * memang tidak dibaca.
 */
export function createChapterReveal(root: Element): void {
  const blocks = root.querySelectorAll<HTMLElement>('[data-chapter-block]')
  if (blocks.length === 0) return

  const mm = gsap.matchMedia()

  const build = (blur: boolean) => () => {
    for (const block of blocks) {
      gsap.from(block, {
        opacity: 0,
        y: 30,
        ...(blur ? { filter: 'blur(8px)' } : {}),
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          // Cukup jauh di bawah lipatan agar paragraf sudah selesai muncul
          // saat mata pembaca sampai ke sana.
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    }
  }

  mm.add(MEDIA.desktop, build(true))
  mm.add(MEDIA.belowDesktop, build(false))
}

/** Kepala bab: nomor, garis, lalu judulnya. */
export function createChapterHeadingReveal(root: Element): void {
  const headings = root.querySelectorAll<HTMLElement>('[data-chapter-heading]')

  for (const heading of headings) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: heading, start: 'top 86%', toggleActions: 'play none none none' },
    })

    tl.from(heading.querySelector('[data-chapter-index]'), {
      opacity: 0,
      x: -14,
      duration: 0.7,
      ease: 'power3.out',
    })
      .from(
        heading.querySelector('[data-chapter-rule]'),
        { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.inOut' },
        0.05,
      )
      .from(
        heading.querySelector('[data-chapter-name]'),
        { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out' },
        0.12,
      )
  }
}

/**
 * Reveal gambar bercerita: tirai membuka dari bawah sementara gambar di
 * dalamnya mengendap dari over-scale.
 *
 * Clip ada di bingkai, skala di gambar, dan parallax di lapis di antara
 * keduanya — memisahkan ketiganya membuat mereka bisa berjalan bersamaan
 * tanpa saling menimpa matriks transform.
 */
export function createStoryImageReveal(root: Element, selector = '[data-parallax]'): void {
  const frames = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (frame) => frame.getClientRects().length > 0,
  )

  for (const frame of frames) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: 'top 88%', toggleActions: 'play none none none' },
    })

    tl.from(frame, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.out' }).from(
      frame.querySelector('img'),
      { scale: 1.16, duration: 1.6, ease: 'expo.out' },
      0,
    )
  }
}
