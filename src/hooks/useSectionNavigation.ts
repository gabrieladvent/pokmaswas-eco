import { useCallback } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { scrollToSection } from '@/lib/scroll'

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
