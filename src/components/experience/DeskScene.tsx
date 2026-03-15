'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { MeshoptDecoder } from 'meshoptimizer'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { DeskInteractions } from './DeskInteractions'
import { PortfolioContent } from '../layout/PortfolioContent'
import type { ExperienceMode } from './ExperienceWrapper'

interface DeskSceneProps {
  mode: ExperienceMode
  onLoaded: () => void
  onProgress: (p: number) => void
  onIntroComplete: () => void
}

function Scene({ onLoaded, mode, onIntroComplete, onProgress }: {
  onLoaded: () => void
  mode: ExperienceMode
  onIntroComplete: () => void
  onProgress: (p: number) => void
}) {
  const { scene, nodes } = useGLTF('/models/desk-scene-web.glb', undefined, undefined, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder as any)
  })
  const hasLoaded = useRef(false)

  useEffect(() => {
    const manager = THREE.DefaultLoadingManager
    manager.onProgress = (_url, loaded, total) => {
      if (total > 0) {
        onProgress(Math.round((loaded / total) * 100))
      }
    }
    return () => {
      manager.onProgress = () => {}
    }
  }, [onProgress])

  useEffect(() => {
    if (!hasLoaded.current && scene) {
      hasLoaded.current = true

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === 'mega_sphere_L') {
            child.material.side = THREE.BackSide
          }
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      onLoaded()
    }
  }, [scene, onLoaded])

  return (
    <>
      <primitive object={scene} />

      {/* Lights (area lights not supported in glTF) */}
      <ambientLight intensity={0.4} color="#F0E8FF" />
      <directionalLight
        position={[-3, 10, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[4, 6, -2]}
        intensity={0.6}
        color="#E0D0FF"
      />
      <pointLight
        position={[-4, 8, 6]}
        intensity={0.8}
        color="#FFE8D0"
        distance={20}
      />

      <DeskInteractions scene={scene} />

      {/* Portfolio rendered ON the monitor screen */}
      {mode === 'seated' && nodes.monitor_main && (
        <Html
          position={[-0.23, 8.5, 2.55]}
          rotation={[0, Math.PI * 0.5, 0]}
          transform
          distanceFactor={1.5}
          style={{
            width: '1024px',
            height: '576px',
            overflow: 'hidden',
            background: '#F2F0ED',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '1024px',
              height: '576px',
              overflow: 'auto',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
            }}
          >
            <div style={{ width: '2048px' }}>
              <PortfolioContent />
            </div>
          </div>
        </Html>
      )}

      <CameraRig mode={mode} onIntroComplete={onIntroComplete} />
    </>
  )
}

export function DeskScene({ mode, onLoaded, onProgress, onIntroComplete }: DeskSceneProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0A0A0A' }}
      camera={{
        fov: 40,
        near: 0.1,
        far: 200,
        position: [0, 12, -12],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      shadows
    >
      <Suspense fallback={null}>
        <Scene
          onLoaded={onLoaded}
          mode={mode}
          onIntroComplete={onIntroComplete}
          onProgress={onProgress}
        />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/desk-scene-web.glb')
