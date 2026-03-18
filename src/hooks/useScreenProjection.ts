'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ScreenRect {
  top: number
  left: number
  width: number
  height: number
  visible: boolean
}

const DEFAULT_RECT: ScreenRect = { top: 0, left: 0, width: 0, height: 0, visible: false }

/**
 * Projects 4 world-space corner points onto the viewport and returns pixel-space rect.
 * corners order: [topLeft, topRight, bottomLeft, bottomRight]
 */
export function useScreenProjection(corners: THREE.Vector3[]): ScreenRect {
  const rectRef = useRef<ScreenRect>(DEFAULT_RECT)
  const { camera, gl } = useThree()
  const projected = useRef<THREE.Vector3[]>([
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
    let allVisible = true

    for (let i = 0; i < 4; i++) {
      projected.current[i].copy(corners[i])
      projected.current[i].project(camera)

      if (projected.current[i].z > 1) {
        allVisible = false
        break
      }

      const sx = (projected.current[i].x * 0.5 + 0.5) * w
      const sy = (-projected.current[i].y * 0.5 + 0.5) * h

      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }

    rectRef.current = allVisible
      ? { top: minY, left: minX, width: maxX - minX, height: maxY - minY, visible: true }
      : DEFAULT_RECT
  })

  return rectRef.current
}
