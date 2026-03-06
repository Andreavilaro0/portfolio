'use client'

import dynamic from 'next/dynamic'
import { ScrollReveal } from './ScrollReveal'

const RobotViewer = dynamic(
  () => import('./RobotViewer').then((m) => ({ default: m.RobotViewer })),
  { ssr: false }
)

export function RoboticsSection() {
  return (
    <section
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(32px, 6vw, 96px)',
      }}
    >
      {/* Section divider */}
      <div className="section-divider" style={{ marginBottom: '48px' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center' }}>
        {/* Left — 3D Robot */}
        <ScrollReveal>
          <div
            className="glass-card"
            style={{
              flex: '1 1 400px',
              aspectRatio: '4 / 3',
              minHeight: '400px',
              position: 'relative',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <RobotViewer />
          </div>
        </ScrollReveal>

        {/* Right — Info */}
        <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="label">03</span>
              <span className="label" style={{ color: 'var(--color-sage-green)' }}>
                Zumo
              </span>
              <span className="label">/ Robotics</span>
              <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--color-espresso)',
                margin: 0,
              }}
            >
              ASTI
              <br />
              Robotics
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <p
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-terracotta)',
                marginTop: '12px',
              }}
            >
              Finalista Nacional
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-cocoa)',
                marginTop: '20px',
              }}
            >
              Clasificada para la final del ASTI Robotics Challenge,
              la competición universitaria más importante de España.
              De 50+ equipos, llegamos a la final. Mi rol: desarrollo de software.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--color-cocoa)' }}>
                → Finalista nacional
              </div>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'var(--color-cocoa)' }}>
                → Desarrollo de software del robot
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['C++', 'Arduino', 'Zumo 32U4'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={350}>
            <a
              href="https://www.udit.es/proyectos-de-exito/tres-nuevos-equipos-de-estudiantes-de-udit-se-clasifican-para-la-final-del-asti-robotics-challenge/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '32px',
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                color: 'var(--color-terracotta)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              [read more]
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
