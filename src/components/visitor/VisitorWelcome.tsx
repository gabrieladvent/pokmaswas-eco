import { useEffect, useRef, useState } from 'react'

import { createOceanReveal, createWelcomeGreeting, createWelcomeIntro } from '@/animations/visitor'
import { UnderwaterFX } from '@/components/ocean/UnderwaterFX'
import { useVisitorCounter } from '@/hooks/useVisitorCounter'
import { gsap } from '@/lib/gsap'
import { lockScroll, unlockScroll } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import { markWelcomeShown } from '@/lib/visitorSession'
import { site } from '@/data/site'
import { VisitorNumber } from './VisitorNumber'

/** Nama kelompok tampil setidaknya selama ini sebelum babak berikutnya
 *  mulai bertumpuk di atasnya. */
const MIN_INTRO_MS = 600

/**
 * Batas menunggu layanan penghitung, dihitung sejak halaman dipasang.
 *
 * Setelah tenggat ini urutannya berjalan terus tanpa nomor. Penghitung
 * pengunjung tidak pernah boleh menjadi alasan seseorang menatap layar
 * kosong.
 */
const MAX_WAIT_MS = 1600

type Phase = 'intro' | 'greeting' | 'exit'

export interface VisitorWelcomeProps {
  readonly onFinish: () => void
}

/**
 * Pembukaan: nama kelompok, sapaan, nomor pengunjung, lalu tirai air yang
 * surut memperlihatkan Hero.
 *
 * Ini bukan halaman tersendiri — ia melapisi situs yang sudah terpasang di
 * bawahnya, sehingga bukaannya berakhir tepat di Hero tanpa perpindahan
 * halaman.
 *
 * Kedua babaknya berada di kotak setinggi tetap yang saling menimpa, bukan
 * saling menggantikan. Tidak ada elemen yang mendorong elemen lain, jadi
 * tidak ada lompatan tata letak di tengah animasi.
 */
