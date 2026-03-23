'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LaptopMockup } from '../ui/LaptopMockup'
import { PhoneMockup } from '../ui/PhoneMockup'
import { RobotViewer } from './RobotViewer'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    num: '01',
    title: 'CLARA\nCIVICAID',
    subtitle: 'AI Voice Assistant',
    desc: 'Multilingual AI assistant connecting vulnerable populations with government services. Voice + text in 8 languages.',
    role: 'Project Lead',
    year: '2026',
    highlights: [
      { title: 'Hackathon Winner', desc: 'OdiseIA4Good 2026 — 1st place out of 300+ participants. Led a team of 4 developers.' },
      { title: 'Full-Stack Architecture', desc: 'React frontend, Python backend, Gemini API for NLP, ElevenLabs for voice synthesis.' },
      { title: 'Quality & Testing', desc: '469+ automated tests. Scalable architecture ready for production deployment.' },
    ],
    tags: ['React', 'TypeScript', 'Python', 'Gemini', 'ElevenLabs'],
    color: '#FF2D9B',
    screenshot: '/projects/clara-desktop.png',
    video: '/projects/clara-mobile.mp4',
    links: { demo: 'https://andreavilaro0.github.io/civicaid-voice/', code: 'https://github.com/Andreavilaro0/civicaid-voice' },
  },
  {
    num: '02',
    title: 'CAPTURING\nMOMENTS',
    subtitle: 'Photography Portfolio',
    desc: 'Editorial photography template with scroll-driven animations, dynamic gallery, and responsive design.',
    role: 'Designer & Developer',
    year: '2025',
    highlights: [
      { title: 'Scroll Animations', desc: 'GSAP-powered scroll-based transitions creating a cinematic browsing experience.' },
      { title: 'Editorial Layout', desc: 'Magazine-inspired grid with dynamic image loading and lazy rendering.' },
      { title: 'Responsive Design', desc: 'Fully adaptive from mobile to ultrawide with fluid typography and spacing.' },
    ],
    tags: ['HTML/CSS', 'JavaScript', 'GSAP'],
    color: '#00E5FF',
    screenshot: '/projects/photo-desktop.png',
    video: '/projects/photo-mobile.mp4',
    links: { demo: 'https://andreavilaro0.github.io/plantilla/' },
  },
  {
    num: '03',
    title: 'ASTI\nROBOTICS',
    subtitle: 'Zumo 32U4 — National Finalist',
    desc: 'Autonomous robot for national competition. Complete software: navigation, sensors, and competition strategy.',
    role: 'Software Developer',
    year: '2025',
    highlights: [
      { title: 'Autonomous Navigation', desc: 'Line-following and obstacle avoidance algorithms running on Arduino hardware.' },
      { title: 'Competition Strategy', desc: 'Real-time decision making with sensor fusion for the sumo ring.' },
      { title: 'National Finalist', desc: 'Competed against 50+ university teams across Spain in the ASTI Robotics Challenge.' },
    ],
    tags: ['C++', 'Arduino', 'Zumo 32U4'],
    color: '#BEFF00',
    hasRobot: true,
    links: { info: 'https://www.udit.es/proyectos-de-exito/tres-nuevos-equipos-de-estudiantes-de-udit-se-clasifican-para-la-final-del-asti-robotics-challenge/' },
  },
  {
    num: '04',
    title: 'TASK\nDASHBOARD',
    subtitle: 'Productivity App',
    desc: 'Interactive task dashboard with widgets: map, calendar, statuses, priorities, and filters.',
    role: 'Frontend Developer',
    year: '2025',
    highlights: [
      { title: 'Widget System', desc: 'Modular dashboard with draggable, resizable widgets for different data views.' },
      { title: 'Interactive Map', desc: 'Integrated map component for location-based task management.' },
      { title: 'Smart Filters', desc: 'Multi-criteria filtering by state, priority, date, and custom tags.' },
    ],
    tags: ['JavaScript', 'HTML', 'CSS'],
    color: '#00E5FF',
    screenshot: '/projects/todo-desktop.png',
    video: '/projects/todo-mobile.mp4',
    links: { demo: 'https://andreavilaro0.github.io/todo-list-dashboard/', code: 'https://github.com/Andreavilaro0/todo-list-dashboard' },
  },
  {
    num: '05',
    title: 'KERNEL\nSIM',
    subtitle: 'OS Simulation',
    desc: 'Operating system simulator with process and memory management. FIFO, SJF, and Round Robin competing in real time.',
    role: 'Systems Developer',
    year: '2025',
    highlights: [
      { title: 'Process Scheduling', desc: 'Three scheduling algorithms competing side by side with real-time visualization.' },
      { title: 'Memory Management', desc: 'Virtual memory simulation with page replacement algorithms and fragmentation analysis.' },
      { title: 'Deadlock Detection', desc: 'Resource allocation graph analysis with automatic deadlock detection and recovery.' },
    ],
    tags: ['C', 'Linux', 'Makefiles', 'GCC', 'Systems'],
    color: '#7B2FFF',
    links: { code: 'https://github.com/gabrielcclv/SistemasOperativos' },
  },
]

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

