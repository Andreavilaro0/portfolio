'use client'

import type { ExperienceMode } from './ExperienceWrapper'

export function RetroFocusOverlay({ mode }: { mode: ExperienceMode }) {
  const active = mode === 'focused'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 25,
      pointerEvents: 'none',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Holographic cyan tint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0, 255, 200, 0.025)',
        mixBlendMode: 'screen',
      }} />
      {/* Subtle scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,200,0.015) 3px, rgba(0,255,200,0.015) 4px)',
        backgroundSize: '100% 4px',
      }} />
      {/* Vignette edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
      }} />
    </div>
  )
}
