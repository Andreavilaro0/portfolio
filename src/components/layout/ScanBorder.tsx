'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Section wrapper that triggers a cyan scan-line animation
 * across the top border when entering viewport.
 */
export function ScanBorder({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`scan-border${active ? ' scan-active' : ''}`}>
      {children}
    </div>
  )
}
