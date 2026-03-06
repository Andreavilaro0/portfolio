import { Hero } from '@/components/layout/Hero'
import { AboutSection } from '@/components/layout/AboutSection'
import { CivicAidSection } from '@/components/layout/CivicAidSection'
import { CapturingMomentsSection } from '@/components/layout/CapturingMomentsSection'
import { RoboticsSection } from '@/components/layout/RoboticsSection'
import { OSSection } from '@/components/layout/OSSection'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <CivicAidSection />
      <CapturingMomentsSection />
      <RoboticsSection />
      <OSSection />
      <Footer />
    </main>
  )
}
