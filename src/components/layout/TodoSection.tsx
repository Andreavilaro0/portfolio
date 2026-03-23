'use client'

import { ScrollReveal } from './ScrollReveal'
import { BrowserMockup } from '../ui/BrowserMockup'
import { PhoneMockup } from '../ui/PhoneMockup'
import { MaskingTape } from '../ui/MaskingTape'
import { HandDrawnLine } from './HandDrawnLine'

export function TodoSection() {
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
      <span className="page-number">pg. 04</span>

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
            TASK DASHBOARD
          </h2>
          <HandDrawnLine variant={1} opacity={0.3} color="var(--color-pencil)" />
        </ScrollReveal>

        {/* Annotations */}
        <ScrollReveal delay={100}>
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--color-pencil)',
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}
            >
              Sprint 6 — Frontend I
            </span>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-pencil)',
                border: '2px solid var(--color-pencil)',
                borderRadius: '50%',
                padding: '2px 12px',
                transform: 'rotate(2deg)',
                display: 'inline-block',
              }}
            >
              UDIT Madrid
            </span>
          </div>
        </ScrollReveal>

        {/* Blueprint: dashboard wireframe */}
        <ScrollReveal delay={150}>
          <div style={{ marginTop: '24px' }}>
            <svg width="100%" viewBox="0 0 360 60" fill="none" aria-hidden="true" style={{ maxWidth: '360px' }}>
              {[
                { x: 0, label: 'mapa' },
                { x: 90, label: 'calendario' },
                { x: 180, label: 'filtros' },
                { x: 270, label: 'tareas' },
              ].map((box) => (
                <g key={box.label}>
                  <rect x={box.x} y="8" width="75" height="28" rx="2" stroke="var(--color-pencil)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                  <text x={box.x + 37} y="26" textAnchor="middle" fontFamily="var(--font-code)" fontSize="8" fill="var(--color-pencil)">{box.label}</text>
                </g>
              ))}
              {[75, 165, 255].map((x) => (
                <line key={x} x1={x} y1="22" x2={x + 15} y2="22" stroke="var(--color-pencil)" strokeWidth="1.2" markerEnd="url(#arrowhead-todo)" />
              ))}
              <defs>
                <marker id="arrowhead-todo" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="var(--color-pencil)" />
                </marker>
              </defs>
              <text x="180" y="55" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="11" fill="var(--color-muted)">widgets interactivos</text>
            </svg>
          </div>
        </ScrollReveal>

        {/* Two-column: info + mockups */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px, 4vw, 64px)',
            alignItems: 'center',
            marginTop: '32px',
          }}
        >
          {/* LEFT — Info */}
          <div style={{ flex: '1 1 340px', maxWidth: '480px' }}>
            <ScrollReveal delay={200}>
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.2vw + 0.4rem, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  margin: '0 0 20px 0',
                  maxWidth: '420px',
                }}
              >
                Dashboard de productividad con widgets interactivos: mapa de ubicaciones,
                calendario, estados de tareas, prioridades y filtros avanzados.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Dashboard con widgets dinámicos',
                  'Mapa interactivo integrado',
                  'Filtros por estado y prioridad',
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
                {['JavaScript', 'HTML', 'CSS'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={350}>
              <div style={{ display: 'flex', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
                <a
                  href="https://andreavilaro0.github.io/todo-list-dashboard/"
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
                  [live demo →]
                </a>
                <a
                  href="https://github.com/Andreavilaro0/todo-list-dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pencil-underline"
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-muted)',
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
              {/* Browser mockup */}
              <div style={{ flex: '1 1 320px', position: 'relative' }}>
                <MaskingTape position="top-left" />
                <MaskingTape position="bottom-right" rotation={-10} />
                <BrowserMockup url="andreavilaro0.github.io/todo-list-dashboard">
                  <a
                    href="https://andreavilaro0.github.io/todo-list-dashboard/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                  >
                    <img
                      src="/projects/todo-desktop.png"
                      alt="Task Dashboard — productivity app with interactive widgets and map"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </a>
                </BrowserMockup>
              </div>
              {/* Phone mockup */}
              <div style={{ flex: '0 0 auto', maxWidth: '160px', position: 'relative' }}>
                <MaskingTape position="top-right" rotation={15} />
                <PhoneMockup>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  >
                    <source src="/projects/todo-mobile.mp4" type="video/mp4" />
                  </video>
                </PhoneMockup>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <HandDrawnLine variant={2} opacity={0.2} color="var(--color-border)" />
      </div>
    </section>
  )
}
