interface PhoneMockupProps {
  children: React.ReactNode
  color?: string
}

export function PhoneMockup({ children, color = 'rgba(255,255,255,0.2)' }: PhoneMockupProps) {
  return (
    <div
      style={{
        display: 'inline-block',
        border: `4px solid ${color}`,
        borderRadius: '12px',
        boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
        background: '#111118',
        padding: '0',
        maxWidth: '320px',
        width: '100%',
      }}
    >
      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: `3px solid ${color}`,
          background: '#0d0d14',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '9px',
            fontWeight: 700,
            color: 'var(--color-text)',
          }}
        >
          9:41
        </span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{ width: 14, height: 8, border: `2px solid ${color}` }} />
          <div
            style={{
              width: 6,
              height: 6,
              background: 'var(--color-lime)',
              border: `1px solid ${color}`,
            }}
          />
        </div>
      </div>

      {/* Screen content */}
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingBottom: '177.78%' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {children}
        </div>
      </div>

      {/* Home indicator */}
      <div
        style={{
          padding: '8px 0',
          display: 'flex',
          justifyContent: 'center',
          borderTop: `3px solid ${color}`,
          background: '#0d0d14',
        }}
      >
        <div
          style={{
            width: '40%',
            height: '4px',
            background: color,
          }}
        />
      </div>
    </div>
  )
}
