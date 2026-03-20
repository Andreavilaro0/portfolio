import { useEffect, useRef, useState, useCallback } from 'react'

interface FPSMonitorOptions {
  sampleInterval?: number // ms between samples (default 2000)
  lowFPSThreshold?: number // FPS below this is "low" (default 25)
  lowFPSConsecutive?: number // consecutive low samples to trigger callback (default 3)
  onLowFPS?: (avgFPS: number) => void
}

interface FPSMonitorResult {
  fps: number
  avgFPS: number
}

export function useFPSMonitor({
  sampleInterval = 2000,
  lowFPSThreshold = 25,
  lowFPSConsecutive = 3,
  onLowFPS,
}: FPSMonitorOptions = {}): FPSMonitorResult {
  const [fps, setFPS] = useState(0)
  const [avgFPS, setAvgFPS] = useState(0)

  const samplesRef = useRef<number[]>([])
  const frameCountRef = useRef(0)
  const lastSampleTimeRef = useRef(0)
  const rafIdRef = useRef(0)
  const lowStreakRef = useRef(0)
  const onLowFPSRef = useRef(onLowFPS)

  // Keep callback ref fresh without re-triggering effect
  useEffect(() => {
    onLowFPSRef.current = onLowFPS
  }, [onLowFPS])

  const tick = useCallback((now: number) => {
    frameCountRef.current++

    if (lastSampleTimeRef.current === 0) {
      lastSampleTimeRef.current = now
    }

    const elapsed = now - lastSampleTimeRef.current
    if (elapsed >= sampleInterval) {
      const currentFPS = Math.round((frameCountRef.current / elapsed) * 1000)
      frameCountRef.current = 0
      lastSampleTimeRef.current = now

      samplesRef.current.push(currentFPS)
      // Keep last 30 samples max
      if (samplesRef.current.length > 30) {
        samplesRef.current.shift()
      }

      const avg = Math.round(
        samplesRef.current.reduce((a, b) => a + b, 0) / samplesRef.current.length
      )

      setFPS(currentFPS)
      setAvgFPS(avg)

      // Check for consecutive low FPS
      if (currentFPS < lowFPSThreshold) {
        lowStreakRef.current++
        if (lowStreakRef.current >= lowFPSConsecutive) {
          onLowFPSRef.current?.(avg)
          lowStreakRef.current = 0 // reset after firing
        }
      } else {
        lowStreakRef.current = 0
      }
    }

    rafIdRef.current = requestAnimationFrame(tick)
  }, [sampleInterval, lowFPSThreshold, lowFPSConsecutive])

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [tick])

  return { fps, avgFPS }
}
