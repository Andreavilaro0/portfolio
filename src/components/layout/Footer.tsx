'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const channels = [
  { label: 'github', href: 'https://github.com/Andreavilaro0' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/andrea-avila-dev' },
  { label: 'email', href: 'mailto:andrea15one@icloud.com' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  }),
}

export function Footer() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <footer
      ref={ref}
      id="contact-section"
      style={{
        width: '100%',
        padding: 'clamp(80px, 14vh, 160px) clamp(32px, 6vw, 96px)',
        position: 'relative',
      }}
    >
      {/* Section divider */}
      <div className="section-divider" style={{ marginBottom: '48px' }} />

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <span className="label">05</span>
        <span className="badge badge-lime">Contact</span>
        <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
      </div>

      {/* Main content — two columns */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(32px, 6vw, 80px)',
          alignItems: 'flex-start',
        }}
      >
        {/* Left — CTA headline */}
        <div style={{ flex: '1 1 400px', maxWidth: '560px' }}>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={0}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              lineHeight: 0.95,
              color: 'var(--color-text)',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            LET&apos;S BUILD
            <br />
            <span style={{ color: 'var(--color-pink)' }}>
              SOMETHING
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={0.15}
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
              marginTop: '24px',
              maxWidth: '420px',
            }}
          >
            Busco oportunidades donde pueda construir sistemas reales.
            Prácticas, colaboraciones o proyectos — hablemos.
          </motion.p>

          {/* Primary CTA */}
          <motion.a
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            custom={0.3}
            href="mailto:andrea15one@icloud.com"
            style={{
              display: 'inline-block',
              marginTop: '32px',
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'var(--color-pink)',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '0px',
              border: '3px solid var(--color-text)',
              boxShadow: '4px 4px 0px var(--color-text)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '6px 6px 0px var(--color-text)'
              e.currentTarget.style.transform = 'translate(-2px, -2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '4px 4px 0px var(--color-text)'
              e.currentTarget.style.transform = 'translate(0, 0)'
            }}
          >
            Enviar Mensaje
          </motion.a>
        </div>

        {/* Right — Channel links + info */}
        <div style={{ flex: '1 1 280px', maxWidth: '360px' }}>
          {/* Channels */}
          <div className="label" style={{ marginBottom: '16px' }}>
            Channels
          </div>

          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.label === 'email' ? undefined : '_blank'}
              rel={ch.label === 'email' ? undefined : 'noopener noreferrer'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '3px solid var(--color-border)',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-pink)'
                const arrow = e.currentTarget.querySelector('span:last-child') as HTMLElement
                if (arrow) arrow.style.color = 'var(--color-pink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                const arrow = e.currentTarget.querySelector('span:last-child') as HTMLElement
                if (arrow) arrow.style.color = 'var(--color-muted)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  color: 'var(--color-text)',
                  transition: 'color 0.2s',
                }}
              >
                {ch.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '14px',
                  color: 'var(--color-muted)',
                  transition: 'color 0.2s',
                }}
              >
                →
              </span>
            </a>
          ))}

          {/* Info panel */}
          <div
            className="card"
            style={{
              marginTop: '32px',
              padding: '16px',
            }}
          >
            <div className="label" style={{ color: 'var(--color-violet)', marginBottom: '12px' }}>
              info
            </div>
            {[
              { k: 'Location', v: 'Madrid, Spain' },
              { k: 'Timezone', v: 'CET (UTC+1)' },
              { k: 'Languages', v: 'ES / EN' },
              { k: 'Status', v: 'Open to work', accent: true },
            ].map((row) => (
              <div
                key={row.k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                <span style={{ color: 'var(--color-muted)', textTransform: 'uppercase' }}>{row.k}</span>
                <span style={{ color: row.accent ? 'var(--color-lime)' : 'var(--color-text)' }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          marginTop: '64px',
          paddingTop: '16px',
          borderTop: '3px solid var(--color-text)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <span className="label">Madrid, Spain</span>
        <span className="label">© {new Date().getFullYear()} Andrea Avila</span>
        <span className="label">Built with Next.js + Three.js</span>
      </div>
    </footer>
  )
}
