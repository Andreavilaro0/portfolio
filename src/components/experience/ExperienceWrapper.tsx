'use client'

import { useState, useCallback, useEffect } from 'react'
import type * as THREE from 'three'
import type { ScreenRect } from './ScreenAlignedOverlay'
import dynamic from 'next/dynamic'
import { LoadingScreen } from './LoadingScreen'
import { NoiseBackground } from '../layout/NoiseBackground'
import { PortfolioContent } from '../layout/PortfolioContent'
import { MonitorPortfolio } from '../layout/MonitorPortfolio'
// Mac OS Desktop loaded as iframe in second screen

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

export type ExperienceMode = 'loading' | 'intro' | 'overview' | 'seated' | 'macbook'

export function ExperienceWrapper() {
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [activeScreen, setActiveScreen] = useState<'none' | 'portfolio' | 'arcade'>('none')
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
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Sync overlay visibility with mode
  useEffect(() => {
    if (mode === 'seated') {
      // Delay to let camera arrive first
      const timer = setTimeout(() => setActiveScreen('portfolio'), 800)
      return () => clearTimeout(timer)
    }
    if (mode === 'macbook') {
      const timer = setTimeout(() => setActiveScreen('arcade'), 800)
      return () => clearTimeout(timer)
    }
  }, [mode])

  const onSceneLoaded = useCallback(() => setSceneReady(true), [])
  const onEnter = useCallback(() => setMode('intro'), [])
  const onIntroComplete = useCallback(() => setMode('seated'), [])

  const goToMacbook = useCallback(() => {
    setActiveScreen('none') // fade out portfolio
    setTimeout(() => setMode('macbook'), 600) // then move camera
  }, [])

  const goToSeated = useCallback(() => {
    setActiveScreen('none') // fade out arcade
    setTimeout(() => setMode('seated'), 600) // then move camera
  }, [])

  if (isMobile) {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <NoiseBackground />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <PortfolioContent />
        </div>
      </div>
    )
  }

  const isPortfolioVisible = activeScreen === 'portfolio'
  const isArcadeVisible = activeScreen === 'arcade'
  const hasMonitorRect = monitorRect.width > 50
  const hasArcadeRect = macbookRect.width > 50

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <NoiseBackground />

      {mode === 'loading' && (
        <LoadingScreen progress={loadProgress} ready={sceneReady} onEnter={onEnter} />
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
        />
      </div>

      {/* PORTFOLIO — centered, responsive, matches monitor aspect ratio */}
      {mode !== 'loading' && mode !== 'intro' && (
        <div
          style={{
            position: 'fixed',
            ...(hasMonitorRect
              ? { top: `${monitorRect.top}px`, left: `${monitorRect.left}px`, width: `${monitorRect.width}px`, height: `${monitorRect.height}px` }
              : { top: '50%', left: '50%', transform: 'translate(-50%, -54%)', width: 'clamp(300px, 44vw, 720px)', height: 'clamp(200px, 48vh, 480px)' }
            ),
            zIndex: 20,
            overflow: 'hidden',
            background: '#F2F0ED',
            pointerEvents: isPortfolioVisible ? 'auto' : 'none',
            opacity: isPortfolioVisible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div className="monitor-scroll" style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            <PortfolioContent />
          </div>
          {/* Nav to arcade — visible button */}
          <div
            onClick={(e) => { e.stopPropagation(); goToMacbook(); }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              color: '#fff',
              cursor: 'pointer',
              padding: '8px 16px',
              background: 'var(--color-pink)',
              borderRadius: '6px',
              zIndex: 30,
              letterSpacing: '0.08em',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(255,45,155,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,45,155,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,45,155,0.3)' }}
          >
            🎮 Arcade
          </div>
        </div>
      )}

      {/* ARCADE — centered overlay with game launcher */}
      {mode !== 'loading' && mode !== 'intro' && (
        <div
          style={{
            position: 'fixed',
            ...(hasArcadeRect
              ? { top: `${macbookRect.top}px`, left: `${macbookRect.left}px`, width: `${macbookRect.width}px`, height: `${macbookRect.height}px` }
              : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(300px, 42vw, 540px)', height: 'clamp(220px, 45vh, 380px)' }
            ),
            zIndex: 20,
            overflow: 'hidden',
            background: '#0a0a0a',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
            pointerEvents: isArcadeVisible ? 'auto' : 'none',
            opacity: isArcadeVisible ? 1 : 0,
            transition: 'opacity 0.6s ease',
            display: 'flex',
            flexDirection: 'column' as const,
          }}
        >
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
            <span
              onClick={goToSeated}
              style={{ color: '#BEFF00', fontSize: '9px', cursor: 'pointer' }}
            >
              ← Portfolio
            </span>
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
        </div>
      )}
    </div>
  )
}
