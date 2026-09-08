import { cn } from '@/lib/utils'

export interface RevealImageProps {
  readonly src: string
  readonly alt: string
  readonly srcSet?: string
  readonly sizes?: string
  /** Kelas untuk bingkai luar — atur rasio dan sudut di sini. */
  readonly className?: string
  /** Kelas untuk elemen gambar, mis. `object-[50%_35%]`. */
  readonly imageClassName?: string
  readonly loading?: 'lazy' | 'eager'
  readonly fetchPriority?: 'high' | 'low' | 'auto'
  /** Beri ruang lebih agar parallax tidak pernah menyingkap tepi kosong. */
  readonly overscan?: boolean
}

/**
 * Bingkai gambar dengan tiga lapis yang masing-masing punya tugas:
 *
 *   `[data-reveal-frame]` — clip-path membuka dari bawah ke atas
 *   `[data-reveal-shift]` — parallax vertikal
 *   `[data-reveal-image]` — scale 1.15 → 1
 *
 * Memisahkan clip, geser, dan skala ke elemen berbeda membuat ketiganya
 * bisa dianimasikan bersamaan tanpa saling menimpa matriks transform.
 *
 * Nilai diam (tanpa JS atau saat reduced motion) sudah merupakan kondisi
 * akhir, jadi gambar tetap tampil utuh meski animasi tidak pernah jalan.
 */
export function RevealImage({
  src,
  alt,
  srcSet,
  sizes,
  className,
  imageClassName,
  loading = 'lazy',
  fetchPriority,
  overscan = true,
}: RevealImageProps) {
  return (
    <div data-reveal-frame className={cn('relative overflow-hidden', className)}>
      <div data-reveal-shift className={cn('absolute', overscan ? 'inset-[-10%]' : 'inset-0')}>
        <img
          data-reveal-image
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          className={cn('h-full w-full object-cover', imageClassName)}
        />
      </div>
    </div>
  )
}
