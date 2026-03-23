'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SketchEmbed } from '../ui/SketchEmbed'
import { HandDrawnLine } from './HandDrawnLine'

const ANNOTATIONS = [
  {
    key: 'opentowork',
    label: 'open to work',
    color: 'var(--color-pink)',
    rotation: -3,
    style: { bottom: '22%', right: '8%' } as React.CSSProperties,
    circled: true,
  },
  {
    key: 'hackathon',
    label: 'hackathon winner!',
    color: 'var(--color-text)',
    rotation: 2,
    style: { top: '6%', left: '2%' } as React.CSSProperties,
    highlight: true,
  },
  {
    key: 'mx-es',
    label: 'MX → ES',
    color: 'var(--color-pencil)',
    rotation: 5,
    style: { top: '12%', right: '4%' } as React.CSSProperties,
  },
  {
    key: '2026',
    label: '2026',
    color: 'var(--color-pencil)',
    rotation: -4,
    style: { bottom: '8%', left: '6%' } as React.CSSProperties,
    circled: true,
  },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Name writes in
    tl.fromTo(
      '.hero-name',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut' },
      0
    )

    // Subtitle fades up like being written
    tl.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.7
    )

    // Photo fades in
    tl.fromTo(
      '.hero-photo-wrap',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.3
    )

    // Annotations appear one by one
    const annotations = gsap.utils.toArray<HTMLElement>('.hero-annotation')
    annotations.forEach((el, i) => {
      gsap.set(el, { opacity: 0, scale: 0.8 })
      tl.to(
        el,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
        },
        0.9 + i * 0.12
      )
    })

    // Scroll note
    tl.fromTo(
      '.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      1.4
    )
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="Hero"
      className="paper-bg"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* p5.brush doodles as background decoration */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <SketchEmbed
          src="/sketches/hero-doodles.html"
          width="100%"
          height="100%"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px) clamp(60px, 8vh, 100px)',
          gap: 'clamp(40px, 6vw, 80px)',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* LEFT — name + subtitle */}
        <div
          style={{
            flex: '1 1 320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
            minWidth: 0,
          }}
        >
          <h1
            className="hero-name"
            aria-label="Andrea Avila"
            style={{
              margin: 0,
              padding: 0,
              lineHeight: 0.95,
            }}
          >
            {/* "Andrea" in handwriting */}
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-hand)',
                fontWeight: 700,
                fontSize: 'clamp(4rem, 14vw, 10rem)',
                color: 'var(--color-text)',
                lineHeight: 0.9,
              }}
            >
              Andrea
            </span>
            {/* "AVILA" stamped/printed */}
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 13vw, 9rem)',
                color: 'var(--color-text)',
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
              }}
            >
              AVILA
            </span>
          </h1>

          {/* Subtitle as handwritten annotation with arrow */}
          <div className="hero-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                fontWeight: 600,
                color: 'var(--color-pencil)',
                transform: 'rotate(-1deg)',
                display: 'inline-block',
              }}
            >
              ← desarrolladora full stack
            </span>
          </div>

          {/* Tech stack as handwritten list */}
          <div
            className="hero-subtitle"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            {['React', 'TypeScript', 'Python', 'Three.js'].map((tech) => (
              <span
                key={tech}
                className="tag"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — photo "taped" to the page */}
        <div
          className="hero-photo-wrap"
          style={{
            flex: '0 0 auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Tape strips on corners */}
          <div
            className="tape"
            aria-hidden="true"
            style={{
              top: '-10px',
              left: '20px',
              transform: 'rotate(-15deg)',
            }}
          />
          <div
            className="tape"
            aria-hidden="true"
            style={{
              top: '-10px',
              right: '20px',
              transform: 'rotate(12deg)',
            }}
          />

          {/* Photo */}
          <img
            src="/images/andrea.png"
            alt="Andrea Avila"
            width={320}
            height={400}
            style={{
              display: 'block',
              maxWidth: '320px',
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              border: '1px solid var(--color-border)',
              borderRadius: '2px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              transform: 'rotate(-2deg)',
            }}
          />

          {/* Handwritten annotations around the photo */}
          {ANNOTATIONS.map((ann) => (
            <span
              key={ann.key}
              className="hero-annotation"
              aria-hidden="true"
              style={{
                position: 'absolute',
                ...ann.style,
                fontFamily: 'var(--font-hand)',
                fontWeight: 700,
                fontSize: ann.circled ? '18px' : '16px',
                color: ann.color,
                transform: `rotate(${ann.rotation}deg)`,
                whiteSpace: 'nowrap',
                cursor: 'default',
                ...(ann.circled
                  ? {
                      border: `2px solid ${ann.color}`,
                      borderRadius: '50%',
                      padding: '4px 12px',
                    }
                  : {}),
                ...(ann.highlight
                  ? {
                      background: 'var(--color-highlight)',
                      padding: '2px 10px',
                      borderRadius: '2px',
                    }
                  : {}),
              }}
            >
              {ann.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator — handwritten */}
      <div
        className="hero-scroll"
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          textAlign: 'center',
        }}
        aria-label="Scroll down"
      >
        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-muted)',
            margin: '0 0 8px',
          }}
        >
          ↓ scroll
        </p>
      </div>

      {/* Bottom hand-drawn line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 20 }}>
        <HandDrawnLine variant={1} opacity={0.3} color="var(--color-border)" />
      </div>
    </section>
  )
}
