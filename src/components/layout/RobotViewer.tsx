'use client'

export function RobotViewer() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #0a0a0a 0%, #0d1117 50%, #0a1628 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)',
      }} />

      {/* Robot icon placeholder */}
      <div style={{
        width: '80px',
        height: '80px',
        border: '2px solid rgba(0,255,255,0.2)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'rgba(0,255,255,0.03)',
      }}>
        <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="8.5" cy="16" r="1.5" />
          <circle cx="15.5" cy="16" r="1.5" />
          <path d="M12 11V7" />
          <circle cx="12" cy="5" r="2" />
        </svg>
      </div>

      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: '16px',
        position: 'relative',
      }}>
        Zumo 32U4
      </span>

      <span style={{
        fontFamily: 'var(--font-code)',
        fontSize: '10px',
        color: 'rgba(0,255,255,0.4)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginTop: '8px',
        position: 'relative',
      }}>
        C++ / Arduino
      </span>
    </div>
  )
}
