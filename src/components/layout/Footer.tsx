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
        <span className="label" style={{ color: 'var(--color-sage-green)' }}>
          Contact
        </span>
        <span className="label">/ Open Kitchen</span>
        <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
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
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: 'var(--color-espresso)',
              margin: 0,
            }}
          >
            Ready to cook
            <br />
            <span style={{ color: 'var(--color-terracotta)' }}>
              something new?
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
              color: 'var(--color-cocoa)',
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
              color: 'var(--color-warm-white)',
              background: 'var(--color-terracotta)',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
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
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,107,60,0.4)'
                const arrow = e.currentTarget.querySelector('span:last-child') as HTMLElement
                if (arrow) arrow.style.color = 'var(--color-terracotta)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                const arrow = e.currentTarget.querySelector('span:last-child') as HTMLElement
                if (arrow) arrow.style.color = 'var(--color-steam-grey)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  color: 'var(--color-cocoa)',
                  transition: 'color 0.2s',
                }}
              >
                {ch.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '14px',
                  color: 'var(--color-steam-grey)',
                  transition: 'color 0.2s',
                }}
              >
                →
              </span>
            </a>
          ))}

          {/* Info panel */}
          <div
            className="glass-card"
            style={{
              marginTop: '32px',
              padding: '16px',
            }}
          >
            <div className="label" style={{ color: 'var(--color-sage-green)', marginBottom: '12px' }}>
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
                <span style={{ color: 'var(--color-steam-grey)', textTransform: 'uppercase' }}>{row.k}</span>
                <span style={{ color: row.accent ? 'var(--color-sage-green)' : 'var(--color-cocoa)' }}>{row.v}</span>
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
          borderTop: '1px dashed rgba(255,255,255,0.08)',
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
