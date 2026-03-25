'use client'

import dynamic from 'next/dynamic'
import { ScrollReveal } from './ScrollReveal'
import { HandDrawnLine } from './HandDrawnLine'

const RobotViewer = dynamic(
  () => import('./RobotViewer').then((m) => ({ default: m.RobotViewer })),
  { ssr: false }
)

export function RoboticsSection() {
  return (
    <section
      className="paper-bg"
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(24px, 6vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Page number */}
      <span className="page-number">pg. 03</span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <ScrollReveal>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              color: 'var(--color-text)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            ASTI ROBOTICS
          </h2>
          <HandDrawnLine variant={2} opacity={0.3} color="var(--color-pencil)" />
        </ScrollReveal>

        {/* Annotations */}
        <ScrollReveal delay={100}>
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--color-pink)',
                border: '2px solid var(--color-pink)',
                borderRadius: '50%',
                padding: '4px 16px',
                transform: 'rotate(2deg)',
                display: 'inline-block',
              }}
            >
              finalista nacional!
            </span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-muted)',
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}
            >
              50+ equipos
            </span>
          </div>
        </ScrollReveal>

        {/* Two-column layout */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'flex-start',
            marginTop: '32px',
          }}
        >
          {/* LEFT — Robot viewer in sketch border */}
          <ScrollReveal>
            <div style={{ flex: '2 1 420px', position: 'relative' }}>
              <div
                className="sketch-border"
                style={{
                  overflow: 'hidden',
                  aspectRatio: '4 / 3',
                  minHeight: '380px',
                  position: 'relative',
                }}
              >
                <RobotViewer />
              </div>

              {/* ASTI Challenge sticker taped on */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '16px',
                  transform: 'rotate(3deg)',
                  zIndex: 10,
                }}
              >
                <div
                  className="tape"
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-8deg)',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--color-text)',
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    padding: '6px 14px',
                    display: 'inline-block',
                  }}
                >
                  ASTI CHALLENGE 2026
                </span>
              </div>

              {/* Blueprint: Zumo exploded view */}
              <div style={{ marginTop: '24px' }}>
                <svg width="100%" viewBox="0 0 320 55" fill="none" aria-hidden="true" style={{ maxWidth: '320px' }}>
                  {[
                    { x: 0, label: 'sensores IR' },
                    { x: 110, label: 'motores' },
                    { x: 220, label: 'cuchilla' },
                  ].map((box) => (
                    <g key={box.label}>
                      <rect x={box.x} y="8" width="90" height="28" rx="2" stroke="var(--color-pencil)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                      <text x={box.x + 45} y="26" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--color-pencil)">{box.label}</text>
                    </g>
                  ))}
                  {/* Measurement arrows */}
                  <line x1="0" y1="46" x2="310" y2="46" stroke="var(--color-muted)" strokeWidth="1" />
                  <line x1="0" y1="42" x2="0" y2="50" stroke="var(--color-muted)" strokeWidth="1" />
                  <line x1="310" y1="42" x2="310" y2="50" stroke="var(--color-muted)" strokeWidth="1" />
                  <text x="155" y="54" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="10" fill="var(--color-muted)">Zumo 32U4</text>
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT — Info column */}
          <div style={{ flex: '1 1 300px', maxWidth: '440px' }}>
            <ScrollReveal delay={150}>
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.2vw + 0.4rem, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                Clasificada para la final del ASTI Robotics Challenge,
                la competición universitaria más importante de España.
                De 50+ equipos, llegamos a la final.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={230}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '24px' }}>
                {[
                  'Finalista nacional — ASTI Challenge',
                  'Desarrollo de software del robot',
                  'Universidad UDIT — Madrid',
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-pencil)',
                    }}
                  >
                    → {h}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
                {['C++', 'Arduino', 'Zumo 32U4'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={360}>
              <div style={{ marginTop: '28px' }}>
                <a
                  href="https://www.udit.es/proyectos-de-exito/tres-nuevos-equipos-de-estudiantes-de-udit-se-clasifican-para-la-final-del-asti-robotics-challenge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pencil-underline"
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-pencil)',
                    textDecoration: 'none',
                  }}
                >
                  [leer más →]
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <HandDrawnLine variant={0} opacity={0.2} color="var(--color-border)" />
      </div>
    </section>
  )
}
