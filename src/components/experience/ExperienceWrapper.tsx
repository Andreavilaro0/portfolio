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

  // Sync overlay visibility with mode — show immediately, CSS opacity handles cross-fade
  useEffect(() => {
    if (mode === 'seated') {
      setActiveScreen('portfolio')
    }
    if (mode === 'macbook') {
      setActiveScreen('arcade')
    }
  }, [mode])

  const onSceneLoaded = useCallback(() => setSceneReady(true), [])
  const onEnter = useCallback(() => setMode('intro'), [])
  const onIntroComplete = useCallback(() => setMode('seated'), [])

  const goToMacbook = useCallback(() => {
    setMode('macbook')
  }, [])

  const goToSeated = useCallback(() => {
    setMode('seated')
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
  const clampedMonitor = clampRect(monitorRect, vw * 0.75, vh * 0.65)
  const clampedMacbook = clampRect(macbookRect, vw * 0.65, vh * 0.55)
  const hasMonitorRect = clampedMonitor !== null
  const hasArcadeRect = clampedMacbook !== null

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
            ...(hasMonitorRect && clampedMonitor
              ? { top: `${clampedMonitor.top}px`, left: `${clampedMonitor.left}px`, width: `${clampedMonitor.width}px`, height: `${clampedMonitor.height}px` }
              : { top: '18%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 42vw, 520px)', height: 'clamp(200px, 50vh, 480px)' }
            ),
            zIndex: 20,
            overflow: 'hidden',
            background: '#ffffff',
            borderRadius: '2px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
            pointerEvents: isPortfolioVisible ? 'auto' : 'none',
            opacity: isPortfolioVisible ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          <div className="monitor-scroll" style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            <MonitorPortfolio />
          </div>
          {/* Nav to arcade — visible button */}
          <div
            onClick={(e) => { e.stopPropagation(); goToMacbook(); }}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              color: '#fff',
              cursor: 'pointer',
              padding: '10px 20px',
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
            pointerEvents: isArcadeVisible ? 'auto' : 'none',
            opacity: isArcadeVisible ? 1 : 0,
            transition: 'opacity 1.2s ease',
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
              style={{ color: '#BEFF00', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', fontWeight: 600 }}
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
