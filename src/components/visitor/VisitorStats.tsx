import { useEffect, useRef, useState } from 'react'

import { createStatsReveal, createStatsRipple } from '@/animations/visitor'
import { createWordReveal } from '@/animations'
import { Container } from '@/components/common/Container'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { Section } from '@/components/common/Section'
import { UnderwaterFX } from '@/components/ocean/UnderwaterFX'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useVisitorCounter } from '@/hooks/useVisitorCounter'
import { VisitorCounter } from './VisitorCounter'

/**
 * "Jejak Kita" — bagian yang menempatkan pembaca ke dalam ceritanya.
 *
 * Angkanya nyata: diambil dari layanan penghitung yang sama yang memberi
 * nomor pengunjung di layar sambutan. Bila layanan itu tidak terjangkau,
 * bagian ini tetap tampil dengan kalimatnya dan tanpa angka — bukan dengan
 * pesan galat, dan bukan dengan nol yang menyesatkan.
 */
export function VisitorStats() {
  const ref = useRef<HTMLElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  /*
   * Statistik baru diminta ketika bagian ini mendekati layar.
   *
   * Hitungan mingguan berarti membaca tujuh ember harian; melakukannya saat
   * halaman dibuka berarti tujuh permintaan yang belum tentu terpakai —
   * pembaca mungkin tidak pernah menggulir sejauh ini. Nomor pengunjung
   * sendiri sudah dicatat jauh sebelumnya di layar sambutan.
   */
  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      // Satu layar lebih awal, supaya angkanya sudah siap saat terlihat.
      { rootMargin: '100% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const { stats } = useVisitorCounter({ withStats: nearViewport })

  useScrollAnimation(
    ref,
    (root) => {
      createWordReveal(root)
      createStatsReveal(root)
      createStatsRipple(root)
    },
    [stats !== null],
  )

  return (
    <Section id="jejak" tone="deep" ref={ref} className="overflow-hidden">
      <UnderwaterFX variant="subtle" className="opacity-70" />

      {/* Garis air di belakang angka — gerak laut, bukan pendar dasbor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.13]"
      >
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="h-56 w-full">
          <path
            d="M0 60c180 0 240 40 420 40s260-48 440-48 260 36 420 36 160-14 160-14"
            fill="none"
            className="stroke-seafoam"
            strokeWidth={1.5}
          />
          <path
            d="M0 120c200 0 260 36 460 36s280-40 480-40 260 28 500 28"
            fill="none"
            className="stroke-turquoise"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      <Container width="wide" className="relative">
        <div className="max-w-2xl">
          <Eyebrow className="text-seafoam">Kehadiran</Eyebrow>
          <SplitHeading
            lines={['Jejak Kita.']}
            reveal="word"
            className="max-w-[12ch] text-offwhite"
          />
          <p data-reveal className="mt-8 max-w-xl font-body text-lead text-offwhite/65">
            Menjaga laut bukan pekerjaan satu kelompok. Setiap orang yang singgah di ruang digital
            ini ikut menjadi bagian dari perjalanannya.
          </p>
        </div>

        <div className="mt-24 grid gap-20 sm:grid-cols-2 sm:gap-12 lg:gap-20">
          <VisitorCounter
            value={stats?.total ?? null}
            label="Orang telah berkunjung"
            caption="Jumlah kunjungan ke ruang digital Pokmaswas San Dominggo sejak penghitung ini dipasang."
          />
          <VisitorCounter
            value={stats?.weekly ?? null}
            label="Kunjungan 7 hari terakhir"
            caption="Dihitung dari tujuh hari ke belakang, diperbarui setiap kali halaman ini dibuka."
          />
        </div>

        <p
          data-reveal
          className="mt-20 max-w-2xl border-l border-white/12 pl-5 font-body text-xs leading-relaxed text-offwhite/40"
        >
          Penghitung ini anonim. Tidak ada nama, alamat surel, lokasi, maupun pengenal perangkat
          yang disimpan — hanya jumlah kunjungan.
        </p>
      </Container>
    </Section>
  )
}
