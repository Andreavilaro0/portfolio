'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import gsap from 'gsap'

// Phase 1: Typing the command
const COMMAND = 'sudo apt install andrea-avila-portfolio'

// Phase 2: Fast download/install output (scrolls fast like real apt)
const INSTALL_LINES = [
  { text: 'Reading package lists... Done', color: '#6B6B7B' },
  { text: 'Building dependency tree... Done', color: '#6B6B7B' },
  { text: 'Reading state information... Done', color: '#6B6B7B' },
  { text: 'The following NEW packages will be installed:', color: '#e8e6e3' },
  { text: '  react typescript next.js three.js gsap tailwind', color: '#00E5FF' },
  { text: '  c++ arduino laravel sql mongodb node.js', color: '#00E5FF' },
  { text: '  vscode cursor figma blender claude-code git', color: '#7B2FFF' },
  { text: '0 upgraded, 18 newly installed, 0 to remove.', color: '#e8e6e3' },
  { text: 'Need to get 42.0 MB of archives.', color: '#e8e6e3' },
  { text: 'After this operation, 128 MB of additional disk space will be used.', color: '#e8e6e3' },
  { text: '', color: '#6B6B7B' },
  { text: 'Get:1 https://registry.npmjs.org react 19.1.0 [2,847 kB]', color: '#6B6B7B' },
  { text: 'Get:2 https://registry.npmjs.org typescript 5.8.0 [5,112 kB]', color: '#6B6B7B' },
  { text: 'Get:3 https://registry.npmjs.org next 16.0.0 [8,934 kB]', color: '#6B6B7B' },
  { text: 'Get:4 https://registry.npmjs.org three 0.175.0 [4,221 kB]', color: '#6B6B7B' },
  { text: 'Get:5 https://registry.npmjs.org gsap 3.14.2 [1,856 kB]', color: '#6B6B7B' },
  { text: 'Get:6 https://registry.npmjs.org tailwindcss 4.2.1 [3,442 kB]', color: '#6B6B7B' },
  { text: 'Get:7 https://gnu.org c++ 14.2.0 [6,789 kB]', color: '#6B6B7B' },
  { text: 'Get:8 https://arduino.cc arduino-cli 1.1.0 [2,134 kB]', color: '#6B6B7B' },
  { text: 'Get:9 https://laravel.com laravel 12.0.0 [3,567 kB]', color: '#6B6B7B' },
  { text: 'Get:10 https://mongodb.com mongodb 8.0.0 [1,923 kB]', color: '#6B6B7B' },
  { text: 'Fetched 42.0 MB in 3s (14.0 MB/s)', color: '#e8e6e3' },
  { text: '', color: '#6B6B7B' },
  { text: 'Selecting previously unselected package react.', color: '#6B6B7B' },
  { text: '(Reading database ... 847293 files and directories currently installed.)', color: '#6B6B7B' },
  { text: 'Preparing to unpack react_19.1.0 ...', color: '#6B6B7B' },
  { text: 'Unpacking react (19.1.0) ...', color: '#6B6B7B' },
  { text: 'Preparing to unpack typescript_5.8.0 ...', color: '#6B6B7B' },
  { text: 'Unpacking typescript (5.8.0) ...', color: '#6B6B7B' },
  { text: 'Preparing to unpack next_16.0.0 ...', color: '#6B6B7B' },
  { text: 'Unpacking next (16.0.0) ...', color: '#6B6B7B' },
  { text: 'Preparing to unpack three_0.175.0 ...', color: '#6B6B7B' },
  { text: 'Unpacking three (0.175.0) ...', color: '#6B6B7B' },
  { text: 'Setting up react (19.1.0) ...', color: '#6B6B7B' },
  { text: 'Setting up typescript (5.8.0) ...', color: '#6B6B7B' },
  { text: 'Setting up next (16.0.0) ...', color: '#6B6B7B' },
  { text: 'Setting up three (0.175.0) ...', color: '#6B6B7B' },
  { text: 'Setting up gsap (3.14.2) ...', color: '#6B6B7B' },
  { text: 'Setting up tailwindcss (4.2.1) ...', color: '#6B6B7B' },
  { text: 'Setting up c++ (14.2.0) ...', color: '#6B6B7B' },
  { text: 'Setting up arduino-cli (1.1.0) ...', color: '#6B6B7B' },
  { text: 'Setting up laravel (12.0.0) ...', color: '#6B6B7B' },
  { text: 'Setting up mongodb (8.0.0) ...', color: '#6B6B7B' },
  { text: '', color: '#6B6B7B' },
  { text: 'Processing triggers for engineer-andrea ...', color: '#6B6B7B' },
  { text: '', color: '#6B6B7B' },
]

