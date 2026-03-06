'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Surveillance-style HUD frame overlay for 3D viewer containers.
 * Corner brackets draw themselves when entering viewport.
 * Supports annotation callouts with connecting lines (Blueprint Design trend).
 */
export function HudFrame({
  children,
  label,
  annotations,
}: {
  children: ReactNode
  label?: string
  annotations?: Array<{
    text: string
    x: string  // CSS position from left (e.g. '70%')
    y: string  // CSS position from top (e.g. '30%')
    align?: 'left' | 'right'
  }>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const borderColor = 'rgba(0,255,255,0.15)'

  const corner = (pos: 'tl' | 'tr' | 'bl' | 'br', delay: number) => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: visible ? '16px' : '0px',
      height: visible ? '16px' : '0px',
      pointerEvents: 'none',
      transition: `width 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, height 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    }

    const positions: Record<string, React.CSSProperties> = {
      tl: { top: 8, left: 8, borderTop: `1px solid ${borderColor}`, borderLeft: `1px solid ${borderColor}` },
      tr: { top: 8, right: 8, borderTop: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` },
      bl: { bottom: 8, left: 8, borderBottom: `1px solid ${borderColor}`, borderLeft: `1px solid ${borderColor}` },
      br: { bottom: 8, right: 8, borderBottom: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` },
    }

    return { ...base, ...positions[pos] }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {children}

      {/* Animated corner brackets */}
      <div style={corner('tl', 0)} />
      <div style={corner('tr', 100)} />
      <div style={corner('bl', 200)} />
      <div style={corner('br', 300)} />

      {/* Blueprint annotation callouts */}
      {annotations?.map((ann, i) => (
        <div
          key={ann.text}
          style={{
            position: 'absolute',
            left: ann.x,
            top: ann.y,
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.4s ease ${500 + i * 150}ms, transform 0.4s ease ${500 + i * 150}ms`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ann.align === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          {/* Dot — anchor point */}
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(0,255,255,0.4)',
              marginBottom: '4px',
              alignSelf: ann.align === 'right' ? 'flex-end' : 'flex-start',
            }}
          />
          {/* Vertical line */}
          <div
            style={{
              width: '1px',
              height: '16px',
              background: 'linear-gradient(to bottom, rgba(0,255,255,0.3), rgba(0,255,255,0.08))',
              marginBottom: '4px',
              alignSelf: ann.align === 'right' ? 'flex-end' : 'flex-start',
            }}
          />
          {/* Label text */}
          <span
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '8px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(0,255,255,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {ann.text}
          </span>
        </div>
      ))}

      {/* Label */}
      {label && (
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            fontFamily: 'var(--font-code)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(0,255,255,0.25)',
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease 400ms',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
