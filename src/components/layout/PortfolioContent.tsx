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
      <nav
        aria-label="Portfolio navigation"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--color-bg)',
          borderBottom: '3px solid var(--color-text)',
          padding: '12px clamp(16px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            letterSpacing: '0.05em',
            color: 'var(--color-text)',
            lineHeight: 1,
          }}
        >
          AA
        </span>
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 32px)',
            alignItems: 'center',
          }}
        >
          {[
            { label: 'Work', href: '#projects' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s, text-decoration-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-pink)'
                e.currentTarget.style.textDecorationColor = 'var(--color-pink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-muted)'
                e.currentTarget.style.textDecorationColor = 'transparent'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

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
