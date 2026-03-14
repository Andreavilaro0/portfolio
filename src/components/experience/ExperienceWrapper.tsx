'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LoadingScreen } from './LoadingScreen'
import { PortfolioContent } from '../layout/PortfolioContent'

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

export type ExperienceMode = 'loading' | 'intro' | 'seated' | 'transitioning' | 'portfolio'

export function ExperienceWrapper() {
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [sceneReady, setSceneReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const onSceneLoaded = useCallback(() => {
    setSceneReady(true)
    setMode('intro')
  }, [])

  const onIntroComplete = useCallback(() => {
    setMode('seated')
  }, [])

  const onEnterPortfolio = useCallback(() => {
    setMode('transitioning')
    // After transition animation, switch to portfolio
    setTimeout(() => setMode('portfolio'), 1200)
  }, [])

  const onBackToDesk = useCallback(() => {
    setMode('transitioning')
    setTimeout(() => setMode('seated'), 800)
  }, [])

  const showScene = mode !== 'portfolio'
  const showPortfolio = mode === 'portfolio' || mode === 'transitioning'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Loading screen */}
      {mode === 'loading' && (
        <LoadingScreen progress={loadProgress} />
      )}

      {/* 3D Scene */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: showScene ? 10 : -1,
          opacity: mode === 'portfolio' ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: showScene ? 'auto' : 'none',
        }}
      >
        <DeskScene
          mode={mode}
          onLoaded={onSceneLoaded}
          onProgress={setLoadProgress}
          onIntroComplete={onIntroComplete}
          onEnterPortfolio={onEnterPortfolio}
        />
      </div>

      {/* Portfolio Content */}
      <div
        style={{
          position: mode === 'portfolio' ? 'relative' : 'fixed',
          inset: mode === 'portfolio' ? undefined : 0,
          zIndex: mode === 'portfolio' ? 20 : 5,
          opacity: showPortfolio ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: mode === 'portfolio' ? 'auto' : 'none',
          overflowY: mode === 'portfolio' ? 'auto' : 'hidden',
          height: mode === 'portfolio' ? 'auto' : '100vh',
        }}
      >
        {mode === 'portfolio' && (
          <>
            <button
              onClick={onBackToDesk}
              style={{
                position: 'fixed',
                top: '24px',
                left: '24px',
                zIndex: 100,
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '3px solid var(--color-border)',
                borderRadius: '0px',
                boxShadow: '4px 4px 0px var(--color-text)',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)'
                e.currentTarget.style.boxShadow = '6px 6px 0px var(--color-text)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)'
                e.currentTarget.style.boxShadow = '4px 4px 0px var(--color-text)'
              }}
            >
              ← Back to desk
            </button>
            <PortfolioContent />
          </>
        )}
      </div>
    </div>
  )
}
