interface LoadingScreenProps {
  progress: number
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
        gap: '24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          color: '#F2F0ED',
          letterSpacing: '-0.02em',
        }}
      >
        ANDREA AVILA
      </h1>

      <div
        style={{
          width: 'clamp(200px, 40vw, 320px)',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#FF2D9B',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}
      >
        Loading workspace...
      </p>
    </div>
  )
}
