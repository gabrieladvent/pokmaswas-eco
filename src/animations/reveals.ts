import { MEDIA, SCRUB, gsap } from '@/lib/gsap'

/**
 * Kosakata reveal.
 *
 * Sebelumnya setiap bagian dibuka dengan rangkaian yang sama persis —
 * eyebrow naik, judul naik, paragraf naik. Hasilnya benar, tetapi setelah
 * bagian ketiga pembaca sudah hafal gerakannya dan berhenti memperhatikan.
 *
 * Berkas ini menyediakan beberapa cara masuk yang berbeda watak, supaya
 * tiap bagian bisa memilih yang paling cocok dengan isinya. Aturannya satu:
 * sebuah bagian memakai satu watak saja, dan bagian yang bersebelahan tidak
 * memakai watak yang sama.
 *
 * Semuanya hanya menyentuh `transform`, `opacity`, `clip-path`, dan
 * `filter` — tidak ada yang memicu layout.
 */

export interface RevealOptions {
  readonly selector?: string
  readonly start?: string
  readonly stagger?: number
  readonly duration?: number
  readonly trigger?: Element
}

function targets(root: Element, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
}

/* ------------------------------------------------------------------ *
 * Mask — tersingkap dari kiri, seperti air surut dari batu
 * ------------------------------------------------------------------ */

/**
 * Wataknya mendatar dan tenang. Dipakai untuk bagian yang berpijak di
 * darat: ia tidak naik dari bawah seperti yang lain, ia tersingkap.
 */
export function createMaskReveal(root: Element, options: RevealOptions = {}): void {
  const { selector = '[data-mask]', start = 'top 82%', stagger = 0.12, duration = 1.25 } = options
  const items = targets(root, selector)
  if (items.length === 0) return

  gsap.from(items, {
    clipPath: 'inset(0% 100% 0% 0%)',
    duration,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger: options.trigger ?? root, start, once: true },
  })
}

/* ------------------------------------------------------------------ *
 * Depth — jauh lalu mendekat, kabur lalu jernih
 * ------------------------------------------------------------------ */

/**
 * Wataknya sinematik: elemennya datang dari kejauhan, bukan dari bawah.
 *
 * Blur hanya di desktop. Menganimasikan `filter` memaksa satu lapisan
 * digambar ulang tiap frame, dan di ponsel kelas menengah itulah yang
 * pertama menjatuhkan frame rate.
 */
export function createDepthReveal(root: Element, options: RevealOptions = {}): void {
  const { selector = '[data-depth]', start = 'top 84%', stagger = 0.1, duration = 1.4 } = options
  const items = targets(root, selector)
  if (items.length === 0) return

  const trigger = options.trigger ?? root
  const base = {
    opacity: 0,
    scale: 0.92,
    y: 28,
    duration,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger, start, once: true },
  } as const

  const mm = gsap.matchMedia()
  mm.add(MEDIA.desktop, () => {
    gsap.from(items, { ...base, filter: 'blur(14px)' })
  })
  mm.add(MEDIA.belowDesktop, () => {
    gsap.from(items, base)
  })
}

/* ------------------------------------------------------------------ *
 * Drift — hanyut masuk dari samping, berselang-seling
 * ------------------------------------------------------------------ */

export interface DriftOptions extends RevealOptions {
  /** Jarak hanyut dalam piksel. */
  readonly distance?: number
  /** `alternate` membuat elemen genap datang dari kiri, ganjil dari kanan. */
  readonly direction?: 'left' | 'right' | 'alternate'
}

/**
 * Wataknya seperti benda yang terbawa arus: masuk menyamping, bukan
 * terangkat. Dipakai untuk daftar dan blok yang berdampingan.
 */
export function createDriftReveal(root: Element, options: DriftOptions = {}): void {
  const {
    selector = '[data-drift]',
    start = 'top 84%',
    stagger = 0.1,
    duration = 1.2,
    distance = 46,
    direction = 'left',
  } = options

  const items = targets(root, selector)
  if (items.length === 0) return

  const trigger = options.trigger ?? root

  const offsetFor = (index: number): number => {
    if (direction === 'alternate') return index % 2 === 0 ? -distance : distance
    return direction === 'left' ? -distance : distance
  }

  // Di layar sempit jarak mendatar dipangkas: hanyut sejauh 46px pada
  // lebar 360px terbaca sebagai elemen yang hampir keluar layar.
  const mm = gsap.matchMedia()

  const build = (scale: number) => () => {
    items.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        x: offsetFor(index) * scale,
        duration,
        ease: 'expo.out',
        delay: index * stagger,
        scrollTrigger: { trigger, start, once: true },
      })
    })
  }

  mm.add(MEDIA.desktop, build(1))
  mm.add(MEDIA.tablet, build(0.7))
  mm.add(MEDIA.mobile, build(0.45))
}

/* ------------------------------------------------------------------ *
 * Tide — terangkat bersama air yang naik
 * ------------------------------------------------------------------ */

/**
 * Versi yang lebih bertenaga dari reveal naik biasa: elemennya tidak
 * sekadar muncul, ia terangkat sambil sedikit melebar, seperti sesuatu
 * yang didorong ke permukaan.
 */
export function createTideReveal(root: Element, options: RevealOptions = {}): void {
  const { selector = '[data-tide]', start = 'top 84%', stagger = 0.11, duration = 1.3 } = options
  const items = targets(root, selector)
  if (items.length === 0) return

  gsap.from(items, {
    opacity: 0,
    y: 54,
    scaleY: 0.96,
    transformOrigin: 'bottom center',
    duration,
    ease: 'expo.out',
    stagger,
    scrollTrigger: { trigger: options.trigger ?? root, start, once: true },
  })
}

/* ------------------------------------------------------------------ *
 * Sustained parallax — bergerak selama bagiannya terlihat
 * ------------------------------------------------------------------ */

export interface LayerDriftOptions {
  /** Jarak tempuh dalam persen tinggi elemen, pada desktop. */
  readonly distance?: number
  /** Pengali untuk tablet dan ponsel. */
  readonly tablet?: number
  readonly mobile?: number
  readonly trigger?: Element
}

/**
 * Parallax satu lapisan, dengan amplitudo berbeda per lebar layar.
 *
 * Berbeda dari `createParallax` yang lama, versi ini tidak pernah mematikan
 * gerakannya di ponsel — ia hanya mengecilkannya. Bagian terbesar dari
 * pengunjung membuka situs ini dari ponsel, dan mematikan seluruh kedalaman
 * di sana berarti merekalah yang justru tidak pernah melihat situsnya
 * bergerak.
 */
export function createLayerDrift(element: Element, options: LayerDriftOptions = {}): void {
  const { distance = 14, tablet = 0.6, mobile = 0.38, trigger } = options
  const mm = gsap.matchMedia()

  const build = (travel: number) => () => {
    gsap.fromTo(
      element,
      { yPercent: -travel / 2 },
      {
        yPercent: travel / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger ?? element.parentElement ?? element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB.soft,
          invalidateOnRefresh: true,
        },
      },
    )
  }

  mm.add(MEDIA.desktop, build(distance))
  mm.add(MEDIA.tablet, build(distance * tablet))
  mm.add(MEDIA.mobile, build(distance * mobile))
}
