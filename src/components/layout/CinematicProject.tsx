'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

export function CinematicProject({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Phase 1: Letter stagger on title
      const letters = containerRef.current!.querySelectorAll('[data-letter]')
      gsap.fromTo(letters,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          stagger: 0.03, duration: 0.6, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current!.querySelector('[data-phase="hook"]'),
            start: 'top 80%',
          },
        }
      )

      // Accent line grows
      const accentLine = containerRef.current!.querySelector('[data-accent-line]')
      if (accentLine) {
        gsap.fromTo(accentLine,
          { width: 0 },
          {
            width: 200, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current!.querySelector('[data-phase="hook"]'),
              start: 'top 70%',
            },
          }
        )
      }

      // Subtitle fade
      const subtitle = containerRef.current!.querySelector('[data-subtitle]')
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, y: 10 },
          {
            opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current!.querySelector('[data-phase="hook"]'),
              start: 'top 70%',
            },
          }
        )
      }

      // Phase 2: Lines reveal
      const narrativeLines = containerRef.current!.querySelectorAll('[data-narrative-line]')
      narrativeLines.forEach((line) => {
        gsap.fromTo(line,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
            },
          }
        )
      })

      // Phase 2: Process image parallax
      const processImg = containerRef.current!.querySelector('[data-process-img]')
      if (processImg) {
        gsap.fromTo(processImg,
          { yPercent: 20, opacity: 0 },
          {
            yPercent: -10, opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: processImg,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        )
      }

      // Phase 3: Screenshot scale + clip-path reveal
      const heroMedia = containerRef.current!.querySelector('[data-hero-media]')
      if (heroMedia) {
        gsap.fromTo(heroMedia,
          { scale: 0.6, clipPath: 'inset(15% 15% 15% 15% round 16px)' },
          {
            scale: 1, clipPath: 'inset(0% 0% 0% 0% round 8px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroMedia,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        )
      }

      // Phase 3: Tags stagger
      const tags = containerRef.current!.querySelectorAll('[data-tag]')
      gsap.fromTo(tags,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, stagger: 0.05, duration: 0.4,
          scrollTrigger: {
            trigger: containerRef.current!.querySelector('[data-phase="solution"]'),
            start: 'top 40%',
          },
        }
      )

      // Phase 4: CountUp metrics
      const metricEls = containerRef.current!.querySelectorAll('[data-metric-value]')
      metricEls.forEach((el) => {
        const target = el.getAttribute('data-metric-value') || ''
        const numMatch = target.match(/^(\d+)/)
        if (numMatch) {
          const endVal = parseInt(numMatch[1], 10)
          const suffix = target.slice(numMatch[1].length)
          const obj = { val: 0 }
          gsap.to(obj, {
            val: endVal,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: () => {
              (el as HTMLElement).textContent = Math.round(obj.val) + suffix
            },
          })
        }
      })

      // Phase 4: CTA fade in
      const cta = containerRef.current!.querySelector('[data-cta]')
      if (cta) {
        gsap.fromTo(cta,
          { opacity: 0, y: 15 },
          {
            opacity: 1, y: 0, duration: 0.5,
            scrollTrigger: { trigger: cta, start: 'top 85%' },
          }
        )
      }

    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  const titleParts = project.title.split(/[\n—]/)[0] === project.title
    ? project.title.split(' ')
    : project.title.split(/[\n—]/)

  return (
    <article ref={containerRef} style={{ position: 'relative' }}>

      {/* PHASE 1: HOOK */}
      <div
        data-phase="hook"
        style={{
          minHeight: isMobile ? '70vh' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(40px, 8vh, 100px) clamp(24px, 6vw, 80px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Giant number */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '10%' : '50%',
          right: isMobile ? '-5%' : '5%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? '30vw' : '20vw',
          fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `2px ${project.color}22`,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {project.num}
        </div>

        {/* Title — letter by letter */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 'clamp(3rem, 12vw, 5rem)' : 'clamp(5rem, 10vw, 10rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          color: '#fff',
          margin: 0,
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}>
          {titleParts.map((part, lineIdx) => (
            <span key={lineIdx} style={{ display: 'block', overflow: 'hidden' }}>
              {part.trim().split('').map((char, charIdx) => (
                <span
                  key={`${lineIdx}-${charIdx}`}
                  data-letter
                  style={{ display: 'inline-block', opacity: 0 }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h2>

        {/* Subtitle */}
        <p
          data-subtitle
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: 'clamp(12px, 1.2vw, 16px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: project.color,
            margin: '24px 0 0 0',
            opacity: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {project.subtitle}
        </p>

        {/* Accent line */}
        <div
          data-accent-line
          style={{
            height: '2px',
            width: 0,
            background: `linear-gradient(90deg, ${project.color}, transparent)`,
            marginTop: '20px',
            boxShadow: `0 0 15px ${project.color}66`,
          }}
        />
      </div>

      {/* PHASE 2: HISTORIA */}
      <div
        data-phase="story"
        style={{
          minHeight: isMobile ? 'auto' : '80vh',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 'clamp(32px, 5vw, 80px)',
          padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div style={{ flex: 1, maxWidth: '600px' }}>
          {project.narrative.map((line, i) => (
            <p
              key={i}
              data-narrative-line
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? 'clamp(1.3rem, 5vw, 1.8rem)' : 'clamp(1.5rem, 2.5vw, 2.2rem)',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.85)',
                margin: i === 0 ? '0' : '16px 0 0 0',
                fontWeight: 400,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: '500px', width: '100%' }}>
          <div
            data-process-img
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${project.color}33`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${project.color}11`,
            }}
          >
            <img
              src={project.processImage}
              alt={`${project.title} — behind the scenes`}
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* PHASE 3: SOLUCION */}
      <div
        data-phase="solution"
        style={{
          minHeight: isMobile ? 'auto' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div
          data-hero-media
          style={{
            width: '100%',
            maxWidth: '1100px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 60px ${project.color}15`,
          }}
        >
          {project.heroVideo ? (
            <video autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }}>
              <source src={project.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={project.heroImage}
              alt={`${project.title} — screenshot`}
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          )}
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '32px',
          justifyContent: 'center',
        }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              data-tag
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: project.color,
                padding: '6px 16px',
                border: `1px solid ${project.color}44`,
                borderRadius: '100px',
                background: `${project.color}11`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* PHASE 4: IMPACTO */}
      <div
        data-phase="impact"
        style={{
          minHeight: isMobile ? 'auto' : '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(60px, 10vh, 100px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div style={{
          display: 'flex',
          gap: isMobile ? '32px' : 'clamp(48px, 6vw, 96px)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '48px',
        }}>
          {project.metrics.map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div
                data-metric-value={m.value}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 'clamp(2.5rem, 10vw, 4rem)' : 'clamp(3.5rem, 5vw, 5rem)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '8px',
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div data-cta style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '14px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '14px 32px',
                border: `2px solid ${project.color}`,
                borderRadius: 0,
                background: 'transparent',
                transition: 'background 0.3s, color 0.3s',
                boxShadow: `4px 4px 0px ${project.color}44`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = project.color
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#fff'
              }}
            >
              View {link.label} →
            </a>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div style={{
        width: '60px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${project.color}44, transparent)`,
        margin: '0 auto',
      }} />
    </article>
  )
}
