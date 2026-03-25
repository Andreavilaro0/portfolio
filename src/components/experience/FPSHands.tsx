'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Hud, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import type { ExperienceMode } from './ExperienceWrapper'

const MODEL_PATH = '/models/fps-hands.glb'

// Toon gradient texture — 3 discrete shading steps for retro look
const TOON_GRADIENT = (() => {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 1
  const ctx = canvas.getContext('2d')!
  // 3 steps: shadow, mid, highlight
  ctx.fillStyle = '#444'
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = '#999'
  ctx.fillRect(1, 0, 1, 1)
  ctx.fillStyle = '#ccc'
  ctx.fillRect(2, 0, 1, 1)
  ctx.fillStyle = '#fff'
  ctx.fillRect(3, 0, 1, 1)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  return tex
})()

interface FPSHandsProps {
  mode: ExperienceMode
  hovered: string | null
  grabbing: boolean
}

function HandModel({ mode, hovered, grabbing }: FPSHandsProps) {
  const { scene, animations } = useGLTF(MODEL_PATH)
  const groupRef = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, groupRef)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const bobPhase = useRef(0)

  // Track mouse for hand sway
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Hide the AKM weapon mesh, apply toon material to arms
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'AKM_model' || child.name === 'Magazine' || child.name === 'Trigger' || child.name === 'Bolt') {
        child.visible = false
      }
      if (child instanceof THREE.Mesh && child.name === 'ArmModel') {
        // Apply toon material for retro look
        const skinColor = new THREE.Color('#c68642')
        child.material = new THREE.MeshToonMaterial({
          color: skinColor,
          gradientMap: TOON_GRADIENT,
        })
      }
    })
  }, [scene])

  // Play idle animation
  useEffect(() => {
    const idle = actions['Armature|Idle']
    if (idle) {
      idle.reset().fadeIn(0.3).play()
      idle.timeScale = 0.6 // Slower idle for calm portfolio vibe
    }
    return () => { idle?.fadeOut(0.3) }
  }, [actions])

  // Visibility based on mode
  const visible = mode === 'overview' || mode === 'seated'

  // Animate: mouse sway + idle bob
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Smooth mouse following
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 3 * delta
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 3 * delta

    // Idle bob
    bobPhase.current += delta * 1.5
    const bobY = Math.sin(bobPhase.current) * 0.02
    const bobX = Math.sin(bobPhase.current * 0.5) * 0.01

    // Hand sway follows mouse (opposite direction for natural feel)
    const swayX = -smoothMouse.current.x * 0.15
    const swayY = -smoothMouse.current.y * 0.08

    // Grab: pull hands closer
    const grabOffset = grabbing ? 0.1 : 0

    groupRef.current.position.set(
      0.3 + swayX + bobX,
      -0.45 + swayY + bobY - grabOffset,
      -0.5
    )

    // Slight rotation following mouse
    groupRef.current.rotation.y = swayX * 0.3
    groupRef.current.rotation.x = swayY * 0.2 + (grabbing ? 0.15 : 0)

    // Reach: tilt forward slightly when hovering
    if (hovered && !grabbing) {
      groupRef.current.rotation.x += 0.08
      groupRef.current.position.z = -0.45
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} scale={0.35} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export function FPSHands({ mode, hovered, grabbing }: FPSHandsProps) {
  const visible = mode === 'overview' || mode === 'seated'
  if (!visible) return null

  return (
    <Hud renderPriority={2}>
      <PerspectiveCamera makeDefault position={[0, 0, 1]} fov={65} />
      <ambientLight intensity={0.6} color="#FFF8F0" />
      <directionalLight position={[2, 3, 1]} intensity={0.8} color="#FFF8F0" />
      <HandModel mode={mode} hovered={hovered} grabbing={grabbing} />
    </Hud>
  )
}

useGLTF.preload(MODEL_PATH)
