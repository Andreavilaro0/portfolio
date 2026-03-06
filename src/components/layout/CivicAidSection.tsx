'use client'

import dynamic from 'next/dynamic'
import { ScrollReveal } from './ScrollReveal'

const SplineScene = dynamic(
  () => import('./SplineScene').then((m) => ({ default: m.SplineScene })),
  { ssr: false }
)

export function CivicAidSection() {
  return (
    <section
      id="projects"
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
          <span className="label">01</span>
          <span className="label" style={{ color: 'var(--color-sage-green)' }}>
            Clara
          </span>
          <span className="label">/ AI Voice Assistant</span>
          <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
        </div>
      </ScrollReveal>

      {/* Two columns: info left, 3D right */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(32px, 4vw, 64px)',
          alignItems: 'center',
        }}
      >
        {/* Left — Project info */}
        <div style={{ flex: '1 1 400px', maxWidth: '560px' }}>
          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--color-espresso)',
                margin: 0,
              }}
            >
              Clara —
              <br />
              CivicAid Voice
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-cocoa)',
                marginTop: '20px',
                maxWidth: '480px',
              }}
            >
              Asistente IA multilingüe que conecta poblaciones vulnerables con
              trámites del gobierno español. Voz + texto en 8 idiomas,
              integración directa con WhatsApp API. Lideré el proyecto completo.
            </p>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal delay={300}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
              {[
                'OdiseIA4Good 2026 — 300+ participantes',
                'Líder de proyecto',
                '469+ tests automatizados',
              ].map((h) => (
                <div
                  key={h}
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '12px',
                    color: 'var(--color-cocoa)',
                    letterSpacing: '0.03em',
                  }}
                >
                  → {h}
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Tags */}
          <ScrollReveal delay={350}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['React', 'TypeScript', 'Python', 'Gemini', 'ElevenLabs'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={400}>
            <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
              <a
                href="https://andreavilaro0.github.io/civicaid-voice/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
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
                [live demo]
              </a>
              <a
                href="https://github.com/Andreavilaro0/civicaid-voice"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '12px',
                  color: 'var(--color-steam-grey)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-terracotta)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-steam-grey)')}
              >
                [github]
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Spline 3D computer */}
        <ScrollReveal delay={200}>
          <div
            className="glass-card"
            style={{
              flex: '1 1 400px',
              aspectRatio: '4 / 3',
              minHeight: '300px',
              position: 'relative',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <SplineScene scene="https://prod.spline.design/S4UfUfH4Mi-TCEg3/scene.splinecode" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
