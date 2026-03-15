# Desk Experience Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the 3D desk experience so the portfolio renders ON the monitor screen, the camera isn't too close, and desk objects are interactive.

**Architecture:** Pull camera back to show full desk context. Replace DOM overlay portfolio with drei `<Html transform>` embedded on the monitor's screen surface. Add raycasting hover/click interactions on desk objects. Keep state machine (loading → intro → seated → portfolio) but remove the full-page takeover — portfolio stays inside the monitor.

**Tech Stack:** React Three Fiber, drei (Html, useGLTF), GSAP, Three.js raycasting

**GLB Data (from inspect-glb.mjs):**
- `monitor_main`: pos[-0.23, 8.39, 2.6] rot[0.04, 0.66, 0.045, 0.748] scale[0.66, 18.63, 37.80]
- `CAMERA_SEATED_MAIN`: pos[0, 8.63, -2.2]
- `CAMERA_INTRO_START`: pos[0, 12, -12]
- Desk surface Y ≈ 6.5 (objects sit at Y 6.38–6.61)
- Desk objects: razer_mouse, keyboard.001, coffee_cup, headphones_marshall, leica_camera, macbook, daftpunk, desk_lamp.001

---

### Task 1: Pull camera back — show full desk

**Files:**
- Modify: `src/components/experience/CameraRig.tsx:16-29`

**Step 1: Update camera positions**

The seated camera at Z=-2.2 is ~4.8 units from the monitor — too close, you can't see the desk. Pull it back to Z=-6 and lower the Y slightly to see more desk surface.

```typescript
const CAMERAS = {
  intro: {
    position: new THREE.Vector3(0, 12, -12),
    lookAt: new THREE.Vector3(0, 5, 0),
  },
  seated: {
    position: new THREE.Vector3(0, 9.5, -5),       // pulled back from Z=-2.2 to Z=-5
    lookAt: new THREE.Vector3(0, 7, 2),              // look at center of desk+monitor area
  },
  monitorFocus: {
    position: new THREE.Vector3(0, 8.63, -2.5),     // keep close for monitor zoom
    lookAt: new THREE.Vector3(-0.23, 8.39, 2.6),
  },
}
```

**Step 2: Update Canvas default camera**

In `DeskScene.tsx`, keep `position: [0, 12, -12]` and `fov: 40` — these match intro start.

**Step 3: Test**

Run: `npx next dev` → open browser
Expected: After intro animation, you see the full desk with monitor, objects, and surrounding environment. Not just a close-up of the monitor.

**Step 4: Commit**

```bash
git add src/components/experience/CameraRig.tsx
git commit -m "fix: pull seated camera back to show full desk context"
```

---

### Task 2: Render portfolio ON the monitor screen

**Files:**
- Modify: `src/components/experience/DeskScene.tsx` (replace current Html CTA with monitor-embedded content)
- Modify: `src/components/experience/ExperienceWrapper.tsx` (remove full-page portfolio overlay)

**Step 1: Replace the monitor CTA with an iframe embedded on the monitor**

In `DeskScene.tsx`, replace the current `<Html>` button with an `<Html>` that renders an iframe of the portfolio page, positioned and rotated to match the monitor's screen surface.

The monitor_main node has:
- position: [-0.23, 8.39, 2.6]
- rotation quaternion: [0.04, 0.66, 0.045, 0.748]
- The monitor material is emissive white (PaletteMaterial008) — this is the screen

Replace the monitor CTA section with:

```tsx
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
      overflow: 'auto',
      background: '#F2F0ED',
      borderRadius: '0',
    }}
    pointerEvents="auto"
  >
    <div style={{ width: '1024px', height: '576px', overflow: 'auto' }}>
      <PortfolioContent />
    </div>
  </Html>
)}
```

Import `PortfolioContent` in DeskScene:
```typescript
import { PortfolioContent } from '../layout/PortfolioContent'
```

**Step 2: Simplify ExperienceWrapper — remove full-page portfolio overlay**

Since the portfolio now lives inside the 3D scene on the monitor, the ExperienceWrapper no longer needs the portfolio DOM overlay, the transitioning→portfolio mode switch, or the back-to-desk button. Simplify to just: loading → intro → seated.

Update `ExperienceMode`:
```typescript
export type ExperienceMode = 'loading' | 'intro' | 'seated'
```

Remove: `onEnterPortfolio`, `onBackToDesk`, `showPortfolio`, the entire portfolio `<div>`, the back button.

Keep: loading screen, 3D scene div (always visible after loading).

**Step 3: Clean up DeskScene props**

Remove `onEnterPortfolio` from DeskSceneProps since there's no portal transition anymore. Remove the `monitorFocus` camera state from CameraRig since we don't zoom into the monitor.

**Step 4: Test**

