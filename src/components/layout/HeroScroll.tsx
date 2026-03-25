'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const TOTAL_FRAMES = 120
const DESKTOP_PATH = '/hero-frames/frame-'
const MOBILE_PATH = '/hero-frames-mobile/frame-'
const INITIAL_BATCH = 10
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 50

export function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const currentFrameIndex = useRef(0)
  const inViewRef = useRef(true)

  // Keep inViewRef in sync so handleScroll can read it without a stale closure
  useEffect(() => {
    inViewRef.current = inView
    // FIX 1: Unload frames when hero scrolls out of view to free RAM
    if (!inView) {
      framesRef.current = []
    }
    // When inView becomes true again, the loading useEffect re-runs because
    // framesRef.current is empty — the loadImage calls will refill it.
  }, [inView])

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Canvas resize handler — only sets canvas dimensions here, NOT in drawFrame
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const applySize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = document.documentElement.clientWidth
      const h = document.documentElement.clientHeight
      sizeRef.current = { w, h, dpr }
      canvas.width = w * dpr
      canvas.height = h * dpr
    }

    applySize()
    window.addEventListener('resize', applySize)
    return () => window.removeEventListener('resize', applySize)
  }, [])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Walk backwards to find the closest loaded frame
    let img = framesRef.current[index]
    let actualIndex = index
    while (actualIndex > 0 && (!img || !img.naturalWidth)) {
      actualIndex--
      img = framesRef.current[actualIndex]
    }
    if (!img || !img.naturalWidth) return

    const { w, h, dpr } = sizeRef.current

    // Reset transform, fill with page background color, then apply DPR scale
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)

    // Cover fit — image covers entire canvas (no black borders visible)
    const imgRatio = img.naturalWidth / img.naturalHeight
    const canvasRatio = w / h
    let drawW: number, drawH: number, drawX: number, drawY: number
    if (imgRatio > canvasRatio) {
      // Image is wider — fit height, crop sides
      drawH = h
      drawW = h * imgRatio
    } else {
      // Image is taller — fit width, crop top/bottom
      drawW = w
      drawH = w / imgRatio
    }
    drawX = (w - drawW) / 2
    drawY = (h - drawH) / 2
    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }, [])

  // Progressive frame loading: first 10 frames → show immediately, then rest in batches.
  // Re-runs when inView becomes true (frames were cleared on out-of-view) or isMobile changes.
  useEffect(() => {
    // Only load when section is visible — avoids loading while scrolled past
    if (!inView) return

    // If frames are already loaded (non-empty array), nothing to do
    if (framesRef.current.length > 0 && framesRef.current[0]?.naturalWidth) return

    let cancelled = false
    const frames: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    framesRef.current = frames
    const basePath = isMobile ? MOBILE_PATH : DESKTOP_PATH

    const loadImage = (i: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = `${basePath}${String(i + 1).padStart(3, '0')}.webp`
        img.onload = () => { frames[i] = img; resolve() }
        img.onerror = () => { resolve() }
        frames[i] = img
      })
    }

    // Load frame 0 first → show immediately, then load rest in background
    loadImage(0).then(() => {
      if (cancelled) return
      setLoaded(true)
      drawFrame(0)

      // Load remaining frames in batches with breathing room for main thread
      let batchStart = 1
      const loadNextBatch = () => {
        if (cancelled || batchStart >= TOTAL_FRAMES) return
        const end = Math.min(batchStart + BATCH_SIZE, TOTAL_FRAMES)
        const batchPromises: Promise<void>[] = []
        for (let i = batchStart; i < end; i++) {
          batchPromises.push(loadImage(i))
        }
        batchStart = end
        Promise.all(batchPromises).then(() => {
          if (!cancelled) setTimeout(loadNextBatch, BATCH_DELAY_MS)
        })
      }
      loadNextBatch()
    })

    return () => { cancelled = true }
  }, [drawFrame, isMobile, inView])

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
      const wasHidden = !inViewRef.current && visible
      setInView(visible)
      if (!visible) return

      const scrolled = -rect.top
      const scrollRange = container.offsetHeight - windowH
      if (scrollRange <= 0) return

      const p = Math.max(0, Math.min(1, scrolled / scrollRange))
      setProgress(p)
      const frameIndex = Math.round(p * (TOTAL_FRAMES - 1))

      // Redraw when scrolling back into view (canvas was unmounted, so it's blank)
      if (wasHidden || frameIndex !== currentFrameIndex.current) {
        currentFrameIndex.current = frameIndex
        requestAnimationFrame(() => drawFrame(frameIndex))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loaded, drawFrame])

  // Subtitle appears after 70% scroll (name is mostly assembled)
  const showSubtitle = progress > 0.3
  const subtitleOpacity = Math.min(1, (progress - 0.3) / 0.2)

  // Detect if inside iframe — reduce hero height (use state to avoid hydration mismatch)
  const [isIframe, setIsIframe] = useState(false)
  useEffect(() => {
    setIsIframe(window.self !== window.top)
  }, [])

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

      {/* Fixed canvas — hidden via visibility+opacity instead of unmounting to preserve canvas state */}
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
          visibility: inView ? 'visible' : 'hidden',
          opacity: inView ? 1 : 0,
        }}
      >
          {/* Static image for LCP — always in DOM, hidden behind canvas once loaded.
               Never depends on framesRef so it's always available as fallback. */}
          <img
            src="/hero-frames/frame-001.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: loaded ? 0 : 1,
              transition: 'opacity 0.5s',
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.5s',
              position: 'relative',
              zIndex: 1,
            }}
          />

          {/* Minimal scroll hint — no name, just atmosphere */}

          {/* Subtitle as code — fades in at 30% scroll */}
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
                zIndex: 2,
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

          {/* Blue pulse lines — evoke the hero animation */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.15 + progress * 0.3,
          }}>
            <div style={{
              position: 'absolute',
              top: '35%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 5%, #00E5FF 30%, transparent 50%, #00E5FF 70%, transparent 95%)',
              boxShadow: '0 0 20px #00E5FF, 0 0 60px rgba(0,229,255,0.3)',
            }} />
            <div style={{
              position: 'absolute',
              top: '65%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 10%, #7B2FFF 40%, transparent 55%, #00E5FF 75%, transparent 90%)',
              boxShadow: '0 0 15px rgba(123,47,255,0.5), 0 0 40px rgba(0,229,255,0.2)',
            }} />
          </div>

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
                  fontSize: '12px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
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
    </>
  )
}
