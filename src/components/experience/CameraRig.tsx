'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Camera positions extracted from GLB scene anchors (inspect-glb.mjs)
// GLB node positions (glTF exporter already handled coordinate conversion):
//   CAMERA_INTRO_START:   pos [0, 12, -12]     → looks toward desk at origin
//   CAMERA_SEATED_MAIN:   pos [0, 8.63, -2.2]  → looks toward monitor at Z=+2.6
//   CAMERA_MONITOR_FOCUS: pos [0, 8.63, -2.5]  → focused on monitor
//   monitor_main:         pos [-0.23, 8.39, 2.6]
//   desk.001:             pos [0, 3.29, 0]
const CAMERAS = {
  intro: {
    position: new THREE.Vector3(0, 12, -12),
    lookAt: new THREE.Vector3(0, 5, 0),
  },
  seated: {
    position: new THREE.Vector3(0, 9.5, -5),
    lookAt: new THREE.Vector3(0, 7, 2),
  },
  monitorFocus: {
    position: new THREE.Vector3(0, 8.63, -2.5),
    lookAt: new THREE.Vector3(-0.23, 8.39, 2.6), // monitor_main position
  },
}

interface CameraRigProps {
  mode: ExperienceMode
  onIntroComplete: () => void
}

export function CameraRig({ mode, onIntroComplete }: CameraRigProps) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const baseRotation = useRef(new THREE.Euler())
  const isAnimating = useRef(false)

  // Track mouse for look-around
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Intro animation
  useEffect(() => {
    if (mode !== 'intro') return
    isAnimating.current = true

    // Start at intro position
    camera.position.copy(CAMERAS.intro.position)
    camera.lookAt(CAMERAS.intro.lookAt)

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false
        // Save the base rotation for look-around
        baseRotation.current.copy(camera.rotation)
        onIntroComplete()
      },
    })

    // Smooth move from intro to seated
    tl.to(camera.position, {
      x: CAMERAS.seated.position.x,
      y: CAMERAS.seated.position.y,
      z: CAMERAS.seated.position.z,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Gradually shift lookAt from intro target to seated target
        const progress = tl.progress()
        const target = new THREE.Vector3().lerpVectors(
          CAMERAS.intro.lookAt,
          CAMERAS.seated.lookAt,
          progress
        )
        camera.lookAt(target)
      },
    })
  }, [mode, camera, onIntroComplete])

  // Monitor focus transition
  useEffect(() => {
    if (mode !== 'transitioning') return
    isAnimating.current = true

    gsap.to(camera.position, {
      x: CAMERAS.monitorFocus.position.x,
      y: CAMERAS.monitorFocus.position.y,
      z: CAMERAS.monitorFocus.position.z,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(CAMERAS.monitorFocus.lookAt)
      },
      onComplete: () => {
        isAnimating.current = false
      },
    })
  }, [mode, camera])

  // Subtle look-around in seated mode
  useFrame(() => {
    if (mode !== 'seated' || isAnimating.current) return

    const maxRotX = 0.08 // subtle vertical
    const maxRotY = 0.15 // subtle horizontal
    const damping = 0.05

    const targetRotX = baseRotation.current.x + mouseRef.current.y * maxRotX
    const targetRotY = baseRotation.current.y + mouseRef.current.x * maxRotY

    camera.rotation.x += (targetRotX - camera.rotation.x) * damping
    camera.rotation.y += (targetRotY - camera.rotation.y) * damping
  })

  return null
}
