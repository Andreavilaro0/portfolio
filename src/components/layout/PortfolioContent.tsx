import { Hero } from './Hero'
import { Marquee } from './Marquee'
import { AboutSection } from './AboutSection'
import { CivicAidSection } from './CivicAidSection'
import { CapturingMomentsSection } from './CapturingMomentsSection'
import { RoboticsSection } from './RoboticsSection'
import { OSSection } from './OSSection'
import { Footer } from './Footer'

export function PortfolioContent() {
  return (
    <main>
      <Hero />
      <Marquee />
      <AboutSection />
      <CivicAidSection />
      <CapturingMomentsSection />
      <RoboticsSection />
      <OSSection />
      <Footer />
    </main>
  )
}
