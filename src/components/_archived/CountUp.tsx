'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated counter that counts from 0 to target when visible.
 * Supports numeric values and values with suffixes (like "10+", "4°").
 */
export function CountUp({
  value,
  duration = 1200,
  style,
}: {
  value: string
  duration?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          observer.disconnect()

          // Extract numeric part and suffix
          const match = value.match(/^(\d+)(.*)$/)
          if (!match) {
            setDisplay(value)
            return
          }

          const target = parseInt(match[1], 10)
          const suffix = match[2]

          // Don't animate large numbers (years, etc.) — looks absurd
          if (target > 100) {
            setDisplay(value)
            return
          }

          const startTime = performance.now()

          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(eased * target)

            setDisplay(`${current}${suffix}`)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} style={style}>
      {display}
    </span>
  )
}
