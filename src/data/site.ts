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
