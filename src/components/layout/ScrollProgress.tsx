import { useEffect, useRef } from 'react'

import { navigation } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { SCRUB, gsap } from '@/lib/gsap'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/utils'

/**
 * Penunjuk posisi di tepi kanan.
 *
 * Dulu bagian ini hanya muncul mulai lebar 1760px — lebar yang praktis
 * tidak pernah terjadi: laptop paling umum berhenti di 1440 atau 1512, dan
 * monitor 1080p memberi 1920 hanya bila jendelanya dibuka penuh tanpa
 * penyesuaian skala. Akibatnya fitur ini ada di dalam bundel tetapi nyaris
 * tidak pernah terlihat siapa pun.
 *
 * Sekarang mulai dari 1536px, dengan satu kompromi: di bawah 1760px yang
 * tampil hanya garis dan titiknya — nama bagiannya baru ikut tampil bila
 * penunjuknya disentuh tetikus, sehingga tidak pernah menabrak isi halaman
 * yang lebarnya sudah mepet.
 *
 * Bagian mana yang aktif tidak diamati sendiri di sini. Bilah navigasi
 * membutuhkan jawaban yang sama, dan dua pengamat untuk satu pertanyaan
 * bisa berbeda pendapat tepat di batas bagian.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLElement>(null)
  const activeHref = useActiveSection()

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const ctx = gsap.context(() => {
      const rail = root.querySelector<HTMLElement>('[data-progress-rail]')
      if (!rail) return

      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'max',
            scrub: SCRUB.tight,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={ref}
      aria-label="Lompat ke bagian"
      className="pointer-events-none fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 mix-blend-difference 2xl:block min-[1760px]:right-8"
    >
      <div className="relative flex items-stretch gap-4">
        <ul className="pointer-events-auto flex flex-col gap-6">
          {navigation.map((item, index) => {
            const isActive = activeHref === item.href

            return (
              <li key={item.href} className="group flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className="flex items-center justify-end gap-3 text-right"
                >
                  <span
                    className={cn(
                      'font-body text-[0.6875rem] tracking-[0.22em] text-white/80 uppercase opacity-0 transition-opacity duration-400 group-hover:opacity-100',
                      // Nama bagian yang aktif baru ikut tampil dengan
                      // sendirinya pada layar yang memang cukup lebar.
                      isActive && 'min-[1760px]:opacity-100',
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-body text-[0.625rem] tabular-nums transition-colors duration-400 group-hover:text-white',
                      isActive ? 'text-white' : 'text-white/40',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'block h-px w-5 origin-right transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-[1.6] group-hover:bg-white',
                      isActive ? 'scale-x-[1.6] bg-white' : 'bg-white/30',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div aria-hidden="true" className="relative w-px bg-white/20">
          <span data-progress-rail className="absolute inset-0 block origin-top bg-white" />
        </div>
      </div>
    </nav>
  )
}
