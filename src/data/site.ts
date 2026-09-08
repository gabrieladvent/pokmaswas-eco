/**
 * Organisation-level facts.
 *
 * NOTE FOR MAINTAINERS — the placeholder fields below are intentionally
 * empty rather than filled with invented values. Replace them with the
 * group's real details before publishing; the UI already handles the
 * empty state gracefully.
 */
export const site = {
  name: 'Pokmaswas San Dominggo',
  shortName: 'POKMASWAS',
  longName: 'Kelompok Masyarakat Pengawas San Dominggo',
  tagline: 'Menjaga Laut, Menjaga Kehidupan.',
  description:
    'Bersama masyarakat menjaga sumber daya kelautan dan perikanan untuk generasi mendatang.',
  address: {
    village: 'San Dominggo',
    city: 'Larantuka',
    regency: 'Flores Timur',
    province: 'Nusa Tenggara Timur',
    country: 'Indonesia',
  },
  /** TODO: fill in with the group's official contact details. */
  contact: {
    email: '',
    phone: '',
  },
} as const

export const addressLines: readonly string[] = [
  site.address.village,
  `${site.address.city}, ${site.address.regency}`,
  site.address.province,
  site.address.country,
]
