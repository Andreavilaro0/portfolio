'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Cached module-level color — avoids allocating a new THREE.Color on every setEmissive call
const GLOW_COLOR = new THREE.Color('#BEFF00')

// Names must match actual GLB mesh names — each links to a page section
export const DESK_OBJECTS: {
  name: string
  label: string
  description: string
  projectId?: string
  section?: string
}[] = [
  { name: 'razer_mouse', label: 'Mi Razer', description: 'Cada pixel cuenta cuando programas interfaces' },
  { name: 'keyboard001', label: 'Teclado', description: 'Donde nacen las ideas a las 4am' },
  { name: 'coffee_cup', label: 'Café de Casa', description: 'De Veracruz a Madrid — siempre con café', projectId: 'clara' },
  { name: 'leica_camera', label: 'Leica', description: 'La fotografía me enseñó a ver el detalle' },
  { name: 'Zumo_Robot', label: 'Zumo 32U4', description: 'Finalista nacional — mi primer robot autónomo', projectId: 'robotics' },
  { name: 'F1_Car', label: 'F1 Car', description: 'La ingeniería más rápida del mundo me inspira' },
  // Separate GLBs — loaded via DeskObjects.tsx
  { name: 'Mexican_Skull', label: 'Calavera', description: 'México siempre presente — nunca olvido de dónde vengo' },
  { name: 'Rubiks_Cube', label: 'Cubo Rubik', description: 'Todo problema tiene solución si lo descompones' },
  { name: 'Desk_Plant', label: 'Suculenta', description: 'Hasta las ingenieras necesitamos algo vivo cerca' },
  { name: 'Box003', label: 'Sketchbook', description: 'Primero dibujo, después programo', section: 'work', projectId: 'sketchbook' },
]

// Grabbable objects — excludes keyboard and monitor
const GRABBABLE = new Set(['coffee_cup', 'F1_Car', 'Object_4', 'Zumo_Robot', 'leica_camera', 'razer_mouse', 'Mexican_Skull', 'Rubiks_Cube', 'Desk_Plant'])

interface DeskInteractionsProps {
  scene: THREE.Object3D
  mode: ExperienceMode
  onProjectSelect?: (projectId: string) => void
  onObjectFocus?: (objectName: string) => void
  onHoverChange?: (name: string | null) => void
  onGrabChange?: (grabbing: boolean) => void
  playSound?: (name: 'hover' | 'click' | 'grab' | 'throw' | 'bounce') => void
}

