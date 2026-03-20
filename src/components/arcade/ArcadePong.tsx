'use client'

import { useRef, useEffect, useCallback } from 'react'

interface Props {
  active: boolean
  demo?: boolean
}

export function ArcadePong({ active, demo = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const W = canvas.width
    const H = canvas.height
    const paddleH = 50
    const paddleW = 8
    const ballSize = 5

    const player = { y: H / 2 - paddleH / 2, score: 0 }
    const cpu = { y: H / 2 - paddleH / 2, score: 0 }
    const ball = { x: W / 2, y: H / 2, dx: 3, dy: 2 }

    let keys = { up: false, down: false }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!active || demo) return
      if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true
      if (e.key === 'ArrowDown' || e.key === 's') keys.down = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false
      if (e.key === 'ArrowDown' || e.key === 's') keys.down = false
    }

    if (active && !demo) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
    }

    function update() {
      // Player movement (or AI in demo)
      if (demo) {
        const center = player.y + paddleH / 2
        if (ball.y < center - 15) player.y -= 3
        else if (ball.y > center + 15) player.y += 3
      } else {
        if (keys.up) player.y -= 5
        if (keys.down) player.y += 5
      }
      player.y = Math.max(0, Math.min(H - paddleH, player.y))

      // CPU AI
      const cpuCenter = cpu.y + paddleH / 2
      if (ball.y < cpuCenter - 20) cpu.y -= 2.5
      else if (ball.y > cpuCenter + 20) cpu.y += 2.5
      cpu.y = Math.max(0, Math.min(H - paddleH, cpu.y))

      // Ball
      ball.x += ball.dx
      ball.y += ball.dy

      if (ball.y <= 0 || ball.y >= H) ball.dy *= -1

      // Left paddle (player)
      if (ball.x <= 20 + paddleW && ball.y > player.y && ball.y < player.y + paddleH) {
        ball.dx = Math.abs(ball.dx)
      }
      // Right paddle (cpu)
      if (ball.x >= W - 20 - paddleW && ball.y > cpu.y && ball.y < cpu.y + paddleH) {
        ball.dx = -Math.abs(ball.dx)
      }

      // Score
      if (ball.x < 0) {
        cpu.score++
        ball.x = W / 2; ball.y = H / 2
        ball.dx = 3; ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1)
      }
      if (ball.x > W) {
        player.score++
        ball.x = W / 2; ball.y = H / 2
        ball.dx = -3; ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1)
      }

      // Draw
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Center line
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // Paddles
      ctx.fillStyle = '#BEFF00'
      ctx.fillRect(15, player.y, paddleW, paddleH)
      ctx.fillStyle = '#FF2D9B'
      ctx.fillRect(W - 15 - paddleW, cpu.y, paddleW, paddleH)

      // Ball
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      // Scores
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '24px monospace'
      ctx.fillText(`${player.score}`, W / 2 - 30, 30)
      ctx.fillText(`${cpu.score}`, W / 2 + 18, 30)

      animRef.current = requestAnimationFrame(update)
    }

    update()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [active, demo])

  useEffect(() => {
    if (!active) return
    const cleanup = gameLoop()
    return cleanup
  }, [active, gameLoop])

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={300}
      style={{ width: '100%', height: '100%', display: 'block', background: '#0a0a0a' }}
    />
  )
}
