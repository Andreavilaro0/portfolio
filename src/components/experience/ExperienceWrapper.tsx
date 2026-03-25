'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import * as Sentry from '@sentry/nextjs'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { LoadingScreen } from './LoadingScreen'
import { NoiseBackground } from '../layout/NoiseBackground'
import { useAnalytics } from '../../hooks/useAnalytics'
import { PortfolioContent } from '../layout/PortfolioContent'
import { SketchbookViewer } from './SketchbookViewer'
import { RetroFocusOverlay } from './RetroFocusOverlay'
import { RetroHUD, RetroCrosshair } from './RetroHUD'
import { GameHUD } from './GameHUD'
import { useAudio } from '../../hooks/useAudio'

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

export type ExperienceMode = 'loading' | 'intro' | 'overview' | 'seated' | 'project' | 'focused' | 'sketchbook'

export function ExperienceWrapper() {
  const { track } = useAnalytics()
  const audio = useAudio()
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)
  const [noWebGL, setNoWebGL] = useState(false)
  const [activeScreen, setActiveScreen] = useState<'none' | 'portfolio' | 'project'>('none')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [focusedObject, setFocusedObject] = useState<string | null>(null)
  const [hoveredObject, setHoveredObject] = useState<string | null>(null)
  const [isGrabbing, setIsGrabbing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [clickFlash, setClickFlash] = useState(false)
  const monitorOverlayRef = useRef<HTMLDivElement>(null)
  const sceneLoadStartRef = useRef<number>(performance.now())
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Cleanup all tracked timeouts on unmount
  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
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

  // Start/stop ambient audio based on mode
  useEffect(() => {
    if (mode === 'seated') audio.startAmbient()
    if (mode === 'loading') audio.stopAmbient()
  }, [mode, audio])

  const handleToggleMute = useCallback(() => {
    audio.toggleMute()
    setIsMuted(prev => !prev)
  }, [audio])

  // Sync overlay visibility with mode
  useEffect(() => {
    if (mode === 'seated') {
      setActiveScreen('portfolio')
    } else if (mode === 'project') {
      setActiveScreen('project')
    } else if (mode === 'focused' || mode === 'sketchbook') {
      setActiveScreen('none')
    }
  }, [mode])

  // Focus management — auto-focus monitor overlay when content becomes visible
  useEffect(() => {
    if ((activeScreen === 'portfolio' || activeScreen === 'project') && monitorOverlayRef.current) {
      timers.current.push(setTimeout(() => {
        monitorOverlayRef.current?.focus()
      }, 200))
    }
  }, [activeScreen])

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

  const openSketchbook = useCallback(() => {
    setFocusedObject('Box003')
    setIsTransitioning(true)
    setMode('sketchbook')
    track('object_focused', { object: 'sketchbook' })
    // Shorter delay — sketchbook overlay has its own entry animation
    timers.current.push(setTimeout(() => setIsTransitioning(false), 500))
  }, [track])

  const closeSketchbook = useCallback(() => {
    setFocusedObject(null)
    setIsTransitioning(true)
    setMode('overview')
    timers.current.push(setTimeout(() => setIsTransitioning(false), 1000))
  }, [])

  const focusObject = useCallback((objectName: string) => {
    if (objectName === 'Box003') {
      openSketchbook()
      return
    }
    setFocusedObject(objectName)
    setIsTransitioning(true)
    setMode('focused')
    setClickFlash(true)
    timers.current.push(setTimeout(() => setClickFlash(false), 200))
    track('object_focused', { object: objectName })
    timers.current.push(setTimeout(() => setIsTransitioning(false), 1000))
  }, [track, openSketchbook])

  const unfocusObject = useCallback(() => {
    setFocusedObject(null)
    setIsTransitioning(true)
    setMode('overview')
    timers.current.push(setTimeout(() => setIsTransitioning(false), 1000))
  }, [])

  const goToProject = useCallback((projectId: string) => {
    Sentry.addBreadcrumb({ category: 'experience', message: `Viewing project: ${projectId}`, level: 'info' })
    setActiveProject(projectId)
    setIsTransitioning(true)
    setMode('project')
    track('project_viewed', { project: projectId })
    // FIX 4: Camera takes 0.7s — reduce dead time from 800ms to 300ms wait
    timers.current.push(setTimeout(() => setIsTransitioning(false), 300))
  }, [track])

  const exitProject = useCallback(() => {
    Sentry.addBreadcrumb({ category: 'experience', message: 'Exiting project view', level: 'info' })
    setActiveProject(null)
    setIsTransitioning(true)
    setMode('seated')
    // FIX 4: Reduced from 2000ms to 1000ms — camera animation is 0.7s
    timers.current.push(setTimeout(() => setIsTransitioning(false), 1000))
  }, [])

  // Escape key exits focused/project/sketchbook mode → back to seated
  // Declared after closeSketchbook and exitProject to avoid TDZ errors
  useEffect(() => {
    if (mode !== 'project' && mode !== 'focused' && mode !== 'sketchbook') return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mode === 'sketchbook') {
          closeSketchbook()
        } else if (mode === 'focused') {
          setFocusedObject(null)
          setIsTransitioning(true)
          setMode('overview')
          timers.current.push(setTimeout(() => setIsTransitioning(false), 1000))
        } else {
          exitProject()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mode, closeSketchbook, exitProject])

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
      <div style={{ position: 'relative', width: '100%' }}>
        <main id="main-content">
          <PortfolioContent />
        </main>
      </div>
    )
  }

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
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '12px 20px',
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

      <div style={{ position: 'fixed', inset: 0, zIndex: 10, animation: clickFlash ? 'fps-shake 0.2s ease' : 'none' }}>
        <DeskScene
          mode={mode}
          onLoaded={onSceneLoaded}
          onProgress={setLoadProgress}
          onIntroComplete={onIntroComplete}
          onProjectSelect={goToProject}
          onObjectFocus={focusObject}
          onHoverChange={setHoveredObject}
          onGrabChange={setIsGrabbing}
          playSound={audio.play}
          focusedObject={focusedObject}
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
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}
          aria-live="polite"
        >
          Moving...
        </div>
      )}

      {/* Toggle between monitor view and desk overview — pixel art style */}
      {(mode === 'seated' || mode === 'overview') && !isTransitioning && (
        <button
          onClick={() => {
            setIsTransitioning(true)
            setMode(mode === 'seated' ? 'overview' : 'seated')
            timers.current.push(setTimeout(() => setIsTransitioning(false), 2000))
          }}
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '10px 24px',
            color: '#00FFC8',
            background: 'rgba(0, 0, 0, 0.85)',
            border: '2px solid #00FFC8',
            borderRadius: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            imageRendering: 'pixelated',
            boxShadow: '4px 4px 0px rgba(0, 255, 200, 0.3), inset 0 0 0 1px rgba(0, 255, 200, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 255, 200, 0.15)'
            e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0, 255, 200, 0.5), inset 0 0 0 1px rgba(0, 255, 200, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)'
            e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0, 255, 200, 0.3), inset 0 0 0 1px rgba(0, 255, 200, 0.1)'
          }}
        >
          {mode === 'seated' ? (
            <>
              {/* Pixel arrow up */}
              <span style={{ fontSize: '14px', lineHeight: 1 }}>▲</span>
              Explore desk
            </>
          ) : (
            <>
              {/* Pixel monitor icon */}
              <span style={{ fontSize: '14px', lineHeight: 1 }}>▼</span>
              Back to screen
            </>
          )}
        </button>
      )}

      {/* Game HUD */}
      <GameHUD
        mode={mode}
        focusedObject={focusedObject}
        hoveredObject={hoveredObject}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
      />

      {/* Retro FPS overlays */}
      <RetroFocusOverlay mode={mode} />
      <RetroCrosshair mode={mode} />
      <RetroHUD mode={mode} focusedObject={focusedObject} onBack={unfocusObject} isTransitioning={isTransitioning} />

      {/* Click flash */}
      {clickFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 35,
          background: 'rgba(0, 255, 200, 0.12)',
          pointerEvents: 'none',
          animation: 'fps-flash 0.15s ease-out forwards',
        }} />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* SKETCHBOOK VIEWER — page flip book */}
      {mode === 'sketchbook' && !isTransitioning && (
        <SketchbookViewer
          onClose={closeSketchbook}
          onProjectSelect={(projectId) => {
            closeSketchbook()
            timers.current.push(setTimeout(() => goToProject(projectId), 800))
          }}
        />
      )}

      {/* Monitor portfolio now rendered inside 3D scene via <Html transform> in DeskScene */}
    </div>
  )
}
