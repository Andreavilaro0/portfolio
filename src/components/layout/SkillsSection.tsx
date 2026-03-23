'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GitHubCalendar } from './GitHubCalendar'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { name: 'React / Next.js', level: 90, color: '#00E5FF' },
  { name: 'TypeScript', level: 85, color: '#00E5FF' },
  { name: 'Python', level: 80, color: '#BEFF00' },
  { name: 'Three.js / R3F', level: 75, color: '#7B2FFF' },
  { name: 'C++ / Arduino', level: 70, color: '#FF2D9B' },
  { name: 'GSAP', level: 75, color: '#BEFF00' },
  { name: 'SQL / MongoDB', level: 70, color: '#00E5FF' },
  { name: 'Laravel / PHP', level: 65, color: '#FF2D9B' },
]

const TOOLS = [
  { name: 'VS Code', icon: '⚡' },
  { name: 'Cursor', icon: '🔮' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Blender', icon: '🎬' },
  { name: 'Claude Code', icon: '🤖' },
  { name: 'Git', icon: '🔀' },
  { name: 'Docker', icon: '📦' },
  { name: 'Linux', icon: '🐧' },
  { name: 'Arduino IDE', icon: '🔧' },
  { name: 'Canva', icon: '✨' },
]

export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Title
    const title = sectionRef.current.querySelector('[data-title]')
    if (title) {
      gsap.fromTo(title, { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: title, start: 'top 85%' },
      })
    }

    // Skill bars — simple opacity, no scale animation
    const fills = sectionRef.current.querySelectorAll('[data-fill]')
    gsap.fromTo(fills, { opacity: 0 }, {
      opacity: 1, duration: 0.6, stagger: 0.05,
      scrollTrigger: { trigger: fills[0], start: 'top 90%' },
    })

    // Tool cards — just fade in
    const tools = sectionRef.current.querySelectorAll('[data-tool]')
    gsap.fromTo(tools, { opacity: 0 }, {
      opacity: 1, duration: 0.4, stagger: 0.04,
      scrollTrigger: { trigger: tools[0], start: 'top 85%' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        background: '#0a0a10',
        padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Title */}
        <h2
          data-title
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            margin: '0 0 48px 0',
            textTransform: 'uppercase',
          }}
        >
          Skills &<br />
          <span style={{
            background: 'linear-gradient(90deg, #FF2D9B, #7B2FFF, #00E5FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Tools
          </span>
        </h2>

        {/* Two column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '48px',
          marginBottom: '64px',
        }}>

          {/* Skills bars */}
          <div ref={barsRef}>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '24px',
            }}>
              Languages & Frameworks
            </div>

            {SKILLS.map((skill) => (
              <div key={skill.name} style={{ marginBottom: '18px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '14px',
                    color: '#fff',
                    fontWeight: 500,
                  }}>
                    {skill.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '13px',
                    color: skill.color,
                  }}>
                    {skill.level}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div
                    data-fill
                    style={{
                      width: `${skill.level}%`,
                      height: '100%',
                      borderRadius: '3px',
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                      transformOrigin: 'left',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tools grid */}
          <div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '24px',
            }}>
              Tools & Environment
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}>
              {TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  data-tool
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '16px 14px',
                    textAlign: 'center',
                    cursor: 'default',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{tool.icon}</div>
                  <div style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.03em',
                  }}>
                    {tool.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Calendar — full width, big */}
        <div
          data-calendar
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <GitHubCalendar />
        </div>

      </div>
    </section>
  )
}
