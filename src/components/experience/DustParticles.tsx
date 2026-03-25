'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 60
const SPREAD = 15
const SPEED = 0.08

/**
 * Floating dust motes that drift slowly through the scene.
 * Creates atmospheric depth and a lived-in feeling.
 * Uses a single Points object for performance.
 */
export function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const frameCount = useRef(0)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Spread around the desk area
      positions[i3] = (Math.random() - 0.5) * SPREAD
      positions[i3 + 1] = Math.random() * 12 + 2 // y: 2 to 14
      positions[i3 + 2] = (Math.random() - 0.5) * SPREAD

      // Slow random velocities
      velocities[i3] = (Math.random() - 0.5) * SPEED
      velocities[i3 + 1] = (Math.random() - 0.3) * SPEED * 0.5 // slight upward bias
      velocities[i3 + 2] = (Math.random() - 0.5) * SPEED
    }

    return { positions, velocities }
  }, [])

  useFrame((_, delta) => {
    frameCount.current++
    // Process every other frame — halves GPU buffer uploads; speed compensated below
    if (frameCount.current % 2 !== 0) return
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    // Compensate for skipped frame so particles move at correct speed
    const compensatedDelta = delta * 2

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] += velocities[i3] * compensatedDelta
      pos[i3 + 1] += velocities[i3 + 1] * compensatedDelta
      pos[i3 + 2] += velocities[i3 + 2] * compensatedDelta

      // Wrap around bounds
      if (pos[i3] > SPREAD / 2) pos[i3] = -SPREAD / 2
      if (pos[i3] < -SPREAD / 2) pos[i3] = SPREAD / 2
      if (pos[i3 + 1] > 16) pos[i3 + 1] = 2
      if (pos[i3 + 1] < 2) pos[i3 + 1] = 16
      if (pos[i3 + 2] > SPREAD / 2) pos[i3 + 2] = -SPREAD / 2
      if (pos[i3 + 2] < -SPREAD / 2) pos[i3 + 2] = SPREAD / 2
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
