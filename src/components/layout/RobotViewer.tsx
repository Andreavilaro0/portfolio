'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const STL_URL = 'https://ik.imagekit.io/xwvrhiauz/zumo-32U4-robot.stl?updatedAt=1772801232398'

export function RobotViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !containerRef.current) return

    const container = containerRef.current
    const w = container.clientWidth
    const h = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.8
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 1000)
    camera.position.set(5, 3.5, 5)
    camera.lookAt(0, 0, 0)

    // Strong 3-point lighting
    scene.add(new THREE.AmbientLight(0x404050, 1.0))

    const keyLight = new THREE.DirectionalLight(0xffffff, 3)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x88ccff, 1.5)
    fillLight.position.set(-4, 2, -2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x00ffff, 2)
    rimLight.position.set(-2, 3, -5)
    scene.add(rimLight)

    const bottomLight = new THREE.PointLight(0x004466, 1, 20)
    bottomLight.position.set(0, -3, 0)
    scene.add(bottomLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.minPolarAngle = Math.PI / 4
    controls.maxPolarAngle = Math.PI / 1.5

    let group: THREE.Group | null = null

    const loader = new STLLoader()
    loader.load(STL_URL, (geometry) => {
      geometry.computeVertexNormals()
      geometry.computeBoundingBox()
      const center = new THREE.Vector3()
      geometry.boundingBox!.getCenter(center)
      geometry.translate(-center.x, -center.y, -center.z)

      const size = new THREE.Vector3()
      geometry.boundingBox!.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      const s = 3 / maxDim

      // Main body - visible silver
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        metalness: 0.4,
        roughness: 0.35,
      })
      const mesh = new THREE.Mesh(geometry, bodyMaterial)

      // Cyan wireframe overlay
      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      })
      const wireMesh = new THREE.Mesh(geometry, wireMaterial)

      group = new THREE.Group()
      group.scale.set(s, s, s)
      group.add(mesh)
      group.add(wireMesh)
      scene.add(group)
    })

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (group) group.rotation.y += 0.004
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      controls.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [visible])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
