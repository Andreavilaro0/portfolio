interface LaptopMockupProps {
  children: React.ReactNode
}

export function LaptopMockup({ children }: LaptopMockupProps) {
  return (
    <div style={{ width: '100%' }}>
      {/* Screen */}
      <div
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
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
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
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
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
            background: 'rgba(255,255,255,0.15)',
          }}
        />
      </div>
    </div>
  )
}
