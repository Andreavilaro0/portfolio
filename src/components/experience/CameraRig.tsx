'use client'

import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Camera positions from Blender cameras (verified 2026-03-18):
// Monitor screen center (Three.js): (0, 10.293, 2.04), size 7.2 x 4.1
// MacBook center (Three.js): (-4.633, 7.500, -1.101), size 3.05 x 2.05
const CAMERAS = {
  // Intro: starts far, high — flies IN toward the desk
  intro: {
    position: new THREE.Vector3(0, 20, -25),
    lookAt: new THREE.Vector3(0, 4, 2),
  },
  // Seated: eye-level with monitor, centered
  seated: {
    position: new THREE.Vector3(0, 10.5, -8.0),
    lookAt: new THREE.Vector3(0, 10.5, 2),
  },
  // MacBook: angled view of laptop
  macbook: {
    position: new THREE.Vector3(-4.63, 8.5, -7.5),
    lookAt: new THREE.Vector3(-4.63, 7.2, -1.1),
  },
  // Project view: closer to monitor
  project: {
    position: new THREE.Vector3(0, 10.5, -7.0),
    lookAt: new THREE.Vector3(0, 9.5, 0),
  },
}

// Midpoint for curved transition between screens (elevated arc)
const TRANSITION_MID = new THREE.Vector3(-2.3, 11.0, -5.0)
const TRANSITION_MID_LOOKAT = new THREE.Vector3(-2.3, 9.0, 0.5)

// Camera positions for each focusable object (GTA-style close-up views)
// Position = where camera goes, lookAt = where camera points
const OBJECT_CAMERAS: Record<string, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  // Monitor: zoom into screen
  'FRHIeNGciselOUD': { position: new THREE.Vector3(0, 10.5, -4.0), lookAt: new THREE.Vector3(0, 10.5, 2) },
  // Keyboard: look down at it
  'keyboard001': { position: new THREE.Vector3(0, 9.0, -3.0), lookAt: new THREE.Vector3(0, 6.7, 1) },
  // Coffee cup: close up
  'coffee_cup': { position: new THREE.Vector3(2.5, 8.5, -3.0), lookAt: new THREE.Vector3(3.0, 6.6, 1.8) },
  // F1 Car: dramatic angle
  'F1_Car': { position: new THREE.Vector3(-2.0, 8.0, -4.0), lookAt: new THREE.Vector3(-2.7, 6.3, -1.9) },
  // Skull: face to face
  'Mexican_Skull': { position: new THREE.Vector3(2.0, 8.5, -4.0), lookAt: new THREE.Vector3(2.5, 6.7, -1.5) },
  'Object_4': { position: new THREE.Vector3(2.0, 8.5, -4.0), lookAt: new THREE.Vector3(2.5, 6.7, -1.5) },
  // Zumo Robot: look at the little bot
  'Zumo_Robot': { position: new THREE.Vector3(-2.5, 8.0, -3.5), lookAt: new THREE.Vector3(-3.0, 6.5, 0.9) },
  // Leica Camera: close up
  'leica_camera': { position: new THREE.Vector3(3.5, 8.0, -3.5), lookAt: new THREE.Vector3(4.0, 6.4, -0.2) },
  // Sketchbook: look down at pages
  'Box003': { position: new THREE.Vector3(-3.0, 9.0, -3.0), lookAt: new THREE.Vector3(-3.5, 6.5, 1.0) },
  // Mouse
  'razer_mouse': { position: new THREE.Vector3(1.5, 8.5, -3.5), lookAt: new THREE.Vector3(2.0, 6.4, 1.0) },
}

interface CameraRigProps {
  mode: ExperienceMode
  onIntroComplete: () => void
  focusedObject?: string | null
}

// Quadratic bezier interpolation for curved camera paths
function quadraticBezier(
  p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number, out: THREE.Vector3
): THREE.Vector3 {
  const inv = 1 - t
  out.x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x
  out.y = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y
  out.z = inv * inv * p0.z + 2 * inv * t * p1.z + t * t * p2.z
  return out
}

