'use client'

import { useEffect, useState } from 'react'

const ASCII_ART = [
  '        .--.     ',
  '       |o_o |    ',
  '       |:_/ |    ',
  '      //   \\ \\   ',
  '     (|     | )  ',
  "    /'\\_   _/`\\  ",
  '    \\___)=(___/  ',
  '                 ',
]

const INFO_LINES = [
  { label: '', value: 'andrea@madrid', highlight: true },
  { label: '', value: '─────────────────', dim: true },
  { label: 'OS', value: 'macOS Sequoia' },
  { label: 'Role', value: 'Full Stack Developer' },
  { label: 'Stack', value: 'React, Next.js, Three.js' },
  { label: 'Backend', value: 'Python, Node.js' },
  { label: 'AI', value: 'Gemini, ElevenLabs' },
  { label: 'Style', value: 'Tailwind, Framer Motion' },
  { label: 'Cloud', value: 'Vercel, AWS' },
  { label: 'Editor', value: 'VS Code + Vim' },
  { label: 'Status', value: 'Available for work' },
  { label: '', value: '' },
  { label: '', value: 'colors', isColors: true },
]

export function Neofetch() {
  const [visibleLines, setVisibleLines] = useState(0)
  const totalLines = Math.max(ASCII_ART.length, INFO_LINES.length)

  useEffect(() => {
    if (visibleLines < totalLines) {
      const id = setTimeout(
        () => setVisibleLines((v) => v + 1),
        60 + Math.random() * 40
      )
      return () => clearTimeout(id)
    }
  }, [visibleLines, totalLines])

  const colorBlocks = ['#ff5f56', '#ffbd2e', '#27c93f', '#00ffff', '#ff00ff', '#ffff00', '#e0e0e0', '#666']

  return (
    <section
      style={{
        width: '100%',
        padding: 'clamp(48px, 8vh, 96px) clamp(32px, 6vw, 96px)',
        background: '#0a0a0a',
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          background: '#111',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: '#1a1a1a',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
          <span
            style={{
              marginLeft: '12px',
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            andrea — neofetch
          </span>
        </div>

        {/* Terminal content */}
        <div
          style={{
            padding: 'clamp(16px, 3vw, 32px)',
            fontFamily: 'var(--font-code)',
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            lineHeight: 1.65,
            overflowX: 'auto',
          }}
        >
          {/* Command */}
          <div style={{ color: '#666', marginBottom: '16px' }}>
            <span style={{ color: '#27c93f' }}>~</span>{' '}
            <span style={{ color: '#e0e0e0' }}>neofetch</span>
          </div>

          {/* Neofetch output — ASCII left, info right */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* ASCII art */}
            <div style={{ flexShrink: 0 }}>
              {ASCII_ART.map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: '#00ffff',
                    opacity: i < visibleLines ? 1 : 0,
                    transition: 'opacity 0.15s',
                    whiteSpace: 'pre',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Info */}
            <div>
              {INFO_LINES.map((line, i) => (
                <div
                  key={i}
                  style={{
                    opacity: i < visibleLines ? 1 : 0,
                    transition: 'opacity 0.15s',
                    whiteSpace: 'pre',
                  }}
                >
                  {line.isColors ? (
                    <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                      {colorBlocks.map((c, ci) => (
                        <div
                          key={ci}
                          style={{
                            width: '16px',
                            height: '16px',
                            background: c,
                            borderRadius: '2px',
                          }}
                        />
                      ))}
                    </div>
                  ) : line.highlight ? (
                    <span style={{ color: '#00ffff', fontWeight: 600 }}>{line.value}</span>
                  ) : line.dim ? (
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>{line.value}</span>
                  ) : line.label ? (
                    <>
                      <span style={{ color: '#00ffff' }}>{line.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>: </span>
                      <span style={{ color: 'rgba(224,224,224,0.7)' }}>{line.value}</span>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
