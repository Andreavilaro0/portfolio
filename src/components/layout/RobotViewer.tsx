'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function RobotModel() {
  const geometry = useLoader(STLLoader, '/models/zumo-robot.stl')
  const meshRef = useRef<THREE.Mesh>(null)

  // FIX 13: Memoize geometry computation — only recomputes when geometry reference changes
  const scale = useMemo(() => {
    geometry.computeBoundingBox()
    geometry.center()
    const box = geometry.boundingBox!
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    return 2.5 / maxDim
  }, [geometry])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color="#1a1a24"
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={1.2}
      />
    </mesh>
  )
}

function Fallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-code)',
      fontSize: '14px',
      color: 'rgba(190,255,0,0.4)',
    }}>
      Loading 3D model...
    </div>
  )
}

export function RobotViewer() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '280px',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.5} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#BEFF00" />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#00E5FF" />
          <RobotModel />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Labels */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 2,
      }}>
        <div style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: '18px',
          fontWeight: 900,
          color: '#BEFF00',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          ZUMO 32U4
        </div>
        <div style={{
          fontFamily: 'var(--font-code, monospace)',
          fontSize: '15px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: '4px',
        }}>
          National Finalist — ASTI Challenge
        </div>
      </div>

      {/* Drag hint */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '10px',
        fontFamily: 'var(--font-code, monospace)',
        fontSize: '9px',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.05em',
      }}>
        drag to rotate
      </div>
    </div>
  )
}
