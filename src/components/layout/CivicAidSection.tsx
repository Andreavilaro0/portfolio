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
      <div className="section-divider" style={{ marginBottom: '48px', background: 'rgba(255,255,255,0.15)' }} />

      {/* Label */}
      <ScrollReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>01</span>
          <span className="badge badge-pink">Clara</span>
          <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>/ AI Voice Assistant</span>
          <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.15)' }} />
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
                color: '#FFFFFF',
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
                fontSize: 'clamp(0.95rem, 1.1vw + 0.5rem, 1.15rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.7)',
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
                    color: 'rgba(255,255,255,0.55)',
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
                <span key={tag} className="tag" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)' }}>{tag}</span>
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
                  color: '#FF6FBF',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
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
                  color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6FBF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                [github]
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Laptop mockup with static preview */}
        <ScrollReveal delay={200}>
          <div style={{ flex: '1 1 400px' }}>
            <LaptopMockup>
              <a
                href="https://andreavilaro0.github.io/civicaid-voice/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  textDecoration: 'none',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute',
                  top: '-20%',
                  right: '-10%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'rgba(190, 255, 0, 0.05)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '-15%',
                  left: '-5%',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'rgba(255, 45, 155, 0.05)',
                }} />
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#fff',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}>
                  Clara
                </span>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}>
                  Click to open live demo →
                </span>
              </a>
            </LaptopMockup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
