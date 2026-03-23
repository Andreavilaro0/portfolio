'use client'

/**
 * HandDrawnLine — SVG separator with irregular hand-drawn stroke.
 * 3 path variants to avoid visual repetition.
 */

const PATHS = [
  // Variant A — gentle wave
  'M0,1 C8,0.2 16,2.2 24,1 C32,-0.2 40,2 48,1.2 C56,0.4 64,2.4 72,1 C80,-0.4 88,2.2 96,1 C100,0.6 100,1 100,1',
  // Variant B — quick wobble
  'M0,1.2 C6,0 14,2.4 22,1.4 C30,0.4 36,2 44,0.8 C52,2.2 60,0 68,1.6 C76,2.4 84,0.2 92,1 C98,1.8 100,1 100,1',
  // Variant C — slow drift
  'M0,0.8 C12,2 24,0 36,1.4 C48,2.4 60,0.2 72,1.2 C84,2.2 96,0.4 100,1',
]

interface HandDrawnLineProps {
  variant?: 0 | 1 | 2
  opacity?: number
  color?: string
  style?: React.CSSProperties
}

export function HandDrawnLine({
  variant = 0,
  opacity = 0.35,
  color = 'var(--color-text)',
  style,
}: HandDrawnLineProps) {
  return (
    <svg
      viewBox="0 0 100 3"
      preserveAspectRatio="none"
      style={{
        width: '100%',
        height: '4px',
        display: 'block',
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <path
        d={PATHS[variant % PATHS.length]}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
