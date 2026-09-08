import { cn } from '@/lib/utils'

const BUBBLES = [
  { left: '8%', size: 6, delay: 0, duration: 15 },
  { left: '17%', size: 11, delay: 4.5, duration: 19 },
  { left: '26%', size: 4, delay: 8, duration: 13 },
  { left: '38%', size: 8, delay: 2, duration: 17 },
  { left: '47%', size: 14, delay: 6.5, duration: 22 },
  { left: '55%', size: 5, delay: 10, duration: 14 },
  { left: '64%', size: 9, delay: 1.5, duration: 18 },
  { left: '73%', size: 6, delay: 7, duration: 16 },
  { left: '82%', size: 12, delay: 3.5, duration: 20 },
  { left: '91%', size: 5, delay: 9.5, duration: 15 },
] as const

/** Partikel melayang — sisa-sisa kehidupan yang tersuspensi di air. */
const MOTES = [
  { left: '12%', top: '18%', size: 3, delay: 0, duration: 26 },
  { left: '31%', top: '62%', size: 2, delay: 5, duration: 32 },
  { left: '44%', top: '30%', size: 4, delay: 9, duration: 24 },
  { left: '58%', top: '74%', size: 2, delay: 2, duration: 30 },
  { left: '69%', top: '22%', size: 3, delay: 12, duration: 28 },
  { left: '86%', top: '55%', size: 2, delay: 7, duration: 34 },
] as const

/** Berkas cahaya dari permukaan. */
const RAYS = [
  { left: '14%', width: 120, rotate: -6, delay: 0, duration: 19, opacity: 0.1 },
  { left: '46%', width: 190, rotate: 4, delay: 5, duration: 24, opacity: 0.14 },
  { left: '78%', width: 140, rotate: -3, delay: 9, duration: 21, opacity: 0.09 },
] as const

export interface UnderwaterFXProps {
  /** `full` menambahkan berkas cahaya dan caustic; `subtle` hanya gelembung. */
  readonly variant?: 'subtle' | 'full'
  readonly className?: string
}

/**
 * Lapis suasana bawah laut.
 *
 * Seluruhnya CSS: hanya `transform` dan `opacity`, jadi semuanya tetap di
 * compositor dan tidak pernah memicu layout. Tidak ada canvas maupun
 * WebGL — untuk efek sehalus ini, biayanya tidak sepadan.
 *
 * Setiap animasi dibungkus `motion-safe`, sehingga saat pengunjung minta
 * gerak dikurangi yang tersisa hanyalah tekstur diam, bukan layar kosong.
 */
export function UnderwaterFX({ variant = 'full', className }: UnderwaterFXProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {variant === 'full' ? (
        <>
          {/* Caustic — pola cahaya yang bergoyang pelan di bawah permukaan. */}
          <div className="absolute inset-0 opacity-[0.07] mix-blend-screen motion-safe:animate-[caustic-drift_28s_ease-in-out_infinite] bg-[radial-gradient(ellipse_40%_18%_at_20%_25%,white,transparent_60%),radial-gradient(ellipse_35%_15%_at_70%_45%,white,transparent_60%),radial-gradient(ellipse_45%_20%_at_45%_75%,white,transparent_60%)]" />

          {RAYS.map((ray) => (
            <span
              key={ray.left}
              className="absolute -top-[10%] h-[130%] origin-top bg-gradient-to-b from-white/70 via-white/15 to-transparent blur-2xl motion-safe:animate-[ray-sway_var(--ray-duration)_ease-in-out_var(--ray-delay)_infinite]"
              style={{
                left: ray.left,
                width: `${ray.width}px`,
                opacity: ray.opacity,
                // Rotasi disimpan sebagai variabel agar keyframes bisa
                // memakainya kembali tanpa menghapus kemiringan dasarnya.
                transform: `rotate(${ray.rotate}deg)`,
                ['--ray-rotate' as string]: `${ray.rotate}deg`,
                ['--ray-duration' as string]: `${ray.duration}s`,
                ['--ray-delay' as string]: `${ray.delay}s`,
              }}
            />
          ))}
        </>
      ) : null}

      {MOTES.map((mote) => (
        <span
          key={`${mote.left}-${mote.top}`}
          className="absolute rounded-full bg-white/40 motion-safe:animate-[mote-drift_var(--mote-duration)_ease-in-out_var(--mote-delay)_infinite]"
          style={{
            left: mote.left,
            top: mote.top,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            ['--mote-duration' as string]: `${mote.duration}s`,
            ['--mote-delay' as string]: `${mote.delay}s`,
          }}
        />
      ))}

      {BUBBLES.map((bubble) => (
        <span
          key={bubble.left}
          className="absolute bottom-[-8%] rounded-full border border-white/25 bg-white/10 motion-safe:animate-[bubble-rise_var(--bubble-duration)_linear_var(--bubble-delay)_infinite] motion-reduce:hidden"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            ['--bubble-duration' as string]: `${bubble.duration}s`,
            ['--bubble-delay' as string]: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
