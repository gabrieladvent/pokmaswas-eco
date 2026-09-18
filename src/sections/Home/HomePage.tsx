import { AboutSection } from '@/components/about/AboutSection'
import { ActivitiesSection } from '@/components/activities/ActivitiesSection'
import { CollaborationSection } from '@/components/collaboration/CollaborationSection'
import { CommunitySection } from '@/components/community/CommunitySection'
import { CTASection } from '@/components/cta/CTASection'
import { GallerySection } from '@/components/gallery/GallerySection'
import { Hero } from '@/components/hero/Hero'
import { FinalTransition } from '@/components/ocean/FinalTransition'
import { OceanStats } from '@/components/ocean/OceanStats'
import { OceanTransition } from '@/components/ocean/OceanTransition'
import { WaveSeam } from '@/components/ocean/WaveSeam'
import { RolesSection } from '@/components/roles/RolesSection'
import { VisitorStats } from '@/components/visitor/VisitorStats'

/**
 * Urutan bagian beranda — dan, sama pentingnya, sambungan di antaranya.
 *
 * Sebagian besar sambungan di sini tidak perlu apa-apa: bagian yang
 * bersebelahan sama-sama laut dalam, jadi batasnya memang tidak terlihat.
 * Dua sambungan berbeda. Galeri berakhir di laut dalam lalu Kegiatan mulai
 * dengan latar terang, dan Kegiatan berakhir terang lalu Komunitas kembali
 * ke air. Tanpa perantara, keduanya terbaca sebagai dua halaman berbeda
 * yang ditempelkan.
 *
 * `WaveSeam` mengisi kedua tempat itu dengan permukaan air, jadi
 * perpindahannya terbaca sebagai naik ke permukaan lalu turun lagi —
 * bukan sebagai pergantian warna latar.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <OceanTransition />
      <RolesSection />
      <OceanStats />
      <GallerySection />

      {/* Naik ke permukaan: laut dalam berakhir, catatan lapangan dimulai. */}
      <WaveSeam
        fromClassName="fill-deep"
        toClassName="bg-offwhite"
        midClassName="fill-ocean"
        shallowClassName="fill-turquoise"
        foam
      />

      <ActivitiesSection />

      {/* Turun kembali ke air, lewat garis pantai. */}
      <WaveSeam
        fromClassName="fill-offwhite"
        toClassName="bg-ocean"
        midClassName="fill-sand"
        shallowClassName="fill-sand-soft"
      />

      <CommunitySection />
      <VisitorStats />
      <CollaborationSection />
      <FinalTransition />
      <CTASection />
    </>
  )
}