// Phase 3: Portfolio info reveal (slower, dramatic)
const INFO_LINES = [
  { text: '╔══════════════════════════════════════════════╗', color: '#333340' },
  { text: '║  ANDREA AVILA — PORTFOLIO INSTALLED          ║', color: '#fff' },
  { text: '╚══════════════════════════════════════════════╝', color: '#333340' },
  { text: '', color: '' },
  { text: '  Name        : Andrea Avila', color: '#e8e6e3' },
  { text: '  Role        : Full-Stack Developer', color: '#e8e6e3' },
  { text: '  Location    : Madrid, Spain', color: '#e8e6e3' },
  { text: '  Origin      : Mexico 🇲🇽', color: '#e8e6e3' },
  { text: '  Education   : UDIT Madrid — 4th semester', color: '#e8e6e3' },
  { text: '', color: '' },
  { text: '  Stack       : React · TypeScript · C++ · Three.js', color: '#00E5FF' },
  { text: '  Tools       : VS Code · Cursor · Figma · Claude', color: '#7B2FFF' },
  { text: '  Databases   : SQL · MongoDB', color: '#BEFF00' },
  { text: '', color: '' },
  { text: '  Status      : Open to work', color: '#FF2D9B' },
  { text: '  Projects    : 5 loaded', color: '#BEFF00' },
  { text: '  Hackathon   : OdiseIA4Good 2026', color: '#BEFF00' },
  { text: '  Robotics    : ASTI Challenge — National Finalist', color: '#BEFF00' },
  { text: '', color: '' },
]

function ProgressBar({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8 + 2
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 200)
          return 100
        }
        return next
      })
    }, 40)
    return () => clearInterval(interval)
  }, [onComplete])

  const pct = Math.min(100, Math.round(progress))
  const filled = Math.round((pct / 100) * 35)
  const bar = '█'.repeat(filled) + '░'.repeat(35 - filled)

  return (
    <div style={{ color: '#00E5FF' }}>
      [{bar}] {pct}%
    </div>
  )
}

