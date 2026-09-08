import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import { HomePage } from '@/sections/Home/HomePage'
import { scrollToSection } from '@/lib/scroll'

/**
 * Rute `/`.
 *
 * Selain menampilkan halamannya, di sinilah `/#bagian` diselesaikan:
 * ketika pengunjung datang dari halaman cerita lewat tautan navigasi,
 * beranda memuat dulu, baru menggulir ke bagian yang diminta.
 */
export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    // Satu frame agar bagian-bagiannya sempat terpasang sebelum diukur.
    const id = window.requestAnimationFrame(() => scrollToSection(hash))
    return () => window.cancelAnimationFrame(id)
  }, [hash])

  return <HomePage />
}
