# Pokmaswas San Dominggo

Landing page untuk **Kelompok Masyarakat Pengawas San Dominggo** — San Dominggo,
Larantuka, Flores Timur, Nusa Tenggara Timur.

Konsep: **"From Land to Ocean"** — scroll-driven storytelling yang membawa
pengunjung dari daratan, menyeberangi permukaan air, turun ke laut dalam, lalu
kembali ke permukaan bersama masyarakat.

## Tech stack

Vite · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger ·
Lenis · Lucide React.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Struktur

```
src/
├── services/     # visitorCounter — satu-satunya tempat yang tahu soal jaringan
├── animations/   # semua logika GSAP, terpisah dari komponen
│   ├── heroAnimations.ts      # intro + enam tahap scroll pass
│   ├── textAnimations.ts      # reveal per baris / per kata (blur → tajam)
│   ├── imageAnimations.ts     # clip-path reveal + scale + parallax
│   ├── parallaxAnimations.ts
│   ├── scrollAnimations.ts
│   ├── activities/            # field journal
│   │   ├── activityScroll.ts          # progres bab, timeline, penutup
│   │   ├── activityReveal.ts          # reveal per blok paragraf
│   │   ├── activityImageTransition.ts # crossfade / clip antar-bab
│   │   └── activityParallax.ts
│   ├── visitor/               # pembuka, hitung naik, tirai air
│   └── transitions.ts         # turun ke laut, lalu naik ke permukaan
├── components/   # UI per bagian (common, layout, hero, activities, …)
├── data/         # seluruh konten: navigation, roles, activities, gallery, …
├── hooks/        # useLenis, useScrollAnimation, useParallax, useMagnetic, …
├── lib/          # setup gsap, singleton Lenis, utilitas
├── pages/        # Home, ActivityDetail, NotFound
├── sections/     # komposisi halaman
└── types/        # tipe bersama
```

## Alur halaman

```
layar pembuka (nomor pengunjung) → hero sinematik → daratan → pesisir →
laut → bawah laut → peran Pokmaswas → galeri → kegiatan lapangan →
masyarakat → jejak pengunjung → konservasi → masa depan
```

Nada warna tiap section yang membawa alurnya: menurun dari pasir ke laut
dalam, naik sebentar ke cahaya siang untuk kerja lapangan, lalu turun lagi
menuju penutup.

Komponen hanya mengurus markup dan ref. Animasi dibangun di `src/animations/`
dan dijalankan lewat `useScrollAnimation`, yang membungkusnya dalam
`gsap.context()` sehingga cleanup selalu lengkap saat unmount.

## Rute

```
/                      beranda
/kegiatan/:slug        satu cerita lapangan
*                      404
```

Router-nya `react-router-dom`. Menambah halaman berarti menambah berkas di
`pages/`, mengomposisikan section-nya, lalu mendaftarkannya di `App.tsx`.

Tautan navigasi tetap memakai anchor (`#tentang`). Dari halaman cerita,
`useSectionNavigation` mengalihkannya menjadi `/#tentang` lebih dulu, dan
`Home` yang menggulir setelah beranda termuat.

> **Hosting:** ini SPA, jadi server harus mengarahkan semua permintaan ke
> `index.html` (mis. `try_files $uri /index.html`). Tanpa itu, membuka
> `/kegiatan/...` langsung dari URL akan menghasilkan 404 dari server.

## Naskah panjang

Deskripsi kegiatan yang panjang **tidak** dipotong dan tidak ditumpuk menjadi
satu kartu raksasa. Ia ditangani berlapis:

1. **Beranda** — ringkasan, lalu tiga bab pertama sebagai cerita dengan panggung
   foto yang menempel. Menggulir naskah menggerakkan gambar dan indikator
   progres sekaligus.
2. **Tautan** — "Baca Cerita Lengkap".
3. **Halaman** — `/kegiatan/:slug` memuat naskah utuh dengan tata letak
   berselang-seling antara teks dan foto.

Jumlah bab di beranda diatur lewat `CHAPTERS_ON_LANDING` di
`components/activities/ActivitiesSection.tsx`.

Bab tidak dipaksakan: kegiatan dengan kurang dari dua bab hanya menampilkan
ringkasan dan tidak ditautkan ke halaman cerita.

## Penghitung pengunjung

