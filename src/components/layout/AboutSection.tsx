'use client'

import { ScrollReveal } from './ScrollReveal'
import { CountUp } from './CountUp'

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
        padding: 'clamp(48px, 8vh, 96px) clamp(32px, 6vw, 96px)',
      }}
    >
      <div style={{ flex: '1 1 480px', maxWidth: '600px' }}>
        <ScrollReveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span className="label">00</span>
            <span className="badge badge-violet">About</span>
            <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              lineHeight: 0.95,
              color: 'var(--color-text)',
              margin: '0 0 24px 0',
            }}
          >
            MEXICANA.<br />
            INGENIERA.<br />
            <span style={{ color: 'var(--color-pink)' }}>BUILDER.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'var(--color-muted)',
              maxWidth: '480px',
            }}
          >
            Gestioné un negocio familiar en México antes de tocar una línea
            de código. En 2022 todo cambió. Me mudé a Madrid, entré a
            ingeniería, y desde entonces: hackathones ganados, finalista
            nacional en robótica, IA que ayuda a gente real.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'var(--color-muted)',
              maxWidth: '480px',
              marginTop: '16px',
            }}
          >
            No espero a que me enseñen — busco los retos. Cada oportunidad
            de construir algo es una oportunidad de aprender.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[
              { number: '4°', label: 'Semestre' },
              { number: '10+', label: 'Tecnologías' },
              { number: '2028', label: 'Graduación' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={{ padding: '16px 24px', textAlign: 'center' }}
              >
                <CountUp
                  value={stat.number}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--color-text)',
                  }}
                />
                <div className="label" style={{ marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right side — photo + stickers */}
      <ScrollReveal delay={150}>
        <div
          style={{
            flex: '1 1 400px',
            minHeight: '400px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Photo */}
          <div
            style={{
              position: 'relative',
              border: '4px solid var(--color-border)',
              boxShadow: '10px 10px 0px var(--color-text)',
              overflow: 'hidden',
              maxWidth: '360px',
              width: '100%',
            }}
          >
            <img
              src="/images/andrea.png"
              alt="Andrea Avila"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Stickers around photo */}
          <div className="sticker" style={{ top: '2%', right: '5%', '--rotation': '-5deg', background: 'var(--color-lime)' } as React.CSSProperties}>
            REACT + TYPESCRIPT
          </div>
          <div className="sticker" style={{ bottom: '15%', left: '0%', '--rotation': '4deg', background: 'var(--color-pink)', color: '#fff' } as React.CSSProperties}>
            PYTHON
          </div>
          <div className="sticker" style={{ top: '40%', right: '0%', '--rotation': '7deg', background: 'var(--color-violet)', color: '#fff' } as React.CSSProperties}>
            C++ / ARDUINO
          </div>
          <div className="sticker" style={{ bottom: '5%', right: '10%', '--rotation': '-3deg', background: 'var(--color-cyan)' } as React.CSSProperties}>
            THREE.JS
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
