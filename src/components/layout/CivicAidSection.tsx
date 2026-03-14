'use client'

import { ScrollReveal } from './ScrollReveal'
import { LaptopMockup } from '../ui/LaptopMockup'

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
          <span className="badge badge-pink">Clara</span>
          <span className="label">/ AI Voice Assistant</span>
          <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
        </div>
      </ScrollReveal>

      {/* Two columns: info left, mockup right */}
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
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              CLARA —<br />CIVICAID VOICE
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
                    color: 'var(--color-muted)',
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
                  color: 'var(--color-pink)',
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
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-pink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                [github]
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Laptop mockup with live site */}
        <ScrollReveal delay={200}>
          <div style={{ flex: '1 1 400px' }}>
            <LaptopMockup>
              <iframe
                src="https://andreavilaro0.github.io/civicaid-voice/"
                title="Clara — CivicAid Voice"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
            </LaptopMockup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
