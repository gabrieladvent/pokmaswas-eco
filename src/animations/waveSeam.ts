import { MEDIA, SCRUB, gsap } from '@/lib/gsap'

/**
 * Menghanyutkan lapisan gelombang mengikuti gulir.
 *
 * Setiap lapisan membawa sendiri seberapa jauh ia hanyut lewat
 * `data-drift`, dalam satuan periode: −0.5 berarti mundur setengah
 * periode sepanjang jahitan ini melintasi layar. Karena SVG-nya selebar
 * dua periode, geseran itu tidak pernah menyingkap tepinya.
 *
 * Dijalankan di semua lebar layar, hanya amplitudonya yang mengecil.
 * Jahitan yang diam di ponsel sama saja dengan tidak ada jahitan.
 */
export function createWaveSeam(root: HTMLElement): void {
  const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-wave-layer]'))
  if (layers.length === 0) return

  const mm = gsap.matchMedia()

  const build = (scale: number) => () => {
    for (const layer of layers) {
      const drift = Number.parseFloat(layer.dataset.drift ?? '0')
      if (!drift) continue

      gsap.fromTo(
        layer,
        // Setengah lebar SVG sama dengan satu periode, jadi −50%
        // menggesernya tepat satu pola. Titik awalnya digeser separuh
        // jarak tempuh supaya jahitan tidak "meloncat" saat pertama kali
        // masuk layar.
        { xPercent: (drift * 50 * scale) / 2 },
        {
          xPercent: (-drift * 50 * scale) / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB.soft,
            invalidateOnRefresh: true,
          },
        },
      )
    }
  }

  mm.add(MEDIA.desktop, build(1))
  mm.add(MEDIA.tablet, build(0.75))
  mm.add(MEDIA.mobile, build(0.55))
}
