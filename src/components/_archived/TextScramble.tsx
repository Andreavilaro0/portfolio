'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

/**
 * Terminal-style text scramble effect.
 * Characters cycle through random glyphs before resolving to the real text.
 */
export function TextScramble({
  text,
  trigger,
  speed = 30,
  style,
}: {
  text: string
  trigger: boolean
  speed?: number
  style?: React.CSSProperties
}) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!trigger) {
      setDisplay(text)
      return
    }

    let frame = 0
    const totalFrames = text.length + 10

    const tick = () => {
      const output = text
        .split('')
        .map((char, i) => {
          if (char === ' ' || char === '\n') return char
          if (i < frame - 3) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplay(output)
      frame++

      if (frame <= totalFrames) {
        frameRef.current = window.setTimeout(tick, speed)
      } else {
        setDisplay(text)
      }
    }

    tick()

    return () => {
      window.clearTimeout(frameRef.current)
    }
  }, [trigger, text, speed])

  return <span style={style}>{display}</span>
}
