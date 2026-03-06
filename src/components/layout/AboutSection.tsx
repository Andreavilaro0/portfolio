'use client'

import dynamic from 'next/dynamic'
import { ScrollReveal } from './ScrollReveal'
import { CountUp } from './CountUp'

const SplineScene = dynamic(
  () => import('./SplineScene').then((m) => ({ default: m.SplineScene })),
  { ssr: false }
)

export function AboutSection() {
  return (
    <section
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Left — About */}
      <div
        style={{
          flex: '1 1 480px',
          padding: 'clamp(48px, 8vh, 96px) clamp(32px, 6vw, 96px)',
        }}
      >
        <ScrollReveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span className="label">00</span>
            <span className="label" style={{ color: 'var(--color-sage-green)' }}>
              The Cook
            </span>
            <span className="label">/ Background</span>
            <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              lineHeight: 1.8,
              color: 'var(--color-cocoa)',
              maxWidth: '480px',
            }}
          >
            No espero a que me enseñen — busco los retos. Hackatones, competiciones
            de robótica, proyectos personales. Cada oportunidad de construir algo
            es una oportunidad de aprender.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              lineHeight: 1.8,
              color: 'var(--color-cocoa)',
              maxWidth: '480px',
              marginTop: '20px',
            }}
          >
            Vengo de gestionar un negocio familiar en México. Esa experiencia me
            enseñó a resolver problemas reales, tratar con clientes y entregar
            resultados — no solo ejercicios de clase.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={300}>
          <div style={{ display: 'flex', gap: '48px', marginTop: '40px', flexWrap: 'wrap' }}>
            {[
              { number: '4°', label: 'Semestre' },
              { number: '10+', label: 'Tecnologías' },
              { number: '2028', label: 'Graduación' },
            ].map((stat) => (
              <div key={stat.label}>
                <div>
                  <CountUp
                    value={stat.number}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      color: 'var(--color-espresso)',
                    }}
                  />
                </div>
                <div className="label" style={{ marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right — Spline 3D card */}
      <div
        style={{
          flex: '1 1 480px',
          height: '80vh',
          minHeight: '400px',
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <SplineScene scene="https://prod.spline.design/AQwbVOvzQrArzTHZ/scene.splinecode" />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100px',
            height: '100%',
            background: 'linear-gradient(90deg, #0a0a0a, transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  )
}
