'use client'

import dynamic from 'next/dynamic'

const SplineScene = dynamic(
  () => import('./SplineScene').then((m) => ({ default: m.SplineScene })),
  { ssr: false }
)

export function SplineShowcase() {
  return (
    <section
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(32px, 6vw, 96px)',
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          02
        </span>
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          Latest Experiment
        </span>
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          marginBottom: '12px',
        }}
      >
        3D Interactive Scene
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '32px',
          maxWidth: '400px',
        }}
      >
        Exploring 3D on the web with Spline. Interactive — try dragging it.
      </p>

      {/* 3D Scene — smaller */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <SplineScene scene="https://prod.spline.design/HplDl9LB-m10p091/scene.splinecode" />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        {['Spline', 'Three.js', 'WebGL'].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              padding: '4px 10px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
