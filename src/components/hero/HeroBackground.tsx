import { photo, photoSrcSet } from '@/lib/utils'

const HERO_PHOTO = 'photo-1507525428034-b723cf961d3e'

/**
 * Hero disusun sebagai tumpukan lapis, masing-masing bergerak dengan
 * kecepatan berbeda agar terbentuk persepsi kedalaman:
 *
 *   foto laut → atmosfer → horizon → pulau jauh → perahu → ombak depan
 *
 * Urutannya sengaja dari yang paling jauh ke paling dekat; kecepatan tiap
 * lapis diatur di `createHeroAnimation`. Setiap lapis tetap tampil benar
 * tanpa JavaScript — bila animasi tidak pernah berjalan, komposisi ini
 * hanya berhenti bergerak.
 */
export function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* 1 — Foto. Dibuat lebih besar agar parallax tidak menyingkap tepi. */}
      <div data-hero-image className="absolute inset-0 will-change-transform">
        <img
          src={photo(HERO_PHOTO, 2000)}
          srcSet={photoSrcSet(HERO_PHOTO)}
          sizes="100vw"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="h-full w-full scale-[1.15] object-cover object-center"
        />
      </div>

      {/* 2 — Atmosfer: kabut tipis yang bergerak paling lambat. */}
      <div
        data-hero-atmos
        className="absolute inset-x-0 top-[22%] h-[46vh] bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.16),transparent_70%)]"
      />

      {/* 3 — Horizon: pita cahaya tempat langit bertemu air. */}
      <div
        data-hero-horizon
        className="absolute inset-x-0 top-[38%] h-[24vh] bg-gradient-to-b from-transparent via-white/12 to-transparent mix-blend-soft-light"
      />

      {/* 4 — Pulau di kejauhan. Nyaris tidak bergerak: itulah yang membuat
              lapis di depannya terasa dekat. */}
      <div data-hero-far className="absolute inset-x-0 top-[44%] opacity-45">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="h-[9vh] w-full">
          <path
            d="M0 90h250c40 0 62-30 104-38 46-9 70 12 120 12 44 0 66-22 108-22 40 0 58 20 96 26 40 6 58-14 100-14 46 0 70 26 118 26 44 0 64-18 104-18 42 0 62 22 106 22 40 0 60-16 98-16 44 0 66 22 106 22h130v0z"
            className="fill-deep/45"
          />
        </svg>
      </div>

      {/* 5 — Perahu kecil di kejauhan. Skala kecil dengan sengaja: ia
              menjadi acuan ukuran untuk seluruh bidang air. */}
      <div data-hero-boat className="absolute top-[47.5%] left-[62%] opacity-55">
        <svg viewBox="0 0 60 34" className="h-[2.6vh] min-h-4 w-auto">
          <path d="M4 26h52l-7 7H11l-7-7z" className="fill-deep/70" />
          <path d="M29 3l14 20H29V3z" className="fill-deep/55" />
          <path d="M27 8L15 23h12V8z" className="fill-deep/45" />
        </svg>
      </div>

      {/* 6 — Atmosfer: scrim permanen untuk keterbacaan, lalu dua lapis
              yang menebal saat hero ditinggalkan. */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/72 via-deep/35 to-deep/78" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/60 via-transparent to-transparent" />

      {/* Tahap 6 — air menua menjadi laut dalam saat pembaca menjauh. */}
      <div
        data-hero-deep
        className="absolute inset-0 bg-gradient-to-b from-ocean/0 via-ocean/50 to-deep opacity-0"
      />
      <div data-hero-overlay className="absolute inset-0 bg-deep opacity-0" />

      {/* 7 — Latar depan: garis pantai itu sendiri, membawa mata turun ke
              section bernuansa pasir di bawahnya. */}
      <div data-hero-wave className="absolute inset-x-0 bottom-[-1px] will-change-transform">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="h-[16vh] min-h-28 w-full"
          role="presentation"
        >
          <path
            d="M0 96c180 0 240 44 420 44s260-52 440-52 260 40 420 40 160-16 160-16v108H0Z"
            className="fill-turquoise/25"
          />
          <path
            d="M0 140c200 0 260 40 460 40s280-44 480-44 260 30 500 30v54H0Z"
            className="fill-ocean/35"
          />
          <path d="M0 168c220 0 300 34 520 34s300-38 520-38 220 24 400 24v32H0Z" className="fill-sand" />
        </svg>
      </div>
    </div>
  )
}
