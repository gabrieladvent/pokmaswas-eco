import { Fragment, useRef } from 'react'

import {
  createCollaborationClosing,
  createCollaborationReveal,
  createCollaborationSequence,
} from '@/animations/collaborationAnimations'
import { Section } from '@/components/common/Section'
import { UnderwaterFX } from '@/components/ocean/UnderwaterFX'
import { collaborationCopy, collaborationPartners } from '@/data/collaboration'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { CollaborationCoda } from './CollaborationCoda'
import { CollaborationCurrents } from './CollaborationCurrents'

/**
 * Racatech × Pokmaswas San Dominggo.
 *
 * Bagian ini sengaja dibuat lebih lengang daripada bagian lain: latarnya
 * hanya laut dalam dengan sedikit cahaya, dan seluruh bebannya ditaruh
 * pada tipografi. Kedua nama mendapat ukuran, bobot, dan warna yang
 * persis sama — tidak ada yang mendominasi.
 *
 * Di desktop, panggungnya menempel (`position: sticky`) sementara jejak
 * gulirnya menjalankan urutan bertahap. Di bawah `lg` panggung itu tidak
 * menempel sama sekali dan animasinya diganti reveal biasa, supaya
 * bagiannya tidak menjadi panjang hanya demi animasi.
 *
 * Kalimat penutup berada di luar area yang menempel, jadi ia tidak pernah
 * menimpa apa pun — termasuk ketika pengunjung meminta gerak dikurangi dan
 * seluruh animasi tidak berjalan.
 */
export function CollaborationSection() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createCollaborationSequence(root)
    createCollaborationReveal(root)
    createCollaborationClosing(root)
  })

  return (
    <Section
      id="kolaborasi"
      tone="deep"
      ref={ref}
      flush
      ariaLabel="Kolaborasi Racatech dan Pokmaswas San Dominggo"
    >
      {/*
        Tanpa `overflow-hidden` di tingkat section: panggung di bawah
        memakai `position: sticky`, yang mati begitu salah satu induknya
        meng-clip. Lapisan hiasnya di-clip di wadahnya sendiri.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgba(14,116,144,0.28),transparent_72%)]" />
        <UnderwaterFX variant="subtle" className="opacity-50" />
      </div>

      {/* Jejak gulir untuk urutan bertahap. Di bawah `lg` tingginya
          mengikuti isinya. */}
      <div data-collab-track className="relative lg:h-[240svh]">
        <div
          data-collab-stage
          // `pt-20` di desktop memberi jarak aman dari navbar yang melayang:
          // tanpa itu, pada layar pendek baris teratas duduk di baliknya.
          className="relative flex flex-col justify-center py-(--spacing-section) lg:sticky lg:top-0 lg:h-svh lg:pt-[9vh] lg:pb-0"
        >
          <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-8">
            {/* Arus */}
            <div aria-hidden="true" className="absolute inset-x-0 -inset-y-16 lg:inset-y-0">
              <CollaborationCurrents />
            </div>

            <div data-collab-figure className="relative text-center">
              {collaborationPartners.map((partner, index) => (
                <Fragment key={partner.id}>
                  {index > 0 ? (
                    <>
                      <span
                        data-collab-link
                        aria-hidden="true"
                        className="mx-auto block h-6 w-px origin-bottom bg-gradient-to-t from-seafoam/50 to-transparent sm:h-8"
                      />
                      <span
                        data-collab-cross
                        aria-hidden="true"
                        className="my-2 block font-display text-[clamp(1.25rem,3vw,2.5rem)] leading-none font-bold text-seafoam"
                      >
                        ×
                      </span>
                      <span
                        data-collab-link
                        aria-hidden="true"
                        className="mx-auto block h-6 w-px origin-top bg-gradient-to-b from-seafoam/50 to-transparent sm:h-8"
                      />
                    </>
                  ) : null}

                  {/*
                    Tanpa logo resmi di proyek, namanya dirender sebagai
                    tipografi. Keduanya memakai kelas yang sama persis —
                    itulah cara paling sederhana memastikan tidak ada yang
                    tampak lebih besar dari yang lain.
                  */}
                  <div data-partner={partner.id} data-collab-step>
                    <p className="font-display text-[clamp(2.25rem,min(7vw,11vh),5.5rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-offwhite uppercase">
                      {partner.name}
                    </p>
                    <p className="mt-3 font-body text-[0.6875rem] tracking-[0.32em] text-seafoam/70 uppercase">
                      {partner.role}
                    </p>
                  </div>
                </Fragment>
              ))}
            </div>

            {/*
              Alur normal, tanpa posisi absolut dan tanpa slot bertinggi
              tetap.
              
              Elemen ber-`opacity: 0` tetap memakan ruang, jadi komposisinya
              memang tidak pernah bergeser saat salinan ini muncul — dan
              sebagai saudara sekandung dalam alur normal, ia tidak mungkin
              menimpa kedua nama di atasnya. Versi sebelumnya menempatkan
              keduanya absolut pada persentase tetap, dan pada layar yang
              lebih pendek keduanya bertabrakan.
              
              Ukurannya ikut tinggi layar (`min(vw, vh)`), sehingga seluruh
              komposisi muat tanpa terpotong di layar sependek 640px.
            */}
            <div className="mt-14 lg:mt-[4vh]">
              <div data-collab-copy className="mx-auto max-w-2xl text-center">
                <p
                  data-collab-statement
                  data-collab-step
                  className="font-display text-[clamp(1.125rem,min(2.8vw,4.2vh),2.25rem)] leading-tight font-extrabold text-offwhite"
                >
                  {collaborationCopy.statement}
                </p>
                <p
                  data-collab-description
                  data-collab-step
                  className="mt-6 font-body text-[clamp(0.9375rem,min(1.5vw,2.6vh),1.3125rem)] leading-relaxed text-offwhite/60"
                >
                  {collaborationCopy.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Di luar area yang menempel. */}
      <div className="relative py-(--spacing-section)">
        <CollaborationCoda />
      </div>
    </Section>
  )
}
