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
  const [subtitleIdx, setSubtitleIdx] = useState(0)
  const [displayedSubtitle, setDisplayedSubtitle] = useState('')
  const hasAnimated = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  // Typewriter subtitle cycling
  useEffect(() => {
    const word = SUBTITLES[subtitleIdx]
    let charIdx = 0
    setDisplayedSubtitle('')

    const typeInterval = setInterval(() => {
      charIdx++
      setDisplayedSubtitle(word.slice(0, charIdx))
      if (charIdx >= word.length) {
        clearInterval(typeInterval)
        timeoutRef.current = setTimeout(() => {
          setSubtitleIdx((prev) => (prev + 1) % SUBTITLES.length)
        }, 1500)
      }
    }, 80)

    return () => {
      clearInterval(typeInterval)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [subtitleIdx])

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
        background: '#0A0A0A',
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
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.35)',
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

      {/* Typewriter subtitle */}
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '12px',
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.4)',
          margin: 0,
          height: '18px',
        }}
      >
        {displayedSubtitle}
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
            fontSize: '10px',
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
            fontSize: '10px',
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
