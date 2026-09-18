import { useLayoutEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'

import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'

/**
 * Tirai air yang surut saat berpindah halaman.
 *
 * Tanpa ini perpindahan ke `/kegiatan/<slug>` adalah potongan keras:
 * seluruh isi layar berganti dalam satu frame. Di situs yang setiap
 * bagiannya bertransisi pelan, satu potongan mendadak terasa seperti
 * tautan yang rusak.
 *
 * Tirainya dimainkan setelah halaman baru terpasang, bukan sebelumnya.
 * Menahan perpindahan demi animasi berarti menunda halaman yang diminta
 * pembaca; cara ini menampilkan halaman baru seketika, lalu menyingkap
 * tirai di atasnya. Bagi yang menonton hasilnya sama, bagi yang menunggu
 * tidak ada tambahan waktu sama sekali.
 *
 * `useLayoutEffect`, bukan `useEffect`: tirai harus sudah menutupi layar
 * pada frame yang sama ketika halaman baru dicat. Satu frame terlambat
 * berarti halaman barunya sempat terlihat, lalu tertutup — persis kedipan
 * yang ingin dihilangkan.
 */
export function RouteTransition() {
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    // Muat pertama sudah punya pembukaannya sendiri.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const veil = ref.current
    if (!veil || reducedMotion) return

    const tl = gsap
      .timeline()
      .set(veil, { autoAlpha: 1, yPercent: 0 })
      .to(veil, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' })
      .set(veil, { autoAlpha: 0 })

    return () => {
      tl.kill()
      gsap.set(veil, { autoAlpha: 0 })
    }
  }, [pathname, reducedMotion])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-90 bg-deep bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(14,116,144,0.55),transparent_70%)]"
    />
  )
}