export function DeskInteractions({ scene, mode, onProjectSelect, onObjectFocus, onHoverChange, onGrabChange, playSound }: DeskInteractionsProps) {
  const [selected, setSelected] = useState<{ name: string; position: THREE.Vector3 } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const { gl, camera, scene: rootScene } = useThree()
  const originalMaterials = useRef<Map<string, Map<THREE.Mesh, THREE.Material>>>(new Map())
  const idleGlowTween = useRef<gsap.core.Tween | null>(null)
  const hoveredRef = useRef<string | null>(null)
  const hintShown = useRef(false)
  const [showHint, setShowHint] = useState(false)
  const [hitboxReady, setHitboxReady] = useState(false)

  // Grab & throw state
  const [grabbedObject, setGrabbedObject] = useState<string | null>(null)
  const originalPositions = useRef<Map<string, { pos: THREE.Vector3; rot: THREE.Euler }>>(new Map())
  const mouseVelocity = useRef(new THREE.Vector2())
  const prevMouseNDC = useRef(new THREE.Vector2())

  // Keep hoveredRef in sync so idle glow tween can read current value without re-creating
  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  // Retry hitbox computation until all objects are loaded (separate GLBs load async)
  useEffect(() => {
    let attempts = 0
    const check = () => {
      const found = DESK_OBJECTS.filter(({ name }) => rootScene.getObjectByName(name)).length
      if (found >= DESK_OBJECTS.length - 1 || attempts > 20) {
        setHitboxReady(true)
      } else {
        attempts++
        setTimeout(check, 300)
      }
    }
    check()
  }, [rootScene])

  // Compute precise hitboxes — uses rootScene (global Three.js scene) so it finds
  // both main GLB objects AND separately-loaded DeskObjects (skull, rubiks, plant)
  const hitboxes = useMemo(() => {
    if (!hitboxReady) return []
    return DESK_OBJECTS.map(({ name }) => {
      // Search the entire Three.js scene graph, not just the main GLB
      const object = rootScene.getObjectByName(name)
      if (!object) return null

      const box = new THREE.Box3().setFromObject(object)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      // Add small padding for easier clicking
      size.x = Math.max(size.x, 0.5)
      size.y = Math.max(size.y, 0.5)
      size.z = Math.max(size.z, 0.5)

      return { name, center, size }
    }).filter(Boolean) as { name: string; center: THREE.Vector3; size: THREE.Vector3 }[]
  }, [rootScene, hitboxReady])

  const setEmissive = useCallback((name: string, intensity: number, color?: string) => {
    const object = rootScene.getObjectByName(name)
    if (!object) return

    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return
      const mat = child.material as THREE.MeshStandardMaterial
      if (!mat.emissive) return

      // Clone material on first hover to avoid shared material issues
      if (intensity > 0 && !originalMaterials.current.has(name)) {
        const origMap = new Map<THREE.Mesh, THREE.Material>()
        object.traverse((c) => {
          if (c instanceof THREE.Mesh && c.material) {
            origMap.set(c, c.material)
            c.material = c.material.clone()
          }
        })
        originalMaterials.current.set(name, origMap)
      }

      const currentMat = child.material as THREE.MeshStandardMaterial
      if (intensity > 0) {
        currentMat.emissive.copy(color ? new THREE.Color(color) : GLOW_COLOR)
        currentMat.emissiveIntensity = intensity
      } else {
        // Restore original material
        const origMap = originalMaterials.current.get(name)
        if (origMap) {
          origMap.forEach((origMat, mesh) => {
            mesh.material = origMat
          })
          originalMaterials.current.delete(name)
        }
      }
    })
  }, [rootScene])

  // Idle glow pulse for project-linked objects (discoverability)
  // Single shared tween drives all objects in sync — reduces N tweens to 1
  useEffect(() => {
    idleGlowTween.current?.kill()
    idleGlowTween.current = null

    if (mode !== 'seated') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const projectObjects = DESK_OBJECTS.filter(d => d.projectId)

    if (prefersReducedMotion) {
      projectObjects.forEach(obj => setEmissive(obj.name, 0.05))
      return
    }

    const proxy = { intensity: 0 }
    idleGlowTween.current = gsap.to(proxy, {
      intensity: 0.08,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        projectObjects.forEach((obj) => {
          // Don't override hover glow — read ref to avoid stale closure / dep churn
          if (hoveredRef.current !== obj.name) {
            setEmissive(obj.name, proxy.intensity)
          }
        })
      },
    })

    return () => {
      idleGlowTween.current?.kill()
      idleGlowTween.current = null
    }
  }, [mode, setEmissive])

  // First-time hint tooltip
  useEffect(() => {
    if (mode !== 'seated' || hintShown.current) return
    if (typeof window !== 'undefined' && localStorage.getItem('desk-hint-shown')) return

    hintShown.current = true
    setShowHint(true)
    localStorage.setItem('desk-hint-shown', 'true')

    const timer = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(timer)
  }, [mode])

  // Store original positions for snap-back
  useEffect(() => {
    if (!hitboxReady) return
    DESK_OBJECTS.forEach(({ name }) => {
      const obj = rootScene.getObjectByName(name)
      if (obj && !originalPositions.current.has(name)) {
        originalPositions.current.set(name, { pos: obj.position.clone(), rot: obj.rotation.clone() })
      }
    })
  }, [rootScene, hitboxReady])

  // Throw with GSAP fake physics
  const throwObject = useCallback((name: string, velocity: THREE.Vector2) => {
    const mesh = rootScene.getObjectByName(name)
    if (!mesh) return
    const orig = originalPositions.current.get(name)
    if (!orig) return

    const GRAVITY = -15
    const BOUNCE = 0.3
    const FRICTION = 0.92
    const baseY = orig.pos.y

    const vel = { x: velocity.x * 8, y: 2, z: velocity.y * 8 }
    const pos = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }

    const update = () => {
      vel.y += GRAVITY * 0.016
      vel.x *= FRICTION
      vel.z *= FRICTION
      pos.x += vel.x * 0.016
      pos.y += vel.y * 0.016
      pos.z += vel.z * 0.016

      if (pos.y <= baseY) {
        pos.y = baseY
        vel.y *= -BOUNCE
        playSound?.('bounce')
        if (Math.abs(vel.y) < 0.1) vel.y = 0
      }

      mesh.position.set(pos.x, pos.y, pos.z)
      mesh.rotation.x += vel.z * 0.05
      mesh.rotation.z -= vel.x * 0.05

      // Snap back if off desk
      const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
      if (Math.abs(pos.x - orig.pos.x) > 6 || Math.abs(pos.z - orig.pos.z) > 3) {
        gsap.ticker.remove(update)
        gsap.to(mesh.position, { x: orig.pos.x, y: orig.pos.y, z: orig.pos.z, duration: 0.5, ease: 'back.out(1.5)' })
        gsap.to(mesh.rotation, { x: orig.rot.x, y: orig.rot.y, z: orig.rot.z, duration: 0.5 })
        return
      }

      if (speed < 0.05 && Math.abs(pos.y - baseY) < 0.01) {
        gsap.ticker.remove(update)
        gsap.to(mesh.rotation, { x: orig.rot.x, z: orig.rot.z, duration: 0.3, ease: 'power2.out' })
      }
    }
    gsap.ticker.add(update)
  }, [rootScene, playSound])

  const handlePointerOver = useCallback((name: string) => {
    if (mode !== 'overview' && mode !== 'seated') return
    gl.domElement.style.cursor = 'pointer'
    setHovered(name)
    onHoverChange?.(name)
    setEmissive(name, 0.15)
    playSound?.('hover')
  }, [gl, mode, setEmissive, onHoverChange, playSound])

  const handlePointerOut = useCallback((name: string) => {
    gl.domElement.style.cursor = 'default'
    setHovered(null)
    onHoverChange?.(null)
    setEmissive(name, 0)
  }, [gl, setEmissive, onHoverChange])

  const handlePointerDown = useCallback((name: string) => {
    if (mode !== 'overview' && mode !== 'seated') return
    if (!GRABBABLE.has(name)) return

    setGrabbedObject(name)
    onGrabChange?.(true)
    playSound?.('grab')
    prevMouseNDC.current.set(0, 0)
    mouseVelocity.current.set(0, 0)
  }, [mode, onGrabChange, playSound])

  const handlePointerUp = useCallback(() => {
    if (!grabbedObject) return
    const vel = mouseVelocity.current.clone()
    if (vel.length() > 0.5) {
      playSound?.('throw')
      throwObject(grabbedObject, vel)
    }
    setGrabbedObject(null)
    onGrabChange?.(false)
  }, [grabbedObject, throwObject, onGrabChange, playSound])

  // Global pointer up listener for grab release
  useEffect(() => {
    const up = () => handlePointerUp()
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [handlePointerUp])

  // Track mouse velocity for throw
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!grabbedObject) return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseVelocity.current.set(nx - prevMouseNDC.current.x, ny - prevMouseNDC.current.y)
      prevMouseNDC.current.set(nx, ny)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [grabbedObject])

  const handleClick = useCallback((name: string, center: THREE.Vector3) => {
    if (mode !== 'overview' && mode !== 'seated') return

    playSound?.('click')
    // GTA-style: fly camera to the object
    if (onObjectFocus) {
      onObjectFocus(name)
      setSelected(null)
    }
  }, [mode, onObjectFocus, playSound])

  // Find coffee cup hitbox for hint position
  const coffeeHitbox = hitboxes.find(h => h.name === 'coffee_cup')

  return (
    <>
      {hitboxes.map(({ name, center, size }) => (
        <mesh
          key={name}
          position={center}
          onClick={() => handleClick(name, center)}
          onPointerDown={() => handlePointerDown(name)}
          onPointerOver={() => handlePointerOver(name)}
          onPointerOut={() => handlePointerOut(name)}
          visible={false}
        >
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}

      {/* Floating hover label — appears above the object when hovered */}
      {(mode === 'overview' || mode === 'seated') && hovered && (() => {
        const info = DESK_OBJECTS.find(d => d.name === hovered)
        const hbox = hitboxes.find(h => h.name === hovered)
        if (!info || !hbox) return null
        return (
          <Html
            position={[hbox.center.x, hbox.center.y + hbox.size.y / 2 + 0.6, hbox.center.z]}
            center
            distanceFactor={6}
          >
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '8px 18px',
              background: 'rgba(10, 10, 10, 0.92)',
              backdropFilter: 'blur(8px)',
              color: '#F2F0ED',
              border: '1px solid #00FFC8',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              textTransform: 'uppercase',
              animation: 'labelPopIn 0.25s ease-out both',
              textAlign: 'center',
            }}>
              {info.label}
              <div style={{
                fontSize: '10px',
                fontWeight: 400,
                color: 'rgba(242, 240, 237, 0.55)',
                letterSpacing: '0.05em',
                marginTop: '3px',
                textTransform: 'none',
              }}>
                {info.description}
              </div>
            </div>
            <style>{`
              @keyframes labelPopIn {
                0% { opacity: 0; transform: scale(0.7) translateY(6px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
          </Html>
        )
      })()}

      {/* First-time hint */}
      {showHint && coffeeHitbox && (
        <Html
          position={[coffeeHitbox.center.x, coffeeHitbox.center.y + 2, coffeeHitbox.center.z]}
          center
          distanceFactor={8}
        >
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '13px',
            letterSpacing: '0.1em',
            padding: '8px 18px',
            background: 'rgba(10, 10, 10, 0.92)',
            backdropFilter: 'blur(8px)',
            color: '#F2F0ED',
            border: '1px solid #00FFC8',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            animation: 'hintFade 4s ease forwards',
          }}>
            Click objects to inspect
          </div>
          <style>{`
            @keyframes hintFade {
              0% { opacity: 0; transform: translateY(8px); }
              15% { opacity: 1; transform: translateY(0); }
              75% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </Html>
      )}
    </>
  )
}
