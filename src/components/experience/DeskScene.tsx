'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Html, OrbitControls } from '@react-three/drei'
import { MeshoptDecoder } from 'meshoptimizer'
import * as THREE from 'three'
import { CameraRig } from './CameraRig'
import { DeskInteractions } from './DeskInteractions'
import type { ExperienceMode } from './ExperienceWrapper'

const DEBUG = false // TEMPORARY — set true for debug helpers

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

      // DEBUG: Log scene graph
      if (DEBUG) {
        console.group('🔍 SCENE DEBUG')
        console.log('Scene children count:', scene.children.length)

        const nodeNames: string[] = []
        const meshNames: string[] = []
        scene.traverse((child) => {
          nodeNames.push(`${child.type}: "${child.name}"`)
          if (child instanceof THREE.Mesh) {
            meshNames.push(child.name)
          }
        })
        console.log('All nodes:', nodeNames)
        console.log('All mesh names:', meshNames)
        console.log('Available node keys from useGLTF:', Object.keys(nodes))

        // Bounding box of entire scene
        const box = new THREE.Box3().setFromObject(scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        console.log('Scene bounding box:')
        console.log('  min:', box.min.toArray().map(v => v.toFixed(2)))
        console.log('  max:', box.max.toArray().map(v => v.toFixed(2)))
        console.log('  size:', size.toArray().map(v => v.toFixed(2)))
        console.log('  center:', center.toArray().map(v => v.toFixed(2)))

        // Check for monitor
        const monitorNode = nodes.monitor_main
        if (monitorNode) {
          const monBox = new THREE.Box3().setFromObject(monitorNode)
          const monCenter = monBox.getCenter(new THREE.Vector3())
          console.log('✅ monitor_main FOUND')
          console.log('  position:', (monitorNode as any).position?.toArray().map((v: number) => v.toFixed(2)))
          console.log('  bounding center:', monCenter.toArray().map(v => v.toFixed(2)))
        } else {
          console.warn('❌ monitor_main NOT FOUND in nodes')
          // Try to find anything with "monitor" in name
          scene.traverse((child) => {
            if (child.name.toLowerCase().includes('monitor') || child.name.toLowerCase().includes('screen')) {
              console.log('  Found similar:', child.name, child.type, (child as any).position?.toArray())
            }
          })
        }
        console.groupEnd()
      }

      // Fix dome normals if needed (environment_dome with inward normals)
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.name === 'environment_dome' || child.name === 'mega_sphere_L') {
            child.material.side = THREE.BackSide
          }
          // Enable shadows
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      onLoaded()
    }
  }, [scene, nodes, onLoaded])

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

      <DeskInteractions scene={scene} />

      {/* Monitor CTA — DEBUG: always visible to test positioning */}
      {(DEBUG || (mode === 'seated' && nodes.monitor_main)) && (
        <Html
          position={[-0.23, 8.39, 2.6]}
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

      {/* DEBUG: helpers for scene exploration */}
      {DEBUG && (
        <>
          <axesHelper args={[10]} />
          <gridHelper args={[50, 50, '#444', '#222']} />
          <OrbitControls makeDefault />
        </>
      )}

      {/* CameraRig disabled during debug — OrbitControls above replaces it */}
      {!DEBUG && <CameraRig mode={mode} onIntroComplete={onIntroComplete} />}
    </>
  )
}

export function DeskScene({ mode, onLoaded, onProgress, onIntroComplete, onEnterPortfolio }: DeskSceneProps) {
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
