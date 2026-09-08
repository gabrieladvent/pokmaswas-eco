import { useEffect, useRef } from 'react'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { lockScroll, unlockScroll } from '@/lib/scroll'

/**
 * Bentuk minimal yang dibutuhkan lightbox.
 *
 * Sengaja dibuat sesempit ini agar galeri editorial maupun kumpulan foto
 * per kegiatan bisa memakai komponen yang sama tanpa saling menyesuaikan
 * tipe datanya.
 */
export interface LightboxItem {
  readonly src: string
  readonly alt: string
  readonly caption: string
  /** Baris kecil di bawah caption — lokasi, tanggal, apa pun. */
  readonly meta?: string
}

export interface LightboxProps {
  readonly items: readonly LightboxItem[]
  readonly index: number
  readonly onClose: () => void
  readonly onNavigate: (index: number) => void
  /** Dibacakan sebagai konteks oleh pembaca layar. */
  readonly label?: string
}

export function Lightbox({ items, index, onClose, onNavigate, label }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const item = items[index]

  const total = items.length
  const goPrev = (): void => onNavigate((index - 1 + total) % total)
  const goNext = (): void => onNavigate((index + 1) % total)

  useEffect(() => {
    lockScroll()
    closeRef.current?.focus({ preventScroll: true })
    return () => unlockScroll()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${label ? `${label} — ` : ''}Foto ${index + 1} dari ${total}: ${item.caption}`}
      className="fixed inset-0 z-100 flex flex-col bg-deep-900/97 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <p className="font-body text-xs tracking-[0.2em] text-offwhite/50 uppercase">
          {label ? <span className="mr-3 text-seafoam/70">{label}</span> : null}
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup galeri"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 text-offwhite transition-colors hover:bg-white/10"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-8">
        {/* `key` memaksa elemen baru tiap perpindahan, sehingga animasi
            masuknya berjalan lagi alih-alih gambar bertukar diam-diam. */}
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          decoding="async"
          className="max-h-full max-w-full rounded-sm object-contain motion-safe:animate-[lightbox-in_0.55s_var(--ease-out-expo)_both]"
        />
      </div>

      <div className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-xl font-bold text-offwhite">{item.caption}</h2>
          {item.meta ? (
            <p className="mt-1 font-body text-[0.6875rem] tracking-[0.2em] text-seafoam/70 uppercase">
              {item.meta}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Foto sebelumnya"
            className="flex size-12 items-center justify-center rounded-full border border-white/15 text-offwhite transition-colors hover:bg-white/10"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Foto berikutnya"
            className="flex size-12 items-center justify-center rounded-full border border-white/15 text-offwhite transition-colors hover:bg-white/10"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
