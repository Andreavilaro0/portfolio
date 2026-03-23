'use client'

import { useEffect, useState, useRef } from 'react'

export function HeroAssembly() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const isStandalone = typeof window !== 'undefined' && window.self === window.top
    const params = new URLSearchParams(window.location.search)
    const autostart = params.get('autostart') === 'true'

    if (isStandalone || autostart) {
      video.play().catch(() => {})
      return
    }

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'boot') {
        video?.play().catch(() => {})
        window.removeEventListener('message', handleMessage)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Show text when video hits ~35%
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const checkTime = () => {
      if (!visible && video.duration > 0 && video.currentTime > video.duration * 0.35) {
        setVisible(true)
        window.dispatchEvent(new Event('hero-text-visible'))
      }
    }

    video.addEventListener('timeupdate', checkTime)
    return () => video.removeEventListener('timeupdate', checkTime)
  }, [visible])

  return (
    <section
      id="top"
      style={{
        minHeight: '100dvh',
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Video — simple loop, no reverse */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.8,
        }}
      >
        <source src="/hero-pingpong-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/hero-pingpong.mp4" type="video/mp4" />
      </video>

      {/* Text — appears once, stays */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display, -apple-system, sans-serif)',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: '#fff',
            margin: 0,
          }}
        >
          Build systems.
          <br />
          Not pages.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-code, "SF Mono", monospace)',
            fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '24px',
          }}
        >
          Andrea Avila — Full-Stack Developer
        </p>
      </div>

      {/* Blue accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
          opacity: visible ? 0.6 : 0,
          transition: 'opacity 1.5s ease 0.5s',
        }}
      />
    </section>
  )
}
