interface LaptopMockupProps {
  children: React.ReactNode
}

export function LaptopMockup({ children }: LaptopMockupProps) {
  return (
    <div style={{ width: '100%' }}>
      {/* Screen */}
      <div
        style={{
          border: '4px solid var(--color-border)',
          borderBottom: 'none',
          boxShadow: '6px -2px 0px var(--color-text)',
          overflow: 'hidden',
          background: '#1A1A1A',
          position: 'relative',
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 0',
            background: '#111',
            borderBottom: '2px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-muted)',
            }}
          />
        </div>

        {/* Screen content */}
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingBottom: '62.5%' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {children}
          </div>
        </div>
      </div>

      {/* Keyboard base */}
      <div
        style={{
          height: '14px',
          background: 'var(--color-bg)',
          border: '4px solid var(--color-border)',
          borderTop: '3px solid var(--color-border)',
          boxShadow: '6px 6px 0px var(--color-text)',
          position: 'relative',
        }}
      >
        {/* Trackpad hint */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20%',
            height: '2px',
            background: 'var(--color-border)',
          }}
        />
      </div>
    </div>
  )
}
