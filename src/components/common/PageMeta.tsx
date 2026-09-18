import { useEffect } from 'react'

export interface PageMetaProps {
  readonly title: string
  readonly description: string
}

function descriptionTag(): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>('meta[name="description"]')
}

/*
 * Nilai bawaan dari `index.html`, dibaca sekali sebelum halaman mana pun
 * sempat mengubahnya. Dipakai untuk memulihkan judul dan deskripsi saat
 * halaman ditinggalkan, sehingga beranda — yang memang memakai nilai
 * bawaan — tidak pernah mewarisi judul halaman sebelumnya.
 */
const defaults = {
  title: typeof document === 'undefined' ? '' : document.title,
  description: typeof document === 'undefined' ? '' : (descriptionTag()?.content ?? ''),
}

/**
 * Judul dan deskripsi khusus per halaman.
 *
 * Ditulis langsung ke elemen yang sudah ada di `index.html`, bukan
 * dirender sebagai `<title>`/`<meta>` lewat pengangkatan metadata React
 * 19. Alasannya: React tidak tahu soal tag yang sudah ada di berkas HTML,
 * jadi yang dirender menjadi tag kedua — padahal `<head>` hanya boleh
 * punya satu judul dan satu deskripsi.
 *
 * Batasnya perlu diketahui: perayap pratinjau tautan (WhatsApp, Facebook)
 * tidak menjalankan JavaScript, jadi yang mereka baca selalu `index.html`
 * mentah. Mengubah `og:*` dari sini tidak akan mengubah pratinjau yang
 * muncul di ruang obrolan — untuk itu halamannya harus dipra-render saat
 * build.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title

    const tag = descriptionTag()
    if (tag) tag.content = description

    return () => {
      document.title = defaults.title
      if (tag) tag.content = defaults.description
    }
  }, [title, description])

  return null
}
