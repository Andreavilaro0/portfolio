'use client'

import { ScrollReveal } from './ScrollReveal'
import { LaptopMockup } from '../ui/LaptopMockup'
import { PhoneMockup } from '../ui/PhoneMockup'
import { MaskingTape } from '../ui/MaskingTape'
import { HandDrawnLine } from './HandDrawnLine'

export function CivicAidSection() {
  return (
    <section
      id="projects"
      className="paper-bg"
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(24px, 6vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Page number */}
      <span className="page-number">pg. 01</span>

      {/* Two-column layout: info + mockups */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT — Info column */}
        <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
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
              CLARA &mdash; CIVICAID
            </h2>
            <HandDrawnLine variant={1} opacity={0.3} color="var(--color-pencil)" />
          </ScrollReveal>

          {/* Handwritten annotation — achievement */}
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
                  transform: 'rotate(-2deg)',
                  display: 'inline-block',
                }}
              >
                1er lugar!
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'var(--color-highlight)',
                  padding: '2px 10px',
                  borderRadius: '2px',
                  color: 'var(--color-text)',
                }}
              >
                300+ participantes
              </span>
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.2vw + 0.4rem, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                marginTop: '20px',
                maxWidth: '420px',
              }}
            >
              Asistente IA multilingüe que conecta poblaciones vulnerables
              con trámites del gobierno español. Voz + texto en 8 idiomas,
              integración directa con WhatsApp API.
            </p>
          </ScrollReveal>

          {/* Blueprint: architecture pipeline */}
          <ScrollReveal delay={280}>
            <div style={{ marginTop: '24px' }}>
              <svg width="100%" viewBox="0 0 380 50" fill="none" aria-hidden="true" style={{ maxWidth: '380px' }}>
                {/* Boxes */}
                {[
                  { x: 0, label: 'React' },
                  { x: 95, label: 'Python' },
                  { x: 190, label: 'Gemini' },
                  { x: 285, label: 'ElevenLabs' },
                ].map((box) => (
                  <g key={box.label}>
                    <rect x={box.x} y="10" width="80" height="28" rx="2" stroke="var(--color-pencil)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                    <text x={box.x + 40} y="28" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--color-pencil)">{box.label}</text>
                  </g>
                ))}
                {/* Arrows */}
                {[80, 175, 270].map((x) => (
                  <line key={x} x1={x} y1="24" x2={x + 15} y2="24" stroke="var(--color-pencil)" strokeWidth="1.2" markerEnd="url(#arrowhead-civic)" />
                ))}
                <defs>
                  <marker id="arrowhead-civic" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="var(--color-pencil)" />
                  </marker>
                </defs>
                {/* Label */}
                <text x="190" y="48" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11" fill="var(--color-muted)">procesamiento de voz →</text>
              </svg>
            </div>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal delay={320}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '20px' }}>
              {[
                '469+ tests automatizados',
                'Líder de proyecto',
                '8 idiomas soportados',
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

          {/* Tags */}
          <ScrollReveal delay={360}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['React', 'TypeScript', 'Python', 'Gemini', 'ElevenLabs'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>

          {/* Links */}
          <ScrollReveal delay={400}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '28px' }}>
              <a
                href="https://andreavilaro0.github.io/civicaid-voice/"
                target="_blank"
                rel="noopener noreferrer"
                className="pencil-underline"
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-pink)',
                  textDecoration: 'none',
                }}
              >
                [live demo →]
              </a>
              <a
                href="https://github.com/Andreavilaro0/civicaid-voice"
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
                [github →]
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* RIGHT — Mockups with tape */}
        <ScrollReveal delay={200}>
          <div style={{ flex: '2 1 460px', minWidth: 0, display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* Laptop mockup */}
            <div style={{ flex: '1 1 320px', position: 'relative' }}>
              <MaskingTape position="top-left" />
              <MaskingTape position="top-right" />
              <LaptopMockup>
                <a
                  href="https://andreavilaro0.github.io/civicaid-voice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                >
                  <img
                    src="/projects/clara-desktop.png"
                    alt="Clara — CivicAid Voice desktop interface"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </a>
              </LaptopMockup>
              {/* Blueprint callout */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  right: '-8px',
                  fontFamily: 'var(--font-hand)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-muted)',
                  transform: 'rotate(3deg)',
                }}
              >
                ← 8 idiomas
              </span>
            </div>
            {/* Phone mockup */}
            <div style={{ flex: '0 0 auto', maxWidth: '160px', position: 'relative' }}>
              <MaskingTape position="top-right" rotation={18} />
              <PhoneMockup>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                  <source src="/projects/clara-mobile.mp4" type="video/mp4" />
                </video>
              </PhoneMockup>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Bottom divider */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <HandDrawnLine variant={2} opacity={0.2} color="var(--color-border)" />
      </div>
    </section>
  )
}
