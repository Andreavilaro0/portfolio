'use client'

import { useState, useEffect, useRef } from 'react'
import { ArcadeBreakout } from './ArcadeBreakout'
import { ArcadePong } from './ArcadePong'
import { ArcadeTetris } from './ArcadeTetris'

type GameId = 'breakout' | 'pong' | 'tetris'

const GAMES: { id: GameId; name: string; color: string; icon: string }[] = [
  { id: 'breakout', name: 'Breakout', color: '#FF2D9B', icon: '🧱' },
  { id: 'pong', name: 'Pong', color: '#BEFF00', icon: '🏓' },
  { id: 'tetris', name: 'Tetris', color: '#7B2FFF', icon: '🟦' },
]

const ATTRACT_ROTATE = 8000

interface Props {
  active: boolean
}

export function ArcadeLauncher({ active }: Props) {
  const [currentGame, setCurrentGame] = useState<GameId | null>(null)
  const [attractMode, setAttractMode] = useState(true)
  const [attractGame, setAttractGame] = useState(0)
  const lastInteraction = useRef(Date.now())

  // Attract mode rotation
  useEffect(() => {
    if (!attractMode || !active) return
    const interval = setInterval(() => {
      setAttractGame((prev) => (prev + 1) % GAMES.length)
    }, ATTRACT_ROTATE)
    return () => clearInterval(interval)
  }, [attractMode, active])

  // Idle → attract
  useEffect(() => {
    if (!active || attractMode || currentGame) return
    const check = setInterval(() => {
      if (Date.now() - lastInteraction.current > 15000) {
        setAttractMode(true)
        setCurrentGame(null)
      }
    }, 3000)
    return () => clearInterval(check)
  }, [active, attractMode, currentGame])

  const exitAttract = () => {
    lastInteraction.current = Date.now()
    setAttractMode(false)
    setCurrentGame(null)
  }

  const selectGame = (id: GameId) => {
    lastInteraction.current = Date.now()
    setAttractMode(false)
    setCurrentGame(id)
  }

  const backToMenu = () => {
    lastInteraction.current = Date.now()
    setCurrentGame(null)
  }

  if (!active) return null

  // === ATTRACT MODE — game demo running ===
  if (attractMode) {
    const game = GAMES[attractGame]
    return (
      <div onClick={exitAttract} style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}>
        {game.id === 'breakout' && <ArcadeBreakout active demo />}
        {game.id === 'pong' && <ArcadePong active demo />}
        {game.id === 'tetris' && <ArcadeTetris active demo />}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '20px 16px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#BEFF00', letterSpacing: '0.2em', animation: 'pulse 2s ease-in-out infinite' }}>
            CLICK TO PLAY
          </div>
        </div>
        <div style={{
          position: 'absolute', top: '8px', left: '12px',
          fontFamily: 'monospace', fontSize: '9px', color: game.color, letterSpacing: '0.1em', opacity: 0.7,
        }}>
          {game.icon} {game.name.toUpperCase()}
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>
    )
  }

  // === GAME ACTIVE ===
  if (currentGame) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', background: '#08080f' }}>
        {currentGame === 'breakout' && <ArcadeBreakout active />}
        {currentGame === 'pong' && <ArcadePong active />}
        {currentGame === 'tetris' && <ArcadeTetris active />}
        <button
          onClick={backToMenu}
          style={{
            position: 'absolute', top: '6px', right: '8px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '9px',
            padding: '4px 10px', borderRadius: '4px', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    )
  }

  // === macOS-STYLE LAUNCHER ===
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px',
      position: 'relative',
    }}>
      {/* Wallpaper hint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(123,47,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255,45,155,0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, monospace',
        fontSize: '13px', fontWeight: 300,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '4px',
      }}>
        Game Center
      </div>

      {/* App grid — macOS Launchpad style */}
      <div style={{
        display: 'flex', gap: '20px',
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => selectGame(g.id)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '6px',
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {/* App icon — macOS rounded square */}
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${g.color}dd, ${g.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
              boxShadow: `0 4px 12px ${g.color}33`,
            }}>
              {g.icon}
            </div>
            {/* App name */}
            <span style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '10px', color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
            }}>
              {g.name}
            </span>
          </button>
        ))}
      </div>

      {/* Dock dots — page indicator */}
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Bottom hint */}
      <div style={{
        position: 'absolute', bottom: '10px',
        fontFamily: 'monospace', fontSize: '8px',
        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
      }}>
        ARROW KEYS TO PLAY
      </div>
    </div>
  )
}
