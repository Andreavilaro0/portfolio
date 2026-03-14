'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Stickers fly in from random directions
    const stickers = gsap.utils.toArray<HTMLElement>('.hero-sticker')
    stickers.forEach((s, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 200
      gsap.set(s, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        rotation: (Math.random() - 0.5) * 40,
        scale: 0.5,
      })
      tl.to(s, {
        x: 0, y: 0, opacity: 1,
        rotation: parseFloat(s.dataset.rotation || '0'),
        scale: 1,
        duration: 0.6,
      }, 0.8 + i * 0.08)
    })

    // Name clips in
    tl.fromTo('.hero-name',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.inOut' },
      0
    )

    // Subtitle fades up
    tl.fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.6
    )

    // Scroll indicator
    tl.fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      1.2
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative" aria-label="Hero">
      <a href="#projects" className="skip-link">Skip to projects</a>

      <div
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Decorative shapes */}
        <div
          className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full"
          style={{ background: 'var(--color-pink)', opacity: 0.15 }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[15%] right-[8%] w-48 h-48"
          style={{ background: 'var(--color-lime)', opacity: 0.12 }}
          aria-hidden="true"
        />
        <div
          className="absolute top-[30%] right-[15%] w-24 h-24 rounded-full"
          style={{ background: 'var(--color-violet)', opacity: 0.1 }}
          aria-hidden="true"
        />

        {/* Name — ENORMOUS */}
        <div className="relative z-10 text-center px-4">
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 15vw, 14rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              fontWeight: 400,
            }}
          >
            ANDREA<br />AVILA
          </h1>

          <p
            className="hero-subtitle mt-4"
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            Full Stack Developer — Madrid
          </p>
        </div>

        {/* Stickers / Badges flotantes */}
        <div
          className="hero-sticker badge badge-pink absolute top-[12%] right-[10%] z-20"
          data-rotation="-5"
          style={{ transform: 'rotate(-5deg)' }}
        >
          FULL STACK
        </div>
        <div
          className="hero-sticker badge badge-lime absolute bottom-[20%] left-[8%] z-20"
          data-rotation="3"
          style={{ transform: 'rotate(3deg)' }}
        >
          MADRID, ES
        </div>
        <div
          className="hero-sticker badge badge-violet absolute top-[25%] left-[12%] z-20"
          data-rotation="-8"
          style={{ transform: 'rotate(-8deg)' }}
        >
          4° SEM
        </div>
        <div
          className="hero-sticker badge badge-cyan absolute bottom-[25%] right-[12%] z-20"
          data-rotation="6"
          style={{ transform: 'rotate(6deg)' }}
        >
          MX → ES
        </div>

        {/* Micro data labels */}
        <div
          className="absolute top-6 left-6 z-20"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            letterSpacing: '0.1em',
          }}
        >
          40.4168°N, 3.7038°W
        </div>
        <div
          className="absolute top-6 right-6 z-20"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            letterSpacing: '0.1em',
          }}
        >
          © 2026
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center">
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: '8px',
            }}
          >
            scroll
          </p>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'var(--color-text)',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    </section>
  )
}
