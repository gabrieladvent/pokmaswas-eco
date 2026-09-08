import { useCallback } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { scrollToSection } from '@/lib/scroll'

/**
 * Menangani tautan ke bagian di dalam beranda dari halaman mana pun.
 *
 * Di beranda, tautan cukup menggulir. Dari halaman cerita, bagian yang
 * dituju belum ada di DOM — jadi tautan berpindah ke `/#bagian` lebih
 * dulu, dan beranda yang menggulir setelah termuat (lihat `Home`).
 */
export function useSectionNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (href: string) => {
      if (pathname === '/') {
        scrollToSection(href)
        return
      }
      navigate(`/${href}`)
    },
    [navigate, pathname],
  )
}
