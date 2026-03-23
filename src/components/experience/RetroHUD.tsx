'use client'

import { DESK_OBJECTS } from './DeskInteractions'
import type { ExperienceMode } from './ExperienceWrapper'

interface RetroHUDProps {
  mode: ExperienceMode
  focusedObject: string | null
  onBack: () => void
  isTransitioning: boolean
}

export function RetroHUD({ mode, focusedObject, onBack, isTransitioning }: RetroHUDProps) {
  if (mode !== 'focused' || !focusedObject || isTransitioning) return null

  const obj = DESK_OBJECTS.find(o => o.name === focusedObject)
  const label = obj?.label ?? focusedObject
  const desc = obj?.description ?? ''

  return (
    <>
      {/* Corner brackets — holographic targeting */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
        {[
          { top: 20, left: 20, borderTop: '2px solid', borderLeft: '2px solid' },
          { top: 20, right: 20, borderTop: '2px solid', borderRight: '2px solid' },
          { bottom: 20, left: 20, borderBottom: '2px solid', borderLeft: '2px solid' },
          { bottom: 20, right: 20, borderBottom: '2px solid', borderRight: '2px solid' },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos,
            width: 28, height: 28,
            borderColor: 'rgba(0, 255, 200, 0.5)',
            animation: `holo-fade-in 0.3s ease ${i * 0.05}s both`,
          }} />
        ))}
        {/* Scan line sweeping down */}
        <div style={{
          position: 'absolute', left: 20, right: 20, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.3), transparent)',
          animation: 'holo-scan 3s linear infinite',
        }} />
      </div>

      {/* Holographic info panel — floating at bottom */}
      <div style={{
        position: 'fixed',
        bottom: 36,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        animation: 'holo-fade-in 0.4s ease both',
      }}>
        <div style={{
          background: 'rgba(10, 10, 10, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #00FFC8',
          borderRadius: 2,
          padding: '16px 36px',
          fontFamily: 'var(--font-code)',
          textAlign: 'center',
          minWidth: 280,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
            background: 'linear-gradient(90deg, transparent, #00FFC8, transparent)',
          }} />

          {/* Object name — large white text */}
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#F2F0ED',
            marginBottom: 6,
          }}>
            {label}
          </div>

          {/* Description — readable gray */}
          <div style={{
            fontSize: 12,
            color: 'rgba(242, 240, 237, 0.6)',
            letterSpacing: '0.05em',
            marginBottom: 14,
          }}>
            {desc}
          </div>

          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 18px',
              color: '#00FFC8',
              background: 'rgba(0, 255, 200, 0.08)',
              border: '1px solid rgba(0, 255, 200, 0.3)',
              borderRadius: 2,
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 200, 0.2)'
              e.currentTarget.style.borderColor = '#00FFC8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 200, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 200, 0.3)'
            }}
          >
            esc to explore
          </button>

          {/* Bottom accent line */}
          <div style={{
            position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.5), transparent)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes holo-fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes holo-scan {
          0% { top: 20px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 20px); opacity: 0; }
        }
        @keyframes holo-flicker {
          0%, 90%, 100% { opacity: 1; }
          91% { opacity: 0.7; }
          93% { opacity: 1; }
          95% { opacity: 0.8; }
          97% { opacity: 1; }
        }
        @keyframes holo-glitch {
          0%, 100% { transform: none; }
          7% { transform: translateX(-2px) skewX(-1deg); }
          7.5% { transform: none; }
          42% { transform: translateX(1px); }
          42.5% { transform: none; }
          87% { transform: translateX(-1px) skewX(0.5deg); }
          87.5% { transform: none; }
        }
        @keyframes holo-blink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}

/** Crosshair for seated/overview mode */
export function RetroCrosshair({ mode }: { mode: ExperienceMode }) {
  if (mode !== 'seated' && mode !== 'overview') return null

  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
      pointerEvents: 'none',
      opacity: mode === 'overview' ? 0.3 : 0.15,
    }}>
      {/* Horizontal */}
      <div style={{
        position: 'absolute',
        width: 20, height: 1,
        background: '#00FFC8',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
      {/* Vertical */}
      <div style={{
        position: 'absolute',
        width: 1, height: 20,
        background: '#00FFC8',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
    </div>
  )
}
