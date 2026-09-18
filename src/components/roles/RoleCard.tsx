import type { Role } from '@/types'

export interface RoleCardProps {
  readonly role: Role
}

export function RoleCard({ role }: RoleCardProps) {
  const Icon = role.icon

  return (
    <article
      data-role-card
      className="group relative flex h-[62vh] w-[82vw] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-sm sm:w-[68vw] lg:h-[68vh] lg:w-[min(72vw,30rem)]"
    >
      <img
        src={role.image}
        alt={role.imageAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-deep/10"
      />

      <span
        aria-hidden="true"
        className="absolute top-6 left-7 font-display text-[clamp(3rem,5vw,4.25rem)] leading-none font-extrabold text-white/25"
      >
        {role.number}
      </span>

      <div data-role-body className="relative p-7 lg:p-8">
        <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full border border-seafoam/35 text-seafoam">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none font-extrabold tracking-tight text-offwhite">
          {role.title}
        </h3>
        <p className="mt-4 max-w-sm font-body text-[0.9375rem] leading-relaxed text-offwhite/65">
          {role.description}
        </p>
      </div>
    </article>
  )
}
