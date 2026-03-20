'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

// Names must match actual GLB mesh names — descriptions tell Andrea's story
const DESK_OBJECTS: {
  name: string
  label: string
  description: string
  projectId?: string
}[] = [
  { name: 'razer_mouse', label: 'Razer Mouse', description: 'Precision instrument' },
  { name: 'keyboard001', label: 'Teclado', description: '4am hackathon mode' },
  { name: 'coffee_cup', label: 'Café de Olla', description: 'Fuel from home — MX → ES', projectId: 'clara' },
  { name: 'desk_lamp001', label: 'Lámpara', description: 'Burning midnight oil since 2022' },
  { name: 'F1_Car', label: 'Aston Martin AMR23', description: 'Alonso P1 or nothing', projectId: 'robotics' },
  { name: 'Mexican_Skull', label: 'Calavera Mexicana', description: 'Día de Muertos — never forget where you come from' },
  { name: 'Zumo_Robot', label: 'Zumo 32U4', description: 'National robotics finalist', projectId: 'robotics' },
  { name: 'Gaming_Laptop', label: 'Gaming Laptop', description: 'Try the arcade →' },
]

interface DeskInteractionsProps {
  scene: THREE.Object3D
  mode: ExperienceMode
  onProjectSelect?: (projectId: string) => void
}

export function DeskInteractions({ scene, mode, onProjectSelect }: DeskInteractionsProps) {
  const [selected, setSelected] = useState<{ name: string; position: THREE.Vector3 } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const { gl } = useThree()
  const originalMaterials = useRef<Map<string, Map<THREE.Mesh, THREE.Material>>>(new Map())
  const idleGlowTweens = useRef<gsap.core.Tween[]>([])
  const hintShown = useRef(false)
  const [showHint, setShowHint] = useState(false)

  // Compute precise hitboxes from actual mesh geometry
  const hitboxes = useMemo(() => {
    return DESK_OBJECTS.map(({ name }) => {
      const object = scene.getObjectByName(name)
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
  }, [scene])

  const setEmissive = useCallback((name: string, intensity: number, color?: string) => {
    const object = scene.getObjectByName(name)
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

    // If object has a projectId, trigger project view
    const info = DESK_OBJECTS.find(d => d.name === name)
    if (info?.projectId && onProjectSelect) {
      onProjectSelect(info.projectId)
      setSelected(null)
      return
    }

    const wp = center.clone()
    wp.y += 1.5

    if (selected?.name === name) {
      setSelected(null)
    } else {
      setSelected({ name, position: wp })
    }
  }, [selected, mode, onProjectSelect])

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

      {/* First-time hint */}
      {showHint && coffeeHitbox && (
        <Html
          position={[coffeeHitbox.center.x, coffeeHitbox.center.y + 2, coffeeHitbox.center.z]}
          center
          distanceFactor={8}
        >
          <div style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.1em',
            padding: '6px 12px',
            background: 'rgba(26,26,26,0.9)',
            color: '#BEFF00',
            border: '1px solid rgba(190,255,0,0.3)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            animation: 'hintFade 4s ease forwards',
          }}>
            Click objects to explore projects
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

      {selected && (() => {
        const info = DESK_OBJECTS.find(d => d.name === selected.name)
        if (!info) return null
        return (
          <Html position={selected.position} center distanceFactor={6}>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              padding: '8px 14px',
              background: '#1A1A1A',
              color: '#F2F0ED',
              border: '2px solid #FF2D9B',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}>
              <strong style={{ color: '#FF2D9B' }}>{info.label}</strong>
              <br />
              {info.description}
            </div>
          </Html>
        )
      })()}
    </>
  )
}
