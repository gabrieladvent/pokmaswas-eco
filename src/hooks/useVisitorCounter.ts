import { useEffect, useState } from 'react'

import { getVisitorStats, registerVisit } from '@/services/visitorCounter'
import type { VisitorStats, VisitorStatus, VisitorVisit } from '@/types/visitor'

export interface UseVisitorCounterOptions {
  /** Ambil juga statistik total dan mingguan. Bagian sambutan tidak
   *  membutuhkannya, jadi permintaannya tidak dilakukan. */
  readonly withStats?: boolean
}

export interface UseVisitorCounterResult {
  readonly status: VisitorStatus
  readonly visit: VisitorVisit | null
  readonly stats: VisitorStats | null
}

/**
 * Menyediakan nomor pengunjung dan statistiknya.
 *
 * Hook ini tidak tahu apa pun tentang cara data disimpan — semuanya lewat
 * `services/visitorCounter`. Kegagalan tidak pernah dilemparkan ke atas:
 * yang muncul hanyalah status `unavailable`, dan pemanggil menampilkan
 * halaman tanpa angka.
 */
export function useVisitorCounter(
  options: UseVisitorCounterOptions = {},
): UseVisitorCounterResult {
  const { withStats = false } = options

  const [status, setStatus] = useState<VisitorStatus>('idle')
  const [visit, setVisit] = useState<VisitorVisit | null>(null)
  const [stats, setStats] = useState<VisitorStats | null>(null)

  useEffect(() => {
    let active = true
    setStatus('loading')

    // Kedua fungsi ini dimemoisasi di dalam service, jadi memanggilnya
    // dari beberapa komponen tetap menghasilkan satu permintaan saja.
    const pending = withStats
      ? Promise.all([registerVisit(), getVisitorStats()])
      : registerVisit().then((result) => [result, null] as const)

    pending
      .then(([visitResult, statsResult]) => {
        if (!active) return
        setVisit(visitResult)
        setStats(statsResult)
        setStatus(visitResult === null && statsResult === null ? 'unavailable' : 'ready')
      })
      .catch(() => {
        if (!active) return
        setStatus('unavailable')
      })

    return () => {
      active = false
    }
  }, [withStats])

  return { status, visit, stats }
}
