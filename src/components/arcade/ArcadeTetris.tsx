'use client'

import { useRef, useEffect, useCallback } from 'react'

interface Props {
  active: boolean
  demo?: boolean
}

const COLS = 10
const ROWS = 20
const BLOCK = 14
const COLORS = ['#FF2D9B', '#7B2FFF', '#00E5FF', '#BEFF00', '#FF6B35', '#FFD700', '#28c840']

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0], [1, 0], [1, 1]],
  [[0, 1], [0, 1], [1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
]

export function ArcadeTetris({ active, demo = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const W = COLS * BLOCK
    const H = ROWS * BLOCK
    canvas.width = W
    canvas.height = H

    const board: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    let score = 0
    let dropCounter = 0
    let dropInterval = demo ? 150 : 500
    let lastTime = 0

    function newPiece() {
      const idx = Math.floor(Math.random() * SHAPES.length)
      return {
        shape: SHAPES[idx],
        color: idx + 1,
        x: Math.floor(COLS / 2) - 1,
        y: 0,
      }
    }

    let piece = newPiece()

    function collide(p: typeof piece, brd: number[][]) {
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
          if (p.shape[r][c]) {
            const nx = p.x + c
            const ny = p.y + r
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true
            if (ny >= 0 && brd[ny][nx]) return true
          }
        }
      }
      return false
    }

    function merge(p: typeof piece) {
      p.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val && p.y + r >= 0) board[p.y + r][p.x + c] = p.color
        })
      })
    }

    function clearLines() {
      let lines = 0
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every((v) => v > 0)) {
          board.splice(r, 1)
          board.unshift(Array(COLS).fill(0))
          lines++
          r++
        }
      }
      score += lines * 100
    }

    function drop() {
      piece.y++
      if (collide(piece, board)) {
        piece.y--
        merge(piece)
        clearLines()
        piece = newPiece()
        if (collide(piece, board)) {
          // Game over — reset
          board.forEach((row) => row.fill(0))
          score = 0
        }
      }
    }

    function rotate() {
      const rotated = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i]).reverse())
      const old = piece.shape
      piece.shape = rotated
      if (collide(piece, board)) piece.shape = old
    }

    // Demo AI
    let demoTimer = 0
    function demoAI() {
      demoTimer++
      if (demoTimer % 3 === 0) {
        const action = Math.random()
        if (action < 0.2) { piece.x--; if (collide(piece, board)) piece.x++ }
        else if (action < 0.4) { piece.x++; if (collide(piece, board)) piece.x-- }
        else if (action < 0.5) rotate()
      }
    }

    let keys = { left: false, right: false, down: false, rotate: false }
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active || demo) return
      if (e.key === 'ArrowLeft' || e.key === 'a') { piece.x--; if (collide(piece, board)) piece.x++ }
      if (e.key === 'ArrowRight' || e.key === 'd') { piece.x++; if (collide(piece, board)) piece.x-- }
      if (e.key === 'ArrowDown' || e.key === 's') drop()
      if (e.key === 'ArrowUp' || e.key === 'w') rotate()
    }

    if (active && !demo) window.addEventListener('keydown', onKeyDown)

    function update(time: number) {
      const dt = time - lastTime
      lastTime = time
      dropCounter += dt
      if (dropCounter > dropInterval) {
        drop()
        dropCounter = 0
      }
      if (demo) demoAI()

      // Draw
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK)
        }
      }

      // Board
      board.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            ctx.fillStyle = COLORS[val - 1]
            ctx.fillRect(c * BLOCK + 1, r * BLOCK + 1, BLOCK - 2, BLOCK - 2)
          }
        })
      })

      // Current piece
      piece.shape.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            ctx.fillStyle = COLORS[piece.color - 1]
            ctx.fillRect((piece.x + c) * BLOCK + 1, (piece.y + r) * BLOCK + 1, BLOCK - 2, BLOCK - 2)
          }
        })
      })

      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '10px monospace'
      ctx.fillText(`${score}`, 4, 12)

      animRef.current = requestAnimationFrame(update)
    }

    animRef.current = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('keydown', onKeyDown)
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
      width={COLS * BLOCK}
      height={ROWS * BLOCK}
      style={{ width: '100%', height: '100%', display: 'block', background: '#0a0a0a', objectFit: 'contain' }}
    />
  )
}
