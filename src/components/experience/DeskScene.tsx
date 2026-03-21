'use client'

import { Suspense, useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Preload, Environment } from '@react-three/drei'
import { EffectComposer, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { CameraRig } from './CameraRig'
import { DeskInteractions } from './DeskInteractions'
import { DustParticles } from './DustParticles'
import { ScreenProjector } from './ScreenAlignedOverlay'
import type { ScreenRect } from './ScreenAlignedOverlay'
// SnakeGame is rendered in ExperienceWrapper as DOM overlay
import type { ExperienceMode } from './ExperienceWrapper'
import { useFPSMonitor } from '@/hooks/useFPSMonitor'

const MODEL_PATH = '/models/desk-scene-web-v2.glb'

// Hide objects with broken textures or too heavy geometry
const HIDE_OBJECTS: string[] = [
  'plant_left', 'plant_right',  // pixelated voxel artifacts
]

interface DeskSceneProps {
  mode: ExperienceMode
  onLoaded: () => void
  onProgress: (p: number) => void
  onIntroComplete: () => void
  onScreenBounds?: (bounds: {
    monitor: THREE.Vector3[]
    macbook: THREE.Vector3[]
  }) => void
  onMonitorRect?: (rect: ScreenRect) => void
  onMacbookRect?: (rect: ScreenRect) => void
  onProjectSelect?: (projectId: string) => void
}

function Scene({ onLoaded, mode, onIntroComplete, onProgress, onScreenBounds, onMonitorRect, onMacbookRect, onProjectSelect }: {
  onLoaded: () => void
  mode: ExperienceMode
  onIntroComplete: () => void
  onProgress: (p: number) => void
  onScreenBounds?: (bounds: { monitor: THREE.Vector3[]; macbook: THREE.Vector3[] }) => void
  onMonitorRect?: (rect: ScreenRect) => void
  onMacbookRect?: (rect: ScreenRect) => void
  onProjectSelect?: (projectId: string) => void
}) {
  const { scene, nodes } = useGLTF(MODEL_PATH)
  const hasLoaded = useRef(false)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const macbookSpotRef = useRef<THREE.SpotLight>(null)
  const prevModeRef = useRef<ExperienceMode>('loading')
  const [monitorCorners3D, setMonitorCorners3D] = useState<THREE.Vector3[]>([])
  const [macbookCorners3D, setMacbookCorners3D] = useState<THREE.Vector3[]>([])

  // macbookCenter removed — arcade is now a DOM overlay

  useEffect(() => {
    const manager = THREE.DefaultLoadingManager
    manager.onProgress = (_url, loaded, total) => {
      if (total > 0) onProgress(Math.round((loaded / total) * 100))
    }
    return () => { manager.onProgress = () => {} }
  }, [onProgress])

  useEffect(() => {
    if (!hasLoaded.current && scene) {
      hasLoaded.current = true

      // Log all mesh names for debugging (dev only)
      if (process.env.NODE_ENV === 'development') {
        const names: string[] = []
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) names.push(child.name)
        })
        console.log('GLB mesh names:', names.join(', '))
      }

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const nameLower = child.name.toLowerCase()

          // Hide decorative objects
          if (HIDE_OBJECTS.some(h => nameLower.includes(h.toLowerCase()))) {
            child.visible = false
            return
          }

          // Background plane — unlit so it reads as backdrop
          if (nameLower === 'background' || nameLower === 'plane') {
            const mat = child.material as THREE.MeshStandardMaterial
            if (mat.map) {
              child.material = new THREE.MeshBasicMaterial({ map: mat.map })
            }
            child.castShadow = false
            child.receiveShadow = false
            return
          }

          // Monitor stand/base — fix checkerboard UV artifact
          if (nameLower.includes('monitor')) {
            const geo = child.geometry
            if (geo) {
              geo.computeBoundingBox()
              const bb = geo.boundingBox!
              const height = bb.max.y - bb.min.y
              if (height < 2) {
                child.material = new THREE.MeshStandardMaterial({
                  color: '#e0e0e0',
                  roughness: 0.15,
                  metalness: 0.5,
                })
              }
            }
          }

          // Desk surface — lighter warm white to match Blender
          if (nameLower.includes('desk')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#f0ece6',
              roughness: 0.4,
              metalness: 0.0,
            })
          }

          // Floor — soft cream, no shadows
          if (nameLower.includes('floor')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#e8d8c8',
              roughness: 0.8,
              metalness: 0.0,
            })
            child.receiveShadow = false
            return
          }

          // Only big objects cast shadows (reduce shadow artifacts)
          child.castShadow = false
          child.receiveShadow = false
        }
      })

      onLoaded()

      // Extract screen corners for DOM overlay alignment
      const extractCorners = (meshNames: string[]): THREE.Vector3[] => {
        const box = new THREE.Box3()
        let found = false
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const name = child.name.toLowerCase()
            if (meshNames.some(n => name.includes(n))) {
              if (!found) {
                box.setFromObject(child)
                found = true
              } else {
                box.expandByObject(child)
              }
            }
          }
        })
        if (!found) return []
        const min = box.min
        const max = box.max
        return [
          new THREE.Vector3(min.x, max.y, min.z), // top-left
          new THREE.Vector3(max.x, max.y, min.z), // top-right
          new THREE.Vector3(min.x, min.y, min.z), // bottom-left
          new THREE.Vector3(max.x, min.y, min.z), // bottom-right
        ]
      }

      const monitorCorners = extractCorners(['frhiengciseloud'])
      const macbookCorners = extractCorners(['macbook_screen', 'macbook_display'])

      // Store corners for ScreenProjector
      if (monitorCorners.length === 4) setMonitorCorners3D(monitorCorners)
      const resolvedMacbook = macbookCorners.length === 4 ? macbookCorners : [
        // Fallback from Blender data (Three.js coords): MacBook screen area
        new THREE.Vector3(-6.16, 8.53, -0.08),
        new THREE.Vector3(-3.11, 8.53, -0.08),
        new THREE.Vector3(-6.16, 6.47, -2.28),
        new THREE.Vector3(-3.11, 6.47, -2.28),
      ]
      setMacbookCorners3D(resolvedMacbook)

      if (onScreenBounds && monitorCorners.length === 4) {
        onScreenBounds({
          monitor: monitorCorners,
          macbook: resolvedMacbook,
        })
      }
    }
  }, [scene, onLoaded, onScreenBounds])

  // Contextual lighting for macbook mode
  useEffect(() => {
    const from = prevModeRef.current
    prevModeRef.current = mode

    if (mode === 'macbook' && from !== 'macbook') {
      if (ambientRef.current) gsap.to(ambientRef.current, { intensity: 0.10, duration: 1 })
      if (macbookSpotRef.current) gsap.to(macbookSpotRef.current, { intensity: 3, duration: 1 })
    } else if (from === 'macbook' && mode !== 'macbook') {
      if (ambientRef.current) gsap.to(ambientRef.current, { intensity: 0.25, duration: 1 })
      if (macbookSpotRef.current) gsap.to(macbookSpotRef.current, { intensity: 0, duration: 1 })
    }
  }, [mode])

  useEffect(() => {
    if (macbookSpotRef.current) {
      macbookSpotRef.current.target.position.set(-3.5, 7.5, 0.5)
      macbookSpotRef.current.target.updateMatrixWorld()
    }
  }, [])

  // Screen glow removed — using baked textures from Blender

  return (
    <>
      <color attach="background" args={['#FAC8A5']} />

      {/* Environment map — reduced intensity to avoid overexposure */}
      <Environment preset="studio" environmentIntensity={0.4} />

      <primitive object={scene} />

      {/* Lighting — HDRI does the heavy lifting, minimal fill */}
      <ambientLight ref={ambientRef} intensity={0.15} color="#FFF8F0" />
      <directionalLight
        position={[-4, 14, -6]}
        intensity={0.6}
        color="#FFF8F0"
      />
      <spotLight
        ref={macbookSpotRef}
        position={[-3.5, 12, -3.5]}
        angle={0.4}
        penumbra={0.5}
        intensity={0}
        color="#FFFFFF"
      />

      <DeskInteractions scene={scene} mode={mode} onProjectSelect={onProjectSelect} />
      <DustParticles />

      {/* Arcade is rendered as DOM overlay in ExperienceWrapper */}

      <CameraRig mode={mode} onIntroComplete={onIntroComplete} />

      {monitorCorners3D.length === 4 && onMonitorRect && (
        <ScreenProjector corners={monitorCorners3D} onUpdate={onMonitorRect} padding={6} />
      )}
      {macbookCorners3D.length === 4 && onMacbookRect && (
        <ScreenProjector corners={macbookCorners3D} onUpdate={onMacbookRect} padding={4} />
      )}
    </>
  )
}

export function DeskScene({ mode, onLoaded, onProgress, onIntroComplete, onScreenBounds, onMonitorRect, onMacbookRect, onProjectSelect }: DeskSceneProps) {
  const handleLowFPS = useCallback((avgFPS: number) => {
    console.warn(`[FPS Monitor] Low FPS detected — avg: ${avgFPS}`)
  }, [])

  useFPSMonitor({ onLowFPS: handleLowFPS })

  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 20, -25] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows={false}
    >
      <Suspense fallback={null}>
        <Scene
          onLoaded={onLoaded}
          mode={mode}
          onIntroComplete={onIntroComplete}
          onProgress={onProgress}
          onScreenBounds={onScreenBounds}
          onMonitorRect={onMonitorRect}
          onMacbookRect={onMacbookRect}
          onProjectSelect={onProjectSelect}
        />
        <EffectComposer multisampling={0}>
          <Vignette eskil={false} offset={0.3} darkness={0.5} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
