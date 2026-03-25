# Cinematic Scroll Projects — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current ProjectsSection with a full-screen cinematic scroll experience where each project reveals dramatically in 4 phases (Hook, Historia, Solucion, Impacto).

**Architecture:** New `CinematicProject` component renders each project as ~350vh of scroll-driven content. GSAP ScrollTrigger pins and drives all animations. Data extended in `projects.ts` with narrative text, process images, and metrics. Mobile gets simplified layout with no pinning.

**Tech Stack:** React, GSAP (ScrollTrigger), TypeScript, inline styles (matching existing codebase pattern)

---

### Task 1: Extend Project Data Model

**Files:**
- Modify: `src/data/projects.ts`

**Step 1: Add new fields to interface and data**

Add `narrative`, `processImage`, `metrics`, `heroImage` to the Project interface and populate for all 5 projects.

```typescript
export interface ProjectMetric {
  value: string
  label: string
}

export interface Project {
  id: string
  num: string
  color: string
  title: string
  subtitle: string
  desc: string
  context: string
  highlights: string[]
  tags: string[]
  links: ProjectLink[]
  // NEW — cinematic scroll fields
  narrative: string[]        // 2-3 punchy lines for "Historia" phase
  processImage: string       // behind-the-scenes photo
  heroImage: string          // main screenshot/video for "Solucion" phase
  heroVideo?: string         // optional video instead of image
  metrics: ProjectMetric[]   // 2-3 big stats for "Impacto" phase
}
```

Data for each project:

**Clara:**
```typescript
narrative: [
  '300+ participantes. 8 idiomas.',
  'Una voz para quien no tiene acceso.',
],
processImage: '/projects/process/clara-whatsapp.png',
heroImage: '/projects/clara-desktop.png',
heroVideo: '/projects/clara-mobile.mp4',
metrics: [
  { value: '1st', label: 'Place — OdiseIA4Good' },
  { value: '469+', label: 'Automated tests' },
  { value: '8', label: 'Languages supported' },
],
```

**Photo:**
```typescript
narrative: [
  'Street photography. Madrid a traves de mi lente.',
  'Scroll animations. Editorial layout.',
],
processImage: '/projects/photo-dark-hero.png',
heroImage: '/projects/photo-fullpage-1920.png',
metrics: [
  { value: '100%', label: 'Responsive design' },
  { value: 'GSAP', label: 'Scroll animations' },
],
```

**Robotics:**
```typescript
narrative: [
  '50 equipos. Un ring en Burgos.',
  'Un robot de 10cm con casco impreso en 3D.',
],
processImage: '/projects/process/zumo-battle.png',
heroImage: '/projects/os-simulator.png', // placeholder until arena photo
metrics: [
  { value: 'Finalist', label: 'National — ASTI Challenge' },
  { value: '50+', label: 'University teams' },
  { value: 'C++', label: 'Bare metal code' },
],
```

**Todo:**
```typescript
narrative: [
  'Sprint 6. Un dashboard que organiza el caos.',
  'Widgets, mapa, calendario, filtros.',
],
processImage: '/projects/todo-desktop.png',
heroImage: '/projects/todo-desktop.png',
metrics: [
  { value: '6', label: 'Interactive widgets' },
  { value: '1', label: 'Integrated map' },
],
```

**OS:**
```typescript
narrative: [
  'FIFO vs SJF vs Round Robin.',
  'Quien gana? Visualizacion en tiempo real.',
],
processImage: '/projects/os-simulator.png',
heroImage: '/projects/os-simulator.png',
metrics: [
  { value: '3', label: 'Scheduling algorithms' },
  { value: 'Real-time', label: 'Visualization' },
],
```

**Step 2: Commit**
```bash
git add src/data/projects.ts
git commit -m "feat: extend project data with narrative, metrics, and process images"
```

---

### Task 2: Create CinematicProject Component — Phase 1 (Hook)

**Files:**
- Create: `src/components/layout/CinematicProject.tsx`

**Step 1: Build the Hook phase**

The Hook phase shows:
- Project number in outline typography (20vw), positioned top-right
- Title revealed letter-by-letter via manual span splitting + GSAP stagger
- Subtitle fades in below
- Accent color line grows from 0 to 200px

