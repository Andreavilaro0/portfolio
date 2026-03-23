'use client'

import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Camera presets — first-person seated perspective
// The person is SITTING in a chair at roughly (0, 10.5, -8).
// All transitions = head movements + slight body leans. Never "fly" the camera.
const CAMERAS = {
  intro: {
    position: new THREE.Vector3(0, 22, -28),
    lookAt: new THREE.Vector3(0, 4, 2),
  },
  // Overview: same seat, eyes drop from monitor to desk
  overview: {
    position: new THREE.Vector3(0, 10.5, -6.5),
    lookAt: new THREE.Vector3(0, 6.5, 1),
  },
  // Seated: eye-level with monitor
  seated: {
    position: new THREE.Vector3(0, 10.5, -8.0),
    lookAt: new THREE.Vector3(0, 10.5, 2),
  },
  project: {
    position: new THREE.Vector3(0, 10.5, -7.0),
    lookAt: new THREE.Vector3(0, 9.5, 0),
  },
}

// Per-object camera: person leans forward + turns head toward the object.
// Position stays close to the chair — only slight lean/tilt.
// LookAt = actual object position on the desk.
const OBJECT_CAMERAS: Record<string, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  // Monitor — lean forward a bit to read closer
  'FRHIeNGciselOUD': { position: new THREE.Vector3(0, 10.5, -6.0), lookAt: new THREE.Vector3(0, 10.5, 2) },
  // Keyboard — look down in front, lean forward
  'keyboard.001': { position: new THREE.Vector3(0, 10.5, -5.5), lookAt: new THREE.Vector3(0, 6.7, 1) },
  // Coffee cup — lean slightly right, look down-right
  'coffee_cup': { position: new THREE.Vector3(0.8, 10.5, -5.5), lookAt: new THREE.Vector3(3.0, 6.6, 1.8) },
  // F1 Car — lean slightly left
  'F1_Car': { position: new THREE.Vector3(-0.6, 10.5, -5.5), lookAt: new THREE.Vector3(-2.7, 6.3, -1.9) },
  // Skull (Object_4) — lean slightly right
  'Object_4': { position: new THREE.Vector3(0.6, 10.5, -5.5), lookAt: new THREE.Vector3(2.5, 6.7, -1.5) },
  // Zumo Robot — lean slightly left
  'Zumo_Robot': { position: new THREE.Vector3(-0.8, 10.5, -5.5), lookAt: new THREE.Vector3(-3.0, 6.5, 0.9) },
  // Leica Camera — lean right
  'leica_camera': { position: new THREE.Vector3(1.0, 10.5, -5.5), lookAt: new THREE.Vector3(4.0, 6.4, -0.2) },
  // Sketchbook (far left) — lean left, look down-left
  'Box003': { position: new THREE.Vector3(-1.2, 10.5, -5.0), lookAt: new THREE.Vector3(-4.87, 6.3, -3.48) },
  // Mouse — lean slightly right, look down
  'razer_mouse': { position: new THREE.Vector3(0.5, 10.5, -5.5), lookAt: new THREE.Vector3(2.0, 6.4, 1.0) },
  // Mexican Skull — lean right
  'Mexican_Skull': { position: new THREE.Vector3(0.8, 10.5, -5.5), lookAt: new THREE.Vector3(3.5, 8.2, -0.5) },
  // Rubik's Cube — lean slightly left
  'Rubiks_Cube': { position: new THREE.Vector3(-0.4, 10.5, -5.5), lookAt: new THREE.Vector3(-1.5, 8.1, -2.5) },
  // Desk Plant — lean right, look at plant behind monitor
  'Desk_Plant': { position: new THREE.Vector3(1.0, 10.5, -5.5), lookAt: new THREE.Vector3(4.8, 7.0, 1.5) },
}

interface CameraRigProps {
  mode: ExperienceMode
  onIntroComplete: () => void
  focusedObject?: string | null
}

