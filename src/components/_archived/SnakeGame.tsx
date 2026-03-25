'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

const CELL = 15
const COLS = 28
const ROWS = 17
const W = COLS * CELL
const H = ROWS * CELL

type Point = { x: number; y: number }
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

interface SnakeGameProps {
  active?: boolean
}

export function SnakeGame({ active = false }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const stateRef = useRef({
    snake: [{ x: 14, y: 8 }] as Point[],
    dir: 'RIGHT' as Dir,
    nextDir: 'RIGHT' as Dir,
    food: { x: 20, y: 8 } as Point,
    score: 0,
    running: false,
  })

  const spawnFood = useCallback(() => {
    const s = stateRef.current
    let food: Point
    do {
      food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
    } while (s.snake.some(p => p.x === food.x && p.y === food.y))
    s.food = food
  }, [])

  const reset = useCallback(() => {
    const s = stateRef.current
    s.snake = [{ x: 14, y: 8 }]
    s.dir = 'RIGHT'
    s.nextDir = 'RIGHT'
    s.score = 0
    s.running = true
    spawnFood()
    setScore(0)
    setGameOver(false)
    setStarted(true)
  }, [spawnFood])

  useEffect(() => {
    if (!active) return

    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (!s.running && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        e.stopPropagation()
        reset()
        return
      }
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      }
      const nd = map[e.key]
      if (!nd) return
      e.preventDefault()
      e.stopPropagation()
      const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
      if (opp[nd] !== s.dir) s.nextDir = nd
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [reset, active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const draw = () => {
      const s = stateRef.current
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      ctx.fillStyle = '#151515'
      for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
          ctx.fillRect(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 1)
        }
      }

      ctx.fillStyle = '#BEFF00'
      ctx.shadowColor = '#BEFF00'
      ctx.shadowBlur = 8
      ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4)
      ctx.shadowBlur = 0

      s.snake.forEach((p, i) => {
        const alpha = 1 - (i / s.snake.length) * 0.6
        if (i === 0) {
          ctx.fillStyle = '#BEFF00'
          ctx.shadowColor = '#BEFF00'
          ctx.shadowBlur = 6
        } else {
          ctx.fillStyle = `rgba(190, 255, 0, ${alpha})`
          ctx.shadowBlur = 0
        }
        ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2)
      })
      ctx.shadowBlur = 0
    }

    const tick = () => {
      const s = stateRef.current
      if (!s.running) return
      s.dir = s.nextDir

      const head = { ...s.snake[0] }
      if (s.dir === 'UP') head.y--
      if (s.dir === 'DOWN') head.y++
      if (s.dir === 'LEFT') head.x--
      if (s.dir === 'RIGHT') head.x++

      if (head.x < 0) head.x = COLS - 1
      if (head.x >= COLS) head.x = 0
      if (head.y < 0) head.y = ROWS - 1
      if (head.y >= ROWS) head.y = 0

      if (s.snake.some(p => p.x === head.x && p.y === head.y)) {
        s.running = false
        setGameOver(true)
        return
      }

      s.snake.unshift(head)

      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++
        setScore(s.score)
        spawnFood()
      } else {
        s.snake.pop()
      }
    }

    const interval = setInterval(() => {
      tick()
      draw()
    }, 100)

    draw()
    return () => clearInterval(interval)
  }, [spawnFood])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#08080f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 6,
        left: 12,
        fontSize: '10px',
        color: '#BEFF00',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.1em',
      }}>
        SCORE: {score}
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ imageRendering: 'pixelated' }}
      />

      {!started && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10,10,10,0.85)',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#BEFF00', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
            SNAKE
          </div>
          <div style={{ fontSize: '10px', color: '#555', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>
            Press SPACE or ENTER to start
          </div>
          <div style={{ fontSize: '9px', color: '#333', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
            WASD / Arrow keys to move
          </div>
        </div>
      )}

      {gameOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10,10,10,0.85)',
        }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#FF2D9B', fontFamily: 'JetBrains Mono, monospace' }}>
            GAME OVER
          </div>
          <div style={{ fontSize: '12px', color: '#BEFF00', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>
            Score: {score}
          </div>
          <div style={{ fontSize: '10px', color: '#555', marginTop: 8, fontFamily: 'JetBrains Mono, monospace' }}>
            Press SPACE to restart
          </div>
        </div>
      )}
    </div>
  )
}
