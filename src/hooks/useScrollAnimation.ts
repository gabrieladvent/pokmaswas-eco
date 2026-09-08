import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'

/** Builds animations for `root`; anything it creates is reverted on cleanup. */
export type AnimationFactory<T extends HTMLElement> = (root: T) => void

/**
 * Menjalankan pabrik animasi di dalam `gsap.context` yang terikat `ref`.
 *
 * Context inilah yang membuat cleanup dapat diandalkan: setiap tween,
 * timeline, dan ScrollTrigger yang dibuat di dalamnya di-revert bersama
 * saat komponen dilepas, sehingga tidak ada yang bocor antar-rute.
 *
 * Sengaja `useLayoutEffect`, bukan `useEffect`. ScrollTrigger yang memakai
 * `pin` membungkus elemennya dalam `pin-spacer`, sehingga induk elemen itu
 * tidak lagi sama dengan yang dicatat React. Cleanup pasif berjalan
 * *setelah* React mencopot node, dan React akan gagal dengan
 * "removeChild: node bukan anak dari node ini" begitu pengunjung berpindah
 * halaman. Cleanup layout berjalan sebelum pencopotan, jadi pin-spacer
 * sudah dilepas lebih dulu.
 *
 * Komponen tetap deklaratif — mereka memegang markup dan ref, sementara
 * gerakannya sendiri tinggal di `src/animations/`.
 */
export function useScrollAnimation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  factory: AnimationFactory<T>,
  deps: readonly unknown[] = [],
): void {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => factory(root), root)
    return () => ctx.revert()
    // The factory is intentionally excluded: callers pass inline closures,
    // and `deps` is the explicit contract for when to rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