export function HeroBoot() {
  const [phase, setPhase] = useState<'waiting' | 'typing' | 'progress' | 'installing' | 'info' | 'prompt'>('waiting')
  const [typedChars, setTypedChars] = useState(0)
  const [installLine, setInstallLine] = useState(0)
  const [infoLine, setInfoLine] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Hide chrome bar when loaded inside portfolio-os
  const [embedded, setEmbedded] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('autostart') === 'true') setEmbedded(true)
  }, [])

  // Wait for boot signal — standalone starts immediately, iframe waits for postMessage
  // ?autostart=true skips the wait (used when loaded inside portfolio-os)
  useEffect(() => {
    const isStandalone = typeof window !== 'undefined' && window.self === window.top
    const params = new URLSearchParams(window.location.search)
    const autostart = params.get('autostart') === 'true'

    if (isStandalone || autostart) {
      setTimeout(() => setPhase('typing'), 500)
      return
    }

    // Inside iframe — wait for parent to send boot message
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'boot') {
        setTimeout(() => setPhase('typing'), 300)
        window.removeEventListener('message', handleMessage)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  // Phase 1: Type the command character by character
  useEffect(() => {
    if (phase !== 'typing') return
    if (typedChars >= COMMAND.length) {
      setTimeout(() => setPhase('progress'), 400)
      return
    }
    const speed = 30 + Math.random() * 40
    const timer = setTimeout(() => setTypedChars(prev => prev + 1), speed)
    return () => clearTimeout(timer)
  }, [phase, typedChars])

  // Phase 2: Progress bar (handled by ProgressBar component)

  // Phase 3: Fast install output
  useEffect(() => {
    if (phase !== 'installing') return
    if (installLine >= INSTALL_LINES.length) {
      setTimeout(() => setPhase('info'), 300)
      return
    }
    const speed = 25 + Math.random() * 20 // Very fast
    const timer = setTimeout(() => {
      setInstallLine(prev => prev + 1)
      scrollToBottom()
    }, speed)
    return () => clearTimeout(timer)
  }, [phase, installLine])

  // Phase 4: Info reveal (slower)
  useEffect(() => {
    if (phase !== 'info') return
    if (infoLine >= INFO_LINES.length) {
      setTimeout(() => {
        setPhase('prompt')
        setShowPrompt(true)
        scrollToBottom()
      }, 400)
      return
    }
    const timer = setTimeout(() => {
      setInfoLine(prev => prev + 1)
      scrollToBottom()
    }, 80)
    return () => clearTimeout(timer)
  }, [phase, infoLine])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  // After boot — animate hero shrinking and scroll to content
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!showPrompt || !sectionRef.current) return
    const timer = setTimeout(() => {
      const section = sectionRef.current
      if (!section) return
      // Shrink the hero terminal with GSAP
      gsap.to(section, {
        height: '40vh',
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
          const projects = document.getElementById('projects')
          if (projects) {
            projects.scrollIntoView({ behavior: 'smooth' })
          }
        }
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [showPrompt])

  const cursor = <span style={{ color: '#BEFF00', opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}>█</span>

  const prompt = (
    <>
      <span style={{ color: '#BEFF00' }}>andrea</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}>@</span>
      <span style={{ color: '#00E5FF' }}>portfolio</span>
      <span style={{ color: 'rgba(255,255,255,0.3)' }}> ~ $ </span>
    </>
  )

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100dvh',
        background: '#08080c',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chrome bar — hidden when embedded in portfolio-os */}
      {!embedded && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: '#111118',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{
            marginLeft: '12px',
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
          }}>
            andrea@portfolio — bash
          </span>
          {phase === 'prompt' && (
            <span style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: '#BEFF00',
            }}>
              ● INSTALLED
            </span>
          )}
        </div>
      )}

      {/* Terminal body */}
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          padding: 'clamp(14px, 2.5vw, 24px)',
          fontFamily: 'var(--font-code)',
          fontSize: 'clamp(16px, 2vw, 22px)',
          lineHeight: 1.5,
          letterSpacing: '0.02em',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#08080c',
        }}
      >
        {/* Waiting state — just cursor blinking */}
        {phase === 'waiting' && (
          <div style={{ whiteSpace: 'pre' }}>
            {prompt}
            {cursor}
          </div>
        )}

        {/* Command being typed */}
        {phase !== 'waiting' && (
          <div style={{ whiteSpace: 'pre' }}>
            {prompt}
            <span style={{ color: '#e8e6e3' }}>{COMMAND.slice(0, typedChars)}</span>
            {phase === 'typing' && cursor}
          </div>
        )}

        {/* Password prompt */}
        {phase !== 'waiting' && phase !== 'typing' && (
          <div style={{ color: '#6B6B7B', marginTop: '4px' }}>
            [sudo] password for andrea: ••••••••
          </div>
        )}

        {/* Progress bar */}
        {(phase === 'progress' || phase === 'installing' || phase === 'info' || phase === 'prompt') && (
          <div style={{ margin: '8px 0' }}>
            <ProgressBar onComplete={() => setPhase('installing')} />
          </div>
        )}

        {/* Fast install output */}
        {INSTALL_LINES.slice(0, installLine).map((line, i) => (
          <div key={`install-${i}`} style={{
            color: line.color,
            minHeight: line.text ? 'auto' : '4px',
            whiteSpace: 'pre',
          }}>
            {line.text}
          </div>
        ))}

        {/* Info reveal */}
        {INFO_LINES.slice(0, infoLine).map((line, i) => (
          <div key={`info-${i}`} style={{
            color: line.color,
            minHeight: line.text ? 'auto' : '4px',
            whiteSpace: 'pre',
          }}>
            {line.text}
          </div>
        ))}

        {/* Final question */}
        {showPrompt && (
          <>
            <div style={{ color: '#e8e6e3', marginTop: '4px' }}>
              Do you want to explore this portfolio? [Y/n]{' '}
              <span style={{ color: '#BEFF00', fontWeight: 600, animation: 'bootFadeIn 0.3s ease forwards', animationDelay: '0.8s', opacity: 0 }}>y</span>
            </div>
            <div style={{ color: '#BEFF00', marginTop: '4px', animation: 'bootFadeIn 0.3s ease forwards', animationDelay: '1.5s', opacity: 0 }}>
              Starting portfolio... ✓
            </div>
            <div style={{ marginTop: '8px', animation: 'bootFadeIn 0.3s ease forwards', animationDelay: '2s', opacity: 0 }}>
              {prompt}
              {cursor}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
