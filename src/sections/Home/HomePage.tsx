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
import { RolesSection } from '@/components/roles/RolesSection'
import { VisitorStats } from '@/components/visitor/VisitorStats'

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
      <VisitorStats />
      <CollaborationSection />
      <FinalTransition />
      <CTASection />
    </>
  )
}
