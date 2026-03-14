interface BrowserMockupProps {
  url?: string
  children: React.ReactNode
}

export function BrowserMockup({ url = 'https://andreaavila.dev', children }: BrowserMockupProps) {
  return (
    <div
      style={{
        border: '3px solid var(--color-border)',
        borderRadius: '0px',
        boxShadow: '8px 8px 0px var(--color-text)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderBottom: '3px solid var(--color-border)',
          background: 'var(--color-bg)',
        }}
      >
        <div style={{ width: 12, height: 12, background: 'var(--color-pink)', border: '2px solid var(--color-border)' }} />
        <div style={{ width: 12, height: 12, background: 'var(--color-lime)', border: '2px solid var(--color-border)' }} />
        <div style={{ width: 12, height: 12, background: 'var(--color-violet)', border: '2px solid var(--color-border)' }} />
        <div
          style={{
            flex: 1,
            marginLeft: '8px',
            padding: '4px 12px',
            border: '2px solid var(--color-border)',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            letterSpacing: '0.03em',
            background: 'var(--color-surface)',
          }}
        >
          {url}
        </div>
      </div>

      {/* Content area */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
