import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { createNavbarTransition } from '@/animations'
import { navigation } from '@/data/navigation'
import { site } from '@/data/site'
import { ScrollTrigger, gsap } from '@/lib/gsap'
import { useSectionNavigation } from '@/hooks/useSectionNavigation'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState<string>('')
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const goToSection = useSectionNavigation()
  const { pathname } = useLocation()

  /*
   * Transparan → buram. Tidak dibatasi reduced motion: ini perubahan
   * keadaan demi keterbacaan, bukan hiasan.
   *
   * Latarnya nyaris pekat (92%), bukan 72%. Navbar melayang di atas
   * campuran foto dan bidang terang — terutama di halaman cerita — dan
   * pada tingkat tembus yang lebih tinggi gambar di belakangnya menembus
   * setempat, sehingga bilahnya terlihat belang alih-alih menyatu.
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      createNavbarTransition(setScrolled)
    })
    return () => ctx.revert()
  }, [])

  /*
   * Bagian yang sedang aktif. Memakai ScrollTrigger, bukan
   * IntersectionObserver, karena section Peran yang di-pin mengacaukan
   * perhitungan perpotongan yang naif.
   *
   * Dibangun ulang tiap kali rute berubah: setelah berpindah halaman,
   * bagian-bagian yang lama sudah tidak ada di DOM, jadi trigger yang
   * menunjuk ke sana harus dibuang dan dipasang lagi.
   */
  useLayoutEffect(() => {
    // Halaman cerita tidak punya bagian-bagian beranda. Tanpa reset ini,
    // sorotan terakhir dari beranda ikut terbawa dan satu butir menu
    // tetap tampak aktif padahal pengunjung sudah pindah halaman.
    setActiveHref('')

    const ctx = gsap.context(() => {
      for (const item of navigation) {
        const target = document.querySelector(item.href)
        if (!target) continue

        ScrollTrigger.create({
          trigger: target,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActiveHref(item.href)
          },
        })
      }
    })

    // Sections mount with the page; refresh once measurements settle.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 0)

    return () => {
      window.clearTimeout(refresh)
      ctx.revert()
    }
  }, [pathname])

  const handleNavigate = (event: React.MouseEvent, href: string): void => {
    event.preventDefault()
    goToSection(href)
  }

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only-focusable z-100 rounded-full bg-seafoam px-5 py-3 font-body text-sm font-medium text-deep top-4 left-4"
      >
        Lompat ke konten utama
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-[var(--ease-out-expo)]',
          scrolled || menuOpen
            ? 'border-b border-white/10 bg-deep/92 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5',
        )}
      >
        <div className="mx-auto flex w-full max-w-[100rem] items-center justify-between gap-6 px-6 sm:px-8 lg:px-12">
          <a
            href="#beranda"
            onClick={(event) => handleNavigate(event, '#beranda')}
            className="group flex shrink-0 flex-col leading-none"
          >
            <span className="font-display text-lg font-extrabold tracking-[0.16em] text-offwhite">
              {site.shortName}
            </span>
            <span className="mt-1 font-body text-[0.625rem] tracking-[0.24em] text-seafoam/70 uppercase">
              San Dominggo
            </span>
          </a>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = activeHref === item.href
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={(event) => handleNavigate(event, item.href)}
                      className={cn(
                        'relative rounded-full px-4 py-2 font-body text-sm transition-colors duration-300',
                        isActive ? 'text-seafoam' : 'text-offwhite/75 hover:text-offwhite',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-4 -bottom-0.5 h-px origin-left bg-seafoam transition-transform duration-400 ease-[var(--ease-out-expo)]',
                          isActive ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#kontak"
              onClick={(event) => handleNavigate(event, '#kontak')}
              className="hidden rounded-full border border-seafoam/40 px-5 py-2.5 font-body text-sm font-medium text-seafoam transition-colors duration-300 hover:bg-seafoam hover:text-deep lg:inline-flex"
            >
              Hubungi Kami
            </a>

            <button
              ref={toggleRef}
              type="button"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
              className="relative z-50 flex size-11 items-center justify-center rounded-full border border-white/15 lg:hidden"
            >
              <span className="sr-only">{menuOpen ? 'Tutup menu' : 'Buka menu'}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={cn(
                    'absolute left-0 block h-px w-full bg-offwhite transition-transform duration-400 ease-[var(--ease-out-expo)]',
                    menuOpen ? 'top-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 block h-px w-full bg-offwhite transition-transform duration-400 ease-[var(--ease-out-expo)]',
                    menuOpen ? 'top-1/2 -rotate-45' : 'top-full',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={toggleRef} />
    </>
  )
}
