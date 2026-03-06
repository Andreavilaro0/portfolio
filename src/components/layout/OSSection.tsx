'use client'

import { useEffect, useState } from 'react'
import { ScrollReveal } from './ScrollReveal'

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
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(32px, 6vw, 96px)',
      }}
    >
      {/* Section divider */}
      <div className="section-divider" style={{ marginBottom: '48px' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'flex-start' }}>
        {/* Left — Info */}
        <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <span className="label">04</span>
              <span className="label" style={{ color: 'var(--color-sage-green)' }}>
                Kernel
              </span>
              <span className="label">/ OS Simulation</span>
              <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(255,255,255,0.08)' }} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--color-espresso)',
                margin: 0,
              }}
            >
              Sistemas
              <br />
              Operativos
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                lineHeight: 1.7,
                color: 'var(--color-cocoa)',
                marginTop: '20px',
              }}
            >
              Simulación de sistemas operativos con gestión de procesos
              y memoria. FIFO, SJF, Round Robin — ver los algoritmos
              competir por recursos en tiempo real.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
              {['C', 'Sistemas', 'Universidad'].map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <a
              href="https://github.com/gabrielcclv/SistemasOperativos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: '32px',
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                color: 'var(--color-terracotta)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              [github]
            </a>
          </ScrollReveal>
        </div>

        {/* Right — Process table (terminal-style but warm) */}
        <div
          style={{
            flex: '1 1 400px',
            background: 'var(--color-espresso)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Window bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.2)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ marginLeft: '8px', fontFamily: 'var(--font-code)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              process_monitor — htop
            </span>
          </div>

          <div style={{ padding: '16px', fontFamily: 'var(--font-code)', fontSize: '12px', overflowX: 'auto' }}>
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 120px 80px 70px 60px',
                gap: '8px',
                color: 'rgba(255,255,255,0.3)',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '4px',
                minWidth: '390px',
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
                  gridTemplateColumns: '60px 120px 80px 70px 60px',
                  gap: '8px',
                  padding: '6px 0',
                  opacity: i < visibleRows ? 1 : 0,
                  transform: i < visibleRows ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  minWidth: '390px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>{proc.pid}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{proc.name}</span>
                <span
                  style={{
                    color:
                      proc.state === 'running'
                        ? '#7a9a6d'
                        : proc.state === 'waiting'
                          ? '#c96b3c'
                          : '#a8a099',
                  }}
                >
                  {proc.state}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{proc.mem}</span>
                <span
                  style={{
                    color: parseFloat(proc.cpu) > 5 ? '#c96b3c' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {proc.cpu}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
