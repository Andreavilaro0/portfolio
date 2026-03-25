'use client'

/**
 * ProjectNavigator — compact project list for the macbook monitor overlay.
 * Designed to live inside a fixed ~520×380px DOM overlay on the 3D desk scene.
 *
 * Usage:
 *   <ProjectNavigator
 *     activeProjectId="clara"
 *     onSelect={(id) => setActiveProject(id)}
 *     onBack={() => setView('portfolio')}
 *   />
 */

import { useRef, useEffect } from 'react'
import { projects } from '../../data/projects'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectNavigatorProps {
  activeProjectId: string | null
  onSelect: (projectId: string) => void
  onBack: () => void
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrafficLights() {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', gap: '5px', alignItems: 'center', flexShrink: 0 }}
    >
      {[
        { color: '#ff5f57', label: 'close' },
        { color: '#febc2e', label: 'minimize' },
        { color: '#28c840', label: 'maximize' },
      ].map(({ color, label }) => (
        <div
          key={label}
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProjectNavigator({
  activeProjectId,
  onSelect,
  onBack,
}: ProjectNavigatorProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll active item into view whenever activeProjectId changes
  useEffect(() => {
    if (!activeProjectId || !listRef.current) return
    const activeEl = listRef.current.querySelector(
      `[data-project-id="${activeProjectId}"]`
    ) as HTMLElement | null
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeProjectId])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#08080f',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-code)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#111',
          borderBottom: '1px solid #222',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <TrafficLights />

        {/* Center label */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#555',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Projects
        </span>

        {/* Back button */}
        <button
          onClick={onBack}
          aria-label="Back to portfolio"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: '#BEFF00',
            letterSpacing: '0.08em',
            padding: '2px 0',
            lineHeight: 1,
            flexShrink: 0,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onBlur={(e) => {
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          &larr; Portfolio
        </button>
      </header>

      {/* ── Scrollable project list ─────────────────────────────────────────── */}
      <div
        ref={listRef}
        className="monitor-scroll"
        role="list"
        aria-label="Project list"
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {projects.map((project, index) => {
          const isActive = project.id === activeProjectId
          const isLast = index === projects.length - 1

          return (
            <button
              key={project.id}
              role="listitem"
              data-project-id={project.id}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${project.num} — ${project.title}, ${project.subtitle}`}
              onClick={() => onSelect(project.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                background: isActive ? 'rgba(190,255,0,0.05)' : 'transparent',
                border: 'none',
                borderLeft: isActive
                  ? '3px solid #BEFF00'
                  : '3px solid transparent',
                borderBottom: isLast ? 'none' : '1px solid #222',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-code)',
                color: '#fff',
                transition: 'background 0.15s, border-left-color 0.15s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '1px solid rgba(190,255,0,0.4)'
                e.currentTarget.style.outlineOffset = '-1px'
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none'
              }}
            >
              {/* Project number */}
              <span
                aria-hidden="true"
                style={{
                  fontSize: '10px',
                  color: '#666',
                  letterSpacing: '0.06em',
                  flexShrink: 0,
                  width: '18px',
                }}
              >
                {project.num}
              </span>

              {/* Title + subtitle */}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 400,
                    color: '#fff',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.3,
                    marginBottom: '3px',
                  }}
                >
                  {project.title}
                </span>

                {/* Subtitle badge */}
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    background: project.color,
                    color: '#fff',
                    lineHeight: 1.4,
                    flexShrink: 0,
                  }}
                >
                  {project.subtitle}
                </span>
              </span>

              {/* Active indicator arrow */}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '10px',
                    color: '#BEFF00',
                    flexShrink: 0,
                  }}
                >
                  &rsaquo;
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Bottom hint ────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          padding: '8px 16px',
          borderTop: '1px solid #1a1a1a',
          textAlign: 'center',
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: '#333',
          flexShrink: 0,
          background: '#08080f',
        }}
      >
        Click to explore
      </div>
    </div>
  )
}
