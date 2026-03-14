'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { MeshoptDecoder } from 'meshoptimizer'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import type { ExperienceMode } from './ExperienceWrapper'

interface DeskSceneProps {
  mode: ExperienceMode
  onLoaded: () => void
  onProgress: (p: number) => void
  onIntroComplete: () => void
  onEnterPortfolio: () => void
}

function Scene({ onLoaded, onEnterPortfolio, mode, onIntroComplete, onProgress }: {
  onLoaded: () => void
  onEnterPortfolio: () => void
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

      // Fix dome normals if needed (environment_dome with inward normals)
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === 'environment_dome') {
            child.material.side = THREE.BackSide
          }
          // Enable shadows
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

      {/* Recreate area lights (not supported in glTF) */}
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

      {/* Monitor CTA — visible in seated mode */}
      {mode === 'seated' && nodes.monitor_main && (
        <Html
          position={[0, 8.5, -6]}
          center
          distanceFactor={8}
          style={{ pointerEvents: 'auto' }}
        >
          <button
            onClick={onEnterPortfolio}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '12px 28px',
              background: '#FF2D9B',
              color: '#fff',
              border: '3px solid #1A1A1A',
              borderRadius: '0px',
              boxShadow: '4px 4px 0px #1A1A1A',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)'
              e.currentTarget.style.boxShadow = '6px 6px 0px #1A1A1A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)'
              e.currentTarget.style.boxShadow = '4px 4px 0px #1A1A1A'
            }}
          >
            Enter Portfolio →
          </button>
        </Html>
      )}

      <CameraRig mode={mode} onIntroComplete={onIntroComplete} />
    </>
  )
}

export function DeskScene({ mode, onLoaded, onProgress, onIntroComplete, onEnterPortfolio }: DeskSceneProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0A0A0A' }}
      camera={{
        fov: 50,
        near: 0.1,
        far: 200,
        position: [0, 12, 12],
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
          onEnterPortfolio={onEnterPortfolio}
          mode={mode}
          onIntroComplete={onIntroComplete}
          onProgress={onProgress}
        />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/desk-scene-web.glb')
