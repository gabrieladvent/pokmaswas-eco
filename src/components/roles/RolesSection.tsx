import { useRef } from 'react'

import { createRolesAnimation } from '@/animations'
import { Eyebrow, SplitHeading } from '@/components/common/SectionHeading'
import { roles } from '@/data/roles'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { RoleCard } from './RoleCard'

export function RolesSection() {
  const ref = useRef<HTMLElement>(null)

  useScrollAnimation(ref, (root) => {
    createRolesAnimation(root)
  })

  return (
    <section
      id="peran"
      ref={ref}
      aria-labelledby="roles-heading"
      className="relative bg-deep py-(--spacing-section) lg:h-svh lg:overflow-hidden lg:py-0"
    >
      <div
        data-roles-track
        className="flex flex-col gap-6 px-6 sm:px-8 lg:h-full lg:flex-row lg:items-center lg:gap-8 lg:px-0 lg:will-change-transform"
      >
        <div className="flex shrink-0 flex-col justify-center lg:h-full lg:w-[min(84vw,34rem)] lg:pl-12">
          <Eyebrow className="text-seafoam">Peran Kami</Eyebrow>

          <SplitHeading
            id="roles-heading"
            lines={['Apa yang', 'Kami Lakukan?']}
            className="max-w-[12ch] text-offwhite"
          />

          <p data-reveal className="mt-8 max-w-md font-body text-lead text-offwhite/65">
            Lima peran yang kami jalankan bersama masyarakat, nelayan, dan pemerintah — sederhana,
            berulang, dan dikerjakan terus-menerus.
          </p>

          <p
            aria-hidden="true"
            className="mt-10 hidden items-center gap-3 font-body text-xs tracking-[0.2em] text-offwhite/40 uppercase lg:flex"
          >
            Gulir untuk menelusuri
            <span className="block h-px w-16 bg-offwhite/25" />
          </p>
        </div>

        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}

        <div aria-hidden="true" className="hidden shrink-0 lg:block lg:w-12" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-12 bottom-8 hidden h-px bg-white/12 lg:block"
      >
        <span data-roles-progress className="block h-full w-full origin-left bg-seafoam" />
      </div>
    </section>
  )
}
