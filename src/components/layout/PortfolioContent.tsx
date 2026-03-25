import { HeroScroll } from './HeroScroll'
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
        background: 'var(--color-violet)',
        boxShadow: '0 0 12px rgba(123,47,255,0.4)',
      }} />
    </div>
  )
}

export function PortfolioContent() {
  return (
    <main id="main-content" style={{ background: '#000', color: '#e8e6e3', position: 'relative', overflow: 'hidden' }}>
      {/* Background blue pulse lines — fixed, subtle, evoke the hero */}
      <div aria-hidden="true" style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        {/* Horizontal lines */}
        <div style={{
          position: 'absolute', top: '20%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 5%, rgba(0,229,255,0.08) 30%, transparent 50%, rgba(0,229,255,0.06) 70%, transparent 95%)',
          boxShadow: '0 0 30px rgba(0,229,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', top: '45%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 10%, rgba(123,47,255,0.06) 40%, transparent 60%, rgba(0,229,255,0.08) 80%, transparent 95%)',
          boxShadow: '0 0 20px rgba(123,47,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', top: '70%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 15%, rgba(0,229,255,0.06) 35%, transparent 55%, rgba(255,45,155,0.04) 75%, transparent 90%)',
          boxShadow: '0 0 25px rgba(0,229,255,0.04)',
        }} />
        {/* Vertical accent */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '10%', width: '1px',
          background: 'linear-gradient(180deg, transparent 10%, rgba(0,229,255,0.04) 30%, transparent 50%, rgba(0,229,255,0.03) 70%, transparent 90%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: '10%', width: '1px',
          background: 'linear-gradient(180deg, transparent 20%, rgba(123,47,255,0.03) 40%, transparent 60%, rgba(0,229,255,0.04) 80%, transparent 95%)',
        }} />
      </div>

      <HeroScroll />
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
