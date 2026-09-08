import { photo } from '@/lib/utils'
import type { Activity, ActivityCategory } from '@/types'

export const activities: readonly Activity[] = [
  {
    id: '01',
    slug: 'pengawasan-wilayah-pesisir',
    date: '2026-08-12',
    title: 'Pengawasan Wilayah Pesisir',
    category: 'Pengawasan',
    location: 'San Dominggo, Larantuka',
    excerpt:
      'Pokmaswas bersama masyarakat menyusuri garis pantai dan perairan sekitar kampung untuk memantau aktivitas yang berlangsung, memastikan tidak ada praktik yang merusak wilayah tangkap bersama.',
    coverImage: photo('photo-1497436072909-60f360e1d4b1', 2000),
    coverAlt: 'Pandangan udara garis pantai tempat hutan bertemu air laut yang jernih',
    featured: true,
    chapters: [
      {
        id: 'latar-belakang',
        title: 'Latar Belakang',
        content: [
          'Perairan di sekitar San Dominggo bukan ruang kosong. Ia dibagi, dikenali, dan dijaga menurut kebiasaan yang sudah berjalan lama — mana wilayah tangkap bersama, mana yang sebaiknya dibiarkan pulih, dan kapan sebaiknya tidak melaut sama sekali.',
          'Persoalannya, kebiasaan itu tidak selalu terlihat dari luar. Perahu yang datang dari perairan lain tidak tahu batas yang tidak tertulis, dan sebagian praktik penangkapan yang merusak justru berlangsung di jam-jam ketika kampung sedang sepi.',
          'Dari situ kegiatan pengawasan ini disusun: bukan untuk menghadang siapa pun, melainkan untuk memastikan ada yang benar-benar melihat, mencatat, dan bisa menjelaskan apa yang terjadi di perairan ini.',
        ],
        image: photo('photo-1505142468610-359e7d316be0', 1600),
        imageAlt: 'Pandangan udara ombak putih memecah di garis pantai berpasir',
      },
      {
        id: 'persiapan',
        title: 'Persiapan',
        content: [
          'Kegiatan dimulai jauh sebelum perahu diturunkan. Beberapa hari sebelumnya, anggota kelompok duduk bersama untuk menentukan titik mana saja yang akan disusuri dan siapa yang berangkat pada tiap titik.',
          'Yang dibawa sederhana: buku catatan, telepon genggam untuk mengambil gambar, dan kesepakatan tentang apa yang perlu dicatat — lokasi, waktu, jenis aktivitas, dan alat tangkap yang terlihat.',
        ],
        image: photo('photo-1519046904884-53103b34b206', 1600),
        imageAlt: 'Perahu-perahu kecil bersandar di tepi pantai berpasir putih',
      },
      {
        id: 'di-lapangan',
        title: 'Di Lapangan',
        content: [
          'Perjalanan dimulai pagi sekali, saat air masih tenang dan jarak pandang ke dasar perairan dangkal masih baik. Rombongan bergerak menyusuri garis pantai, berhenti di beberapa titik yang selama ini paling sering dilewati perahu dari luar.',
          'Sebagian besar waktu di lapangan justru dihabiskan untuk menunggu dan memperhatikan. Pengawasan bukan pekerjaan yang dramatis — ia lebih menyerupai kebiasaan membaca laut: memperhatikan arah jaring, kedalaman tempat perahu berhenti, dan apakah ada yang berubah dibanding kunjungan sebelumnya.',
          'Di beberapa titik, anggota kelompok berhenti untuk berbicara dengan nelayan yang sedang melaut. Percakapan itu sering kali memberi lebih banyak keterangan daripada pengamatan dari kejauhan.',
        ],
        image: photo('photo-1484291470158-b8f8d608850d', 1600),
        imageAlt: 'Buih ombak putih di permukaan laut dilihat dari ketinggian',
      },
      {
        id: 'temuan',
        title: 'Temuan',
        content: [
          'Sebagian besar wilayah yang disusuri dalam keadaan wajar. Aktivitas yang terlihat berasal dari nelayan setempat, dengan alat tangkap yang selama ini memang digunakan di perairan ini.',
          'Beberapa hal tetap dicatat untuk diperhatikan pada kunjungan berikutnya: sampah yang terkumpul di satu teluk kecil, dan satu titik karang dangkal yang tampak lebih rusak dibanding catatan sebelumnya. Keduanya belum tentu berasal dari satu peristiwa; justru karena itu perlu diamati berulang.',
          'Catatan lapangan hari itu kemudian dirapikan dan disiapkan untuk disampaikan kepada instansi yang berwenang, lengkap dengan titik lokasi dan waktunya.',
        ],
        image: photo('photo-1621451537084-482c73073a0f', 1600),
        imageAlt: 'Sampah plastik melayang di dalam air laut',
      },
      {
        id: 'refleksi',
        title: 'Refleksi',
        content: [
          'Satu kali pengawasan tidak mengubah apa pun. Nilainya baru muncul ketika kegiatan yang sama diulang, dicatat dengan cara yang sama, dan bisa dibandingkan dari waktu ke waktu.',
          'Yang paling terasa justru bukan temuannya, melainkan kebiasaannya: semakin banyak warga yang tahu bahwa perairan ini diperhatikan, semakin kecil ruang bagi praktik yang merusak untuk berlangsung tanpa diketahui.',
        ],
        image: photo('photo-1476673160081-cf065607f449', 1600),
        imageAlt: 'Pantai berpasir yang tenang saat matahari terbit',
      },
    ],
    gallery: [
      {
        src: photo('photo-1505142468610-359e7d316be0', 1600),
        alt: 'Ombak memecah di sepanjang garis pantai berpasir dari udara',
        caption: 'Menyusuri garis pantai',
      },
      {
        src: photo('photo-1519046904884-53103b34b206', 1600),
        alt: 'Perahu kecil bersandar di tepi pantai',
        caption: 'Titik sandar perahu warga',
      },
      {
        src: photo('photo-1484291470158-b8f8d608850d', 1600),
        alt: 'Buih ombak dari ketinggian',
        caption: 'Perairan dangkal di sisi utara',
      },
      {
        src: photo('photo-1476673160081-cf065607f449', 1600),
        alt: 'Pantai berpasir saat matahari terbit',
        caption: 'Pagi terakhir sebelum kembali',
      },
    ],
  },
  {
    id: '02',
    slug: 'monitoring-aktivitas-perikanan',
    date: '2026-06-27',
    title: 'Monitoring Aktivitas Perikanan',
    category: 'Monitoring',
    location: 'Perairan San Dominggo',
    excerpt:
      'Pengamatan langsung terhadap cara penangkapan ikan di perairan dangkal, sekaligus mencatat jenis dan ukuran hasil tangkapan sebagai gambaran kesehatan sumber daya laut.',
    coverImage: photo('photo-1499242611767-cf8b9be02854', 2000),
    coverAlt: 'Seorang penyelam bebas mengamati perairan biru dari dekat permukaan',
    chapters: [
      {
        id: 'mengapa-dicatat',
        title: 'Mengapa Dicatat',
        content: [
          'Nelayan biasanya tahu lebih dulu ketika laut mulai berubah. Hasil tangkapan mengecil, jenis tertentu makin jarang muncul, atau harus melaut lebih jauh untuk mendapatkan jumlah yang sama.',
          'Yang sering hilang adalah catatannya. Tanpa catatan, perubahan itu hanya menjadi cerita — sulit dijadikan dasar ketika harus dibicarakan dengan pihak lain.',
        ],
        image: photo('photo-1560275619-4662e36fa65c', 1600),
        imageAlt: 'Cahaya matahari membentuk pola di dasar laut berpasir',
      },
      {
        id: 'di-perairan-dangkal',
        title: 'Di Perairan Dangkal',
        content: [
          'Pengamatan dilakukan di perairan dangkal, tempat sebagian besar aktivitas penangkapan berlangsung dan kondisi dasar laut masih bisa dilihat langsung dari permukaan.',
          'Yang dicatat bukan hanya hasil tangkapan, tetapi juga alat yang dipakai dan lokasi pengambilannya. Kombinasi ketiganya yang membuat catatan ini berguna di kemudian hari.',
        ],
        image: photo('photo-1559825481-12a05cc00344', 1600),
        imageAlt: 'Permukaan laut dilihat dari bawah air di atas dasar berpasir',
      },
      {
        id: 'yang-terbaca',
        title: 'Yang Terbaca',
        content: [
          'Dari beberapa kali pengamatan, mulai terlihat pola musiman yang selama ini hanya diketahui sebagai kebiasaan. Pola itu kini punya bentuk yang bisa ditunjukkan.',
          'Catatan ini belum cukup untuk menarik kesimpulan besar. Tetapi ia menjadi titik awal — sesuatu yang bisa dibandingkan ketika pengamatan berikutnya dilakukan.',
        ],
        image: photo('photo-1583212292454-1fe6229603b7', 1600),
        imageAlt: 'Terumbu karang dengan ikan-ikan kecil di bawah cahaya matahari',
      },
    ],
    gallery: [
      {
        src: photo('photo-1560275619-4662e36fa65c', 1600),
        alt: 'Pola cahaya di dasar laut berpasir',
        caption: 'Dasar perairan dangkal',
      },
      {
        src: photo('photo-1559825481-12a05cc00344', 1600),
        alt: 'Permukaan laut dilihat dari bawah air',
        caption: 'Batas permukaan',
      },
    ],
  },
  {
    id: '03',
    slug: 'edukasi-masyarakat-pesisir',
    date: '2026-05-15',
    title: 'Edukasi Masyarakat Pesisir',
    category: 'Edukasi',
    location: 'Balai kampung, San Dominggo',
    excerpt:
      'Ruang berbagi bersama warga dan generasi muda mengenai cara memanfaatkan laut tanpa menghabiskannya — dari aturan wilayah tangkap hingga alasan mengapa mangrove perlu dijaga.',
    coverImage: photo('photo-1471922694854-ff1b63b20054', 2000),
    coverAlt: 'Burung-burung terbang di atas pantai saat matahari terbit',
    chapters: [
      {
        id: 'ruang-berbagi',
        title: 'Ruang Berbagi',
        content: [
          'Pertemuan diadakan di balai kampung, tanpa susunan acara yang kaku. Sebagian besar waktunya justru dipakai untuk mendengar, bukan menjelaskan.',
          'Anak-anak muda yang hadir umumnya tahu laut sebagai tempat bekerja. Yang jarang dibicarakan adalah bagaimana laut itu bisa habis bila cara mengambilnya tidak berubah.',
        ],
        image: photo('photo-1542601906990-b4d3fb778b09', 1600),
        imageAlt: 'Sepasang tangan menangkupkan tunas tanaman muda',
      },
      {
        id: 'yang-dibicarakan',
        title: 'Yang Dibicarakan',
        content: [
          'Pembicaraan bergerak dari hal yang paling dekat: mengapa ikan tertentu makin sulit didapat, dan apa hubungannya dengan karang yang rusak serta mangrove yang berkurang.',
          'Tidak semua pertanyaan bisa dijawab hari itu. Sebagian dicatat untuk dibawa ke pertemuan berikutnya, dan itu justru menjadi alasan untuk bertemu lagi.',
        ],
        image: photo('photo-1590523278191-995cbcda646b', 1600),
        imageAlt: 'Pohon kelapa condong ke arah laut saat senja',
      },
    ],
  },
  {
    id: '04',
    slug: 'aksi-bersih-pantai',
    date: '2026-04-22',
    title: 'Aksi Bersih Pantai',
    category: 'Konservasi',
    location: 'Pesisir San Dominggo',
    excerpt:
      'Aksi bersama mengangkat sampah dari pesisir dan perairan dangkal. Pekerjaan yang sederhana, tetapi dampaknya langsung terasa bagi biota yang hidup di sana.',
    coverImage: photo('photo-1621451537084-482c73073a0f', 2000),
    coverAlt: 'Sampah plastik melayang di dalam air laut',
    chapters: [
      {
        id: 'pagi-itu',
        title: 'Pagi Itu',
        content: [
          'Kegiatan dimulai saat air surut, ketika bagian pantai yang biasanya terendam bisa dijangkau dengan berjalan kaki.',
          'Sebagian besar sampah yang terkumpul bukan berasal dari kampung ini. Ia dibawa arus dari tempat lain, lalu tertahan di teluk kecil di sisi utara.',
        ],
        image: photo('photo-1476673160081-cf065607f449', 1600),
        imageAlt: 'Pantai berpasir bersih saat matahari terbit',
      },
      {
        id: 'setelahnya',
        title: 'Setelahnya',
        content: [
          'Membersihkan pantai tidak menyelesaikan persoalan sampah laut. Tetapi ia membuat persoalan itu terlihat, dan sesuatu yang terlihat lebih mungkin dibicarakan.',
        ],
        image: photo('photo-1500375592092-40eb2168fd21', 1600),
        imageAlt: 'Ombak kecil pecah dari jarak dekat di permukaan laut',
      },
    ],
    gallery: [
      {
        src: photo('photo-1476673160081-cf065607f449', 1600),
        alt: 'Pantai berpasir bersih saat matahari terbit',
        caption: 'Pesisir setelah dibersihkan',
      },
    ],
  },
  {
    id: '05',
    slug: 'pemantauan-biota-dilindungi',
    date: '2026-03-09',
    title: 'Pemantauan Biota Laut Dilindungi',
    category: 'Konservasi',
    location: 'Perairan Flores Timur',
    excerpt:
      'Mencatat perjumpaan dengan biota laut yang dilindungi di perairan sekitar, termasuk lokasi dan waktunya, sebagai bahan laporan kepada instansi berwenang.',
    coverImage: photo('photo-1591025207163-942350e47db2', 2000),
    coverAlt: 'Seekor penyu laut berenang naik ke arah permukaan',
    chapters: [
      {
        id: 'perjumpaan',
        title: 'Perjumpaan',
        content: [
          'Perjumpaan dengan biota yang dilindungi tidak bisa dijadwalkan. Yang bisa disiapkan hanyalah kesiapan mencatat ketika hal itu terjadi.',
          'Setiap perjumpaan dicatat dengan tiga keterangan paling dasar: apa, di mana, dan kapan. Tanpa ketiganya, catatan tidak banyak berguna bagi pihak yang menindaklanjuti.',
        ],
        image: photo('photo-1551244072-5d12893278ab', 1600),
        imageAlt: 'Terumbu karang di bawah berkas cahaya matahari',
      },
    ],
  },
  {
    id: '06',
    slug: 'kegiatan-bersama-nelayan',
    date: '2026-01-18',
    title: 'Kegiatan Bersama Nelayan',
    category: 'Masyarakat',
    location: 'Dermaga San Dominggo',
    excerpt:
      'Duduk bersama para nelayan untuk mendengar kondisi laut dari mereka yang setiap hari berada di atasnya — perubahan musim, hasil tangkapan, dan wilayah yang mulai sepi.',
    coverImage: photo('photo-1534447677768-be436bb09401', 2000),
    coverAlt: 'Sebuah perahu di perairan tenang di bawah langit berbintang',
    chapters: [
      {
        id: 'di-dermaga',
        title: 'Di Dermaga',
        content: [
          'Pertemuan berlangsung sore hari di dermaga, saat perahu-perahu mulai kembali. Tidak ada pengeras suara, tidak ada daftar hadir.',
          'Yang dibicarakan adalah hal yang paling mereka kenal: arah angin yang berubah, wilayah yang dulu ramai kini sepi, dan bagaimana keduanya saling berkaitan.',
        ],
        image: photo('photo-1439405326854-014607f694d7', 1600),
        imageAlt: 'Permukaan laut lepas saat matahari terbenam',
      },
    ],
  },
  {
    id: '07',
    slug: 'patroli-perairan-dangkal',
    date: '2025-11-05',
    title: 'Patroli Perairan Dangkal',
    category: 'Pengawasan',
    location: 'San Dominggo, Larantuka',
    excerpt:
      'Patroli rutin menyusuri perairan dangkal bersama perwakilan warga, memastikan wilayah tangkap tradisional tetap aman dari praktik penangkapan yang merusak.',
    coverImage: photo('photo-1518837695005-2083093ee35b', 2000),
    coverAlt: 'Permukaan laut yang tenang menjelang senja',
    chapters: [],
  },
  {
    id: '08',
    slug: 'perawatan-mangrove',
    date: '2025-09-20',
    title: 'Penanaman dan Perawatan Mangrove',
    category: 'Konservasi',
    location: 'Pesisir San Dominggo',
    excerpt:
      'Menanam dan merawat mangrove di sepanjang pesisir sebagai penahan abrasi sekaligus rumah bagi biota muda sebelum mereka bergerak ke perairan yang lebih dalam.',
    coverImage: photo('photo-1542601906990-b4d3fb778b09', 2000),
    coverAlt: 'Sepasang tangan menangkupkan tunas tanaman muda',
    chapters: [],
  },
]

export const featuredActivity: Activity | undefined = activities.find((item) => item.featured)

export const timelineActivities: readonly Activity[] = activities.filter((item) => !item.featured)

export function hasFullStory(activity: Activity): boolean {
  return activity.chapters.length >= 2
}

export function findActivityBySlug(slug: string | undefined): Activity | undefined {
  if (!slug) return undefined
  return activities.find((activity) => activity.slug === slug)
}

export function relatedActivities(activity: Activity, limit = 3): readonly Activity[] {
  const sameCategory = activities.filter(
    (item) => item.slug !== activity.slug && item.category === activity.category,
  )
  const rest = activities.filter(
    (item) => item.slug !== activity.slug && item.category !== activity.category,
  )
  return [...sameCategory, ...rest].slice(0, limit)
}

export const ACTIVITY_FILTER_ALL = 'Semua' as const

export type ActivityFilterValue = typeof ACTIVITY_FILTER_ALL | ActivityCategory

export const activityFilters: readonly ActivityFilterValue[] = [
  ACTIVITY_FILTER_ALL,
  ...(['Pengawasan', 'Monitoring', 'Edukasi', 'Konservasi', 'Masyarakat'] as const).filter(
    (category) => activities.some((item) => item.category === category),
  ),
]
