import { MEDIA, SCRUB, gsap } from '@/lib/gsap'
import { createImageReveal } from './imageAnimations'
import {
  createDepthReveal,
  createDriftReveal,
  createLayerDrift,
  createMaskReveal,
  createTideReveal,
} from './reveals'
import { createLineReveal, createWordReveal } from './textAnimations'

/* ------------------------------------------------------------------ *
 * Generic reveal
 * ------------------------------------------------------------------ */

export interface RevealConfig {
  readonly selector?: string
  readonly y?: number
  readonly stagger?: number
  readonly start?: string
}

export function createRevealAnimation(root: Element, config: RevealConfig = {}): void {
  const { selector = '[data-reveal]', y = 34, stagger = 0.09, start = 'top 82%' } = config
  const targets = selector ? root.querySelectorAll(selector) : [root]
  if (targets.length === 0) return

  gsap.from(targets, {
    opacity: 0,
    y,
    duration: 1.15,
    ease: 'power3.out',
    stagger,
    scrollTrigger: { trigger: root, start, once: true },
  })
}

/* ------------------------------------------------------------------ *
 * About — text reveal against a clip-path image
 * ------------------------------------------------------------------ */

export function createAboutAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  /*
   * Watak bagian ini: mendatar dan berpijak.
   *
   * Inilah satu-satunya bagian yang seluruhnya berada di darat, jadi tidak
   * ada yang terangkat dari bawah di sini. Judulnya tersingkap ke samping
   * dan paragrafnya hanyut masuk — bagian berikutnya, begitu pembaca masuk
   * ke air, barulah memakai gerak vertikal.
   */
  createRevealAnimation(root)
  createMaskReveal(root)
  createImageReveal(root, { distance: 16 })

  createDriftReveal(root, {
    selector: '[data-about-body] > *',
    trigger: q('[data-about-body]')[0],
    start: 'top 84%',
    distance: 40,
    stagger: 0.11,
  })

  gsap.from(q('[data-about-detail]'), {
    opacity: 0,
    y: 40,
    scale: 0.94,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('[data-reveal-frame]'), start: 'top 62%', once: true },
  })

  gsap.from(q('[data-about-caption]'), {
    opacity: 0,
    y: 20,
    duration: 1,
    scrollTrigger: { trigger: q('[data-about-caption]'), start: 'top 92%', once: true },
  })

  /*
   * Foto sisipan bergerak berlawanan arah dengan foto utama, jadi keduanya
   * saling melewati alih-alih naik bersama. Dulu hanya di desktop; di
   * tablet foto ini tampil (`sm:block`) tetapi diam, dan justru
   * kediamannya yang membuatnya terlihat seperti tempelan.
   */
  for (const detail of q('[data-about-detail]')) {
    createLayerDrift(detail, { trigger: root, distance: -20, tablet: 0.65, mobile: 0.4 })
  }
}

/* ------------------------------------------------------------------ *
 * Roles — vertical scroll converted to horizontal movement
 * ------------------------------------------------------------------ */

export function createRolesAnimation(root: HTMLElement): void {
  /*
   * Watak bagian ini: sinematik dan menyamping.
   *
   * Judulnya datang dari kejauhan — kabur lalu jernih — sebagai pembuka
   * untuk kartu-kartu yang sebentar lagi melintas mendatar.
   *
   * Sebelumnya di sini ada dua panggilan `createWordReveal` yang identik.
   * Keduanya menyasar elemen `[data-word]` yang sama, jadi tiap kata
   * mendapat dua tween `from` yang saling menimpa: yang kedua membaca
   * keadaan awal dari yang pertama, dan huruf-hurufnya sempat tersentak.
   */
  createRevealAnimation(root)
  createDepthReveal(root)

  const mm = gsap.matchMedia()

  mm.add(MEDIA.desktop, () => {
    const track = root.querySelector<HTMLElement>('[data-roles-track]')
    const progress = root.querySelector<HTMLElement>('[data-roles-progress]')
    if (!track) return

    const overflow = (): number => Math.max(0, track.scrollWidth - window.innerWidth)

    const tween = gsap.to(track, {
      x: () => -overflow(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${overflow()}`,
        pin: true,
        scrub: SCRUB.soft,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    if (progress) {
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${overflow()}`,
          // Nilainya harus sama persis dengan trek kartunya. Sebelumnya
          // bilah ini `scrub: true` sementara treknya tertinggal satu
          // detik, jadi penanda posisi menunjuk kartu yang belum tiba.
          scrub: SCRUB.soft,
        },
      })
    }

    for (const card of track.querySelectorAll<HTMLElement>('[data-role-card]')) {
      gsap.from(card.querySelector('[data-role-body]'), {
        opacity: 0,
        y: 40,
        duration: 0.9,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left 88%',
          once: true,
        },
      })
    }
  })

  mm.add(MEDIA.belowDesktop, () => {
    const rail = root.querySelector<HTMLElement>('[data-roles-rail]')
    const progress = root.querySelector<HTMLElement>('[data-roles-rail-progress]')

    /*
     * Rel-nya masuk sebagai satu blok, bukan kartu per kartu.
     *
     * Reveal berjenjang tidak masuk akal di sini: hanya kartu pertama yang
     * ada di layar, jadi sisanya menyelesaikan animasinya di luar pandangan
     * dan sudah diam ketika pembaca menggeser ke sana.
     */
    if (rail) {
      gsap.from(rail, {
        opacity: 0,
        y: 44,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: rail, start: 'top 88%', once: true },
      })
    }

    if (!rail || !progress) return

    /*
     * Penanda posisi dijalankan oleh gulir rel itu sendiri, bukan oleh
     * ScrollTrigger: yang diukur di sini gerakan mendatar di dalam satu
     * wadah, sementara ScrollTrigger mengamati gulir halaman.
     *
     * `quickTo` menyiapkan satu tween yang dipakai ulang — satu peristiwa
     * gulir sentuh bisa memicu puluhan panggilan per detik, dan membuat
     * tween baru pada tiap panggilan berarti membuang objek sebanyak itu
     * pula.
     */
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })
    const scaleTo = gsap.quickTo(progress, 'scaleX', { duration: 0.3, ease: 'power2.out' })

    const update = (): void => {
      const travel = rail.scrollWidth - rail.clientWidth
      // Rel yang muat seluruhnya tidak punya posisi untuk ditandai.
      scaleTo(travel > 0 ? gsap.utils.clamp(0, 1, rail.scrollLeft / travel) : 0)
    }

    update()
    rail.addEventListener('scroll', update, { passive: true })
    return () => rail.removeEventListener('scroll', update)
  })
}

