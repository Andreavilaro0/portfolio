'use client'

import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface DeskObjectProps {
  url: string
  position: [number, number, number]
  scale: number
  rotation?: [number, number, number]
  name: string
}

function DeskObject({ url, position, scale, rotation = [0, 0, 0], name }: DeskObjectProps) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const clone = scene.clone(true)

    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    // Center X/Z, sit on bottom (Y base = 0)
    const wrapper = new THREE.Group()
    wrapper.name = name
    clone.position.set(-center.x, -box.min.y, -center.z)
    wrapper.add(clone)

    const s = scale / maxDim
    wrapper.scale.setScalar(s)

    wrapper.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = false
      }
    })

    group.add(wrapper)

    return () => {
      group.remove(wrapper)
    }
  }, [scene, scale, name, position])

  return <group ref={groupRef} position={position} rotation={rotation} />
}

export function DeskObjects() {
  return (
    <>
      {/* Mexican Sugar Skull — left side of monitor */}
      <DeskObject
        url="/models/skull.glb"
        name="Mexican_Skull"
        position={[-5.0, 6.4, 0.5]}
        scale={0.5}
        rotation={[0, Math.PI, 0]}
      />

      {/* Rubik's Cube — right side of monitor */}
      <DeskObject
        url="/models/rubiks.glb"
        name="Rubiks_Cube"
        position={[5.0, 6.4, 0.2]}
        scale={0.5}
        rotation={[0.1, 0.7, 0.05]}
      />

      {/* Plant — behind monitor right */}
      <DeskObject
        url="/models/plant.glb"
        name="Desk_Plant"
        position={[4.8, 6.4, 1.5]}
        scale={1.2}
        rotation={[0, 0.3, 0]}
      />
    </>
  )
}

useGLTF.preload('/models/skull.glb')
useGLTF.preload('/models/rubiks.glb')
useGLTF.preload('/models/plant.glb')
