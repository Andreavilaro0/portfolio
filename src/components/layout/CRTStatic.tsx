'use client'

import { useEffect, useRef } from 'react'

export function CRTStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let lastGlitch = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const colors = ['#00ffff', '#ff00ff', '#ffff00']

    const draw = (timestamp: number) => {
      const { width, height } = canvas

      // Base static noise
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 40
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }

      ctx.putImageData(imageData, 0, 0)

      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1)
      }

      // Random RGB glitch bars
      if (timestamp - lastGlitch > 100 + Math.random() * 400) {
        lastGlitch = timestamp
        const numBars = 1 + Math.floor(Math.random() * 3)

        for (let b = 0; b < numBars; b++) {
          const y = Math.random() * height
          const h = 2 + Math.random() * 20
          const color = colors[Math.floor(Math.random() * colors.length)]
          const alpha = 0.08 + Math.random() * 0.15

          ctx.fillStyle = color
          ctx.globalAlpha = alpha
          ctx.fillRect(0, y, width, h)

          // Horizontal displacement
          if (Math.random() > 0.5) {
            const sliceY = Math.floor(y)
            const sliceH = Math.floor(h)
            const shift = (Math.random() - 0.5) * 30
            try {
              const slice = ctx.getImageData(0, Math.max(0, sliceY), width, Math.min(sliceH, height - sliceY))
              ctx.putImageData(slice, shift, sliceY)
            } catch {
              // ignore out-of-bounds
            }
          }
        }
        ctx.globalAlpha = 1
      }

      // Occasional big flash
      if (Math.random() > 0.995) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        ctx.fillStyle = color
        ctx.globalAlpha = 0.03
        ctx.fillRect(0, 0, width, height)
        ctx.globalAlpha = 1
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        /* CRT curvature + inner glow */
        boxShadow: 'inset 0 0 80px rgba(0,255,255,0.05), inset 0 0 20px rgba(255,0,255,0.03)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
      {/* CRT curved edges overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '8px',
          boxShadow: 'inset 0 0 120px 60px rgba(0,0,0,0.7)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