/* ------------------------------------------------------------------ *
 * Ocean statistics
 * ------------------------------------------------------------------ */

export function createStatsAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  /*
   * Watak bagian ini: terangkat ke permukaan.
   *
   * Keempat blok tidak sekadar muncul — masing-masing terdorong naik
   * sambil sedikit meregang, lalu garis di atasnya menarik dirinya dari
   * kiri ke kanan.
   */
  createRevealAnimation(root)
  createLineReveal(root)

  createTideReveal(root, {
    selector: '[data-stat]',
    trigger: q('[data-stats-grid]')[0],
    start: 'top 82%',
    stagger: 0.13,
  })

  // Angka penandanya melayang pelan selama bagian ini terlihat, jadi
  // keempatnya tidak berdiri sekaku kolom tabel.
  for (const [index, marker] of q('[data-stat-marker]').entries()) {
    createLayerDrift(marker, {
      trigger: q('[data-stats-grid]')[0],
      // Ganjil-genap berlawanan arah: itulah yang membuat baris ini
      // terbaca sebagai benda yang mengambang, bukan satu blok kaku.
      distance: index % 2 === 0 ? 22 : -22,
      tablet: 0.6,
      mobile: 0.4,
    })
  }

  gsap.from(q('[data-stat-rule]'), {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 1.4,
    ease: 'power3.inOut',
    stagger: 0.14,
    scrollTrigger: { trigger: q('[data-stats-grid]'), start: 'top 82%', once: true },
  })
}

/* ------------------------------------------------------------------ *
 * Community — the chain draws itself
 * ------------------------------------------------------------------ */

export function createCommunityAnimation(root: HTMLElement): void {
  const q = gsap.utils.selector(root)

  createRevealAnimation(root)
  createLineReveal(root)
  createWordReveal(root)

  const path = root.querySelector<SVGPathElement>('[data-chain-path]')
  if (path) {
    const dashLength = (): number => path.getBoundingClientRect().height || path.getTotalLength()

    gsap.fromTo(
      path,
      { strokeDashoffset: dashLength },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: q('[data-chain]'),
          start: 'top 72%',
          end: 'bottom 82%',
          scrub: SCRUB.soft,
          invalidateOnRefresh: true,
          onRefresh: () => gsap.set(path, { strokeDasharray: dashLength() }),
        },
      },
    )

    gsap.set(path, { strokeDasharray: dashLength() })
  }

  for (const node of root.querySelectorAll<HTMLElement>('[data-chain-node]')) {
    gsap
      .timeline({ scrollTrigger: { trigger: node, start: 'top 80%', once: true } })
      .from(node.querySelector('[data-chain-dot]'), {
        scale: 0,
        opacity: 0,
        duration: 0.75,
        ease: 'back.out(2.2)',
      })
      .from(
        node.querySelector('[data-chain-card]'),
        { opacity: 0, y: 30, duration: 1 },
        0.08,
      )
  }
}

/* ------------------------------------------------------------------ *
 * Gallery
 * ------------------------------------------------------------------ */

export function createGalleryAnimation(root: HTMLElement): void {
  /* Watak bagian ini: kedalaman. Judulnya mendekat dari jauh, lalu
     fotonya mekar dari tengah kisi. */
  createRevealAnimation(root)
  createDepthReveal(root)

  const items = root.querySelectorAll<HTMLElement>('[data-gallery-item]')
  if (items.length === 0) return

  /*
   * Foto mekar dari tengah, bukan berbaris dari kiri atas.
   *
   * `grid: 'auto'` membuat GSAP mengukur sendiri baris dan kolomnya dari
   * posisi elemen, jadi jedanya tetap benar ketika galeri berganti dari
   * tiga kolom ke satu kolom di layar sempit — tanpa perlu memberitahu
   * jumlah kolomnya dari sini.
   */
  gsap.from(items, {
    opacity: 0,
    y: 60,
    scale: 0.96,
    duration: 1.25,
    ease: 'expo.out',
    stagger: { each: 0.07, grid: 'auto', from: 'center' },
    scrollTrigger: {
      trigger: root.querySelector('[data-gallery-grid]'),
      start: 'top 84%',
      once: true,
    },
  })

  /*
   * Parallax tiap foto berjalan di semua lebar layar, hanya jaraknya yang
   * mengecil. Bingkainya sudah melebih (`inset-[-8%]`), jadi geseran
   * sekecil ini tidak pernah menyingkap tepi foto.
   */
  for (const item of items) {
    const image = item.querySelector<HTMLElement>('[data-gallery-image]')
    if (!image) continue
    createLayerDrift(image, { trigger: item, distance: 12, tablet: 0.6, mobile: 0.45 })
  }
}
