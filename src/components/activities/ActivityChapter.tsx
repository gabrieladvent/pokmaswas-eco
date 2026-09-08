import { ActivityImage } from './ActivityImage'
import type { ActivityChapter as Chapter } from '@/types'

export interface ActivityChapterProps {
  readonly chapter: Chapter
  readonly index: number
  /**
   * Halaman cerita menempatkan fotonya sendiri di samping naskah, jadi
   * foto bawaan di sini dimatikan agar tidak muncul dua kali saat kolom
   * grid-nya menumpuk di layar sempit.
   */
  readonly showInlinePhoto?: boolean
}

/**
 * Satu bab cerita.
 *
 * Paragraf dibungkus `data-chapter-block` supaya reveal berjalan per blok,
 * bukan per kata — bagian ini memang untuk dibaca.
 *
 * Fotonya ikut tampil di sini hanya di bawah `lg`, tempat panggung gambar
 * sticky tidak dipakai. Lihat `ActivityStory`.
 */
export function ActivityChapter({
  chapter,
  index,
  showInlinePhoto = true,
}: ActivityChapterProps) {
  return (
    <article
      data-chapter
      data-index={index}
      data-active="false"
      className="border-t border-deep/10 pt-10 pb-16 first:border-t-0 first:pt-0 lg:pb-28"
    >
      <header data-chapter-heading className="mb-8 flex items-center gap-4">
        <span
          data-chapter-index
          className="font-body text-[0.6875rem] tracking-[0.24em] text-turquoise tabular-nums"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span data-chapter-rule aria-hidden="true" className="block h-px w-8 bg-turquoise/40" />
        <h4
          data-chapter-name
          className="font-body text-[0.6875rem] font-medium tracking-[0.24em] text-deep/60 uppercase"
        >
          {chapter.title}
        </h4>
      </header>

      {/* Lebar baca dibatasi; panjangnya naskah tidak boleh membuat mata
          harus melompat jauh saat berpindah baris. */}
      <div className="max-w-[62ch] space-y-6">
        {chapter.content.map((paragraph) => (
          <p
            key={paragraph.slice(0, 48)}
            data-chapter-block
            className="font-body text-lead leading-[1.75] text-deep/75"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {showInlinePhoto && chapter.image ? (
        <div data-chapter-photo className="mt-10 lg:hidden">
          <ActivityImage
            src={chapter.image}
            alt={chapter.imageAlt ?? ''}
            sizes="(min-width: 1024px) 0px, 90vw"
            className="aspect-4/3"
          />
        </div>
      ) : null}
    </article>
  )
}
