'use client'
import { useState, useEffect, useCallback } from 'react'
import { DESK_OBJECTS } from './DeskInteractions'
import type { ExperienceMode } from './ExperienceWrapper'

const ZONE_NAMES: Partial<Record<ExperienceMode, string>> = {
  overview: 'DESK',
  seated: 'WORKSTATION',
  project: 'PROJECT VIEW',
  focused: 'INSPECTING',
  sketchbook: 'SKETCHBOOK',
}

const STYLE = {
  font: '"JetBrains Mono", monospace',
  cyan: '#00E5FF',
  green: '#BEFF00',
  dim: 'rgba(255,255,255,0.3)',
  bg: 'rgba(0,0,0,0.55)',
}

interface GameHUDProps {
  mode: ExperienceMode
  focusedObject: string | null
  hoveredObject: string | null
  onToggleMute: () => void
  isMuted: boolean
}

export function GameHUD({ mode, focusedObject, hoveredObject, onToggleMute, isMuted }: GameHUDProps) {
  const [clock, setClock] = useState('')
  const [discovered, setDiscovered] = useState<Set<string>>(new Set())

  // Real-time clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  // Load discovered objects from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('discovered-objects')
      if (stored) setDiscovered(new Set(JSON.parse(stored)))
    } catch { /* ignore */ }
  }, [])

  // Track discoveries
  const trackDiscovery = useCallback((name: string) => {
    setDiscovered(prev => {
      if (prev.has(name)) return prev
      const next = new Set(prev)
      next.add(name)
      localStorage.setItem('discovered-objects', JSON.stringify([...next]))
      return next
    })
  }, [])

  // Auto-track focused objects
  useEffect(() => {
    if (focusedObject) trackDiscovery(focusedObject)
  }, [focusedObject, trackDiscovery])

  if (mode === 'loading' || mode === 'intro') return null

  const zone = ZONE_NAMES[mode] || 'DESK'
  const total = DESK_OBJECTS.length
  const found = discovered.size
  const hoveredInfo = hoveredObject ? DESK_OBJECTS.find(d => d.name === hoveredObject) : null

  return (
    <>
      {/* Top-left: Name + Zone */}
      <div style={{
        position: 'fixed', top: 16, left: 20, zIndex: 25,
        fontFamily: STYLE.font, pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: STYLE.cyan, textTransform: 'uppercase' }}>
          Andrea Avila
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: STYLE.dim, textTransform: 'uppercase', marginTop: 2 }}>
          {zone}
        </div>
      </div>

      {/* Top-right: Clock */}
      <div style={{
        position: 'fixed', top: 16, right: 20, zIndex: 25,
        fontFamily: STYLE.font, pointerEvents: 'none',
        fontSize: 11, letterSpacing: '0.15em', color: STYLE.dim,
      }}>
        {clock}
      </div>

      {/* Bottom-left: Discovery counter */}
      <div style={{
        position: 'fixed', bottom: 16, left: 20, zIndex: 25,
        fontFamily: STYLE.font, pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: found === total ? STYLE.green : STYLE.dim }}>
          {found}/{total} discovered
        </div>
      </div>

      {/* Bottom-right: Controls + Mute */}
      <div style={{
        position: 'fixed', bottom: 16, right: 20, zIndex: 25,
        fontFamily: STYLE.font, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 9, letterSpacing: '0.1em', color: STYLE.dim, pointerEvents: 'none' }}>
          MOUSE look · CLICK interact · ESC back
        </div>
        <button
          onClick={onToggleMute}
          style={{
            fontFamily: STYLE.font, fontSize: 14, lineHeight: 1,
            background: 'none', border: 'none', cursor: 'pointer',
            color: isMuted ? 'rgba(255,255,255,0.2)' : STYLE.cyan,
            padding: '4px 6px',
          }}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Center-bottom: Inspect prompt when hovering */}
      {hoveredInfo && (mode === 'overview' || mode === 'seated') && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 25, pointerEvents: 'none',
          fontFamily: STYLE.font, fontSize: 11, letterSpacing: '0.1em',
          color: STYLE.green, textTransform: 'uppercase',
          animation: 'hud-fade 0.2s ease both',
        }}>
          [click] Inspect {hoveredInfo.label}
        </div>
      )}

      {/* All-clear celebration */}
      {found === total && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 26, pointerEvents: 'none',
          fontFamily: STYLE.font, fontSize: 14, letterSpacing: '0.2em',
          color: STYLE.green, textTransform: 'uppercase',
          textShadow: `0 0 20px ${STYLE.green}`,
          animation: 'hud-complete 3s ease forwards',
        }}>
          ALL OBJECTS DISCOVERED
        </div>
      )}

      <style>{`
        @keyframes hud-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hud-complete {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          30% { transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
