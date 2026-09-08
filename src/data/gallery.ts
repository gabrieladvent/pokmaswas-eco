import { photo } from '@/lib/utils'
import type { GalleryImage } from '@/types'

export const galleryImages: readonly GalleryImage[] = [
  {
    id: 'garis-pantai',
    src: photo('photo-1505142468610-359e7d316be0', 1600),
    alt: 'Pandangan udara ombak putih memecah di garis pantai berpasir',
    caption: 'Tempat daratan bertemu laut',
    location: 'Pesisir San Dominggo',
    span: 'large',
  },
  {
    id: 'bintang-laut',
    src: photo('photo-1471357674240-e1a485acb3e1', 1000),
    alt: 'Bintang laut di atas pasir basah tersapu buih ombak',
    caption: 'Kehidupan di garis pasang',
    location: 'Zona intertidal',
    span: 'regular',
  },
  {
    id: 'anemon',
    src: photo('photo-1544552866-d3ed42536cfd', 1000),
    alt: 'Ikan badut bersembunyi di antara anemon laut',
    caption: 'Yang kecil pun perlu dijaga',
    location: 'Perairan dangkal',
    span: 'regular',
  },
  {
    id: 'senja',
    src: photo('photo-1590523278191-995cbcda646b', 1600),
    alt: 'Pohon kelapa condong ke arah laut saat senja',
    caption: 'Senja di kampung pesisir',
    location: 'San Dominggo',
    span: 'wide',
  },
  {
    id: 'terumbu',
    src: photo('photo-1583212292454-1fe6229603b7', 1200),
    alt: 'Terumbu karang dengan ikan-ikan kecil di bawah cahaya matahari',
    caption: 'Rumah bagi ribuan kehidupan',
    location: 'Perairan dangkal',
    span: 'tall',
  },
  {
    id: 'nyiur',
    src: photo('photo-1520454974749-611b7248ffdb', 1000),
    alt: 'Dua pohon kelapa tinggi di tepi pantai berpasir putih',
    caption: 'Daratan yang bersandar pada laut',
    location: 'San Dominggo',
    span: 'tall',
  },
  {
    id: 'pulau',
    src: photo('photo-1559128010-7c1ad6e1b6a5', 1400),
    alt: 'Pulau karang kecil bervegetasi hijau di tengah laut biru',
    caption: 'Penanda di lepas pantai',
    location: 'Perairan Flores Timur',
    span: 'wide',
  },
  {
    id: 'ombak',
    src: photo('photo-1500375592092-40eb2168fd21', 1400),
    alt: 'Ombak kecil pecah dari jarak dekat di permukaan laut',
    caption: 'Laut yang tak pernah diam',
    location: 'Laut Flores',
    span: 'wide',
  },
]
