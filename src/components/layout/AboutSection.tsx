'use client'

import { useRef, useEffect, useState, useCallback, type CSSProperties } from 'react'
import { animate, stagger, utils } from 'animejs'
// GitHubCalendar moved to SkillsSection

const NEOFETCH_LINES = [
  { label: 'OS', value: 'Engineer v4.0 (4th semester)', color: '#FF2D9B' },
  { label: 'Host', value: 'Madrid, Spain', color: '#FF2D9B' },
  { label: 'Origin', value: 'Mexico → Cambridge → Madrid', color: '#FF2D9B' },
  { label: 'Shell', value: 'React / TypeScript / C++', color: '#00E5FF' },
  { label: 'Terminal', value: 'VS Code + Cursor', color: '#00E5FF' },
  { label: 'Packages', value: 'Three.js, GSAP, Tailwind, Laravel', color: '#BEFF00' },
  { label: 'Also', value: 'SQL, MongoDB, Node.js, Arduino', color: '#BEFF00' },
  { label: 'Tools', value: 'Figma, Canva, Blender, Claude', color: '#7B2FFF' },
  { label: 'Uptime', value: 'Since 2024 @ UDIT Madrid', color: '#7B2FFF' },
  { label: 'Memory', value: '10+ technologies loaded', color: '#7B2FFF' },
]

const BIO_LINES = [
  'From running a family business in Mexico to winning',
  'robotics competitions and building interactive web',
  'experiences in Spain.',
  '',
  'I specialize in creative development: the space where',
  'engineering meets design. I build things that move,',
  'respond, and feel alive.',
]

const PALETTE_COLORS = ['#2C2C2C', '#FF2D9B', '#BEFF00', '#00E5FF', '#7B2FFF', '#FFD93D', '#e8e6e3', '#fff']

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const hasAnimated = useRef(false)

  // Detect when section enters viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Anime.js animation — tokens fly in
  const runAnimation = useCallback(() => {
    if (hasAnimated.current || !contentRef.current) return
    hasAnimated.current = true

    const spans = contentRef.current.querySelectorAll('[data-animate]')
    if (!spans.length) return

    // Set initial state
    utils.set(spans, {
      opacity: 0,
      translateY: () => utils.random(-40, 40),
      translateX: () => utils.random(-30, 30),
      rotate: () => utils.random(-15, 15),
      scale: 0.8,
    })

    // Animate in
    animate(spans, {
      opacity: [0, 1],
      translateY: 0,
      translateX: 0,
      rotate: 0,
      scale: 1,
      duration: 800,
      delay: stagger(20, { from: 'first' }),
      ease: 'outExpo',
    })
  }, [])

  useEffect(() => {
    if (visible) {
      // Small delay to ensure DOM is painted
      const timer = setTimeout(runAnimation, 200)
      return () => clearTimeout(timer)
    }
  }, [visible, runAnimation])

  const codeFont: CSSProperties = {
    fontFamily: 'var(--font-code)',
    fontSize: 'clamp(11px, 1.2vw, 14px)',
    lineHeight: 1.8,
    letterSpacing: '0.02em',
  }

  const prompt = (
    <>
      <span style={{ color: '#BEFF00' }}>andrea</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>@</span>
      <span style={{ color: '#00E5FF' }}>portfolio</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}> ~ % </span>
    </>
  )

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: 'clamp(48px, 8vh, 96px) clamp(16px, 4vw, 80px)',
        maxWidth: 'var(--max-width-content)',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Blue signal line — connects projects to about */}
      <div style={{
        width: '1px',
        height: '48px',
        background: 'linear-gradient(180deg, transparent, #00E5FF, transparent)',
        margin: '0 auto 32px auto',
        opacity: 0.3,
      }} />

      {/* Terminal window */}
      <div style={{
        background: '#000',
        border: '1px solid rgba(0,229,255,0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,229,255,0.03)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#000',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
          <span style={{
            marginLeft: '12px',
            fontFamily: 'var(--font-code)',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            andrea@portfolio — kitty
          </span>
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ padding: 'clamp(16px, 3vw, 32px)', ...codeFont }}>
          {/* neofetch command */}
          <div data-animate style={{ marginBottom: '20px' }}>
            {prompt}
            <span style={{ color: '#e8e6e3' }}>neofetch</span>
          </div>

          {/* Photo + Info layout */}
          <div style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 40px)',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            {/* Photo */}
            <div data-animate style={{ flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/andrea.png"
                alt="Andrea Avila"
                style={{
                  width: 'clamp(100px, 15vw, 160px)',
                  height: 'auto',
                  borderRadius: '6px',
                  border: '2px solid rgba(255,255,255,0.08)',
                  display: 'block',
                }}
              />
            </div>

            {/* Neofetch info */}
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div data-animate style={{ color: '#FF2D9B', fontWeight: 700, fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
                andrea avila
              </div>
              <div data-animate style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                ──────────────────
              </div>

              {NEOFETCH_LINES.map((line) => (
                <div data-animate key={line.label} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: line.color, fontWeight: 600, minWidth: '75px' }}>
                    {line.label}:
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {line.value}
                  </span>
                </div>
              ))}

              {/* Palette */}
              <div data-animate style={{ display: 'flex', gap: '5px', marginTop: '12px' }}>
                {PALETTE_COLORS.map((c) => (
                  <div key={c} style={{ width: '13px', height: '13px', borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>
          </div>

          {/* cat about.txt */}
          <div data-animate style={{ marginTop: '8px' }}>
            {prompt}
            <span style={{ color: '#e8e6e3' }}>cat about.txt</span>
          </div>

          <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.55)' }}>
            {BIO_LINES.map((line, i) => (
              <div data-animate key={i} style={{ minHeight: line ? 'auto' : '10px' }}>
                {line}
              </div>
            ))}
          </div>

          {/* echo $STATUS */}
          <div data-animate style={{ marginTop: '16px' }}>
            {prompt}
            <span style={{ color: '#e8e6e3' }}>echo $STATUS</span>
          </div>

          <div data-animate style={{ marginTop: '4px' }}>
            <span style={{ color: '#BEFF00', fontWeight: 600 }}>
              → Open to work — internships in Madrid
            </span>
          </div>

          {/* Cursor */}
          <div style={{ marginTop: '12px' }}>
            {prompt}
            <span style={{
              color: '#e8e6e3',
              animation: 'cursor-blink 1.06s step-end infinite',
            }}>█</span>
          </div>
        </div>
      </div>

      {/* GitHub Calendar moved to SkillsSection */}
    </section>
  )
}