function ProjectSection({ project, index }: { project: typeof projects[0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const isEven = index % 2 === 0

  useGSAP(() => {
    if (!sectionRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Title fade in
    const title = sectionRef.current.querySelector('[data-title]')
    if (title) {
      gsap.fromTo(title, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }

    // Info fade in
    const infoItems = sectionRef.current.querySelectorAll('[data-info]')
    gsap.fromTo(infoItems, { opacity: 0 }, {
      opacity: 1, duration: 0.5, stagger: 0.08,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
    })

    // Cards fade in
    const cards = sectionRef.current.querySelectorAll('[data-card]')
    gsap.fromTo(cards, { opacity: 0, y: 15 }, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.08,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
  }, { scope: sectionRef })

  const bgColor = isEven ? '#08080c' : '#0e0e14'

  return (
    <div
      ref={sectionRef}
      style={{
        background: bgColor,
        padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px)',
      }}
    >
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'flex-start',
      }}>

        {/* LEFT — Info */}
        <div style={{ flex: '0 0 auto', maxWidth: isMobile ? '100%' : '440px' }}>
          {/* Giant title */}
          <h2
            data-title
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              whiteSpace: 'pre-line',
            }}
          >
            {project.title}
          </h2>

          {/* Description */}
          <p
            data-info
            style={{
              fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.75)',
              margin: '0 0 24px 0',
              maxWidth: '400px',
            }}
          >
            {project.desc}
          </p>

          {/* Metadata line */}
          <div
            data-info
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <span>Role: <span style={{ color: 'rgba(255,255,255,0.65)' }}>{project.role}</span></span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Year: <span style={{ color: 'rgba(255,255,255,0.65)' }}>{project.year}</span></span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Tools: <span style={{ color: project.color }}>{project.tags.join(', ')}</span></span>
          </div>

          {/* Links */}
          <div data-info style={{ display: 'flex', gap: '24px' }}>
            {Object.entries(project.links).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '13px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textDecoration: 'none',
                  borderBottom: `1px solid ${project.color}`,
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = project.color }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#fff' }}
              >
                View {label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — Cards or Mockup */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Mockup row (if has screenshot/video) */}
          {(project.screenshot || project.video) && !('hasRobot' in project) && (
            <div data-info style={{ marginBottom: '28px' }}>
              {isMobile && project.video ? (
                <div style={{ maxWidth: '220px', margin: '0 auto' }}>
                  <PhoneMockup>
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
                      <source src={project.video} type="video/mp4" />
                    </video>
                  </PhoneMockup>
                </div>
              ) : project.screenshot ? (
                <LaptopMockup>
                  <img src={project.screenshot} alt={`${project.title} screenshot`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                </LaptopMockup>
              ) : null}
            </div>
          )}

          {/* Robot viewer */}
          {'hasRobot' in project && (
            <div data-info style={{ marginBottom: '28px', borderRadius: '12px', overflow: 'hidden' }}>
              <RobotViewer />
            </div>
          )}

          {/* Phase cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {project.highlights.map((h, i) => (
              <div
                key={h.title}
                data-card
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'background 0.2s, border-color 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = `${project.color}33`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: project.color,
                  marginBottom: '10px',
                }}>
                  Phase {i + 1}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 8px 0',
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}>
                  {h.title}
                </h4>
                <p style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                }}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const header = sectionRef.current.querySelector('[data-section-header]')
    if (header) {
      gsap.fromTo(header, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: header, start: 'top 90%' },
      })
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="projects">
      {/* Section header */}
      <div
        data-section-header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '48px clamp(24px, 6vw, 80px) 0',
          maxWidth: '1300px',
          margin: '0 auto',
          opacity: 0,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: '14px',
          letterSpacing: '0.15em',
          background: 'linear-gradient(90deg, #FF2D9B, #00E5FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textTransform: 'uppercase',
        }}>
          Selected Work
        </span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(0,229,255,0.15), rgba(255,255,255,0.06), rgba(0,229,255,0.15))' }} />
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.25)',
        }}>
          {projects.length} projects
        </span>
      </div>

      {/* Project sections */}
      {projects.map((project, i) => (
        <ProjectSection key={project.num} project={project} index={i} />
      ))}
    </section>
  )
}
