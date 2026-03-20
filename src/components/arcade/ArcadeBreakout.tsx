'use client'

import { useRef, useEffect, useCallback } from 'react'

interface Props {
  active: boolean
  demo?: boolean
}

export function ArcadeBreakout({ active, demo = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const W = canvas.width
    const H = canvas.height

    let score = 0
    const ROWS = 7
    const COLS = 5
    const brickW = W / ROWS - 8
    const brickH = 16
    const brickPad = 6
    const brickOffX = (W - (ROWS * (brickW + brickPad) - brickPad)) / 2
    const brickOffY = 40

    const ball = { x: W / 2, y: H - 50, size: 6, dx: 2.5, dy: -2.5 }
    const paddle = { x: W / 2 - 35, y: H - 18, w: 70, h: 8, dx: 0 }

    const bricks: { x: number; y: number; vis: boolean }[][] = []
    for (let i = 0; i < ROWS; i++) {
      bricks[i] = []
      for (let j = 0; j < COLS; j++) {
        bricks[i][j] = {
          x: i * (brickW + brickPad) + brickOffX,
          y: j * (brickH + brickPad) + brickOffY,
          vis: true,
        }
      }
    }

    const colors = ['#FF2D9B', '#7B2FFF', '#00E5FF', '#BEFF00', '#FF6B35']
    let keys = { left: false, right: false }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!active || demo) return
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false
    }

    if (active && !demo) {
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
    }

    function update() {
      // AI demo mode
      if (demo) {
        const center = paddle.x + paddle.w / 2
        if (ball.x < center - 10) paddle.dx = -3
        else if (ball.x > center + 10) paddle.dx = 3
        else paddle.dx = 0
      } else {
        paddle.dx = keys.left ? -5 : keys.right ? 5 : 0
      }

      paddle.x += paddle.dx
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.w > W) paddle.x = W - paddle.w

      ball.x += ball.dx
      ball.y += ball.dy

      if (ball.x + ball.size > W || ball.x - ball.size < 0) ball.dx *= -1
      if (ball.y - ball.size < 0) ball.dy *= -1

      // Paddle collision
      if (ball.y + ball.size > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
        ball.dy = -Math.abs(ball.dy)
      }

      // Brick collision
      bricks.forEach((col) => {
        col.forEach((b) => {
          if (b.vis && ball.x > b.x && ball.x < b.x + brickW && ball.y > b.y && ball.y < b.y + brickH) {
            ball.dy *= -1
            b.vis = false
            score++
          }
        })
      })

      // Reset on miss
      if (ball.y + ball.size > H) {
        ball.x = W / 2
        ball.y = H - 50
        ball.dx = 2.5 * (Math.random() > 0.5 ? 1 : -1)
        ball.dy = -2.5
        score = 0
        bricks.forEach((col) => col.forEach((b) => (b.vis = true)))
      }

      // Draw
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Bricks
      bricks.forEach((col) => {
        col.forEach((b, j) => {
          if (!b.vis) return
          ctx.fillStyle = colors[j % colors.length]
          ctx.fillRect(b.x, b.y, brickW, brickH)
        })
      })

      // Ball
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      // Paddle
      ctx.fillStyle = '#BEFF00'
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h)

      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.font = '12px monospace'
      ctx.fillText(`SCORE: ${score}`, 8, 20)

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
