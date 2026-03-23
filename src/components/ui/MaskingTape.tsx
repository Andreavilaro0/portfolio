interface MaskingTapeProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  rotation?: number
  color?: string
}

const DEFAULTS: Record<MaskingTapeProps['position'], { top?: string; bottom?: string; left?: string; right?: string; rotate: number }> = {
  'top-left': { top: '-10px', left: '12px', rotate: -15 },
  'top-right': { top: '-10px', right: '12px', rotate: 12 },
  'bottom-left': { bottom: '-10px', left: '12px', rotate: 10 },
  'bottom-right': { bottom: '-10px', right: '12px', rotate: -8 },
}

export function MaskingTape({
  position,
  rotation,
  color = '#F5E6C8',
}: MaskingTapeProps) {
  const pos = DEFAULTS[position]
  const rot = rotation ?? pos.rotate

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        right: pos.right,
        width: '80px',
        height: '28px',
        background: `linear-gradient(135deg, ${color}B3 0%, ${color}80 50%, ${color}B3 100%)`,
        border: '0.5px solid rgba(0, 0, 0, 0.08)',
        transform: `rotate(${rot}deg)`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}
