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
      <div className="section-divider" style={{ marginBottom: '48px', background: 'rgba(255,255,255,0.15)' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center' }}>
        {/* Left — 3D Robot */}
        <ScrollReveal>
          <div
            className="card"
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
              <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>03</span>
              <span className="badge badge-cyan">Zumo</span>
              <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>/ Robotics</span>
              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              ASTI<br />ROBOTICS
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <span className="badge badge-lime" style={{ marginTop: '12px' }}>
              Finalista Nacional
            </span>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw + 0.5rem, 1.15rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.7)',
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
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                → Finalista nacional
              </div>
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                → Desarrollo de software del robot
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['C++', 'Arduino', 'Zumo 32U4'].map((tag) => (
                <span key={tag} className="tag" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)' }}>{tag}</span>
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
                color: '#FF6FBF',
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
