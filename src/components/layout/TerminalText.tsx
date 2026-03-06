'use client'

import { useEffect, useState } from 'react'

const outputLines = [
  { text: 'andrea avila', delay: 800 },
  { text: 'full_stack_dev', delay: 1000 },
  { text: 'location: madrid', delay: 1200 },
  { text: 'status: available', delay: 1400 },
]

const links = [
  { label: 'github', href: 'https://github.com' },
  { label: 'linkedin', href: 'https://linkedin.com' },
  { label: 'cv', href: '#' },
]

export function TerminalText() {
  const [typedChars, setTypedChars] = useState(0)
  const [commandDone, setCommandDone] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showLinks, setShowLinks] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  const command = 'whoami'

  // Type "whoami"
  useEffect(() => {
    if (typedChars < command.length) {
      const id = setTimeout(() => setTypedChars((c) => c + 1), 90 + Math.random() * 70)
      return () => clearTimeout(id)
    }
    if (!commandDone) {
      const id = setTimeout(() => setCommandDone(true), 400)
      return () => clearTimeout(id)
    }
  }, [typedChars, commandDone])

  // Show output lines
  useEffect(() => {
    if (commandDone && visibleLines < outputLines.length) {
      const id = setTimeout(() => setVisibleLines((v) => v + 1), 200)
      return () => clearTimeout(id)
    }
    if (commandDone && visibleLines >= outputLines.length && !showLinks) {
      const id = setTimeout(() => setShowLinks(true), 400)
      return () => clearTimeout(id)
    }
  }, [commandDone, visibleLines, showLinks])

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        fontFamily: 'var(--font-code)',
        fontSize: 'clamp(14px, 1.4vw, 18px)',
        lineHeight: 2,
        color: '#e0e0e0',
      }}
    >
      {/* Command */}
      <div>
        <span style={{ color: '#27c93f' }}>~</span>
        <span style={{ color: '#e0e0e0' }}> {command.slice(0, typedChars)}</span>
        {!commandDone && (
          <span style={{ opacity: showCursor ? 1 : 0, color: '#e0e0e0' }}>█</span>
        )}
      </div>

      {/* Output */}
      {commandDone && <div style={{ height: '0.5em' }} />}
      {outputLines.slice(0, visibleLines).map((line, i) => (
        <div key={i} style={{ color: 'rgba(224,224,224,0.7)' }}>
          {line.text}
        </div>
      ))}

      {/* Separator + links */}
      {showLinks && (
        <>
          <div
            style={{
              margin: '16px 0',
              borderTop: '1px solid rgba(224,224,224,0.12)',
              maxWidth: '200px',
            }}
          />
          <div style={{ display: 'flex', gap: '20px' }}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(224,224,224,0.35)',
                  textDecoration: 'none',
                  fontSize: 'clamp(11px, 1vw, 13px)',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#00ffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(224,224,224,0.35)')}
              >
                [{link.label}]
              </a>
            ))}
          </div>

          {/* Final prompt with blinking cursor */}
          <div style={{ marginTop: '16px' }}>
            <span style={{ color: '#27c93f' }}>~</span>
            <span style={{ opacity: showCursor ? 1 : 0, color: '#e0e0e0' }}> █</span>
          </div>
        </>
      )}
    </div>
  )
}
