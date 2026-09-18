import { useRef } from 'react'

import { createWaveSeam } from '@/animations/waveSeam'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

/**
 * Bentuk gelombang, digambar dengan perintah relatif dan diulang beberapa
 * kali.
 *
 * Yang terisi warna adalah bagian **di atas** garis gelombang, bukan di
 * bawahnya: jahitan ini adalah tepi bawah bagian sebelumnya, jadi warna
 * bagian itulah yang harus turun sampai ke garis ombak. Mengisi ke arah
 * sebaliknya menyisakan pita kosong selebar jahitan tepat di antara kedua
 * bagian.
 *
 * Lintasannya mulai dari −720 dan berakhir jauh di luar `viewBox`, dan
 * SVG-nya sendiri direntang dua kali lebar induknya. Keduanya bersama
 * memberi kelebihan di kiri dan kanan, sehingga hanyutnya mengikuti gulir
 * tidak pernah menyingkap ujung lintasan.
 */
/*
 * Satu periode selebar 840 satuan, sementara yang terlihat di layar
 * sekitar 1440 satuan — jadi pembaca melihat kira-kira satu setengah
 * gelombang sekaligus.
 *
 * Angka itu hasil percobaan, bukan selera. Pada periode dua kali lipatnya
 * yang tampak di layar kurang dari satu gelombang penuh, dan tepinya
 * terbaca sebagai garis miring biasa, bukan sebagai permukaan air.
 */
const HALF = 420

function waveLine(amplitude: number, baseline: number): string {
  const crest = `c${HALF / 3} -${amplitude} ${(HALF / 3) * 2} -${amplitude} ${HALF} 0`
  const trough = `c${HALF / 3} ${amplitude} ${(HALF / 3) * 2} ${amplitude} ${HALF} 0`
  const period = `${crest} ${trough}`
  return `M-${HALF} ${baseline} ${period} ${period} ${period} ${period} ${period}`
}

function wavePath(amplitude: number, baseline: number): string {
  // Bentuk terisi: garis yang sama, lalu ditutup lewat tepi atas.
  return `${waveLine(amplitude, baseline)} V0 H-${HALF} Z`
}

interface Layer {
  readonly amplitude: number
  readonly baseline: number
  /** Seberapa jauh lapisan ini hanyut, relatif terhadap satu periode. */
  readonly drift: number
  readonly className: string
}

export interface WaveSeamProps {
  /**
   * Warna bagian di atas jahitan ini, sebagai kelas `fill-*`. Gelombangnya
   * memakai warna tersebut, jadi bagian sebelumnya seakan berakhir dengan
   * tepi yang berombak alih-alih garis lurus.
   */
  readonly fromClassName: string
  /** Warna bagian di bawahnya, sebagai kelas `bg-*`. */
  readonly toClassName: string
  /** Lapisan pengantara — bayangan dangkal di antara kedua warna. */
  readonly midClassName?: string
  readonly shallowClassName?: string
  /** Menambahkan garis buih tepat di puncak gelombang terdepan. */
  readonly foam?: boolean
  readonly className?: string
  /** Menjungkirkan jahitan: dipakai saat pembaca justru turun ke dalam air. */
  readonly flip?: boolean
}

/**
 * Perpindahan antar-bagian berbentuk permukaan air.
 *
 * Dua tempat di halaman ini berganti warna secara mendadak — dari laut
 * dalam ke catatan lapangan yang terang, lalu kembali turun ke air. Potongan
 * seperti itu terbaca sebagai dua halaman berbeda yang ditempel, bukan satu
 * perjalanan.
 *
 * Jahitan ini menggantinya dengan permukaan air: tiga lapisan gelombang
 * yang hanyut pada kecepatan berbeda mengikuti gulir, sehingga batas kedua
 * bagian terlihat bergerak dan punya kedalaman. Yang digerakkan hanya
 * `transform` pada tiga elemen — tidak ada canvas, tidak ada gambar.
 */
export function WaveSeam({
  fromClassName,
  toClassName,
  midClassName,
  shallowClassName,
  foam = false,
  className,
  flip = false,
}: WaveSeamProps) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollAnimation(ref, (root) => {
    createWaveSeam(root)
  })

  /*
   * Tiga lapisan, digambar dari belakang ke depan.
   *
   * Yang di belakang turun paling jauh — itulah yang mengintip di bawah
   * tepi utama dan terbaca sebagai perairan dangkal. Yang terdepan justru
   * berhenti paling tinggi: ia adalah tepi sebenarnya antara kedua bagian,
   * dan di atasnya warnanya sudah rapat tanpa celah.
   *
   * Arah hanyutnya dibuat berlawanan antar-lapisan. Kalau ketiganya
   * bergerak searah, yang terlihat hanya satu gambar yang bergeser;
   * berlawanan arah barulah terbaca sebagai tiga permukaan pada kedalaman
   * berbeda.
   */
  const layers: Layer[] = [
    { amplitude: 40, baseline: 148, drift: -0.5, className: shallowClassName ?? fromClassName },
    { amplitude: 34, baseline: 114, drift: 0.34, className: midClassName ?? fromClassName },
    { amplitude: 28, baseline: 82, drift: -0.18, className: fromClassName },
  ]

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative isolate h-[clamp(5.5rem,11vw,11rem)] w-full overflow-hidden',
        toClassName,
        flip && 'rotate-180',
        className,
      )}
    >
      {layers.map((layer, index) => (
        <div
          key={layer.baseline}
          data-wave-layer
          data-drift={layer.drift}
          className="absolute inset-0 will-change-transform"
        >
          <svg
            viewBox="0 0 2880 200"
            preserveAspectRatio="none"
            className="absolute inset-y-0 left-0 h-full w-[200%]"
          >
            <path d={wavePath(layer.amplitude, layer.baseline)} className={layer.className} />
          </svg>

          {/* Buih hanya di lapisan terdepan: dua garis buih terbaca sebagai
              dua permukaan air yang berbeda, dan air hanya punya satu. */}
          {foam && index === layers.length - 1 ? (
            <svg
              viewBox="0 0 2880 200"
              preserveAspectRatio="none"
              className="absolute inset-y-0 left-0 h-full w-[200%]"
            >
              <path
                d={waveLine(layer.amplitude, layer.baseline + 3)}
                fill="none"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                className="stroke-seafoam/55"
              />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  )
}
