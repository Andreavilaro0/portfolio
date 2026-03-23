'use client'

import { useEffect, useRef } from 'react'

/**
 * Background that mimics the hero's blue signal lines —
 * glowing traces with nodes, flowing through the page.
 * Only visible BELOW the hero (starts after 100vh).
 */

interface Point { x: number; y: number }

interface Trace {
  points: Point[]
  progress: number
  speed: number
  opacity: number
  fadeOut: boolean
  glowColor: string
  lineColor: string
}

function generateTrace(canvasW: number, canvasH: number): Trace {
  const points: Point[] = []
  const startX = Math.random() * canvasW
  const startY = Math.random() * canvasH
  points.push({ x: startX, y: startY })

  // Long segments with right angles — like PCB / hero signal
  const segments = 4 + Math.floor(Math.random() * 5)
  let x = startX
  let y = startY
  let horizontal = Math.random() > 0.5

  for (let i = 0; i < segments; i++) {
    const length = 80 + Math.random() * 200
    if (horizontal) {
      x += (Math.random() > 0.5 ? 1 : -1) * length
    } else {
      y += (Math.random() > 0.5 ? 1 : -1) * length
    }
    x = Math.max(10, Math.min(canvasW - 10, x))
    y = Math.max(10, Math.min(canvasH - 10, y))
    points.push({ x, y })
    horizontal = !horizontal
  }

  // Mostly cyan/blue like the hero, rare accent
  const r = Math.random()
  const glowColor = r < 0.6 ? 'rgba(0,229,255,' : r < 0.8 ? 'rgba(0,160,255,' : r < 0.9 ? 'rgba(123,47,255,' : 'rgba(255,45,155,'
  const lineColor = glowColor

  return {
    points,
    progress: 0,
    speed: 0.0015 + Math.random() * 0.003,
    opacity: 1,
    fadeOut: false,
    glowColor,
    lineColor,
  }
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tracesRef = useRef<Trace[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = document.documentElement.clientWidth * dpr
      canvas.height = document.documentElement.clientHeight * dpr
      ctx!.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => document.documentElement.clientWidth
    const h = () => document.documentElement.clientHeight

    // Start with traces already partially drawn — no pop-in
    tracesRef.current = Array.from({ length: 5 }, () => {
      const t = generateTrace(w(), h())
      t.progress = 0.3 + Math.random() * 0.5
      return t
    })

    function drawTrace(trace: Trace) {
      if (!ctx) return
      const totalPoints = trace.points.length
      const currentSegment = trace.progress * (totalPoints - 1)
      const segIndex = Math.floor(currentSegment)
      const segProgress = currentSegment - segIndex

      // Build the path
      const pathPoints: Point[] = [trace.points[0]]
      for (let j = 1; j <= segIndex && j < totalPoints; j++) {
        pathPoints.push(trace.points[j])
      }
      if (segIndex < totalPoints - 1) {
        const from = trace.points[segIndex]
        const to = trace.points[segIndex + 1]
        pathPoints.push({
          x: from.x + (to.x - from.x) * segProgress,
          y: from.y + (to.y - from.y) * segProgress,
        })
      }

      if (pathPoints.length < 2) return

      const baseAlpha = trace.opacity * 0.03

      // 1. Outer glow (wide, soft)
      ctx.save()
      ctx.filter = 'blur(8px)'
      ctx.beginPath()
      ctx.strokeStyle = trace.glowColor + (baseAlpha * 3) + ')'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
      for (let j = 1; j < pathPoints.length; j++) ctx.lineTo(pathPoints[j].x, pathPoints[j].y)
      ctx.stroke()
      ctx.restore()

      // 2. Inner glow (medium)
      ctx.save()
      ctx.filter = 'blur(3px)'
      ctx.beginPath()
      ctx.strokeStyle = trace.glowColor + (baseAlpha * 5) + ')'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
      for (let j = 1; j < pathPoints.length; j++) ctx.lineTo(pathPoints[j].x, pathPoints[j].y)
      ctx.stroke()
      ctx.restore()

      // 3. Core line (sharp, thin)
      ctx.beginPath()
      ctx.strokeStyle = trace.lineColor + (baseAlpha * 8) + ')'
      ctx.lineWidth = 1.2
      ctx.lineCap = 'square'
      ctx.lineJoin = 'miter'
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
      for (let j = 1; j < pathPoints.length; j++) ctx.lineTo(pathPoints[j].x, pathPoints[j].y)
      ctx.stroke()

      // 4. Nodes at each completed corner — glowing dots
      for (let j = 0; j <= segIndex && j < totalPoints; j++) {
        const p = trace.points[j]

        // Glow
        ctx.save()
        ctx.filter = 'blur(4px)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = trace.glowColor + (baseAlpha * 6) + ')'
        ctx.fill()
        ctx.restore()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = trace.lineColor + (baseAlpha * 10) + ')'
        ctx.fill()
      }

      // 5. Moving pulse dot at the tip
      const tip = pathPoints[pathPoints.length - 1]
      ctx.save()
      ctx.filter = 'blur(3px)'
      ctx.beginPath()
      ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = trace.glowColor + (baseAlpha * 8) + ')'
      ctx.fill()
      ctx.restore()
      ctx.beginPath()
      ctx.arc(tip.x, tip.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = trace.lineColor + (baseAlpha * 12) + ')'
      ctx.fill()
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, w(), h())

      const traces = tracesRef.current

      for (let i = traces.length - 1; i >= 0; i--) {
        const trace = traces[i]

        if (!trace.fadeOut) {
          trace.progress = Math.min(1, trace.progress + trace.speed)
          if (trace.progress >= 1) trace.fadeOut = true
        } else {
          trace.opacity -= 0.004
          if (trace.opacity <= 0) {
            traces[i] = generateTrace(w(), h())
            continue
          }
        }

        drawTrace(trace)
      }

      if (traces.length < 7 && Math.random() < 0.012) {
        traces.push(generateTrace(w(), h()))
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    function handleVisibility() {
      if (document.hidden) cancelAnimationFrame(animRef.current)
      else animRef.current = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