export function VisitorWelcome({ onFinish }: VisitorWelcomeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [minElapsed, setMinElapsed] = useState(false)
  const [waitedTooLong, setWaitedTooLong] = useState(false)

  const { visit, status } = useVisitorCounter()
  const settled = status === 'ready' || status === 'unavailable'
  const number = visit?.visitorNumber ?? null
  const returning = visit?.returning ?? false

  useEffect(() => {
    markWelcomeShown()
    lockScroll()

    /*
     * Fokus dipindahkan ke tombol lewati.
     *
     * Lapisan ini menutupi seluruh halaman, jadi pengguna keyboard dan
     * pembaca layar harus mendarat pada jalan keluarnya — bukan pada
     * konten di baliknya yang sedang tidak terlihat.
     */
    skipRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setPhase('exit')
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      unlockScroll()
    }
  }, [])

  useEffect(() => {
    const minTimer = window.setTimeout(() => setMinElapsed(true), MIN_INTRO_MS)
    const maxTimer = window.setTimeout(() => setWaitedTooLong(true), MAX_WAIT_MS)
    return () => {
      window.clearTimeout(minTimer)
      window.clearTimeout(maxTimer)
    }
  }, [])

  /* Babak satu — berjalan seketika, tanpa menunggu jaringan. */
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const ctx = gsap.context(() => createWelcomeIntro(root), root)
    return () => ctx.revert()
  }, [])

  /* Beralih ke sapaan begitu nomornya tiba — atau begitu tenggat lewat. */
  useEffect(() => {
    if (phase !== 'intro') return
    if (!minElapsed) return
    if (!settled && !waitedTooLong) return
    setPhase('greeting')
  }, [phase, minElapsed, settled, waitedTooLong])

  /* Babak dua. */
  useEffect(() => {
    const root = ref.current
    if (!root || phase !== 'greeting') return

    const ctx = gsap.context(
      () =>
        createWelcomeGreeting(root, {
          hasNumber: number !== null,
          onComplete: () => setPhase('exit'),
        }),
      root,
    )
    return () => ctx.revert()
  }, [phase, number])

  /* Babak tiga — tirai surut. */
  useEffect(() => {
    const root = ref.current
    if (!root || phase !== 'exit') return

    const ctx = gsap.context(() => createOceanReveal(root, onFinish), root)
    return () => ctx.revert()
  }, [phase, onFinish])

  const greeting = returning ? 'Selamat datang kembali' : 'Selamat datang'

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-label="Layar pembuka Pokmaswas San Dominggo"
      className="fixed inset-0 z-200 flex flex-col items-center justify-center overflow-hidden bg-deep px-6 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(14,116,144,0.35),transparent_70%)]"
      />
      <UnderwaterFX variant="subtle" className="opacity-60" />

      {/* Air yang ikut surut bersama tirai. */}
      <div
        data-welcome-tide
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-seafoam/20 via-ocean/40 to-transparent"
      />

      <div data-welcome-content className="relative flex w-full max-w-3xl flex-col items-center">
        {/* Nama kelompok — tidak pernah berpindah tempat, hanya mundur
            fokusnya saat sapaan naik. */}
        <div data-welcome-brand>
          <p className="font-display text-[clamp(1.5rem,5vw,2.75rem)] leading-none font-extrabold tracking-[0.16em] text-offwhite">
            {[...site.shortName].map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom"
              >
                <span data-welcome-letter className="inline-block">
                  {letter}
                </span>
              </span>
            ))}
          </p>
          <p
            data-welcome-sub
            className="mt-3 font-body text-[0.6875rem] font-medium tracking-[0.32em] text-seafoam/80 uppercase"
          >
            {site.address.village}
          </p>
        </div>

        <span
          data-welcome-rule
          aria-hidden="true"
          className="mt-7 block h-px w-16 origin-center bg-seafoam/40"
        />

        {/*
          Kotak setinggi tetap. Kedua babak menempatinya bersamaan secara
          absolut, sehingga yang satu bisa memudar sementara yang lain naik
          tanpa mendorong apa pun.
        */}
        {/* Tingginya harus memuat babak terpanjang — sapaan, label, angka,
            garisnya, lalu ajakan yang berlabuh di dasar kotak. Kurang dari
            ini, garis di bawah angka menimpa teks ajakan. */}
        <div className="relative mt-9 h-80 w-full sm:h-[22rem]">
          <p
            data-welcome-standby
            className="absolute inset-x-0 top-1 font-body text-[0.6875rem] tracking-[0.28em] text-offwhite/40 uppercase"
          >
            Memuat
          </p>

          {phase !== 'intro' ? (
            <div className="absolute inset-0 flex flex-col items-center">
              <p
                data-welcome-greeting
                className="font-display text-[clamp(1.375rem,3.2vw,2.25rem)] leading-tight font-extrabold text-offwhite"
              >
                {greeting}
              </p>

              {number !== null ? (
                <>
                  <p
                    data-welcome-label
                    className="mt-6 font-body text-[0.6875rem] tracking-[0.28em] text-seafoam uppercase"
                  >
                    Anda adalah pengunjung ke-
                  </p>
                  <p
                    data-welcome-number
                    className="mt-3 font-display text-[clamp(3.25rem,11vw,7rem)] leading-none font-extrabold text-offwhite"
                  >
                    <VisitorNumber value={number} trigger="immediate" />
                  </p>
                  <span
                    data-welcome-number-rule
                    aria-hidden="true"
                    className="mt-5 block h-px w-24 origin-center bg-seafoam/50"
                  />
                </>
              ) : null}

              <p
                data-welcome-enter
                className={cn(
                  'font-body text-[0.6875rem] tracking-[0.32em] text-offwhite/50 uppercase',
                  // Dengan nomor, ajakan berlabuh di dasar kotak agar
                  // posisinya tetap. Tanpa nomor, kotak itu nyaris kosong —
                  // jadi ajakannya mengikuti sapaan, bukan menggantung jauh
                  // di bawahnya.
                  number !== null ? 'mt-auto' : 'mt-10',
                )}
              >
                Masuk ke laut
              </p>
              <span
                data-welcome-enter-line
                aria-hidden="true"
                className="mt-4 block h-8 w-px origin-top bg-gradient-to-b from-seafoam/60 to-transparent"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Selalu ada jalan keluar. Bukaan yang tidak bisa dilewati adalah
          bukaan yang menahan orang. */}
      <button
        ref={skipRef}
        type="button"
        onClick={() => setPhase('exit')}
        aria-label="Lewati layar pembuka"
        onKeyDown={(event) => {
          // Menahan Tab di dalam lapisan: tombol ini satu-satunya kendali,
          // jadi fokus tidak boleh berpindah ke halaman yang tertutup.
          if (event.key === 'Tab') event.preventDefault()
        }}
        className="absolute right-6 bottom-8 rounded-full border border-white/15 px-5 py-2.5 font-body text-[0.6875rem] tracking-[0.2em] text-offwhite/60 uppercase transition-colors duration-300 hover:border-seafoam/50 hover:text-seafoam sm:right-10"
      >
        Lewati
      </button>
    </div>
  )
}
