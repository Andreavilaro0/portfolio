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

export function CinematicProject({ project, isFirst }: { project: Project; isFirst?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const hookEl = containerRef.current!.querySelector('[data-phase="hook"]')

      // Phase 1: Letter stagger — single trigger, batch animation
      const letters = containerRef.current!.querySelectorAll('[data-letter]')
      if (letters.length) {
        gsap.fromTo(letters,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0, opacity: 1,
            stagger: 0.03, duration: 0.5, ease: 'power3.out',
            scrollTrigger: { trigger: hookEl, start: 'top 75%' },
          }
        )
      }

      // Subtitle + accent line — combined on same trigger
      const subtitle = containerRef.current!.querySelector('[data-subtitle]')
      const accentLine = containerRef.current!.querySelector('[data-accent-line]')
      if (subtitle && accentLine) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: hookEl, start: 'top 65%' },
        })
        tl.fromTo(subtitle, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
          .fromTo(accentLine, { width: 0 }, { width: 200, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      }

      // Phase 2: Narrative lines — simple fade, no parallax on mobile
      const narrativeLines = containerRef.current!.querySelectorAll('[data-narrative-line]')
      if (narrativeLines.length) {
        gsap.fromTo(narrativeLines,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current!.querySelector('[data-phase="story"]'),
              start: 'top 80%',
            },
          }
        )
      }

      // Phase 2: Process image — parallax only on desktop
      if (!isMobile) {
        const processImg = containerRef.current!.querySelector('[data-process-img]')
        if (processImg) {
          gsap.fromTo(processImg,
            { y: 60, opacity: 0.3 },
            {
              y: -30, opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: processImg,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2,
              },
            }
          )
        }
      }

      // Phase 3: Screenshot scale reveal — scrub for smooth feel
      const heroMedia = containerRef.current!.querySelector('[data-hero-media]')
      if (heroMedia) {
        gsap.fromTo(heroMedia,
          { scale: 0.7, clipPath: 'inset(12% round 16px)', opacity: 0.5 },
          {
            scale: 1, clipPath: 'inset(0% round 8px)', opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: heroMedia,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 2,
            },
          }
        )
      }

      // Phase 3: Tags — simple batch fade
      const tags = containerRef.current!.querySelectorAll('[data-tag]')
      if (tags.length) {
        gsap.fromTo(tags,
          { opacity: 0, y: 8 },
          {
            opacity: 1, y: 0, stagger: 0.04, duration: 0.3,
            scrollTrigger: {
              trigger: containerRef.current!.querySelector('[data-phase="solution"]'),
              start: 'top 35%',
            },
          }
        )
      }

      // Phase 4: Metrics count-up
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
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: () => {
              (el as HTMLElement).textContent = Math.round(obj.val) + suffix
            },
          })
        }
      })

      // Phase 4: CTA fade
      const cta = containerRef.current!.querySelector('[data-cta]')
      if (cta) {
        gsap.fromTo(cta,
          { opacity: 0, y: 12 },
          {
            opacity: 1, y: 0, duration: 0.4,
            scrollTrigger: { trigger: cta, start: 'top 85%' },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isMobile])

  // Split title into display lines
  const titleParts = project.title.includes('—')
    ? project.title.split('—').map(s => s.trim())
    : project.title.split(' ')

  return (
    <article
      ref={containerRef}
      style={{
        position: 'relative',
        // Smooth gradient transition from hero for first project
        ...(isFirst ? { paddingTop: '10vh' } : {}),
      }}
    >
      {/* PHASE 1: HOOK */}
      <div
        data-phase="hook"
        style={{
          minHeight: isMobile ? '60vh' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(40px, 8vh, 100px) clamp(24px, 6vw, 80px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Giant number */}
        <div
          aria-hidden="true"
          style={{
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
          }}
        >
          {project.num}
        </div>

        {/* Title */}
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
                  style={{
                    display: 'inline-block',
                    opacity: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          ))}
        </h2>

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
          minHeight: isMobile ? 'auto' : '70vh',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 'clamp(32px, 5vw, 80px)',
          padding: 'clamp(40px, 8vh, 100px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div style={{ flex: 1, maxWidth: '600px' }}>
          {project.narrative.map((line, i) => (
            <p
              key={i}
              data-narrative-line
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? 'clamp(1.2rem, 5vw, 1.6rem)' : 'clamp(1.4rem, 2.2vw, 2rem)',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.85)',
                margin: i === 0 ? '0' : '12px 0 0 0',
                fontWeight: 400,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: '480px', width: '100%' }}>
          <div
            data-process-img
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${project.color}33`,
              boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 30px ${project.color}11`,
              willChange: isMobile ? 'auto' : 'transform, opacity',
            }}
          >
            <img
              src={project.processImage}
              alt={`${project.title} — proceso`}
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
          minHeight: isMobile ? 'auto' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(40px, 8vh, 100px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div
          data-hero-media
          style={{
            width: '100%',
            maxWidth: '1000px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 40px ${project.color}15`,
            willChange: 'transform, clip-path, opacity',
          }}
        >
          {project.heroVideo ? (
            <video autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }}>
              <source src={project.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={project.heroImage}
              alt={`${project.title} — resultado`}
              loading="lazy"
              style={{ width: '100%', display: 'block' }}
            />
          )}
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '28px',
          justifyContent: 'center',
        }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              data-tag
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: project.color,
                padding: '5px 14px',
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
          minHeight: isMobile ? 'auto' : '40vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(40px, 8vh, 80px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div style={{
          display: 'flex',
          gap: isMobile ? '28px' : 'clamp(40px, 5vw, 80px)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          {project.metrics.map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div
                data-metric-value={m.value}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 'clamp(2rem, 10vw, 3.5rem)' : 'clamp(3rem, 4.5vw, 4.5rem)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {m.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginTop: '8px',
                maxWidth: '140px',
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div data-cta style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '13px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                padding: '12px 28px',
                border: `2px solid ${project.color}`,
                borderRadius: 0,
                background: 'transparent',
                transition: 'background 0.3s, color 0.3s',
                boxShadow: `3px 3px 0px ${project.color}44`,
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
        width: '40px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${project.color}33, transparent)`,
        margin: '0 auto',
        padding: '40px 0',
      }} />
    </article>
  )
}