export function CameraRig({ mode, onIntroComplete, focusedObject }: CameraRigProps) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const baseLookAt = useRef(new THREE.Vector3())
  const basePosition = useRef(new THREE.Vector3())
  const isAnimating = useRef(false)
  const prevMode = useRef<ExperienceMode>('loading')

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

  // Helper: animate camera with cinematic easing
  const animateCamera = (
    targetPos: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number,
    ease: string,
    onDone?: () => void,
  ) => {
    isAnimating.current = true
    const startPos = camera.position.clone()
    const startDir = new THREE.Vector3()
    camera.getWorldDirection(startDir)
    const startLookAt = startDir.multiplyScalar(10).add(startPos.clone())

    const proxy = { t: 0 }
    const lookTarget = new THREE.Vector3()

    gsap.to(proxy, {
      t: 1,
      duration: reducedMotion ? 0.3 : duration,
      ease,
      onUpdate: () => {
        camera.position.lerpVectors(startPos, targetPos, proxy.t)
        lookTarget.lerpVectors(startLookAt, targetLookAt, proxy.t)
        camera.lookAt(lookTarget)
      },
      onComplete: () => {
        camera.position.copy(targetPos)
        camera.lookAt(targetLookAt)
        basePosition.current.copy(targetPos)
        baseLookAt.current.copy(targetLookAt)
        isAnimating.current = false
        onDone?.()
      },
    })
  }

  // ─── INTRO: Cinematic 3-stage crane shot ───
  useEffect(() => {
    if (mode !== 'intro') return

    if (reducedMotion) {
      camera.position.copy(CAMERAS.seated.position)
      camera.lookAt(CAMERAS.seated.lookAt)
      basePosition.current.copy(CAMERAS.seated.position)
      baseLookAt.current.copy(CAMERAS.seated.lookAt)
      isAnimating.current = false
      onIntroComplete()
      return
    }

    isAnimating.current = true
    camera.position.copy(CAMERAS.intro.position)
    camera.lookAt(CAMERAS.intro.lookAt)

    const lookAtTarget = new THREE.Vector3()

    // Stage 1: Crane down (high → mid) — slow, majestic
    // Stage 2: Push in toward desk — accelerating
    // Stage 3: Settle at seated with slight overshoot
    const mid = {
      position: new THREE.Vector3(0, 15, -15),
      lookAt: new THREE.Vector3(0, 8, 1),
    }

    const tl = gsap.timeline()
    const proxy = { t: 0 }

    // Stage 1: Crane down
    tl.to(proxy, {
      t: 0.4,
      duration: 2.0,
      ease: 'power2.out',
      onUpdate: () => {
        camera.position.lerpVectors(CAMERAS.intro.position, mid.position, proxy.t / 0.4)
        lookAtTarget.lerpVectors(CAMERAS.intro.lookAt, mid.lookAt, proxy.t / 0.4)
        camera.lookAt(lookAtTarget)
      },
    })

    // Stage 2: Push in
    tl.to(proxy, {
      t: 0.9,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = (proxy.t - 0.4) / 0.5
        camera.position.lerpVectors(mid.position, CAMERAS.seated.position, p)
        lookAtTarget.lerpVectors(mid.lookAt, CAMERAS.seated.lookAt, p)
        camera.lookAt(lookAtTarget)
      },
    })

    // Stage 3: Settle with overshoot
    tl.to(proxy, {
      t: 1,
      duration: 0.7,
      ease: 'back.out(1.2)',
      onUpdate: () => {
        const p = (proxy.t - 0.9) / 0.1
        // Tiny push forward then back
        const overshoot = new THREE.Vector3().copy(CAMERAS.seated.position)
        overshoot.z += (1 - p) * -0.5
        camera.position.copy(overshoot)
        camera.lookAt(CAMERAS.seated.lookAt)
      },
      onComplete: () => {
        camera.position.copy(CAMERAS.seated.position)
        camera.lookAt(CAMERAS.seated.lookAt)
        basePosition.current.copy(CAMERAS.seated.position)
        baseLookAt.current.copy(CAMERAS.seated.lookAt)
        isAnimating.current = false
        onIntroComplete()
      },
    })
  }, [mode, camera, onIntroComplete, reducedMotion])

  // ─── MODE TRANSITIONS (seated ↔ overview ↔ project) ───
  useEffect(() => {
    if (mode === 'loading' || mode === 'intro' || mode === 'focused' || mode === 'sketchbook') return

    const from = prevMode.current
    prevMode.current = mode
    if (from === 'loading' || from === 'intro') return

    const target = CAMERAS[mode as keyof typeof CAMERAS]
    if (!target) return

    const isReturnFromFocus = from === 'focused' || from === 'sketchbook'

    animateCamera(
      target.position,
      target.lookAt,
      isReturnFromFocus ? 0.8 : 1.2,
      'power2.inOut',
    )
  }, [mode, camera, reducedMotion])

  // ─── FOCUSED/SKETCHBOOK: Snap to object ───
  useEffect(() => {
    if (mode !== 'focused' && mode !== 'sketchbook') return
    if (!focusedObject) return
    prevMode.current = mode

    const target = OBJECT_CAMERAS[focusedObject]
    if (!target) return

    animateCamera(
      target.position,
      target.lookAt,
      0.7,
      'power3.out', // quick head turn — no overshoot, natural stop
    )
  }, [mode, focusedObject, camera, reducedMotion])

  // ─── MOUSE-LOOK: First person feel ───
  useFrame(() => {
    if (isAnimating.current || reducedMotion) return

    if (mode === 'overview') {
      // Subtle head movement — enough to feel alive, not enough to feel like the camera moves alone
      const lookX = baseLookAt.current.x + mouseRef.current.x * 1.2
      const lookY = baseLookAt.current.y + mouseRef.current.y * 0.6
      const lookZ = baseLookAt.current.z

      const targetLookAt = new THREE.Vector3(lookX, lookY, lookZ)
      // Smooth damping for natural head movement
      const currentDir = new THREE.Vector3()
      camera.getWorldDirection(currentDir)
      const currentLookAt = currentDir.multiplyScalar(10).add(camera.position)

      currentLookAt.lerp(targetLookAt, 0.06)
      camera.lookAt(currentLookAt)
    } else if (mode === 'seated' || mode === 'project') {
      // Minimal parallax — just enough to feel alive, not enough to interfere with iframe
      const offsetX = mouseRef.current.x * 0.15
      const offsetY = mouseRef.current.y * 0.08
      const targetLookAt = new THREE.Vector3(
        baseLookAt.current.x + offsetX,
        baseLookAt.current.y + offsetY,
        baseLookAt.current.z,
      )
      const currentDir = new THREE.Vector3()
      camera.getWorldDirection(currentDir)
      const currentLookAt = currentDir.multiplyScalar(10).add(camera.position)
      currentLookAt.lerp(targetLookAt, 0.04)
      camera.lookAt(currentLookAt)
    }
    // focused mode: no mouse movement — camera locked on object
  })

  return null
}
