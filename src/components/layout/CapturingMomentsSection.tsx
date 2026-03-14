'use client'

import { ScrollReveal } from './ScrollReveal'
import { BrowserMockup } from '../ui/BrowserMockup'

export function CapturingMomentsSection() {
  return (
    <section
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(32px, 6vw, 96px)',
      }}
    >
      {/* Section divider */}
      <div className="section-divider" style={{ marginBottom: '48px' }} />

      {/* Label */}
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <span className="label">02</span>
          <span className="badge badge-cyan">Lens</span>
          <span className="label">/ Photography Portfolio</span>
          <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
        </div>
      </ScrollReveal>

      {/* Two columns: info left, browser mockup right */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center' }}>
        {/* Left — Info */}
        <div style={{ flex: '1 1 400px', maxWidth: '560px' }}>
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              CAPTURING<br />MOMENTS
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-muted)',
                marginTop: '20px',
                maxWidth: '480px',
              }}
            >
              Portafolio de fotografía con diseño editorial,
              animaciones GSAP y galería dinámica. Street photography
              capturando momentos reales en la ciudad.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--color-muted)' }}>
                → Diseño editorial responsive
              </div>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--color-muted)' }}>
                → Animaciones scroll-based
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={350}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['HTML/CSS', 'JavaScript', 'GSAP'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <a
              href="https://andreavilaro0.github.io/plantilla/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '32px',
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                color: 'var(--color-pink)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              [view project]
            </a>
          </ScrollReveal>
        </div>

        {/* Right — Browser mockup with video */}
        <ScrollReveal delay={150}>
          <div style={{ flex: '1 1 400px' }}>
            <BrowserMockup url="andreavilaro0.github.io/plantilla">
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              >
                <source src="/videos/plantilla-showcase.mp4" type="video/mp4" />
              </video>
            </BrowserMockup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
