import { ActivityImage } from './ActivityImage'
import type { ActivityChapter as Chapter } from '@/types'

export interface ActivityChapterProps {
  readonly chapter: Chapter
  readonly index: number
  readonly showInlinePhoto?: boolean
  /**
   * Tingkat heading untuk judul bab.
   *
   * Nilainya bergantung pada apa yang berada di atasnya: di beranda bab
   * bersarang di bawah judul kegiatan (h3), jadi `4`; di halaman detail
   * bab adalah anak langsung dari judul halaman (h1), jadi `2`. Urutan
   * heading yang melompat membuat pembaca layar kehilangan kerangka
   * halaman, sekalipun tampilannya sama persis.
   */
  readonly headingLevel?: 2 | 3 | 4
}

export function ActivityChapter({
  chapter,
  index,
  showInlinePhoto = true,
  headingLevel = 4,
}: ActivityChapterProps) {
  const Heading = `h${headingLevel}` as const

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
        <Heading
          data-chapter-name
          className="font-body text-[0.6875rem] font-medium tracking-[0.24em] text-deep/60 uppercase"
        >
          {chapter.title}
        </Heading>
      </header>

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
