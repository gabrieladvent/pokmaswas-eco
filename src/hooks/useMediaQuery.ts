import { useCallback, useSyncExternalStore } from 'react'

import { MEDIA, REDUCED_MOTION_QUERY } from '@/lib/gsap'

/**
 * Subscribes to a media query without the extra render that the
 * `useState` + `useEffect` pattern causes on mount.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  // No SSR in this app, but keeping the server snapshot honest costs nothing.
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA.desktop)
}

export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA.mobile)
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}