Tanpa basis data. Angkanya disimpan di **Abacus**
(https://abacus.jasoncameron.dev), layanan penghitung publik yang hanya bisa
melakukan dua hal: menaikkan satu bilangan secara atomik, dan membacanya.
Layanan ini tidak memerlukan kunci API sama sekali, jadi tidak ada rahasia
apa pun yang perlu diletakkan di bundel frontend.

```
VITE_VISITOR_COUNTER_URL         basis URL layanan   (opsional)
VITE_VISITOR_COUNTER_NAMESPACE   ruang nama penghitung (opsional)
```

Keduanya punya nilai bawaan yang sudah berfungsi — lihat `.env.example`.
Ganti `NAMESPACE` untuk memulai hitungan dari nol.

### Kunci yang dipakai

```
total              jumlah kunjungan sejak penghitung dipasang, tanpa kedaluwarsa
day-YYYY-MM-DD     satu ember per hari (UTC)
```

Statistik mingguan adalah **7 hari terakhir yang bergulir**, dijumlahkan dari
tujuh ember harian terakhir. Tidak ada data per individu yang disimpan — hanya
bilangan.

Ember untuk hari yang belum pernah ada kunjungan menghasilkan 404 dan
diperlakukan sebagai nol. Wajar terlihat di konsol peramban selama minggu
pertama, dan hilang sendiri setelah situs punya lalu lintas tujuh hari penuh.

### Apa yang dihitung sebagai satu kunjungan

Satu kunjungan per perangkat per **12 jam** (`VISIT_WINDOW_MS` di
`lib/visitorSession.ts`). Menyegarkan halaman atau kembali dalam jendela itu
tidak menaikkan penghitung: nomor yang tersimpan dipakai kembali.

`localStorage` hanya menyimpan hal lokal — pengenal sesi anonim, waktu
kunjungan terakhir, dan nomor pengunjung yang sudah didapat. Angka global
tidak pernah berasal dari sana.

### Menukar backend

Semua yang tahu soal jaringan ada di `services/visitorCounter.ts`. Backend
apa pun yang bisa memenuhi antarmuka ini dapat menggantikannya tanpa satu pun
komponen React ikut berubah:

```ts
interface CounterBackend {
  hit(key: string): Promise<number>   // naikkan, kembalikan nilai baru
  read(key: string): Promise<number>  // baca tanpa menaikkan
}
```

Ganti isi `createBackend()` — misalnya ke endpoint serverless sendiri bila
kelak dibutuhkan kunci rahasia — dan selesai.

### Kalau layanannya mati

Situs tetap berjalan penuh. Permintaan dibatasi 4 detik, layar pembuka
berhenti menunggu setelah 1,6 detik, dan bagian "Jejak Kita" menampilkan
tanda "—" alih-alih angka. Tidak ada pesan galat teknis yang muncul ke
pengunjung.

### Layar pembuka

Tampil **sekali per sesi tab**; menyegarkan halaman melewatinya. Selalu bisa
dilewati lewat tombol "Lewati" atau tombol Escape, dan fokus keyboard mendarat
di sana saat lapisan itu muncul. Saat `prefers-reduced-motion` aktif,
urutannya tetap ada tetapi tanpa gerakan sama sekali.

Babaknya sengaja **bertumpuk**, bukan berurutan: nama kelompok meredup dan
sedikit mengecil sementara sapaan naik ke tempatnya, dan tirai mulai surut
sebelum isinya habis memudar. Itulah yang membuatnya terasa satu gerakan
sekaligus memangkas durasinya.

Durasi terukur di peramban:

| Keadaan | Sampai Hero terlihat |
| --- | --- |
| Normal | ±3,5 dtk |
| Penghitung mati | ±2,8 dtk |
| Penghitung menggantung 8 dtk | ±3,9 dtk |
| `prefers-reduced-motion` | ±2,2 dtk |
| Tombol "Lewati" ditekan | ±0,8 dtk |

Ambangnya ada di `components/visitor/VisitorWelcome.tsx` (`MIN_INTRO_MS`,
`MAX_WAIT_MS`); panjang tiap babak ada di `animations/visitor/`.

## Konten yang masih placeholder

Bagian berikut sengaja **tidak** diisi angka atau tanggal karangan. Ganti
dengan data resmi organisasi sebelum publikasi:

- `data/site.ts` — email dan nomor telepon masih kosong.
- `data/stats.ts` — `01/02/03/∞` adalah penanda urutan, **bukan** statistik.
  Catatan ini juga ditampilkan di halaman. Aktifkan counter animation hanya
  setelah ada angka resmi.
- `data/activities.ts` — **seluruh entri adalah data contoh**, bukan catatan
  resmi. Tanggal, judul, deskripsi, dan lokasinya dibuat untuk menunjukkan
  struktur timeline dan harus diganti dengan dokumentasi kegiatan yang
  sebenarnya sebelum publikasi. Berkasnya sudah diberi tanda peringatan di
  bagian atas.
- `data/navigation.ts` — akun media sosial dirender sebagai teks "SEGERA",
  bukan tautan kosong.
- Angka pengunjung **bukan** placeholder — ia benar-benar berasal dari
  layanan penghitung, dan mulai dari nol pada ruang nama yang baru.
- Seluruh foto masih diambil dari Unsplash lewat helper `photo()` di
  `lib/utils.ts`. Untuk memakai foto dokumentasi sendiri, letakkan berkas di
  `src/assets/images/` dan ubah nilai `src` di `src/data/`.

## Catatan animasi

Komponen hanya memegang markup dan ref. Seluruh animasi dibangun di
`src/animations/` lalu dijalankan lewat `useScrollAnimation`, yang
membungkusnya dalam `gsap.context()` sehingga semuanya ter-revert saat unmount.

Beberapa keputusan yang perlu diketahui sebelum menyentuh bagian ini:

- **Tidak ada state React untuk hal yang berubah tiap frame.** Posisi kursor
  memakai `gsap.quickTo`; status aktif pada timeline kegiatan dan indikator
  bagian ditulis sebagai atribut `data-active` di DOM, lalu ditanggapi CSS.
- **`position: sticky` mati bila salah satu induknya meng-clip.** Karena itu
  `OceanTransition`, `FinalTransition`, dan section kegiatan tidak memakai
  `overflow-hidden` di tingkat section; lapis dekoratifnya di-clip di wadah
  sendiri.
- **Jangan membuat ScrollTrigger untuk elemen yang sedang `display: none`.**
  Elemen berukuran nol membuat start dan end jatuh di titik yang sama dan
  langsung terpicu. `createImageReveal` dan `createStoryParallax` menyaring
  bingkai tak terender.
- **`useScrollAnimation` memakai `useLayoutEffect`, bukan `useEffect`.**
  ScrollTrigger dengan `pin` membungkus elemennya dalam `pin-spacer`, sehingga
  induknya tidak lagi sama dengan yang dicatat React. Cleanup pasif berjalan
  setelah React mencopot node, dan berpindah rute akan gagal dengan
  "removeChild: node bukan anak dari node ini".
- **Kolom yang menampung kotak sticky tidak boleh `items-start`.** Kotak
  sticky hanya bisa menempel sepanjang induknya; dengan `items-start` kolomnya
  sependek isinya dan gambar ikut tergulir pergi.
- **Teks di-reveal per blok paragraf dan dipicu sekali, bukan ter-scrub.**
  Opasitas yang ter-scrub berarti paragraf setengah transparan selama masih
  dibaca. Scrub disimpan untuk gambar dan indikator progres.
- Blur dan parallax berat hanya berjalan di desktop lewat `gsap.matchMedia()`.

## Aksesibilitas & motion

Saat `prefers-reduced-motion: reduce` aktif: parallax, pinned/horizontal
scrolling, custom cursor, magnetic button, dan smooth scrolling semuanya mati
(Lenis tidak diinisialisasi sama sekali). Panel foto sticky pada timeline
kegiatan ikut disembunyikan dan setiap entri kembali membawa fotonya sendiri,
karena panel itu bergantung pada crossfade ter-scrub untuk berganti gambar.
Panggung foto pada cerita lapangan juga disembunyikan dan setiap bab kembali
membawa fotonya sendiri. Seluruh konten tetap terbaca penuh.

Kursor asli tidak pernah disembunyikan secara global — hanya di atas elemen
yang memang digantikan cincin kursor. Lightbox dan menu seluler mendukung
Escape, navigasi panah, dan pengembalian fokus.
