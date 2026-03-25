'use client'

import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Html } from '@react-three/drei'
import { EffectComposer, Vignette, ToneMapping, Noise, ChromaticAberration } from '@react-three/postprocessing'
import { ToneMappingMode, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { DeskInteractions } from './DeskInteractions'
import { DustParticles } from './DustParticles'
import { DeskObjects } from './DeskObjects'
// Portfolio loads as iframe from /portfolio route
import type { ExperienceMode } from './ExperienceWrapper'
import { useFPSMonitor } from '@/hooks/useFPSMonitor'

// FIX 12: Build the bezel shape once at module level — not inside JSX on every render
const BEZEL_SHAPE = (() => {
  const w = 7.4, h = 4.4, r = 0.15
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
})()

const MODEL_PATH = '/models/desk-scene-web-v2.glb'

// Hide objects with broken textures or too heavy geometry
const HIDE_OBJECTS: string[] = ['object_6_1', 'object_6_2', 'object_6_3', 'object_6_4', 'object_6_5', 'object_6_6', 'desk_lamp']

interface DeskSceneProps {
  mode: ExperienceMode
  onLoaded: () => void
  onProgress: (p: number) => void
  onIntroComplete: () => void
  onProjectSelect?: (projectId: string) => void
  onObjectFocus?: (objectName: string) => void
  onHoverChange?: (name: string | null) => void
  onGrabChange?: (grabbing: boolean) => void
  playSound?: (name: 'hover' | 'click' | 'grab' | 'throw' | 'bounce') => void
  focusedObject?: string | null
}

function Scene({ onLoaded, mode, onIntroComplete, onProgress, onProjectSelect, onObjectFocus, onHoverChange, onGrabChange, playSound, focusedObject }: {
  onLoaded: () => void
  mode: ExperienceMode
  onIntroComplete: () => void
  onProgress: (p: number) => void
  onObjectFocus?: (objectName: string) => void
  onHoverChange?: (name: string | null) => void
  onGrabChange?: (grabbing: boolean) => void
  playSound?: (name: 'hover' | 'click' | 'grab' | 'throw' | 'bounce') => void
  focusedObject?: string | null
  onProjectSelect?: (projectId: string) => void
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const hasLoaded = useRef(false)
  const ambientRef = useRef<THREE.AmbientLight>(null)

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
        // Log Box003 position for camera calibration
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name === 'Box003') {
            const box = new THREE.Box3().setFromObject(child)
            const center = new THREE.Vector3()
            box.getCenter(center)
            console.log(`BOX003 center: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`)
          }
        })
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


          // Monitor screen — hide the flat screen panels so Html shows cleanly
          if (child.name === 'FRHIeNGciselOUD' || (nameLower.includes('monitor') && nameLower.includes('screen'))) {
            child.visible = false
          }
          // Also hide the glass/quad screen surfaces
          if (nameLower === 'monitor_screen_glass' || nameLower === 'monitor_screen_quad' || nameLower === 'monitor_inner_panel') {
            child.visible = false
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

          // Desk surface — light natural wood
          if (nameLower.includes('desk')) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#d4b896',
              roughness: 0.65,
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

      // Push monitor screen behind the Html overlay
      const monitorScreen = scene.getObjectByName('FRHIeNGciselOUD')
      if (monitorScreen) {
        monitorScreen.traverse((c) => {
          if (c instanceof THREE.Mesh) {
            c.material = new THREE.MeshBasicMaterial({ color: '#0a0a0f' })
            c.position.z -= 0.5
            c.renderOrder = -1
          }
        })
      }

      onLoaded()
    }
  }, [scene, onLoaded])

  // FIX 5: Send boot signal to iframe when camera arrives at monitor.
  // Retry every 500ms for up to 5s in case the iframe hasn't loaded yet.
  useEffect(() => {
    if (mode !== 'seated') return

    let attempts = 0
    const MAX_ATTEMPTS = 10 // 10 * 500ms = 5s total
    let ackReceived = false

    const tryBoot = () => {
      if (ackReceived) return
      const iframe = document.getElementById('portfolio-iframe') as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'boot' }, window.location.origin)
      }
      attempts++
      if (attempts < MAX_ATTEMPTS && !ackReceived) {
        intervalId = setTimeout(tryBoot, 500)
      }
    }

    // Listen for ACK from iframe so we stop retrying once it responds
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'boot-ack') {
        ackReceived = true
      }
    }
    window.addEventListener('message', onMessage)

    let intervalId: ReturnType<typeof setTimeout>
    tryBoot()

    return () => {
      clearTimeout(intervalId)
      window.removeEventListener('message', onMessage)
    }
  }, [mode])

  return (
    <>
      <color attach="background" args={['#FAC8A5']} />

      {/* Environment map */}
      <Environment preset="studio" environmentIntensity={0.4} />

      <primitive object={scene} />

      {/* Dark bezel frame with rounded corners */}
      <mesh position={[0, 10.45, 0.5]}>
        <shapeGeometry args={[BEZEL_SHAPE]} />
        <meshStandardMaterial color="#6a6a75" metalness={0.9} roughness={0.1} side={2} />
      </mesh>

      {/* ⚠️ LOCKED — Portfolio position calibrated manually. DO NOT CHANGE these values. */}
      {mode !== 'loading' && (
        <Html
          transform
          position={[-0.02, 10.43, 1.62]}
          scale={[-0.25, 0.25, 0.25]}
          style={{
            width: '1640px',
            height: '980px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: '#000',
            overflow: 'hidden',
            borderRadius: '16px',
            position: 'relative',
            border: '8px solid #2a2a30',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 0 2px #1a1a1f',
          }}>
          {/* Real iframe — full page with its own window, scroll, GSAP */}
          <iframe
            src="/portfolio-os/index.html"
            id="portfolio-iframe"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              background: '#000',
            }}
            title="Andrea Avila Portfolio"
          />
          </div>
        </Html>
      )}

      {/* Additional desk objects from Sketchfab */}
      <DeskObjects />

      {/* Lighting — HDRI does the heavy lifting, minimal fill */}
      <ambientLight ref={ambientRef} intensity={0.15} color="#FFF8F0" />
      <directionalLight
        position={[-4, 14, -6]}
        intensity={0.6}
        color="#FFF8F0"
      />

      <DeskInteractions scene={scene} mode={mode} onProjectSelect={onProjectSelect} onObjectFocus={onObjectFocus} onHoverChange={onHoverChange} onGrabChange={onGrabChange} playSound={playSound} />
      <DustParticles />

      {/* Arcade is rendered as DOM overlay in ExperienceWrapper */}

      <CameraRig mode={mode} onIntroComplete={onIntroComplete} focusedObject={focusedObject} />
    </>
  )
}

export function DeskScene({ mode, onLoaded, onProgress, onIntroComplete, onProjectSelect, onObjectFocus, onHoverChange, onGrabChange, playSound, focusedObject }: DeskSceneProps) {
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
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene
          onLoaded={onLoaded}
          mode={mode}
          onIntroComplete={onIntroComplete}
          onProgress={onProgress}
          onProjectSelect={onProjectSelect}
          onObjectFocus={onObjectFocus}
          onHoverChange={onHoverChange}
          onGrabChange={onGrabChange}
          playSound={playSound}
          focusedObject={focusedObject}
        />
        <EffectComposer multisampling={0}>
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
          <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
          <ChromaticAberration offset={[0.0004, 0.0004]} radialModulation />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
