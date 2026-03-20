'use client'

import { Suspense, useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Preload } from '@react-three/drei'
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

// Objects to hide — broken geometry/textures after Blender export optimization
const HIDE_OBJECTS: string[] = [
  'plant_left', 'plant_right', 'chair',
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

          // Monitor screen: subtle glow so it looks "on"
          // The monitor mesh is FRHIeNGciselOUD — apply emissive to the thinnest submesh (the screen)
          if (nameLower.includes('frhiengciseloud')) {
            const geo = child.geometry
            if (geo) {
              geo.computeBoundingBox()
              const bb = geo.boundingBox!
              const depth = bb.max.z - bb.min.z
              // Screen is very thin in depth
              if (depth < 0.1) {
                child.material = new THREE.MeshStandardMaterial({
                  color: '#1a1a2e',
                  emissive: '#2a2a4a',
                  emissiveIntensity: 0.8,
                  roughness: 0.05,
                  metalness: 0.3,
                  side: THREE.DoubleSide,
                })
                return
              }
            }
          }

          child.castShadow = true
          child.receiveShadow = true
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

  // Screen glow breathing — subtle pulse on the monitor screen emissive
  useEffect(() => {
    if (!scene) return
    const screenMeshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase()
        if (name.includes('frhiengciseloud')) {
          screenMeshes.push(child)
        }
      }
    })

    if (screenMeshes.length === 0) return

    const proxy = { intensity: 0.8 }
    const tween = gsap.to(proxy, {
      intensity: 1.2,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        screenMeshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat.emissiveIntensity !== undefined) {
            mat.emissiveIntensity = proxy.intensity
          }
        })
      },
    })

    return () => { tween.kill() }
  }, [scene])

  return (
    <>
      <color attach="background" args={['#FAC8A5']} />
      <primitive object={scene} />

      {/* Ground plane — anchors the desk in space */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#E8D5C4" roughness={0.9} metalness={0} />
      </mesh>

      {/* Lighting — neutral warm, no pink */}
      <ambientLight ref={ambientRef} intensity={0.3} color="#F5F3F0" />
      <directionalLight
        position={[-4, 12, -6]}
        intensity={2.0}
        color="#FFF8F0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />
      <directionalLight position={[5, 6, -4]} intensity={0.4} color="#F0EDE8" />
      <pointLight position={[0, 8, 4]} intensity={0.3} color="#FFF5F0" distance={15} />
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
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 12, -12] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows="basic"
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
