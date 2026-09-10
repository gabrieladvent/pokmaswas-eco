/**
 * Dua arus laut yang mengapit kedua nama, lalu melebur menjadi satu.
 *
 * SVG, bukan video: bentuknya sesederhana tiga garis, dan menggambarnya
 * lewat dash offset jauh lebih ringan daripada memutar berkas video hanya
 * untuk gerakan sehalus ini.
 *
 * Garis `merged` sudah ada sejak awal tetapi tersembunyi di balik dash
 * offset penuh — lihat `createCollaborationSequence`.
 */
export function CollaborationCurrents() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 620"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Arus atas — sisi Racatech. */}
      <path
        data-current="a"
        d="M-60 122 C 140 78, 288 158, 468 126 S 812 74, 1012 122 S 1184 152, 1264 118"
        fill="none"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        className="stroke-seafoam/45"
      />

      {/* Arus bawah — sisi Pokmaswas. */}
      <path
        data-current="b"
        d="M1264 500 C 1064 544, 916 464, 736 496 S 392 548, 192 500 S 20 470, -60 504"
        fill="none"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        className="stroke-turquoise/55"
      />

      {/* Satu arus, setelah keduanya bertemu. */}
      <path
        data-current="merged"
        d="M-60 312 C 168 266, 306 352, 506 314 S 848 262, 1048 310 S 1200 340, 1264 306"
        fill="none"
        strokeWidth={1.75}
        vectorEffect="non-scaling-stroke"
        className="stroke-seafoam/70"
      />
    </svg>
  )
}
