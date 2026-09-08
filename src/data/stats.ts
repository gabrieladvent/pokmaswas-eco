import type { OceanStat } from '@/types'

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
