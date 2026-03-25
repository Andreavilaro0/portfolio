'use client'

import { ScrollReveal } from './ScrollReveal'
import { BrowserMockup } from '../ui/BrowserMockup'
import { PhoneMockup } from '../ui/PhoneMockup'
import { MaskingTape } from '../ui/MaskingTape'
import { HandDrawnLine } from './HandDrawnLine'

export function CapturingMomentsSection() {
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
      <span className="page-number">pg. 02</span>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
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
            CAPTURING MOMENTS
          </h2>
          <HandDrawnLine variant={0} opacity={0.3} color="var(--color-pencil)" />
        </ScrollReveal>

        {/* Annotation */}
        <ScrollReveal delay={100}>
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--color-pencil)',
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}
            >
              ← diseño editorial
            </span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-muted)',
              }}
            >
              ✓ GSAP
            </span>
          </div>
        </ScrollReveal>

        {/* Blueprint: page wireframe */}
        <ScrollReveal delay={150}>
          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <svg width="100%" viewBox="0 0 300 60" fill="none" aria-hidden="true" style={{ maxWidth: '300px' }}>
              {[
                { x: 0, label: 'hero' },
                { x: 100, label: 'gallery' },
                { x: 200, label: 'about' },
              ].map((box) => (
                <g key={box.label}>
                  <rect x={box.x} y="8" width="80" height="30" rx="2" stroke="var(--color-pencil)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                  <text x={box.x + 40} y="27" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--color-pencil)">{box.label}</text>
                </g>
              ))}
              {[80, 180].map((x) => (
                <g key={x}>
                  <line x1={x} y1="23" x2={x + 20} y2="23" stroke="var(--color-pencil)" strokeWidth="1.2" markerEnd="url(#arrowhead-photo)" />
                </g>
              ))}
              <defs>
                <marker id="arrowhead-photo" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="var(--color-pencil)" />
                </marker>
              </defs>
              <text x="150" y="55" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11" fill="var(--color-muted)">scroll flow →</text>
            </svg>
          </div>
        </ScrollReveal>

        {/* Mockups with tape */}
        <ScrollReveal delay={200}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* Browser mockup */}
            <div style={{ flex: '1 1 400px', position: 'relative' }}>
              <MaskingTape position="top-left" />
              <MaskingTape position="bottom-right" rotation={-12} />
              <BrowserMockup url="andreavilaro0.github.io/plantilla">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/projects/photo-desktop.png"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 'clamp(260px, 40vw, 520px)' }}
                >
                  <source src="/videos/plantilla-showcase.mp4" type="video/mp4" />
                </video>
              </BrowserMockup>
            </div>
            {/* Phone mockup */}
            <div style={{ flex: '0 0 auto', maxWidth: '160px', position: 'relative' }}>
              <MaskingTape position="top-right" rotation={20} />
              <PhoneMockup>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                >
                  <source src="/projects/photo-mobile.mp4" type="video/mp4" />
                </video>
              </PhoneMockup>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom info row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(24px, 4vw, 64px)',
            alignItems: 'flex-start',
            marginTop: '32px',
          }}
        >
          <ScrollReveal delay={280}>
            <p
              style={{
                flex: '1 1 320px',
                maxWidth: '500px',
                fontSize: 'clamp(1rem, 1.2vw + 0.4rem, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              Portafolio de fotografía con diseño editorial, animaciones GSAP
              y galería dinámica. Street photography capturando momentos
              reales en la ciudad.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={340}>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {['HTML/CSS', 'JavaScript', 'GSAP'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <a
                href="https://andreavilaro0.github.io/plantilla/"
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
                [ver proyecto →]
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <HandDrawnLine variant={1} opacity={0.2} color="var(--color-border)" />
      </div>
    </section>
  )
}
