'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Camera positions from Blender cameras (verified 2026-03-18):
// Monitor screen center (Three.js): (0, 10.293, 2.04), size 7.2 x 4.1
// MacBook center (Three.js): (-4.633, 7.500, -1.101), size 3.05 x 2.05
const CAMERAS = {
  // Intro: very far, high and wide — dramatic fly-in to first person
  intro: {
    position: new THREE.Vector3(0, 18, -40),
    lookAt: new THREE.Vector3(0, 10.29, 2.04),
  },
  // Seated: pulled back enough so monitor fits within ~70% of viewport width
  seated: {
    position: new THREE.Vector3(0, 11.5, -7.0),
    lookAt: new THREE.Vector3(0, 10.29, 2.04),
  },
  // MacBook: from Blender Camera_MacBook, looking at macbook center
  macbook: {
    position: new THREE.Vector3(-4.63, 8.0, -6.0),
    lookAt: new THREE.Vector3(-4.63, 7.5, -1.1),
  },
}

// Midpoint for curved transition between screens (elevated arc)
const TRANSITION_MID = new THREE.Vector3(-2.3, 11.0, -5.0)
const TRANSITION_MID_LOOKAT = new THREE.Vector3(-2.3, 9.0, 0.5)

interface CameraRigProps {
  mode: ExperienceMode
  onIntroComplete: () => void
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

export function CameraRig({ mode, onIntroComplete }: CameraRigProps) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const baseRotation = useRef(new THREE.Euler())
  const isAnimating = useRef(false)
  const prevMode = useRef<ExperienceMode>('loading')
  const introTween = useRef<gsap.core.Tween | null>(null)
  const tempVec = useRef(new THREE.Vector3())

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
    isAnimating.current = true

    camera.position.copy(CAMERAS.intro.position)
    camera.lookAt(CAMERAS.intro.lookAt)

    const proxy = { t: 0 }

    introTween.current = gsap.to(proxy, {
      t: 1,
      duration: 5.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        const t = proxy.t
        // Smooth S-curve fly-in: far+high → close+seated
        camera.position.lerpVectors(CAMERAS.intro.position, CAMERAS.seated.position, t)
        // LookAt: fixed at the seated target for rock-solid stability
        camera.lookAt(CAMERAS.seated.lookAt)
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
  }, [mode, camera, onIntroComplete])

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

    // Determine if we use the curved path
    const useCurve = (from === 'seated' && mode === 'macbook') ||
                     (from === 'macbook' && mode === 'seated')

    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration: 2.2,
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
  }, [mode, camera])

  // Parallax only in macbook mode (seated has DOM overlay that can't move with camera)
  useFrame(() => {
    if (mode !== 'macbook') return
    if (isAnimating.current) return

    const maxRotX = 0.015
    const maxRotY = 0.02
    const damping = 0.02

    const targetRotX = baseRotation.current.x + mouseRef.current.y * maxRotX
    const targetRotY = baseRotation.current.y + mouseRef.current.x * maxRotY

    camera.rotation.x += (targetRotX - camera.rotation.x) * damping
    camera.rotation.y += (targetRotY - camera.rotation.y) * damping
  })

  return null
}
