'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Names must match actual GLB mesh names — each links to a page section
export const DESK_OBJECTS: {
  name: string
  label: string
  description: string
  projectId?: string
  section?: string
}[] = [
  { name: 'razer_mouse', label: 'Razer Mouse', description: 'Precision is everything' },
  { name: 'keyboard001', label: 'Keyboard', description: '4am coding sessions' },
  { name: 'coffee_cup', label: 'Coffee', description: 'Fuel from home — MX → ES', projectId: 'clara' },
  { name: 'leica_camera', label: 'Leica Camera', description: 'I capture moments too' },
  { name: 'Zumo_Robot', label: 'Zumo 32U4', description: 'National robotics finalist', projectId: 'robotics' },
  { name: 'F1_Car', label: 'F1 Car', description: 'Speed is a feature' },
  // Sketchfab objects (separate GLBs — found via global scene)
  { name: 'Mexican_Skull', label: 'Calavera', description: 'Never forget where you come from — MX' },
  { name: 'Rubiks_Cube', label: "Rubik's Cube", description: 'Every problem has a solution' },
  { name: 'Desk_Plant', label: 'Succulent', description: 'Even engineers need something alive' },
  { name: 'Box003', label: 'Sketchbook', description: 'Dibujo mis ideas antes de programarlas', section: 'work', projectId: 'sketchbook' },
]

interface DeskInteractionsProps {
  scene: THREE.Object3D
  mode: ExperienceMode
  onProjectSelect?: (projectId: string) => void
  onObjectFocus?: (objectName: string) => void
}

export function DeskInteractions({ scene, mode, onProjectSelect, onObjectFocus }: DeskInteractionsProps) {
  const [selected, setSelected] = useState<{ name: string; position: THREE.Vector3 } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const { gl, scene: rootScene } = useThree()
  const originalMaterials = useRef<Map<string, Map<THREE.Mesh, THREE.Material>>>(new Map())
  const idleGlowTweens = useRef<gsap.core.Tween[]>([])
  const hintShown = useRef(false)
  const [showHint, setShowHint] = useState(false)
  const [hitboxReady, setHitboxReady] = useState(false)

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
        currentMat.emissive = new THREE.Color(color || '#BEFF00')
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
  }, [scene])

  // Idle glow pulse for project-linked objects (discoverability)
  useEffect(() => {
    // Kill previous tweens
    idleGlowTweens.current.forEach(t => t.kill())
    idleGlowTweens.current = []

    if (mode !== 'seated') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const projectObjects = DESK_OBJECTS.filter(d => d.projectId)

    projectObjects.forEach((obj, i) => {
      if (prefersReducedMotion) {
        setEmissive(obj.name, 0.05)
        return
      }

      const proxy = { intensity: 0 }
      const tween = gsap.to(proxy, {
        intensity: 0.08,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.8,
        onUpdate: () => {
          // Don't override hover glow
          if (hovered !== obj.name) {
            setEmissive(obj.name, proxy.intensity)
          }
        },
      })
      idleGlowTweens.current.push(tween)
    })

    return () => {
      idleGlowTweens.current.forEach(t => t.kill())
      idleGlowTweens.current = []
    }
  }, [mode, setEmissive, hovered])

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

  const handlePointerOver = useCallback((name: string) => {
    if (mode !== 'overview' && mode !== 'seated') return
    gl.domElement.style.cursor = 'pointer'
    setHovered(name)
    setEmissive(name, 0.15)
  }, [gl, mode, setEmissive])

  const handlePointerOut = useCallback((name: string) => {
    gl.domElement.style.cursor = 'default'
    setHovered(null)
    setEmissive(name, 0)
  }, [gl, setEmissive])

  const handleClick = useCallback((name: string, center: THREE.Vector3) => {
    if (mode !== 'overview' && mode !== 'seated') return

    // GTA-style: fly camera to the object
    if (onObjectFocus) {
      onObjectFocus(name)
      setSelected(null)
    }
  }, [mode, onObjectFocus])

  // Find coffee cup hitbox for hint position
  const coffeeHitbox = hitboxes.find(h => h.name === 'coffee_cup')

  return (
    <>
      {hitboxes.map(({ name, center, size }) => (
        <mesh
          key={name}
          position={center}
          onClick={() => handleClick(name, center)}
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
