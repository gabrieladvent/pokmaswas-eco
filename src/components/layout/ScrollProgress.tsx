import { useEffect, useRef } from 'react'

import { navigation } from '@/data/navigation'
import { ScrollTrigger, gsap } from '@/lib/gsap'
import { scrollToSection } from '@/lib/scroll'

/**
 * Indikator bagian di sisi kanan.
 *
 * Status aktif ditulis sebagai atribut `data-active` langsung ke DOM oleh
 * ScrollTrigger, bukan disimpan sebagai state React — menggulir seluruh
 * halaman berarti belasan pergantian, dan tidak satu pun perlu memicu
 * render ulang. Seluruh penekanan visualnya ditangani CSS.
 *
 * Hanya muncul dari `xl` ke atas: di layar yang lebih sempit ia akan
 * berebut ruang dengan konten, dan navbar sudah menyediakan hal yang sama.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const ctx = gsap.context(() => {
      const items = Array.from(root.querySelectorAll<HTMLElement>('[data-progress-item]'))

      items.forEach((item) => {
        const href = item.dataset.target
        if (!href) return
        const target = document.querySelector(href)
        if (!target) return

        ScrollTrigger.create({
          trigger: target,
          start: 'top center',
          end: 'bottom center',
          invalidateOnRefresh: true,
          onToggle: (self) => {
            item.dataset.active = String(self.isActive)
          },
        })
      })

      // Rel progres keseluruhan halaman.
      const rail = root.querySelector<HTMLElement>('[data-progress-rail]')
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: { trigger: document.body, start: 'top top', end: 'max', scrub: 0.4 },
          },
        )
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={ref}
      aria-label="Lompat ke bagian"
      /*
       * Dua batasan yang keduanya penting:
       *
       * - `mix-blend-difference` membuat indikator membalik warna terhadap
       *   apa pun di belakangnya, jadi ia tetap terbaca baik di atas pasir
       *   terang maupun laut dalam tanpa perlu tahu nada section.
       * - Ambang 1760px adalah titik di mana container `wide` (100rem)
       *   berhenti melebar dan menyisakan gutter sungguhan. Di bawah itu
       *   indikator akan menimpa teks, jadi ia tidak ditampilkan.
       */
      className="pointer-events-none fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 mix-blend-difference min-[1760px]:block"
    >
      <div className="relative flex items-stretch gap-4">
        <ul className="pointer-events-auto flex flex-col gap-6">
          {navigation.map((item, index) => (
            <li
              key={item.href}
              data-progress-item
              data-target={item.href}
              data-active="false"
              className="group flex items-center justify-end gap-3"
            >
              <button
                type="button"
                onClick={() => scrollToSection(item.href)}
                className="flex items-center justify-end gap-3 text-right"
              >
                {/* Label hanya hadir saat aktif atau di-hover, supaya
                    indikator tetap kecil dan tidak mengganggu. */}
                <span
                  className="font-body text-[0.6875rem] tracking-[0.22em] text-white/80 uppercase opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-data-[active=true]:opacity-100"
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className="font-body text-[0.625rem] tabular-nums text-white/40 transition-colors duration-400 group-hover:text-white group-data-[active=true]:text-white"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-px w-5 origin-right bg-white/30 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-[1.6] group-hover:bg-white group-data-[active=true]:scale-x-[1.6] group-data-[active=true]:bg-white"
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Rel progres keseluruhan. */}
        <div aria-hidden="true" className="relative w-px bg-white/20">
          <span data-progress-rail className="absolute inset-0 block origin-top bg-white" />
        </div>
      </div>
    </nav>
  )
}
