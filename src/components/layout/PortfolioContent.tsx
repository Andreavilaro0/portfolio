import { HeroAssembly } from './HeroAssembly'
import { ProjectsSection } from './ProjectsSection'
import { SkillsSection } from './SkillsSection'
import { AboutSection } from './AboutSection'
import { Footer } from './Footer'
import { GlassNav } from './GlassNav'

function GradientDivider() {
  return (
    <div style={{
      width: '100%',
      height: '120px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gradient mesh */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(255,45,155,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0,229,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(123,47,255,0.04) 0%, transparent 60%)',
      }} />
      {/* Center line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,45,155,0.2), rgba(123,47,255,0.2), rgba(0,229,255,0.2), transparent)',
      }} />
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#7B2FFF',
        boxShadow: '0 0 12px rgba(123,47,255,0.4)',
      }} />
    </div>
  )
}

export function PortfolioContent() {
  return (
    <main style={{ background: '#000', color: '#e8e6e3', position: 'relative' }}>
      <HeroAssembly />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ProjectsSection />
        <SkillsSection />
        <GradientDivider />
        <AboutSection />
        <GradientDivider />
        <Footer />
      </div>
      <GlassNav />
    </main>
  )
}
