'use client'

/**
 * ProjectDetail — rich single-project view rendered inside the monitor overlay.
 *
 * Usage:
 *   <ProjectDetail
 *     projectId="clara"
 *     onBack={() => setView('list')}
 *     onNavigate={(id) => setActiveProject(id)}
 *   />
 *
 * The component occupies the full monitor overlay area (~65vw × 75vh).
 * Scroll is handled by the .monitor-scroll CSS class defined in globals.css.
 */

import { projects, type Project } from '../../data/projects'

interface ProjectDetailProps {
  projectId: string
  onBack: () => void
  onNavigate: (projectId: string) => void
}

// Derive a slightly darker shade of a hex color for text-on-color legibility.
function darkenHex(hex: string, amount = 40): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (n >> 16) - amount)
  const g = Math.max(0, ((n >> 8) & 0xff) - amount)
  const b = Math.max(0, (n & 0xff) - amount)
  return `rgb(${r},${g},${b})`
}

// Determine whether white or dark text is more readable on a given color.
function contrastColor(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  // Perceived luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1A1A1A' : '#ffffff'
}

export function ProjectDetail({ projectId, onBack, onNavigate }: ProjectDetailProps) {
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  const project: Project | undefined = projects[projectIndex]

  // Graceful fallback if the id is not found.
  if (!project) {
    return (
      <div
        style={{
          padding: '24px',
          fontFamily: 'var(--font-code)',
          fontSize: '12px',
          color: 'var(--color-muted)',
        }}
      >
        Project not found.{' '}
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-pink)', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          Go back
        </button>
      </div>
    )
  }

  const prevProject: Project | undefined = projectIndex > 0 ? projects[projectIndex - 1] : undefined
  const nextProject: Project | undefined = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : undefined

  const heroTextColor = contrastColor(project.color)
  const linkColor = project.color === '#00E5FF' ? darkenHex('#00E5FF', 60) : project.color

  return (
    <>
      {/* Scoped keyframes — no external CSS dependency */}
      <style>{`
        @keyframes pd-fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-animated { animation: none !important; }
        }
      `}</style>

      {/* Root: fills whatever the overlay gives it */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#ffffff',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          overflow: 'hidden',
        }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            borderBottom: '2px solid var(--color-border)',
            background: '#ffffff',
            flexShrink: 0,
          }}
        >
          <button
            onClick={onBack}
            aria-label="Back to portfolio"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.08em',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              padding: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '13px', lineHeight: 1 }}>←</span>
            Back to portfolio
          </button>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              lineHeight: 1,
              color: project.color,
              letterSpacing: '0.05em',
            }}
          >
            {project.num}
          </span>
        </div>

        {/* ── Scrollable body ── */}
        <div
          className="monitor-scroll pd-animated"
          style={{
            flex: 1,
            overflowY: 'auto',
            animation: 'pd-fadeIn 0.3s ease',
          }}
        >
          {/* Hero */}
          <div
            style={{
              background: project.color,
              padding: '20px 20px 16px',
            }}
          >
            {/* Subtitle badge */}
            <div
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-code)',
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: heroTextColor,
                border: `1.5px solid ${heroTextColor}`,
                padding: '2px 8px',
                marginBottom: '8px',
                opacity: 0.85,
              }}
            >
              {project.subtitle}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                lineHeight: 1.05,
                margin: 0,
                color: heroTextColor,
                letterSpacing: '0.02em',
              }}
            >
              {project.title}
            </h2>
          </div>

          {/* Body content */}
          <div style={{ padding: '16px 20px 24px' }}>

            {/* Description */}
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.65,
                color: 'var(--color-muted)',
                margin: '0 0 16px 0',
              }}
            >
              {project.desc}
            </p>

            {/* Context */}
            {project.context && (
              <p
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '11px',
                  lineHeight: 1.55,
                  color: 'var(--color-text)',
                  margin: '0 0 16px 0',
                  opacity: 0.65,
                  padding: '10px 12px',
                  background: 'rgba(26,26,26,0.04)',
                  borderLeft: `3px solid ${project.color}`,
                }}
              >
                {project.context}
              </p>
            )}

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                opacity: 0.12,
                marginBottom: '14px',
              }}
            />

            {/* Highlights */}
            {project.highlights.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    marginBottom: '8px',
                  }}
                >
                  Highlights
                </div>
                {project.highlights.map((h) => (
                  <div
                    key={h}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      fontFamily: 'var(--font-code)',
                      fontSize: '11px',
                      lineHeight: 1.5,
                      color: 'var(--color-text)',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ color: project.color, flexShrink: 0, fontWeight: 700 }}
                    >
                      →
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px',
                  marginBottom: '16px',
                }}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '10px',
                      letterSpacing: '0.05em',
                      color: 'var(--color-text)',
                      border: '1.5px solid var(--color-border)',
                      padding: '3px 8px',
                      background: 'transparent',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {project.links.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  flexWrap: 'wrap',
                  marginBottom: '24px',
                }}
              >
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                      color: linkColor,
                      textDecoration: 'none',
                      fontWeight: 600,
                      opacity: 1,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.opacity = '0.6'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.opacity = '1'
                    }}
                  >
                    [{link.label}]
                  </a>
                ))}
              </div>
            )}

            {/* Bottom nav — prev / next */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid var(--color-border)',
                paddingTop: '14px',
                gap: '12px',
              }}
            >
              {/* Prev */}
              {prevProject ? (
                <button
                  onClick={() => onNavigate(prevProject.id)}
                  aria-label={`Previous project: ${prevProject.title}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span aria-hidden="true">←</span> Prev
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      color: prevProject.color,
                      letterSpacing: '0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    {prevProject.title}
                  </span>
                </button>
              ) : (
                <div style={{ flex: 1 }} />
              )}

              {/* Center dot */}
              <div
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-border)',
                  opacity: 0.25,
                  flexShrink: 0,
                }}
              />

              {/* Next */}
              {nextProject ? (
                <button
                  onClick={() => onNavigate(nextProject.id)}
                  aria-label={`Next project: ${nextProject.title}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Next <span aria-hidden="true">→</span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      color: nextProject.color,
                      letterSpacing: '0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    {nextProject.title}
                  </span>
                </button>
              ) : (
                <div style={{ flex: 1 }} />
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
