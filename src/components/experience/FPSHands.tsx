'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ExperienceMode } from './ExperienceWrapper'

const MODEL_PATH = '/models/cj-sitting.glb'

// Bone rotations for sitting pose (quaternion xyzw)
// CJ is in T-pose by default — we rotate bones to sit at the desk
const SITTING_POSE: Record<string, THREE.Quaternion> = {
  // Hips: tilt pelvis back slightly (sitting)
  'root hips_00': new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, 0, 0)),
  // Spine: lean slightly forward (working posture)
  'spine lower_011': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0, 0)),
  'spine middle_012': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)),
  'spine upper_013': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)),
  // Left leg: thigh down, knee bent 90°
  'leg left thigh_03': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, 0.1, 0.1)),
  'leg left knee_04': new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.5, 0, 0)),
  'leg left ankle_05': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)),
  // Right leg: same
  'leg right thigh_07': new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, -0.1, -0.1)),
  'leg right knee_08': new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.5, 0, 0)),
  'leg right ankle_09': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)),
  // Left arm: resting on desk
  'arm left shoulder 1_038': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, -1.2)),
  'arm left shoulder 2_039': new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
  'arm left elbow_040': new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.8, 0)),
  'arm left wrist_041': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0)),
  // Right arm: resting on desk
  'arm right shoulder 1_048': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, 0, 1.2)),
  'arm right shoulder 2_049': new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
  'arm right elbow_050': new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.8, 0)),
  'arm right wrist_051': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0)),
  // Head: looking slightly down at desk
  'head neck lower_014': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0, 0)),
  'head neck upper_015': new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)),
}

interface FPSHandsProps {
  mode: ExperienceMode
  hovered: string | null
  grabbing: boolean
}

export function FPSHands({ mode, hovered, grabbing }: FPSHandsProps) {
  const { scene } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const bonesRef = useRef<Map<string, THREE.Bone>>(new Map())
  const fadeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const bobPhase = useRef(0)
  const poseApplied = useRef(false)

  // Only visible in overview (exploring desk)
  const visible = mode === 'overview'

  // Track mouse
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Collect bones and apply sitting pose
  useEffect(() => {
    if (poseApplied.current) return
    const bones = new Map<string, THREE.Bone>()

    scene.traverse((child) => {
      if (child instanceof THREE.Bone) {
        bones.set(child.name, child)
      }
      // Hide head (first person — you don't see your own head)
      if (child instanceof THREE.Mesh && child.name === 'Object001_head_0') {
        child.visible = false
      }
    })

    bonesRef.current = bones

    // Apply sitting pose
    for (const [boneName, quat] of Object.entries(SITTING_POSE)) {
      const bone = bones.get(boneName)
      if (bone) {
        bone.quaternion.copy(quat)
      }
    }

    poseApplied.current = true
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Fade
    const target = visible ? 1 : 0
    fadeRef.current += (target - fadeRef.current) * 3 * delta
    if (fadeRef.current < 0.01 && !visible) {
      groupRef.current.visible = false
      return
    }
    groupRef.current.visible = true
    const fade = fadeRef.current

    // Mouse smooth
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 3 * delta
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 3 * delta

    // Subtle breathing
    bobPhase.current += delta * 0.8
    const breathe = Math.sin(bobPhase.current) * 0.03

    // Subtle head tracking following mouse
    const headBone = bonesRef.current.get('head neck upper_015')
    if (headBone) {
      headBone.quaternion.setFromEuler(new THREE.Euler(
        0.1 + smoothMouse.current.y * 0.15,
        -smoothMouse.current.x * 0.2,
        0
      ))
    }

    // Subtle spine breathing
    const spineMid = bonesRef.current.get('spine middle_012')
    if (spineMid) {
      spineMid.quaternion.setFromEuler(new THREE.Euler(0.1 + breathe, 0, 0))
    }

    // Position: sitting at desk
    // Desk edge is around Z=-5, desk surface Y=6.4
    // Character sits behind the desk, facing the monitor (positive Z)
    const slideDown = (1 - fade) * 3
    groupRef.current.position.set(0, 4.0 - slideDown, -7.5)
    groupRef.current.rotation.set(0, 0, 0)
    groupRef.current.scale.setScalar(3.2 * fade)
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
