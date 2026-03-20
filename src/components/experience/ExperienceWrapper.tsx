'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import * as Sentry from '@sentry/nextjs'
import type * as THREE from 'three'
import type { ScreenRect } from './ScreenAlignedOverlay'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { LoadingScreen } from './LoadingScreen'
import { NoiseBackground } from '../layout/NoiseBackground'
import { useAnalytics } from '../../hooks/useAnalytics'
import { PortfolioContent } from '../layout/PortfolioContent'
import { MonitorPortfolio } from '../layout/MonitorPortfolio'
import { ProjectNavigator } from '../layout/ProjectNavigator'
// Mac OS Desktop loaded as iframe in second screen

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

export type ExperienceMode = 'loading' | 'intro' | 'overview' | 'seated' | 'macbook' | 'project'

export function ExperienceWrapper() {
  const { track } = useAnalytics()
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)
  const [noWebGL, setNoWebGL] = useState(false)
  const [activeScreen, setActiveScreen] = useState<'none' | 'portfolio' | 'arcade' | 'project'>('none')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const monitorOverlayRef = useRef<HTMLDivElement>(null)
  const sceneLoadStartRef = useRef<number>(performance.now())
  const [screenBounds, setScreenBounds] = useState<{
    monitor: THREE.Vector3[]
    macbook: THREE.Vector3[]
  } | null>(null)
  const [monitorRect, setMonitorRect] = useState<ScreenRect>({ top: 0, left: 0, width: 0, height: 0 })
  const [macbookRect, setMacbookRect] = useState<ScreenRect>({ top: 0, left: 0, width: 0, height: 0 })

  const onScreenBounds = useCallback((bounds: { monitor: THREE.Vector3[]; macbook: THREE.Vector3[] }) => {
    setScreenBounds(bounds)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fix 4: Detect WebGL support early
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!gl) setNoWebGL(true)
    } catch {
      setNoWebGL(true)
    }
  }, [])

  // Fix 3: Listen for WebGL context loss on the active canvas
  useEffect(() => {
    const handler = () => {
      Sentry.captureException(new Error('WebGL context lost'), {
        tags: { component: 'ExperienceWrapper' },
      })
      setWebglFailed(true)
    }
    const canvas = document.querySelector('canvas')
    canvas?.addEventListener('webglcontextlost', handler)
    return () => canvas?.removeEventListener('webglcontextlost', handler)
  }, [sceneReady])

  // Fix 5: Auto-fallback if scene hasn't loaded within 15 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!sceneReady) setWebglFailed(true)
    }, 15000)
    return () => clearTimeout(timeout)
  }, [sceneReady])

  // Sync overlay visibility with mode
  useEffect(() => {
    if (mode === 'seated') {
      setActiveScreen('portfolio')
    }
    if (mode === 'macbook') {
      setActiveScreen('arcade')
    }
    if (mode === 'project') {
      setActiveScreen('project')
    }
  }, [mode])

  // Focus management — auto-focus monitor overlay when content becomes visible
  useEffect(() => {
    if ((activeScreen === 'portfolio' || activeScreen === 'project') && monitorOverlayRef.current) {
      setTimeout(() => {
        monitorOverlayRef.current?.focus()
      }, 200)
    }
  }, [activeScreen])

  // Escape key exits project mode
  useEffect(() => {
    if (mode !== 'project') return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitProject()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode])

  const onSceneLoaded = useCallback(() => {
    const loadTimeMs = performance.now() - sceneLoadStartRef.current
    Sentry.startSpan(
      { name: 'scene_load', op: 'resource.load', attributes: { 'scene.load_time_ms': loadTimeMs } },
      () => { /* span auto-finishes */ }
    )
    setSceneReady(true)
    track('hero_loaded')
  }, [track])
  const onEnter = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'User entered intro', level: 'info' })
    setMode('intro')
  }, [])
  const onIntroComplete = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'Intro complete — entering seated mode', level: 'info' })
    setMode('seated')
  }, [])

  const goToMacbook = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'Navigating to macbook (arcade)', level: 'info' })
    setIsTransitioning(true)
    setMode('macbook')
    track('arcade_opened')
    setTimeout(() => setIsTransitioning(false), 2500)
  }, [track])

  const goToSeated = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'Navigating to seated (portfolio)', level: 'info' })
    setIsTransitioning(true)
    setMode('seated')
    setActiveProject(null)
    setTimeout(() => setIsTransitioning(false), 2500)
  }, [])

  const goToProject = useCallback((projectId: string) => {
    Sentry.addBreadcrumb({ category: 'experience', message: `Viewing project: ${projectId}`, level: 'info' })
    setActiveProject(projectId)
    setIsTransitioning(true)
    setMode('project')
    track('project_viewed', { project: projectId })
    setTimeout(() => setIsTransitioning(false), 2000)
  }, [track])

  const navigateProject = useCallback((projectId: string) => {
    setActiveProject(projectId)
    track('project_navigated', { project: projectId })
  }, [track])

  const exitProject = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'Exiting project view', level: 'info' })
    setActiveProject(null)
    setIsTransitioning(true)
    setMode('seated')
    setTimeout(() => setIsTransitioning(false), 2000)
  }, [])

  // Track fallback activation
  const fallbackTracked = useRef(false)
  useEffect(() => {
    if ((isMobile || webglFailed || noWebGL) && !fallbackTracked.current) {
      fallbackTracked.current = true
      track('fallback_activated', { reason: isMobile ? 'mobile' : webglFailed ? 'webgl_lost' : 'no_webgl' })
    }
  }, [isMobile, webglFailed, noWebGL, track])

  // Fix 3+4: Show 2D fallback for mobile, WebGL context loss, or no WebGL support
  if (isMobile || webglFailed || noWebGL) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100dvh' }}>
        <NoiseBackground />
        <main id="main-content" style={{ position: 'relative', zIndex: 10 }}>
          <PortfolioContent />
        </main>
      </div>
    )
  }

  const isPortfolioVisible = activeScreen === 'portfolio'
  const isProjectVisible = activeScreen === 'project'
  const isArcadeVisible = activeScreen === 'arcade'
  const isMonitorActive = isPortfolioVisible || isProjectVisible

  // Clamp projected rect to fit within viewport with max size constraints
  const clampRect = (rect: ScreenRect, maxW: number, maxH: number) => {
    if (rect.width < 50) return null // no valid projection yet
    const w = Math.min(rect.width, maxW)
    const h = Math.min(rect.height, maxH)
    // Center the clamped rect within the projected area
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return {
      left: Math.max(8, cx - w / 2),
      top: Math.max(8, cy - h / 2),
      width: w,
      height: h,
    }
  }

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1080

  // Monitor grows in project mode
  const monitorMaxW = isProjectVisible ? vw * 0.65 : vw * 0.75
  const monitorMaxH = isProjectVisible ? vh * 0.75 : vh * 0.65
  const clampedMonitor = clampRect(monitorRect, monitorMaxW, monitorMaxH)
  const clampedMacbook = clampRect(macbookRect, vw * 0.65, vh * 0.55)
  const hasMonitorRect = clampedMonitor !== null
  const hasArcadeRect = clampedMacbook !== null

  return (
    <div id="main-content" style={{ position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden' }}>
      <NoiseBackground />

      {mode === 'loading' && (
        <LoadingScreen progress={loadProgress} ready={sceneReady} onEnter={onEnter} />
      )}

      {mode === 'intro' && (
        <button
          onClick={() => {
            gsap.killTweensOf('*')
            setMode('seated')
          }}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 40,
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            color: 'rgba(255,255,255,0.5)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
        >
          Skip →
        </button>
      )}

      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
        <DeskScene
          mode={mode}
          onLoaded={onSceneLoaded}
          onProgress={setLoadProgress}
          onIntroComplete={onIntroComplete}
          onScreenBounds={onScreenBounds}
          onMonitorRect={setMonitorRect}
          onMacbookRect={setMacbookRect}
          onProjectSelect={goToProject}
        />
      </div>

      {/* Transition feedback during camera movements */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            fontFamily: 'var(--font-code)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}
          aria-live="polite"
        >
          Moving...
        </div>
      )}

      {/* MONITOR OVERLAY — portfolio or project detail */}
      {mode !== 'loading' && mode !== 'intro' && (
        <div
          ref={monitorOverlayRef}
          tabIndex={-1}
          style={{
            position: 'fixed',
            ...(hasMonitorRect && clampedMonitor
              ? { top: `${clampedMonitor.top}px`, left: `${clampedMonitor.left}px`, width: `${clampedMonitor.width}px`, height: `${clampedMonitor.height}px` }
              : { top: '18%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 42vw, 520px)', height: 'clamp(200px, 50vh, 480px)' }
            ),
            zIndex: 20,
            overflow: 'hidden',
            background: '#ffffff',
            borderRadius: '2px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
            pointerEvents: isMonitorActive ? 'auto' : 'none',
            opacity: isMonitorActive ? 1 : 0,
            transition: 'opacity 1.2s ease, top 0.8s ease, left 0.8s ease, width 0.8s ease, height 0.8s ease',
          }}
        >
          <div className="monitor-scroll" style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            <MonitorPortfolio
              activeProject={activeProject}
              onExitProject={exitProject}
              onNavigateProject={navigateProject}
            />
          </div>
          {/* Nav to arcade — only shown when not in project mode */}
          {!isProjectVisible && (
            <button
              type="button"
              aria-label="Go to Arcade"
              onClick={(e) => { e.stopPropagation(); goToMacbook(); }}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                color: 'var(--color-muted)',
                cursor: 'pointer',
                padding: '6px 12px',
                background: 'rgba(26,26,26,0.05)',
                border: '1px solid rgba(26,26,26,0.12)',
                borderRadius: '4px',
                zIndex: 30,
                letterSpacing: '0.08em',
                fontWeight: 500,
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-pink)'; e.currentTarget.style.borderColor = 'var(--color-pink)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)' }}
            >
              Arcade →
            </button>
          )}
        </div>
      )}

      {/* MACBOOK OVERLAY — arcade or project navigator */}
      {mode !== 'loading' && mode !== 'intro' && (
        <div
          style={{
            position: 'fixed',
            ...(hasArcadeRect && clampedMacbook
              ? { top: `${clampedMacbook.top}px`, left: `${clampedMacbook.left}px`, width: `${clampedMacbook.width}px`, height: `${clampedMacbook.height}px` }
              : { top: '22%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 42vw, 480px)', height: 'clamp(200px, 48vh, 380px)' }
            ),
            zIndex: 20,
            overflow: 'hidden',
            background: '#0a0a0a',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
            pointerEvents: (isArcadeVisible || isProjectVisible) ? 'auto' : 'none',
            opacity: (isArcadeVisible || isProjectVisible) ? 1 : 0,
            transition: 'opacity 1.2s ease',
            display: 'flex',
            flexDirection: 'column' as const,
          }}
        >
          {isProjectVisible ? (
            <ProjectNavigator
              activeProjectId={activeProject}
              onSelect={navigateProject}
              onBack={exitProject}
            />
          ) : (
            <>
              {/* Header */}
              <div style={{
                padding: '8px 14px',
                background: '#111',
                borderBottom: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: '#555',
                flexShrink: 0,
                fontFamily: 'monospace',
              }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#febc2e' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#28c840' }} />
                </div>
                <span style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>Arcade</span>
                <button
                  type="button"
                  aria-label="Back to Portfolio"
                  onClick={goToSeated}
                  style={{ color: '#BEFF00', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', fontWeight: 600, background: 'none', border: 'none', fontFamily: 'monospace' }}
                >
                  ← Portfolio
                </button>
              </div>
              {/* Mac OS Desktop with Game Center */}
              <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
                {isArcadeVisible && (
                  <iframe
                    src="/macos-desktop/index.html"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block',
                    }}
                    title="Mac OS Desktop"
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
