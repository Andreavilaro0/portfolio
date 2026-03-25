'use client'

import { useEffect, useState } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { HandDrawnLine } from './HandDrawnLine'

const processes = [
  { pid: 1024, name: 'init', state: 'running', mem: '2.1MB', cpu: '0.1%' },
  { pid: 1337, name: 'scheduler', state: 'running', mem: '4.8MB', cpu: '12.3%' },
  { pid: 2048, name: 'memory_mgr', state: 'running', mem: '8.2MB', cpu: '5.7%' },
  { pid: 2049, name: 'process_a', state: 'waiting', mem: '1.4MB', cpu: '0.0%' },
  { pid: 3001, name: 'process_b', state: 'running', mem: '3.6MB', cpu: '8.2%' },
  { pid: 3072, name: 'deadlock_det', state: 'running', mem: '2.0MB', cpu: '1.1%' },
  { pid: 4096, name: 'io_handler', state: 'blocked', mem: '1.8MB', cpu: '0.0%' },
]

export function OSSection() {
  const [visibleRows, setVisibleRows] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let count = 0
          const id = setInterval(() => {
            count++
            setVisibleRows(count)
            if (count >= processes.length) clearInterval(id)
          }, 150)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    const el = document.getElementById('os-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="os-section"
      className="paper-bg"
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(24px, 6vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Page number */}
      <span className="page-number">pg. 05</span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <ScrollReveal>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              color: 'var(--color-text)',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
            }}
          >
            KERNEL SIM
          </h2>
          <HandDrawnLine variant={0} opacity={0.3} color="var(--color-pencil)" />
        </ScrollReveal>

        {/* Handwritten question */}
        <ScrollReveal delay={100}>
          <span
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--color-muted)',
              display: 'inline-block',
              marginTop: '16px',
              transform: 'rotate(-1deg)',
            }}
          >
            cual gana? →
          </span>
        </ScrollReveal>

        {/* Blueprint: scheduling diagram */}
        <ScrollReveal delay={150}>
          <div style={{ marginTop: '20px' }}>
            <svg width="100%" viewBox="0 0 340 70" fill="none" aria-hidden="true" style={{ maxWidth: '340px' }}>
              {[
                { x: 0, label: 'FIFO' },
                { x: 115, label: 'SJF' },
                { x: 230, label: 'Round Robin' },
              ].map((box) => (
                <g key={box.label}>
                  <rect x={box.x} y="8" width="95" height="28" rx="2" stroke="var(--color-pencil)" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                  <text x={box.x + 47} y="26" textAnchor="middle" fontFamily="var(--font-code)" fontSize="9" fill="var(--color-pencil)">{box.label}</text>
                </g>
              ))}
              {/* Time arrows */}
              <line x1="0" y1="50" x2="325" y2="50" stroke="var(--color-muted)" strokeWidth="1" markerEnd="url(#arrowhead-os)" />
              <defs>
                <marker id="arrowhead-os" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="var(--color-muted)" />
                </marker>
              </defs>
              <line x1="0" y1="46" x2="0" y2="54" stroke="var(--color-muted)" strokeWidth="1" />
              <text x="0" y="64" fontFamily="var(--font-code)" fontSize="8" fill="var(--color-muted)">t=0</text>
              <text x="325" y="64" textAnchor="end" fontFamily="var(--font-code)" fontSize="8" fill="var(--color-muted)">t=n</text>
              <text x="162" y="64" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="10" fill="var(--color-muted)">tiempo de ejecución →</text>
            </svg>
          </div>
        </ScrollReveal>

        {/* Two-column layout */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(32px, 5vw, 64px)',
            alignItems: 'flex-start',
            marginTop: '32px',
          }}
        >
          {/* LEFT — Info */}
          <div style={{ flex: '1 1 300px', maxWidth: '420px' }}>
            <ScrollReveal delay={200}>
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.2vw + 0.4rem, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                Simulación de sistemas operativos con gestión de procesos
                y memoria. FIFO, SJF, Round Robin — ver los algoritmos
                competir por recursos en tiempo real.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={270}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '24px' }}>
                {[
                  'Gestión de procesos en tiempo real',
                  'FIFO / SJF / Round Robin',
                  'Detección de deadlocks',
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-pencil)',
                    }}
                  >
                    → {h}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
                {['C', 'Sistemas', 'Universidad'].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={370}>
              <div style={{ marginTop: '28px' }}>
                <a
                  href="https://github.com/gabrielcclv/SistemasOperativos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pencil-underline"
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-pencil)',
                    textDecoration: 'none',
                  }}
                >
                  [github →]
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT — Terminal in sketch border */}
          <ScrollReveal delay={200}>
            <div style={{ flex: '2 1 460px', minWidth: 0 }}>
              <div
                className="sketch-border"
                style={{ overflow: 'hidden' }}
              >
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Process monitor"
                  style={{
                    width: '100%',
                    background: '#1A1A1A',
                    padding: '16px',
                    fontFamily: 'var(--font-code)',
                    fontSize: '11px',
                    overflowX: 'auto',
                  }}
                >
                  {/* Terminal header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-pink)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-lime)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-violet)' }} />
                    <span style={{ marginLeft: '6px', fontSize: '9px', color: 'rgba(255,255,255,0.55)' }}>
                      process_monitor — htop
                    </span>
                  </div>

                  {/* Table header */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 100px 70px 60px 50px',
                      gap: '6px',
                      color: 'rgba(255,255,255,0.55)',
                      paddingBottom: '6px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '4px',
                      fontSize: '10px',
                    }}
                  >
                    <span>PID</span>
                    <span>NAME</span>
                    <span>STATE</span>
                    <span>MEM</span>
                    <span>CPU</span>
                  </div>

                  {/* Rows */}
                  {processes.map((proc, i) => (
                    <div
                      key={proc.pid}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 100px 70px 60px 50px',
                        gap: '6px',
                        padding: '4px 0',
                        opacity: i < visibleRows ? 1 : 0,
                        transform: i < visibleRows ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        fontSize: '10px',
                      }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{proc.pid}</span>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{proc.name}</span>
                      <span
                        style={{
                          color:
                            proc.state === 'running'
                              ? 'var(--color-lime)'
                              : proc.state === 'waiting'
                                ? '#FFD700'
                                : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        {proc.state}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{proc.mem}</span>
                      <span
                        style={{
                          color: parseFloat(proc.cpu) > 5 ? 'var(--color-pink)' : 'rgba(255,255,255,0.55)',
                        }}
                      >
                        {proc.cpu}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <HandDrawnLine variant={1} opacity={0.2} color="var(--color-border)" />
      </div>
    </section>
  )
}
