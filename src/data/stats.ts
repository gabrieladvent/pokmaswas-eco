import type { OceanStat } from '@/types'

/**
 * NOTE FOR MAINTAINERS — these are editorial markers, not measurements.
 * The group has no published figures yet, so nothing here should be read
 * as data. Once official numbers exist, add a numeric field and switch on
 * the counter animation in `animations/scrollAnimations.ts`.
 */
export const oceanStats: readonly OceanStat[] = [
  {
    id: 'wilayah',
    marker: '01',
    label: 'Wilayah Pesisir',
    description:
      'Satu garis pantai yang menjadi tanggung jawab bersama seluruh warga kampung.',
  },
  {
    id: 'pengawasan',
    marker: '02',
    label: 'Pengawasan',
    description:
      'Pengamatan yang berjalan terus-menerus, bukan sekadar kegiatan sesaat.',
  },
  {
    id: 'kolaborasi',
    marker: '03',
    label: 'Kolaborasi',
    description:
      'Kerja bersama masyarakat, nelayan, dan pemerintah dalam satu arah yang sama.',
  },
  {
    id: 'generasi',
    marker: '∞',
    label: 'Untuk Generasi Mendatang',
    description:
      'Alasan paling sederhana mengapa semua ini dikerjakan hari ini.',
  },
]
