'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const TOTAL_FRAMES = 120
const DESKTOP_PATH = '/hero-frames/frame-'
const MOBILE_PATH = '/hero-frames-mobile/frame-'

export function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const currentFrameIndex = useRef(0)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = framesRef.current[index]
    if (!img || !img.naturalWidth) return

    const dpr = window.devicePixelRatio || 1
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Contain fit — image fits inside canvas with padding
    const padding = w < 640 ? 24 : 48
    const availW = w - padding * 2
    const availH = h - padding * 2
    const imgRatio = img.naturalWidth / img.naturalHeight
    const availRatio = availW / availH
    let drawW, drawH, drawX, drawY
    if (imgRatio > availRatio) {
      drawW = availW
      drawH = availW / imgRatio
    } else {
      drawH = availH
      drawW = availH * imgRatio
    }
    drawX = (w - drawW) / 2
    drawY = (h - drawH) / 2
    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }, [])

  // Preload all frames — mobile uses vertical frames, desktop uses horizontal
  useEffect(() => {
    let cancelled = false
    const frames: HTMLImageElement[] = []
    let loadedCount = 0
    const basePath = isMobile ? MOBILE_PATH : DESKTOP_PATH

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `${basePath}${String(i + 1).padStart(3, '0')}.jpg`
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES && !cancelled) {
          setLoaded(true)
          drawFrame(0)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES && !cancelled) {
          setLoaded(true)
          drawFrame(0)
        }
      }
      frames[i] = img
    }
    framesRef.current = frames
    return () => { cancelled = true }
  }, [drawFrame, isMobile])

  // Scroll handler
  useEffect(() => {
    if (!loaded) return

    function handleScroll() {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const windowH = document.documentElement.clientHeight
      // Hero is in view only while we haven't scrolled past the spacer
      const visible = rect.bottom > windowH * 0.1
      setInView(visible)
      if (!visible) return

      const scrolled = -rect.top
      const scrollRange = container.offsetHeight - windowH
      if (scrollRange <= 0) return

      const p = Math.max(0, Math.min(1, scrolled / scrollRange))
      setProgress(p)
      const frameIndex = Math.round(p * (TOTAL_FRAMES - 1))

      if (frameIndex !== currentFrameIndex.current) {
        currentFrameIndex.current = frameIndex
        requestAnimationFrame(() => drawFrame(frameIndex))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loaded, drawFrame])

  // Subtitle appears after 70% scroll (name is mostly assembled)
  const showSubtitle = progress > 0.7
  const subtitleOpacity = Math.min(1, (progress - 0.7) / 0.2)

  // Detect if inside iframe — reduce hero height
  const isIframe = typeof window !== 'undefined' && window.self !== window.top

  return (
    <>
      {/* Scroll spacer */}
      <div
        ref={containerRef}
        style={{
          height: isIframe ? '200vh' : '400vh',
          position: 'relative',
          background: '#000',
        }}
      />

      {/* Fixed canvas */}
      {inView && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 1,
            pointerEvents: 'none',
            background: '#000',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
          />

          {/* Subtitle as code — fades in when name is assembled */}
          {showSubtitle && (
            <div
              style={{
                position: 'absolute',
                bottom: 'clamp(20px, 4vh, 48px)',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: subtitleOpacity,
                transition: 'opacity 0.3s ease',
                fontFamily: 'var(--font-code)',
                fontSize: 'clamp(11px, 1.2vw, 14px)',
                lineHeight: 1.7,
                whiteSpace: 'nowrap',
              }}
            >
              <div>
                <span style={{ color: '#7B2FFF' }}>&lt;</span>
                <span style={{ color: '#FF2D9B' }}>Developer</span>
                <span style={{ color: '#7B2FFF' }}> /&gt;</span>
              </div>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'// '}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>React · TypeScript · C++ · Three.js</span>
              </div>
            </div>
          )}

          {/* Scroll hint — only at the beginning */}
          {loaded && progress < 0.1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                opacity: 1 - progress * 10,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#6B6B7B',
                  margin: '0 0 8px 0',
                }}
              >
                scroll
              </p>
              <div
                style={{
                  width: '1px',
                  height: '28px',
                  background: '#6B6B7B',
                  margin: '0 auto',
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
