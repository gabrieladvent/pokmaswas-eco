import { useEffect } from 'react'

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import { Cursor } from '@/components/common/Cursor'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { useLenis } from '@/hooks/useLenis'
import { ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/lib/scroll'
import ActivityDetail from '@/pages/ActivityDetail'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const { pathname, hash } = useLocation()

  useLenis()

  /*
   * Berpindah halaman berarti seluruh isi `main` berganti, sehingga setiap
   * ScrollTrigger mengukur tata letak yang sudah tidak ada lagi.
   *
   * Posisi scroll juga direset — kecuali bila tujuannya memang sebuah
   * bagian di beranda (`/#kegiatan`), yang penggulirannya diurus `Home`.
   */
  useEffect(() => {
    if (!hash) {
      getLenis()?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }
    ScrollTrigger.refresh()
  }, [pathname, hash])

  /*
   * Foto datang setelah cat pertama dan mengubah tinggi section. Satu
   * refresh setelah semuanya termuat memperbaiki seluruh pengukuran.
   */
  useEffect(() => {
    const refresh = (): void => ScrollTrigger.refresh()

    if (document.readyState === 'complete') {
      refresh()
    } else {
      window.addEventListener('load', refresh, { once: true })
    }

    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <Navbar />
      {pathname === '/' ? <ScrollProgress /> : null}

      <main id="konten-utama">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kegiatan/:slug" element={<ActivityDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <Cursor />
    </>
  )
}
