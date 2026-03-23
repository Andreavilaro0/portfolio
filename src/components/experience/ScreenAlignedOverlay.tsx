'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface ScreenRect {
  top: number
  left: number
  width: number
  height: number
}

interface ScreenProjectorProps {
  corners: THREE.Vector3[]
  onUpdate: (rect: ScreenRect) => void
  padding?: number // px of inset to shrink overlay slightly inside screen bezel
}

/**
 * R3F component (must be inside Canvas).
 * Projects 3D corners to screen pixels every frame and calls onUpdate.
 */
export function ScreenProjector({ corners, onUpdate, padding = 4 }: ScreenProjectorProps) {
  const { camera, gl } = useThree()
  const prevRect = useRef<string>('')
  const projected = useRef([
    new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(),
  ])

  useFrame(() => {
    if (corners.length !== 4) return

    const canvas = gl.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    for (let i = 0; i < 4; i++) {
      projected.current[i].copy(corners[i])
      projected.current[i].project(camera)

      if (projected.current[i].z > 1) return // behind camera

      const sx = (projected.current[i].x * 0.5 + 0.5) * w
      const sy = (-projected.current[i].y * 0.5 + 0.5) * h

      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }

    const rect: ScreenRect = {
      top: minY + padding,
      left: minX + padding,
      width: (maxX - minX) - padding * 2,
      height: (maxY - minY) - padding * 2,
    }

    // Only update if changed (avoids React re-renders every frame)
    const r = (v: number) => Math.round(v * 2) / 2 // 0.5px precision for smoother tracking
    const key = `${r(rect.top)},${r(rect.left)},${r(rect.width)},${r(rect.height)}`
    if (key !== prevRect.current) {
      prevRect.current = key
      onUpdate(rect)
    }
  })

  return null
}
