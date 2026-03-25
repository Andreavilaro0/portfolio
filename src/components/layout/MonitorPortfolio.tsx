'use client'

/**
 * MonitorPortfolio — compact portfolio designed for the fixed DOM overlay (~520×380px).
 * Sections: Work · About · Skills · Contact
 * Sticky nav scrolls within the monitor-scroll container using section IDs.
 */

import { useRef, useState, useEffect } from 'react'
import { useAnalytics } from '../../hooks/useAnalytics'
import { projects } from '../../data/projects'
import { ProjectDetail } from './ProjectDetail'
import { HandDrawnLine } from './HandDrawnLine'

const skills = [
  { name: 'React / Next.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'Three.js / R3F', level: 75 },
  { name: 'C++ / Arduino', level: 70 },
  { name: 'GSAP', level: 75 },
]

const channels = [
  { label: 'github', href: 'https://github.com/Andreavilaro0' },
  { label: 'linkedin', href: 'https://www.linkedin.com/feed/' },
  { label: 'email', href: 'mailto:andrea15one@icloud.com' },
]

const navLinks = [
  { label: 'Work', target: 'monitor-work' },
  { label: 'About', target: 'monitor-about' },
  { label: 'Skills', target: 'monitor-skills' },
  { label: 'Contact', target: 'monitor-contact' },
]

interface MonitorPortfolioProps {
  activeProject?: string | null
  onExitProject?: () => void
  onNavigateProject?: (projectId: string) => void
}

export function MonitorPortfolio({ activeProject, onExitProject, onNavigateProject }: MonitorPortfolioProps) {
  // All hooks must be called unconditionally before any early return (Rules of Hooks)
  const { track } = useAnalytics()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [activeSection, setActiveSection] = useState('monitor-work')

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const sections = container.querySelectorAll('[id^="monitor-"]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            if (entry.target.id === 'monitor-work') {
              track('work_viewed')
            }
          }
        }
      },
      { root: container, threshold: 0.3 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Conditional render after all hooks
  if (activeProject && onExitProject && onNavigateProject) {
    return (
      <ProjectDetail
        projectId={activeProject}
        onBack={onExitProject}
        onNavigate={onNavigateProject}
      />
    )
  }

  function scrollToSection(id: string) {
    const container = scrollRef.current
    if (!container) return
    const target = container.querySelector(`#${id}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ position: 'relative', width: '100%', fontFamily: 'var(--font-body)', color: 'var(--color-text)', background: '#FDFBF7', display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Sticky nav */}
      <nav aria-label="Portfolio sections" style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#FDFBF7',
        borderBottom: '1px solid rgba(26,26,26,0.12)',
        padding: '8px 24px',
        display: 'flex',
        gap: '18px',
        alignItems: 'center',
      }}>
        {navLinks.map((link) => (
          <button
            key={link.target}
            onClick={() => scrollToSection(link.target)}
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeSection === link.target ? 'var(--color-pink)' : 'var(--color-muted)',
              fontWeight: activeSection === link.target ? 700 : 400,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              if (activeSection !== link.target) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-pink)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== link.target) {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
              }
            }}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Scrollable content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Header */}
        <header style={{ marginBottom: '16px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            lineHeight: 1,
            margin: '0 0 4px 0',
            color: 'var(--color-text)',
          }}>
            ANDREA AVILA
          </h1>
          <p style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'var(--color-muted)',
            margin: 0,
            textTransform: 'uppercase',
          }}>
            Full Stack Developer — Madrid, Spain
          </p>
        </header>

        {/* About — minimal, the desk tells the story */}
        <section id="monitor-about" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { n: '4', s: 'o', label: 'Semestre' },
              { n: '10', s: '+', label: 'Tecnologias' },
              { n: '2028', s: '', label: 'Graduacion' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  color: 'var(--color-text)',
                  lineHeight: 1,
                }}>
                  {s.n}<span style={{ fontSize: '12px', color: 'var(--color-pink)' }}>{s.s}</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <HandDrawnLine variant={0} style={{ marginBottom: '12px' }} />

        {/* Projects */}
        <section id="monitor-work">
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'var(--color-muted)',
                }}>
                  {p.num}
                </span>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  padding: '2px 8px',
                  background: p.color,
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {p.subtitle}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                lineHeight: 1.1,
                margin: '0 0 4px 0',
                color: 'var(--color-text)',
              }}>
                {p.title}
              </h2>

              <p style={{
                fontSize: '11px',
                lineHeight: 1.5,
                color: 'var(--color-muted)',
                margin: '0 0 5px 0',
              }}>
                {p.desc}
              </p>

              {p.context && (
                <p style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  lineHeight: 1.4,
                  color: 'var(--color-text)',
                  margin: '0 0 5px 0',
                  opacity: 0.7,
                }}>
                  {p.context}
                </p>
              )}

              {p.highlights.length > 0 && (
                <div style={{ marginBottom: '6px' }}>
                  {p.highlights.map((h) => (
                    <div key={h} style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '10px',
                      color: 'var(--color-muted)',
                      lineHeight: 1.4,
                    }}>
                      → {h}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                {p.tags.map((tag) => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '10px',
                    padding: '2px 6px',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {p.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('project_opened', { project: p.id, link: link.label })}
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '10px',
                      color: p.id === 'clara' ? '#C4007A' : p.color,
                      textDecoration: 'none',
                    }}
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>

              <HandDrawnLine variant={(projects.indexOf(p) % 3) as 0 | 1 | 2} opacity={0.2} style={{ marginTop: '12px' }} />
            </div>
          ))}
        </section>

        {/* Skills */}
        <section id="monitor-skills" style={{ marginBottom: '12px' }}>
          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Stack
          </div>
          {skills.map((s) => (
            <div key={s.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                color: 'var(--color-text)',
                width: '110px',
                flexShrink: 0,
              }}>
                {s.name}
              </span>
              <div style={{
                flex: 1,
                height: '3px',
                background: 'rgba(26,26,26,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${s.level}%`,
                  height: '100%',
                  background: 'var(--color-pink)',
                }} />
              </div>
            </div>
          ))}
        </section>

        {/* CV Download */}
        <div style={{ marginBottom: '12px' }}>
          <a
            href="/cv-andrea-avila.pdf"
            download
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              border: '2px solid var(--color-text)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            Download CV ↓
          </a>
        </div>

        <HandDrawnLine variant={2} style={{ marginBottom: '12px' }} />

        {/* Contact */}
        <section id="monitor-contact" style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Let&apos;s connect
          </div>

          <p style={{
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            color: 'var(--color-text)',
            margin: '0 0 8px 0',
            fontWeight: 600,
          }}>
            andrea15one@icloud.com
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.label === 'email' ? undefined : '_blank'}
                rel={ch.label === 'email' ? undefined : 'noopener noreferrer'}
                onClick={() => track('contact_clicked', { channel: ch.label })}
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  color: 'var(--color-pink)',
                  textDecoration: 'none',
                }}
              >
                [{ch.label}]
              </a>
            ))}
          </div>

          <div style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <span>Madrid, Spain</span>
            <span>ES / EN</span>
            <span style={{
              color: 'var(--color-text)',
              background: 'var(--color-lime)',
              padding: '2px 8px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '10px',
            }}>
              Open to work
            </span>
          </div>
        </section>

      </div>

      {!isScrolledToBottom && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(transparent, #FDFBF7)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}
    </div>
  )
}
