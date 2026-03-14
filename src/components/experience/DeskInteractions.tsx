'use client'

import { useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const DESK_OBJECTS = [
  { name: 'razer_mouse', label: 'Razer Mouse', description: 'Daily driver' },
  { name: 'keyboard.001', label: 'Keyboard', description: 'Mechanical vibes' },
  { name: 'coffee_cup', label: 'Coffee', description: 'Fuel for coding' },
  { name: 'headphones_marshall', label: 'Marshall Major IV', description: 'Lo-fi beats' },
  { name: 'leica_camera', label: 'Leica Camera', description: 'Street photography' },
  { name: 'macbook', label: 'MacBook Pro', description: 'Work machine' },
  { name: 'daftpunk', label: 'Daft Punk', description: 'Around the world' },
  { name: 'desk_lamp.001', label: 'Desk Lamp', description: 'Late night sessions' },
]

interface DeskInteractionsProps {
  scene: THREE.Object3D
}

export function DeskInteractions({ scene }: DeskInteractionsProps) {
  const [selected, setSelected] = useState<{ name: string; position: THREE.Vector3 } | null>(null)
  const { gl } = useThree()

  const handlePointerOver = useCallback(() => {
    gl.domElement.style.cursor = 'pointer'
  }, [gl])

  const handlePointerOut = useCallback(() => {
    gl.domElement.style.cursor = 'default'
  }, [gl])

  const handleClick = useCallback((name: string, object: THREE.Object3D) => {
    const wp = new THREE.Vector3()
    object.getWorldPosition(wp)
    wp.y += 1.5

    if (selected?.name === name) {
      setSelected(null)
    } else {
      setSelected({ name, position: wp })
    }
  }, [selected])

  return (
    <>
      {DESK_OBJECTS.map(({ name }) => {
        const object = scene.getObjectByName(name)
        if (!object) return null

        const wp = new THREE.Vector3()
        object.getWorldPosition(wp)

        return (
          <mesh
            key={name}
            position={wp}
            onClick={() => handleClick(name, object)}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            visible={false}
          >
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )
      })}

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