```tsx
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

      // Phase 2: Lines reveal driven by scroll progress
      const narrativeLines = containerRef.current!.querySelectorAll('[data-narrative-line]')
      narrativeLines.forEach((line, i) => {
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

  // Split title into letters (handle \n as line break)
  const titleParts = project.title.split('\n')

  return (
    <article ref={containerRef} style={{ position: 'relative' }}>

      {/* ═══ PHASE 1: HOOK ═══ */}
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
        {/* Giant number — background */}
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
              {part.split('').map((char, charIdx) => (
                <span
                  key={`${lineIdx}-${charIdx}`}
                  data-letter
                  style={{
                    display: 'inline-block',
                    opacity: 0,
                  }}
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

      {/* ═══ PHASE 2: HISTORIA ═══ */}
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
        {/* Narrative text */}
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
                margin: i === 0 ? 0 : '16px 0 0 0',
                fontWeight: 400,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Process image with parallax */}
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
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>

      {/* ═══ PHASE 3: SOLUCION ═══ */}
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
        {/* Hero media — scale + clip-path reveal */}
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
            <video
              autoPlay loop muted playsInline
              style={{ width: '100%', display: 'block' }}
            >
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

        {/* Tags */}
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

      {/* ═══ PHASE 4: IMPACTO ═══ */}
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
        {/* Metrics row */}
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

        {/* CTA links */}
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

      {/* Separator between projects */}
      <div style={{
        width: '60px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${project.color}44, transparent)`,
        margin: '0 auto',
      }} />
    </article>
  )
}
```

**Step 2: Commit**
```bash
git add src/components/layout/CinematicProject.tsx
git commit -m "feat: add CinematicProject component with 4-phase scroll reveal"
```

---

### Task 3: Replace ProjectsSection with Cinematic Version

**Files:**
- Modify: `src/components/layout/ProjectsSection.tsx`

**Step 1: Rewrite ProjectsSection to use CinematicProject**

Replace the entire file. Keep the section header but swap ProjectSection for CinematicProject.

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import { CinematicProject } from './CinematicProject'

gsap.registerPlugin(ScrollTrigger)

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
      {projects.map((project) => (
        <CinematicProject key={project.id} project={project} />
      ))}
    </section>
  )
}
```

**Step 2: Remove "PROJECTS" section title from PortfolioContent**

The giant "PROJECTS" header in PortfolioContent is now redundant — each project has its own giant title. Remove the header block (lines 87-121 of PortfolioContent.tsx) and connect HeroScroll directly to ProjectsSection.

In `src/components/layout/PortfolioContent.tsx`, replace:
```tsx
        {/* Giant section title — MÅNE style */}
        <div style={{
          padding: 'clamp(80px, 15vh, 160px) clamp(24px, 6vw, 80px)',
          ...
        }}>
          ...
        </div>
        <ProjectsSection />
```

With:
```tsx
        <ProjectsSection />
```

**Step 3: Remove old imports from ProjectsSection**

The old file imported LaptopMockup, PhoneMockup, RobotViewer — these are no longer needed. The new file only imports from `@/data/projects` and `./CinematicProject`.

**Step 4: Verify build**
```bash
npx tsc --noEmit --pretty 2>&1 | grep -E "(CinematicProject|ProjectsSection)" || echo "No errors"
```

**Step 5: Commit**
```bash
git add src/components/layout/ProjectsSection.tsx src/components/layout/PortfolioContent.tsx
git commit -m "feat: replace projects grid with cinematic scroll experience"
```

---

### Task 4: Visual Polish and Test

**Files:**
- Possibly tweak: `src/components/layout/CinematicProject.tsx`

**Step 1: Run dev server and verify**
```bash
npm run dev
```

Check in browser:
- [ ] Each project shows 4 phases on scroll
- [ ] Title letters stagger in correctly
- [ ] Narrative text reveals line by line
- [ ] Process image has parallax effect
- [ ] Screenshot scales up with clip-path
- [ ] Metrics count up when visible
- [ ] CTA buttons work and hover correctly
- [ ] Mobile layout stacks properly (no horizontal scroll)
- [ ] `prefers-reduced-motion` disables all animations

**Step 2: Fix any visual issues found during testing**

Common things to adjust:
- Timing of staggers (may need to slow down or speed up)
- Scroll trigger start/end positions (tune for feel)
- Font sizes on different viewport sizes
- Process image aspect ratio / sizing
- Gap between projects

**Step 3: Commit fixes**
```bash
git add -u
git commit -m "fix: tune cinematic scroll timing and responsive layout"
```

---

### Task 5: Cleanup Old Code

**Files:**
- Check: `src/components/ui/LaptopMockup.tsx` — still used elsewhere?
- Check: `src/components/ui/PhoneMockup.tsx` — still used elsewhere?
- Check: `src/components/layout/RobotViewer.tsx` — still used in 3D scene?

**Step 1: Check for remaining usages**
```bash
grep -r "LaptopMockup\|PhoneMockup\|RobotViewer" src/ --include="*.tsx" --include="*.ts"
```

If only used by old ProjectsSection (now removed), delete them. If used elsewhere (e.g. DeskScene, DeskInteractions), keep them.

**Step 2: Commit cleanup if any**
```bash
git add -u
git commit -m "chore: remove unused mockup components"
```
