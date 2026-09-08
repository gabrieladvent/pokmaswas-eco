import { AboutSection } from '@/components/about/AboutSection'
import { ActivitiesSection } from '@/components/activities/ActivitiesSection'
import { CommunitySection } from '@/components/community/CommunitySection'
import { CTASection } from '@/components/cta/CTASection'
import { GallerySection } from '@/components/gallery/GallerySection'
import { Hero } from '@/components/hero/Hero'
import { FinalTransition } from '@/components/ocean/FinalTransition'
import { OceanStats } from '@/components/ocean/OceanStats'
import { OceanTransition } from '@/components/ocean/OceanTransition'
import { RolesSection } from '@/components/roles/RolesSection'

/**
 * Perjalanannya, berurutan:
 *
 *   hero sinematik → daratan → pesisir → laut → bawah laut →
 *   cerita Pokmaswas → kegiatan lapangan → masyarakat →
 *   konservasi → masa depan
 *
 * Nada tiap section menuruni gradasi dari pasir ke laut dalam, naik
 * sebentar ke cahaya siang untuk kerja lapangan, lalu turun lagi menuju
 * penutup — palet warnanya sendiri yang membawa alurnya.
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
      <ActivitiesSection />
      <CommunitySection />
      <FinalTransition />
      <CTASection />
    </>
  )
}
