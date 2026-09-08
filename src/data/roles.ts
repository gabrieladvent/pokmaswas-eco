import { Eye, GraduationCap, Radar, ScrollText, ShieldCheck } from 'lucide-react'

import { photo } from '@/lib/utils'
import type { Role } from '@/types'

export const roles: readonly Role[] = [
  {
    id: 'mengawasi',
    number: '01',
    title: 'Mengawasi',
    description:
      'Menjadi mata masyarakat di wilayah pesisir. Kami memperhatikan aktivitas yang terjadi di perairan sekitar kampung — dari cara penangkapan ikan hingga hal-hal yang berpotensi merusak ekosistem.',
    icon: Eye,
    image: photo('photo-1497436072909-60f360e1d4b1', 1400),
    imageAlt: 'Pandangan udara garis pantai tempat hutan bertemu air laut yang jernih',
  },
  {
    id: 'memantau',
    number: '02',
    title: 'Memantau',
    description:
      'Mengamati kondisi sumber daya laut dari waktu ke waktu: terumbu karang, mangrove, dan hasil tangkapan nelayan. Perubahan kecil yang tercatat hari ini menjadi dasar keputusan di kemudian hari.',
    icon: Radar,
    image: photo('photo-1544551763-46a013bb70d5', 1400),
    imageAlt: 'Penyelam mengamati gerombolan ikan di dekat terumbu karang',
  },
  {
    id: 'melaporkan',
    number: '03',
    title: 'Melaporkan',
    description:
      'Menyampaikan temuan di lapangan kepada instansi yang berwenang. Pokmaswas menjadi jembatan antara apa yang dilihat masyarakat setiap hari dan tindakan yang bisa diambil pemerintah.',
    icon: ScrollText,
    image: photo('photo-1439405326854-014607f694d7', 1400),
    imageAlt: 'Permukaan laut lepas saat matahari terbenam',
  },
  {
    id: 'menjaga',
    number: '04',
    title: 'Menjaga',
    description:
      'Ikut merawat ekosistem yang menghidupi kampung — menjaga wilayah tangkap tetap sehat agar laut tidak hanya memberi hari ini, tetapi juga untuk anak cucu nanti.',
    icon: ShieldCheck,
    image: photo('photo-1583212292454-1fe6229603b7', 1400),
    imageAlt: 'Terumbu karang berwarna dengan ikan-ikan kecil di perairan dangkal',
  },
  {
    id: 'mengedukasi',
    number: '05',
    title: 'Mengedukasi',
    description:
      'Berbagi pemahaman dengan sesama warga dan generasi muda. Pengawasan yang paling kuat lahir dari kesadaran bersama, bukan dari aturan semata.',
    icon: GraduationCap,
    image: photo('photo-1542601906990-b4d3fb778b09', 1400),
    imageAlt: 'Sepasang tangan menangkupkan tunas tanaman muda',
  },
]
