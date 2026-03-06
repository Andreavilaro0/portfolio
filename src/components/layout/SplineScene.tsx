'use client'

import { useState } from 'react'
import Spline from '@splinetool/react-spline'

export function SplineScene({ scene }: { scene?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', zIndex: 0 }} />
      )}
      <Spline
        scene={scene || 'https://prod.spline.design/AQwbVOvzQrArzTHZ/scene.splinecode'}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%' }}
      />
    </>
  )
}
