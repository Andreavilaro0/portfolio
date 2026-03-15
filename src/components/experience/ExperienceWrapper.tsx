'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { LoadingScreen } from './LoadingScreen'

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

export type ExperienceMode = 'loading' | 'intro' | 'seated'

export function ExperienceWrapper() {
  const [mode, setMode] = useState<ExperienceMode>('loading')
  const [loadProgress, setLoadProgress] = useState(0)

  const onSceneLoaded = useCallback(() => {
    setMode('intro')
  }, [])

  const onIntroComplete = useCallback(() => {
    setMode('seated')
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Loading screen */}
      {mode === 'loading' && (
        <LoadingScreen progress={loadProgress} />
      )}

      {/* 3D Scene — always visible after loading */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
        }}
      >
        <DeskScene
          mode={mode}
          onLoaded={onSceneLoaded}
          onProgress={setLoadProgress}
          onIntroComplete={onIntroComplete}
        />
      </div>
    </div>
  )
}
