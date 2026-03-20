'use client'

import { useEffect, useState } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { LaptopMockup } from '../ui/LaptopMockup'

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
      <div className="section-divider" style={{ marginBottom: '48px', background: 'rgba(255,255,255,0.15)' }} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'flex-start' }}>
        {/* Left — Info */}
        <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>04</span>
              <span className="badge badge-violet">Kernel</span>
              <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>/ OS Simulation</span>
              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              SISTEMAS<br />OPERATIVOS
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.1vw + 0.5rem, 1.15rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.7)',
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
                <span key={tag} className="tag" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.25)' }}>{tag}</span>
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
                color: '#FF6FBF',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              [github]
            </a>
          </ScrollReveal>
        </div>

        {/* Right — Laptop mockup with terminal */}
        <div style={{ flex: '1 1 400px' }}>
          <LaptopMockup>
            <div tabIndex={0} role="region" aria-label="Process monitor" style={{ width: '100%', height: '100%', background: '#1A1A1A', padding: '16px', fontFamily: 'var(--font-code)', fontSize: '11px', overflowX: 'auto' }}>
              {/* Terminal header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF2D9B' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#BEFF00' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B2FFF' }} />
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
                          ? '#BEFF00'
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
                      color: parseFloat(proc.cpu) > 5 ? '#FF2D9B' : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {proc.cpu}
                  </span>
                </div>
              ))}
            </div>
          </LaptopMockup>
        </div>
      </div>
    </section>
  )
}