export function CameraRig({ mode, onIntroComplete, focusedObject }: CameraRigProps) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const baseRotation = useRef(new THREE.Euler())
  const isAnimating = useRef(false)
  const prevMode = useRef<ExperienceMode>('loading')
  const introTween = useRef<gsap.core.Tween | null>(null)
  const tempVec = useRef(new THREE.Vector3())

  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // INTRO: cinematic crane + push-in
  // Camera starts far and high, descends smoothly while pushing toward monitor
  // Fixed lookAt = rock-solid stability, no wobble
  useEffect(() => {
    if (mode !== 'intro') return

    if (reducedMotion) {
      camera.position.copy(CAMERAS.seated.position)
      camera.lookAt(CAMERAS.seated.lookAt)
      baseRotation.current.copy(camera.rotation)
      isAnimating.current = false
      onIntroComplete()
      return
    }

    isAnimating.current = true

    // Start at intro position
    camera.position.copy(CAMERAS.intro.position)
    camera.lookAt(CAMERAS.intro.lookAt)

    const lookAtTarget = new THREE.Vector3()
    const proxy = { t: 0 }

    introTween.current = gsap.to(proxy, {
      t: 1,
      duration: 4.5,
      ease: 'power3.inOut',
      onUpdate: () => {
        const t = proxy.t
        // Position: smooth fly-in from far to seated
        camera.position.lerpVectors(CAMERAS.intro.position, CAMERAS.seated.position, t)
        // LookAt: gradually straighten — starts looking down at desk, ends at monitor
        lookAtTarget.lerpVectors(CAMERAS.intro.lookAt, CAMERAS.seated.lookAt, t)
        camera.lookAt(lookAtTarget)
      },
      onComplete: () => {
        camera.position.copy(CAMERAS.seated.position)
        camera.lookAt(CAMERAS.seated.lookAt)
        baseRotation.current.copy(camera.rotation)
        isAnimating.current = false
        introTween.current = null
        onIntroComplete()
      },
    })
  }, [mode, camera, onIntroComplete, reducedMotion])

  // SEATED ↔ MACBOOK: curved bezier path for cinematic feel
  useEffect(() => {
    if (mode === 'loading' || mode === 'intro') return

    const from = prevMode.current
    prevMode.current = mode

    if (from === 'loading' || from === 'intro') return

    const targetPreset = CAMERAS[mode as keyof typeof CAMERAS]
    if (!targetPreset) return

    isAnimating.current = true

    const startPos = camera.position.clone()
    const fromCam = CAMERAS[from as keyof typeof CAMERAS]
    const startLookAt = fromCam ? fromCam.lookAt.clone() : targetPreset.lookAt.clone()

    // Determine if we use the curved path (only seated↔macbook)
    const useCurve = (from === 'seated' && mode === 'macbook') ||
                     (from === 'macbook' && mode === 'seated')

    // Project transitions are faster and linear
    const isProjectTransition = mode === 'project' || from === 'project'

    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration: reducedMotion ? 0.3 : isProjectTransition ? 1.5 : 2.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        const t = proxy.t

        if (useCurve) {
          // Curved path through elevated midpoint
          quadraticBezier(startPos, TRANSITION_MID, targetPreset.position, t, camera.position)
          quadraticBezier(startLookAt, TRANSITION_MID_LOOKAT, targetPreset.lookAt, t, tempVec.current)
          camera.lookAt(tempVec.current)
        } else {
          camera.position.lerpVectors(startPos, targetPreset.position, t)
          const lookTarget = new THREE.Vector3().lerpVectors(startLookAt, targetPreset.lookAt, t)
          camera.lookAt(lookTarget)
        }
      },
      onComplete: () => {
        camera.position.copy(targetPreset.position)
        camera.lookAt(targetPreset.lookAt)
        baseRotation.current.copy(camera.rotation)
        isAnimating.current = false
      },
    })
  }, [mode, camera, reducedMotion])

  // FOCUSED: fly camera to specific object (GTA-style)
  useEffect(() => {
    if (mode !== 'focused' || !focusedObject) return

    const target = OBJECT_CAMERAS[focusedObject]
    if (!target) return

    isAnimating.current = true
    const startPos = camera.position.clone()
    const startLookAt = CAMERAS.seated.lookAt.clone()
    const lookAtTarget = new THREE.Vector3()
    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration: reducedMotion ? 0.3 : 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.lerpVectors(startPos, target.position, proxy.t)
        lookAtTarget.lerpVectors(startLookAt, target.lookAt, proxy.t)
        camera.lookAt(lookAtTarget)
      },
      onComplete: () => {
        camera.position.copy(target.position)
        camera.lookAt(target.lookAt)
        baseRotation.current.copy(camera.rotation)
        isAnimating.current = false
      },
    })
  }, [mode, focusedObject, camera, reducedMotion])

  // Subtle parallax — feels like moving your head
  useFrame(() => {
    if (mode !== 'seated' && mode !== 'macbook' && mode !== 'project' && mode !== 'focused') return
    if (isAnimating.current) return
    if (reducedMotion) return

    const maxRotX = mode === 'project' ? 0.006 : 0.012
    const maxRotY = mode === 'project' ? 0.009 : 0.018
    const damping = 0.03

    const targetRotX = baseRotation.current.x + mouseRef.current.y * maxRotX
    const targetRotY = baseRotation.current.y + mouseRef.current.x * maxRotY

    camera.rotation.x += (targetRotX - camera.rotation.x) * damping
    camera.rotation.y += (targetRotY - camera.rotation.y) * damping
  })

  return null
}
