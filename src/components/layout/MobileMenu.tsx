import { useEffect, useRef } from 'react'

import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { lockScroll, unlockScroll } from '@/lib/scroll'
import { useSectionNavigation } from '@/hooks/useSectionNavigation'
import { navigation } from '@/data/navigation'
import { addressLines, site } from '@/data/site'

export interface MobileMenuProps {
  readonly open: boolean
  readonly onClose: () => void
  /** Focus returns here when the menu closes. */
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const goToSection = useSectionNavigation()
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  /* Escape closes; focus is trapped loosely inside the panel. */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  /* Scroll lock + focus handoff. */
  useEffect(() => {
    if (open) {
      lockScroll()
      firstLinkRef.current?.focus({ preventScroll: true })
      return () => unlockScroll()
    }
    return undefined
  }, [open])

  /* Panel + link choreography. */
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !open || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85 })
        .from('[data-menu-link]', { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.15)
        .from('[data-menu-meta]', { opacity: 0, y: 20, duration: 0.8 }, 0.42)
    }, panel)

    return () => ctx.revert()
  }, [open])

  const handleNavigate = (href: string): void => {
    onClose()
    triggerRef.current?.focus({ preventScroll: true })
    // Let the overlay unmount before scrolling, so the lock is released first.
    window.requestAnimationFrame(() => goToSection(href))
  }

  if (!open) return null

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col justify-between bg-deep px-6 pt-28 pb-10 lg:hidden"
    >
      <nav aria-label="Navigasi utama seluler">
        <ul className="flex flex-col gap-1">
          {navigation.map((item, index) => (
            <li key={item.href} className="overflow-hidden">
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                data-menu-link
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  handleNavigate(item.href)
                }}
                className="flex items-baseline gap-4 py-3 font-display text-[2.5rem] leading-none font-extrabold text-offwhite transition-colors hover:text-seafoam"
              >
                <span aria-hidden="true" className="font-body text-xs font-medium text-seafoam/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div data-menu-meta className="space-y-6">
        <a
          href="#kontak"
          onClick={(event) => {
            event.preventDefault()
            handleNavigate('#kontak')
          }}
          className="inline-flex w-full items-center justify-center rounded-full bg-seafoam px-6 py-4 font-body text-sm font-medium text-deep"
        >
          Hubungi Kami
        </a>
        <address className="font-body text-sm leading-relaxed text-offwhite/55 not-italic">
          <span className="mb-1 block font-medium text-offwhite/80">{site.name}</span>
          {addressLines.join(' · ')}
        </address>
      </div>
    </div>
  )
}
