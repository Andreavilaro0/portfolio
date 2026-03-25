'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  progress: number
  ready: boolean
  onEnter: () => void
}

const SUBTITLES = ['developer', 'photographer', 'F1 fan', 'sketch artist', 'builder']

export function LoadingScreen({ progress, ready, onEnter }: LoadingScreenProps) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const subtitleIdxRef = useRef(0)
  const [exiting, setExiting] = useState(false)

  // Stagger animation on name letters
  useEffect(() => {
    if (hasAnimated.current || !nameRef.current) return
    hasAnimated.current = true

    const spans = nameRef.current.querySelectorAll('.letter')
    gsap.fromTo(spans,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power2.out' }
    )
  }, [])

  // Ref-based typewriter — zero React re-renders per character
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    const cycleSubtitle = () => {
      const word = SUBTITLES[subtitleIdxRef.current]
      let charIdx = 0

      if (subtitleRef.current) subtitleRef.current.textContent = ''

      intervalId = setInterval(() => {
        if (cancelled) { if (intervalId) clearInterval(intervalId); return }
        charIdx++
        if (subtitleRef.current) {
          subtitleRef.current.textContent = word.slice(0, charIdx)
        }
        if (charIdx >= word.length) {
          if (intervalId) clearInterval(intervalId)
          // FIX 6: Reduced pause between words from 1500ms to 800ms
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return
            subtitleIdxRef.current = (subtitleIdxRef.current + 1) % SUBTITLES.length
            cycleSubtitle()
          }, 800)
        }
      // FIX 6: Reduced char interval from 80ms to 60ms for snappier typing
      }, 60)
    }

    cycleSubtitle()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const handleEnter = () => {
    if (exiting) return
    setExiting(true)
    // P3 fix: immediate visual feedback
    if (containerRef.current) {
      // Quick fade-out (0.4s) so the intro fly-in is visible
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: onEnter,
      })
    } else {
      onEnter()
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        gap: '24px',
        cursor: ready ? 'pointer' : 'default',
      }}
      role={ready ? 'button' : undefined}
      tabIndex={ready ? 0 : undefined}
      aria-label={ready ? 'Enter portfolio' : undefined}
      onClick={ready ? handleEnter : undefined}
      onKeyDown={ready ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEnter() } } : undefined}
    >
      {/* Tagline */}
      <p style={{
        fontFamily: 'var(--font-code)',
        fontSize: '12px',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.5)',
        margin: 0,
        textTransform: 'uppercase',
      }}>
        mexicana · ingeniera · builder
      </p>

      <h1
        ref={nameRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          color: '#F2F0ED',
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {'ANDREA AVILA'.split('').map((char, i) => (
          <span key={i} className="letter" style={{ display: 'inline-block', opacity: 0 }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Typewriter subtitle — DOM-direct updates, no React re-renders */}
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '12px',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
          height: '18px',
        }}
      >
        <span ref={subtitleRef} />
        <span style={{ opacity: 0.5, animation: 'blink 1s steps(1) infinite' }}>|</span>
      </p>

      <div
        style={{
          width: 'clamp(200px, 40vw, 320px)',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF2D9B, #7B2FFF)',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 12px rgba(255,45,155,0.5)',
          }}
        />
      </div>

      {ready ? (
        <p
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          View portfolio
        </p>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Loading workspace...
        </p>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