Run: `npx next dev` → open browser
Expected: After intro, you see the desk scene. The monitor shows the actual portfolio content (scrollable). You can scroll inside the monitor iframe.

**Step 5: Commit**

```bash
git add src/components/experience/DeskScene.tsx src/components/experience/ExperienceWrapper.tsx src/components/experience/CameraRig.tsx
git commit -m "feat: render portfolio content on monitor screen instead of DOM overlay"
```

---

### Task 3: Add interactive desk objects

**Files:**
- Create: `src/components/experience/DeskInteractions.tsx`
- Modify: `src/components/experience/DeskScene.tsx` (add DeskInteractions component)

**Step 1: Create DeskInteractions component**

This component adds hover and click interactions to desk objects. On hover: cursor changes, object glows or scales slightly. On click: show a tooltip/label with object info.

```tsx
'use client'

import { useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface DeskObject {
  name: string
  label: string
  description: string
}

const DESK_OBJECTS: DeskObject[] = [
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
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<{ name: string; position: THREE.Vector3 } | null>(null)
  const { gl } = useThree()

  const handlePointerOver = useCallback((name: string) => {
    setHovered(name)
    gl.domElement.style.cursor = 'pointer'
  }, [gl])

  const handlePointerOut = useCallback(() => {
    setHovered(null)
    gl.domElement.style.cursor = 'default'
  }, [gl])

  const handleClick = useCallback((name: string, object: THREE.Object3D) => {
    const wp = new THREE.Vector3()
    object.getWorldPosition(wp)
    wp.y += 1 // offset tooltip above object

    if (selected?.name === name) {
      setSelected(null)
    } else {
      setSelected({ name, position: wp })
    }
  }, [selected])

  return (
    <>
      {DESK_OBJECTS.map(({ name, label, description }) => {
        const object = scene.getObjectByName(name)
        if (!object) return null

        return (
          <group key={name}>
            <mesh
              position={object.position.clone()}
              onClick={() => handleClick(name, object)}
              onPointerOver={() => handlePointerOver(name)}
              onPointerOut={() => handlePointerOut()}
              visible={false}
            >
              <boxGeometry args={[2, 2, 2]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>
        )
      })}

      {/* Tooltip for selected object */}
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
```

**Step 2: Add DeskInteractions to DeskScene**

In DeskScene.tsx Scene component, add after the lights:
```tsx
<DeskInteractions scene={scene} />
```

Import:
```typescript
import { DeskInteractions } from './DeskInteractions'
```

**Step 3: Test**

Run: `npx next dev`
Expected: Hovering over desk objects shows pointer cursor. Clicking shows a tooltip with object name and description. Clicking again dismisses it.

**Step 4: Commit**

```bash
git add src/components/experience/DeskInteractions.tsx src/components/experience/DeskScene.tsx
git commit -m "feat: add interactive hover/click on desk objects"
```

---

### Task 4: Clean up debug code and orphaned files

**Files:**
- Modify: `src/components/experience/DeskScene.tsx` (remove DEBUG block, OrbitControls import if unused)
- Delete: `inspect-glb.mjs`
- Delete: `recovery_audit.md`, `phase1_scene_debug.md`, `phase2_camera_lock.md`

**Step 1: Remove DEBUG code from DeskScene**

Remove:
- `const DEBUG = false` line
- The entire `if (DEBUG) { ... }` block inside the scene load useEffect
- The `{DEBUG && (<> <axesHelper> ... </>)}` block
- The `{!DEBUG && ...}` conditional around CameraRig — just render `<CameraRig>` directly
- `OrbitControls` from imports

**Step 2: Delete temp files**

```bash
rm inspect-glb.mjs recovery_audit.md phase1_scene_debug.md phase2_camera_lock.md
```

**Step 3: Build check**

Run: `npx next build 2>&1 | tail -10`
Expected: Compiled successfully

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: clean up debug code and temp recovery files"
```

---

### Task 5: Final integration test

**Step 1: Full flow test**

Run: `npx next dev`

Test checklist:
- [ ] Loading screen shows with progress bar advancing
- [ ] After load, camera animates from high/far to seated position
- [ ] Seated view shows the FULL desk — monitor, keyboard, mouse, objects visible
- [ ] Monitor screen shows the actual portfolio content
- [ ] Portfolio content on monitor is scrollable
- [ ] Hovering desk objects changes cursor to pointer
- [ ] Clicking desk objects shows tooltip
- [ ] Clicking again dismisses tooltip
- [ ] Mouse look-around works subtly in seated mode
- [ ] No console errors

**Step 2: Adjust values if needed**

If monitor content positioning is off, tweak the `<Html>` position/rotation/distanceFactor in Task 2.
If camera still too close/far, adjust `CAMERAS.seated` in Task 1.

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: verified desk experience works end-to-end"
```
