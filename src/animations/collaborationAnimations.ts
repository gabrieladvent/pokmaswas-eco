import { MEDIA, gsap } from '@/lib/gsap'

/** Menyiapkan panjang garis arus agar bisa "digambar" lewat dash offset. */
function primeCurrent(path: SVGPathElement): number {
  const length = path.getTotalLength()
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  return length
}

export function createCollaborationSequence(root: HTMLElement): void {
  const q = gsap.utils.selector(root)
  const mm = gsap.matchMedia()

  mm.add(MEDIA.desktop, () => {
    const track = root.querySelector<HTMLElement>('[data-collab-track]')
    if (!track) return

    for (const path of root.querySelectorAll<SVGPathElement>('[data-current]')) {
      primeCurrent(path)
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    /* Tahap 1 — Racatech, sendiri. */
    tl.from(q('[data-partner="racatech"]'), {
      opacity: 0,
      x: -70,
      filter: 'blur(12px)',
      duration: 1.2,
      ease: 'power2.out',
    })
      // `primeCurrent` sudah menyembunyikan garisnya dengan offset penuh, jadi
      // yang dibutuhkan di sini `.to(0)` — `.from(panjang)` justru bergerak
      // dari nilai yang sudah terpasang ke nilai yang sama, alias diam.
      .to(q('[data-current="a"]'), { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, 0.6)

      /* Tahap 2 — tanda silang. */
      .from(q('[data-collab-cross]'), { opacity: 0, scale: 0.4, duration: 0.8, ease: 'back.out(2)' }, 1.2)

      /* Tahap 3 — Pokmaswas, dari arah berlawanan. */
      .from(
        q('[data-partner="pokmaswas"]'),
        { opacity: 0, x: 70, filter: 'blur(12px)', duration: 1.2, ease: 'power2.out' },
        1.8,
      )
      .to(q('[data-current="b"]'), { strokeDashoffset: 0, duration: 1.4, ease: 'none' }, 2.4)

      /* Tahap 4 — keduanya mendekat. */
      .to(q('[data-partner="racatech"]'), { y: 18, duration: 1.2, ease: 'power2.inOut' }, 3.4)
      .to(q('[data-partner="pokmaswas"]'), { y: -18, duration: 1.2, ease: 'power2.inOut' }, 3.4)

      /* Tahap 5 — terhubung, lalu melebur jadi satu arus. */
      .from(q('[data-collab-link]'), { scaleY: 0, duration: 0.9, ease: 'power3.out' }, 4.2)
      .to(q('[data-current="a"]'), { opacity: 0, y: 90, duration: 1.2, ease: 'power2.inOut' }, 4.4)
      .to(q('[data-current="b"]'), { opacity: 0, y: -90, duration: 1.2, ease: 'power2.inOut' }, 4.4)
      .to(q('[data-current="merged"]'), { strokeDashoffset: 0, duration: 1.6, ease: 'none' }, 4.8)

      /* Tahap 6 — pernyataannya. */
      .from(q('[data-collab-statement]'), { opacity: 0, y: 28, duration: 1.1 }, 5.4)
      .from(q('[data-collab-description]'), { opacity: 0, y: 22, duration: 1.1 }, 5.9)

      /*
       * Penutup — pasangan itu mundur, menyerahkan layar ke kalimat
       * terakhir yang menyusul di bawahnya.
       *
       * Sengaja ditaruh di ujung: kalau mundurnya dimulai terlalu awal,
       * sisa jarak tempel yang panjang terisi layar yang nyaris kosong.
       */
      .to(q('[data-collab-figure]'), { scale: 0.9, opacity: 0.3, duration: 1.6, ease: 'power2.in' }, 8.4)
      .to(q('[data-collab-copy]'), { opacity: 0, y: -24, duration: 1.4, ease: 'power2.in' }, 8.6)
  })
}

/**
 * Versi ringkas untuk layar sempit.
 *
 * Tidak menempel, tidak ter-scrub, dan tidak memakai blur — setiap bagian
 * cukup muncul saat masuk viewport. Bagian ini tidak boleh menjadi tinggi
 * hanya demi animasi.
 */
export function createCollaborationReveal(root: HTMLElement): void {
  const mm = gsap.matchMedia()

  mm.add(MEDIA.belowDesktop, () => {
    for (const path of root.querySelectorAll<SVGPathElement>('[data-current]')) {
      primeCurrent(path)
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 80%', toggleActions: 'play none none none' },
      })
    }

    const steps = root.querySelectorAll<HTMLElement>('[data-collab-step]')
    if (steps.length === 0) return

    gsap.from(steps, {
      opacity: 0,
      y: 26,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: { trigger: root, start: 'top 78%', toggleActions: 'play none none none' },
    })
  })
}

/**
 * Kalimat penutup.
 *
 * Berjalan di semua lebar layar: bagian ini mengalir biasa, di luar area
 * yang menempel, jadi tidak pernah menimpa apa pun.
 */
export function createCollaborationClosing(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  gsap.from(q('[data-collab-closing-line]'), {
    yPercent: 115,
    duration: 1.3,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: q('[data-collab-closing]'),
      start: 'top 76%',
      toggleActions: 'play none none none',
    },
  })
}
