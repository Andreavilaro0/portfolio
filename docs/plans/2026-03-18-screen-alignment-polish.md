# Screen Alignment & Camera Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 5 UX issues — DOM overlays perfectly aligned to 3D screens, MacBook camera straight, first-person feel, zero black screens, responsive overlay sizing.

**Architecture:** Replace hardcoded CSS centering with a `useScreenProjection` hook that projects 3D screen corners to 2D viewport coordinates every frame. Camera presets recalibrated for straight-on, first-person perspective. Overlay visibility managed with content-ready gates to prevent black screens.

**Tech Stack:** React Three Fiber, drei, Three.js, GSAP, Next.js 16, TypeScript

---

## Context for the Implementer

### Current state
- **ExperienceWrapper.tsx** renders two fixed DOM overlays (portfolio + arcade) positioned with `top: 50%; left: 50%; transform: translate(-50%, -54%)` and hardcoded `clamp()` sizes
- **CameraRig.tsx** has camera presets for intro/seated/macbook with bezier transitions
- 3D model (`desk-scene-clean.glb`) has meshes named `monitor_screen`, `screen_plane`, `screen_glass`, `screen_quad` for the monitor, and `macbook` for the laptop
- Monitor screen center in Blender: approximately (0, 10.29, -2.04), size ~7.2 x 4.1 units
- MacBook screen center in Blender: approximately (-4.63, 7.5, 1.1), size ~3.05 x 2.05 units

### Key files
- `src/components/experience/ExperienceWrapper.tsx` — orchestrator, overlays, mode state
- `src/components/experience/CameraRig.tsx` — camera positions, animations
- `src/components/experience/DeskScene.tsx` — 3D scene, lighting, model loading

### What the plan changes
1. **New hook:** `useScreenProjection` — projects 3D bounding box corners to pixel coordinates
2. **CameraRig.tsx** — recalibrate macbook preset for straight-on view
3. **ExperienceWrapper.tsx** — use projected coordinates instead of hardcoded CSS, add content-ready gates
4. **DeskScene.tsx** — expose screen mesh refs for projection

---

### Task 1: Create useScreenProjection hook

**Files:**
- Create: `src/hooks/useScreenProjection.ts`

**Step 1: Write the hook**

This hook takes a Three.js camera, a gl renderer, and 4 corner positions (Vector3) in world space. Every frame, it projects them to screen pixels and returns `{ top, left, width, height }`.

```typescript
// src/hooks/useScreenProjection.ts
'use client'

import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ScreenRect {
  top: number
  left: number
  width: number
  height: number
  visible: boolean
}

const DEFAULT_RECT: ScreenRect = { top: 0, left: 0, width: 0, height: 0, visible: false }

/**
 * Projects 4 world-space corner points onto the viewport and returns pixel-space rect.
 * corners order: [topLeft, topRight, bottomLeft, bottomRight]
 */
export function useScreenProjection(corners: THREE.Vector3[]): ScreenRect {
  const rectRef = useRef<ScreenRect>(DEFAULT_RECT)
  const { camera, gl } = useThree()
  const projected = useRef<THREE.Vector3[]>([
    new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(),
  ])

  useFrame(() => {
    if (corners.length !== 4) return

    const canvas = gl.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity
    let allVisible = true

    for (let i = 0; i < 4; i++) {
      projected.current[i].copy(corners[i])
      projected.current[i].project(camera)

      // Check if behind camera
      if (projected.current[i].z > 1) {
        allVisible = false
        break
      }

      const sx = (projected.current[i].x * 0.5 + 0.5) * w
      const sy = (-projected.current[i].y * 0.5 + 0.5) * h

      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }

    rectRef.current = allVisible
      ? { top: minY, left: minX, width: maxX - minX, height: maxY - minY, visible: true }
      : DEFAULT_RECT
  })

  return rectRef.current
}
```

**Step 2: Verify build compiles**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`
Expected: Build succeeds (hook is unused yet, tree-shaken)

**Step 3: Commit**

```bash
git add src/hooks/useScreenProjection.ts
git commit -m "feat: add useScreenProjection hook for 3D-to-DOM alignment"
```

---

### Task 2: Expose screen corner data from DeskScene

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Add screen corner extraction in DeskScene**

After the GLB loads, find the monitor and macbook screen meshes, compute their world-space bounding box, and expose the 4 corners via a callback prop.

In `DeskScene.tsx`, add a new prop `onScreenBounds` and call it after model loads:

```typescript
// Add to DeskSceneProps interface:
onScreenBounds?: (bounds: {
  monitor: THREE.Vector3[]  // [topLeft, topRight, bottomLeft, bottomRight]
  macbook: THREE.Vector3[]
}) => void
```

Inside the `useEffect` where `hasLoaded` fires, after `onLoaded()`, add:

```typescript
// Extract screen corners from mesh bounding boxes
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
  // For a screen facing -Z (toward camera), corners are:
  return [
    new THREE.Vector3(min.x, max.y, min.z), // top-left
    new THREE.Vector3(max.x, max.y, min.z), // top-right
    new THREE.Vector3(min.x, min.y, min.z), // bottom-left
    new THREE.Vector3(max.x, min.y, min.z), // bottom-right
  ]
}

const monitorCorners = extractCorners(['monitor_screen', 'screen_plane', 'screen_glass', 'screen_quad'])
const macbookCorners = extractCorners(['macbook_screen', 'macbook_display'])

if (onScreenBounds && monitorCorners.length === 4) {
  onScreenBounds({
    monitor: monitorCorners,
    macbook: macbookCorners.length === 4 ? macbookCorners : [
      // Fallback based on Blender data if mesh names don't match
      new THREE.Vector3(-6.15, 8.53, 1.1),
      new THREE.Vector3(-3.11, 8.53, 1.1),
      new THREE.Vector3(-6.15, 6.48, 1.1),
      new THREE.Vector3(-3.11, 6.48, 1.1),
    ],
  })
}
```

**Step 2: Thread the prop through ExperienceWrapper**

In `ExperienceWrapper.tsx`, add state to hold the bounds and pass them down:

```typescript
const [screenBounds, setScreenBounds] = useState<{
  monitor: THREE.Vector3[]
  macbook: THREE.Vector3[]
} | null>(null)

const onScreenBounds = useCallback((bounds: { monitor: THREE.Vector3[]; macbook: THREE.Vector3[] }) => {
  setScreenBounds(bounds)
}, [])
```

Pass `onScreenBounds={onScreenBounds}` to `<DeskScene>`.

**Step 3: Verify build compiles**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/experience/DeskScene.tsx src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: extract 3D screen corners for DOM overlay alignment"
```

---

### Task 3: Create ScreenAlignedOverlay component

**Files:**
- Create: `src/components/experience/ScreenAlignedOverlay.tsx`

**Step 1: Write the component**

This component lives INSIDE the R3F Canvas (as a child of Scene), uses `useScreenProjection` to get pixel rect, and renders a `drei Html` portal that positions a DOM div at exactly those coordinates.

**IMPORTANT:** We can't use `useFrame` outside the Canvas. Instead, this component uses `drei`'s `Html` with `calculatePosition` override, OR we use a simpler approach: a component inside the Canvas that writes projected coordinates to a shared ref that the DOM overlay reads.

Simpler approach — use a "bridge" pattern:

```typescript
// src/components/experience/ScreenAlignedOverlay.tsx
'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface ScreenRect {
  top: number
  left: number
  width: number
  height: number
}

interface ScreenProjectorProps {
  corners: THREE.Vector3[]
  onUpdate: (rect: ScreenRect) => void
  padding?: number // px of inset to shrink overlay slightly inside screen bezel
}

/**
 * R3F component (must be inside Canvas).
 * Projects 3D corners to screen pixels every frame and calls onUpdate.
 */
export function ScreenProjector({ corners, onUpdate, padding = 4 }: ScreenProjectorProps) {
  const { camera, gl } = useThree()
  const prevRect = useRef<string>('')
  const projected = useRef([
    new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(),
  ])

  useFrame(() => {
    if (corners.length !== 4) return

    const canvas = gl.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight

    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    for (let i = 0; i < 4; i++) {
      projected.current[i].copy(corners[i])
      projected.current[i].project(camera)

      if (projected.current[i].z > 1) return // behind camera

      const sx = (projected.current[i].x * 0.5 + 0.5) * w
      const sy = (-projected.current[i].y * 0.5 + 0.5) * h

      minX = Math.min(minX, sx)
      maxX = Math.max(maxX, sx)
      minY = Math.min(minY, sy)
      maxY = Math.max(maxY, sy)
    }

    const rect: ScreenRect = {
      top: minY + padding,
      left: minX + padding,
      width: (maxX - minX) - padding * 2,
      height: (maxY - minY) - padding * 2,
    }

    // Only update if changed (avoids React re-renders every frame)
    const key = `${Math.round(rect.top)},${Math.round(rect.left)},${Math.round(rect.width)},${Math.round(rect.height)}`
    if (key !== prevRect.current) {
      prevRect.current = key
      onUpdate(rect)
    }
  })

  return null
}
```

**Step 2: Verify build compiles**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add src/components/experience/ScreenAlignedOverlay.tsx
git commit -m "feat: add ScreenProjector for real-time 3D-to-pixel projection"
```

---

### Task 4: Wire ScreenProjector into DeskScene and use projected rects in ExperienceWrapper

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Add ScreenProjectors inside DeskScene's Scene component**

Add two `ScreenProjector` instances after the `<CameraRig>`:

```typescript
// In DeskScene.tsx Scene component, add props:
interface SceneInternalProps {
  // ... existing props
  monitorCorners: THREE.Vector3[]
  macbookCorners: THREE.Vector3[]
  onMonitorRect: (rect: ScreenRect) => void
  onMacbookRect: (rect: ScreenRect) => void
}

// Inside Scene's return JSX, after <CameraRig>:
{monitorCorners.length === 4 && (
  <ScreenProjector corners={monitorCorners} onUpdate={onMonitorRect} padding={6} />
)}
{macbookCorners.length === 4 && (
  <ScreenProjector corners={macbookCorners} onUpdate={onMacbookRect} padding={4} />
)}
```

Thread these through the DeskScene wrapper component that creates the Canvas.

**Step 2: Replace hardcoded CSS in ExperienceWrapper with projected rects**

Replace the portfolio overlay's inline styles:

```typescript
// Before (hardcoded):
// top: '50%', left: '50%', transform: 'translate(-50%, -54%)',
// width: 'clamp(300px, 44vw, 720px)', height: 'clamp(200px, 48vh, 480px)'

// After (projected):
const [monitorRect, setMonitorRect] = useState<ScreenRect>({ top: 0, left: 0, width: 0, height: 0 })
const [macbookRect, setMacbookRect] = useState<ScreenRect>({ top: 0, left: 0, width: 0, height: 0 })

// Portfolio overlay styles:
style={{
  position: 'fixed',
  top: `${monitorRect.top}px`,
  left: `${monitorRect.left}px`,
  width: `${monitorRect.width}px`,
  height: `${monitorRect.height}px`,
  zIndex: 20,
  // ... rest stays the same
}}

// Arcade overlay styles:
style={{
  position: 'fixed',
  top: `${macbookRect.top}px`,
  left: `${macbookRect.left}px`,
  width: `${macbookRect.width}px`,
  height: `${macbookRect.height}px`,
  zIndex: 20,
  // ... rest stays the same
}}
```

**Step 3: Add fallback for zero-size rects**

If the projection hasn't computed yet (first frame), use the old hardcoded values as fallback:

```typescript
const hasMonitorRect = monitorRect.width > 50
const hasArcadeRect = macbookRect.width > 50

// In portfolio overlay:
style={{
  position: 'fixed',
  ...(hasMonitorRect
    ? { top: `${monitorRect.top}px`, left: `${monitorRect.left}px`, width: `${monitorRect.width}px`, height: `${monitorRect.height}px` }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -54%)', width: 'clamp(300px, 44vw, 720px)', height: 'clamp(200px, 48vh, 480px)' }
  ),
  // ...
}}
```

**Step 4: Verify build compiles**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`
Expected: Build succeeds

**Step 5: Visual verification with dev server**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npm run dev`
Open browser, check that overlays now track the 3D screen positions.

**Step 6: Commit**

```bash
git add src/components/experience/DeskScene.tsx src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: align DOM overlays to 3D screen projections"
```

---

### Task 5: Fix MacBook camera — straight and frontal

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Recalibrate macbook camera preset**

The current macbook preset:
```typescript
position: new THREE.Vector3(-4.63, 7.5, -5),
lookAt: new THREE.Vector3(-4.63, 7.5, 1.1),
```

Problem: The camera and lookAt share the same X (-4.63) and Y (7.5), which means the camera looks straight forward. But the MacBook screen may be tilted (laptop lid angle), so "straight at the screen" means the camera should be slightly above and tilted down.

Adjust to look straight-on at the MacBook screen center:

```typescript
macbook: {
  // Camera directly in front, slightly above screen center to match lid angle (~110°)
  position: new THREE.Vector3(-4.63, 8.0, -4.5),
  lookAt: new THREE.Vector3(-4.63, 7.3, 1.1),
},
```

The key fix: camera Y (8.0) is above lookAt Y (7.3), creating a natural slight downward gaze that matches looking at a laptop on a desk. Camera Z (-4.5) is closer than before (-5) for a more intimate first-person feel.

**NOTE:** These values may need fine-tuning after visual inspection. The implementer should:
1. Open dev server
2. Navigate to macbook mode
3. Check if the view feels straight-on and natural
4. Adjust Y offset (±0.3) and Z distance (±0.5) until it feels right

**Step 2: Verify the transition midpoint still works**

The `TRANSITION_MID` point may need adjustment if the macbook position changed:

```typescript
// Current:
const TRANSITION_MID = new THREE.Vector3(-1.5, 9.5, -5.0)
const TRANSITION_MID_LOOKAT = new THREE.Vector3(-2.0, 9.0, 1.5)
```

These should still work since the midpoint is between seated (x=0) and macbook (x=-4.63). No change needed unless the transition path feels wrong visually.

**Step 3: Verify build and visual check**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`
Then: visual check in browser

**Step 4: Commit**

```bash
git add src/components/experience/CameraRig.tsx
git commit -m "fix: macbook camera straight-on with natural downward gaze"
```

---

### Task 6: Improve first-person seated camera feel

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Adjust seated camera for natural desk perspective**

Current seated preset:
```typescript
seated: {
  position: new THREE.Vector3(0, 10.29, -8),
  lookAt: new THREE.Vector3(0, 10.29, 2),
},
```

Problem: Camera and lookAt at same Y (10.29) = perfectly level gaze. A person sitting at a desk naturally looks slightly downward at a monitor. Also Z=-8 may be too far back.

Fix:
```typescript
seated: {
  // Slightly above screen center, looking slightly down — natural desk posture
  position: new THREE.Vector3(0, 10.8, -6.5),
  lookAt: new THREE.Vector3(0, 10.0, 2),
},
```

Changes:
- Position Y: 10.29 → 10.8 (eyes slightly above screen center)
- Position Z: -8 → -6.5 (closer = more immersive first-person)
- LookAt Y: 10.29 → 10.0 (slight downward gaze)

**Step 2: Adjust intro start position to match new seated end**

```typescript
intro: {
  position: new THREE.Vector3(0, 13, -18),
  lookAt: new THREE.Vector3(0, 10.0, 2),
},
```

The intro starts far and high, then cranes down to the seated position. The lookAt Y should match seated's lookAt Y for a stable target.

**Step 3: Verify build and visual check**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git add src/components/experience/CameraRig.tsx
git commit -m "fix: first-person seated camera with natural desk posture"
```

---

### Task 7: Eliminate black screens — content-ready gates

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Identify the black screen scenarios**

Black screens happen when:
1. Camera arrives at a screen but the DOM overlay hasn't faded in yet (800ms delay)
2. Transitioning between screens: old content fades out, camera moves, new content fades in — gap in between
3. First load: scene loads but loading screen doesn't dismiss fast enough

**Step 2: Fix overlay timing — show content DURING camera transition, not after**

Current code waits 800ms after mode change to show content. Fix: start fading in content immediately when mode changes, so by the time the camera arrives (2.2s transition), content is already visible.

Replace the `useEffect` that syncs overlay visibility:

```typescript
// Before:
useEffect(() => {
  if (mode === 'seated') {
    const timer = setTimeout(() => setActiveScreen('portfolio'), 800)
    return () => clearTimeout(timer)
  }
  if (mode === 'macbook') {
    const timer = setTimeout(() => setActiveScreen('arcade'), 800)
    return () => clearTimeout(timer)
  }
}, [mode])

// After:
useEffect(() => {
  if (mode === 'seated') {
    // Show immediately — camera takes 2.2s to arrive, plenty of time for fade-in
    setActiveScreen('portfolio')
  }
  if (mode === 'macbook') {
    setActiveScreen('arcade')
  }
}, [mode])
```

**Step 3: Fix transition — don't hide old content before new arrives**

Current `goToMacbook`:
```typescript
const goToMacbook = useCallback(() => {
  setActiveScreen('none')  // immediately hides portfolio
  setTimeout(() => setMode('macbook'), 600)  // 600ms gap of nothing
}, [])
```

Fix: cross-fade instead of sequential hide→show:

```typescript
const goToMacbook = useCallback(() => {
  setMode('macbook')  // camera starts moving + arcade starts fading in
  // Portfolio fades out naturally because activeScreen will become 'arcade'
}, [])

const goToSeated = useCallback(() => {
  setMode('seated')  // camera starts moving + portfolio starts fading in
}, [])
```

The `opacity: isPortfolioVisible ? 1 : 0` with `transition: 'opacity 0.6s ease'` already handles the cross-fade — we just need to stop manually setting `activeScreen('none')` which creates the gap.

**Step 4: Verify build**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`

**Step 5: Visual verification**

Open dev server, navigate between portfolio ↔ arcade. Check:
- No moment where both screens are invisible
- Content is visible by the time camera arrives
- Cross-fade feels smooth

**Step 6: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: eliminate black screens with immediate content gates and cross-fade"
```

---

### Task 8: Make overlays responsive on window resize

**Files:**
- Modify: `src/components/experience/ScreenAlignedOverlay.tsx`

**Step 1: The ScreenProjector already handles this**

Because `useFrame` runs every frame and reads `gl.domElement.clientWidth/Height`, the projection automatically updates when the window resizes and the canvas resizes. The Three.js camera projection matrix also updates via R3F's built-in resize handling.

Verify this works:
1. Open dev server
2. Resize the browser window
3. Check that overlays stay aligned to 3D screens

**Step 2: Handle edge case — very narrow viewports**

Add minimum dimensions so overlays remain usable on small screens:

```typescript
// In ExperienceWrapper, where we use monitorRect:
const safeMonitorRect = {
  ...monitorRect,
  width: Math.max(monitorRect.width, 280),
  height: Math.max(monitorRect.height, 180),
}
```

**Step 3: Verify build**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: enforce minimum overlay dimensions for small viewports"
```

---

### Task 9: Final integration test — full flow walkthrough

**Files:**
- No file changes — verification only

**Step 1: Build production bundle**

Run: `cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio && npx next build 2>&1 | tail -30`
Expected: Build succeeds with zero errors

**Step 2: Visual walkthrough checklist**

Run dev server and verify each step:

1. **Loading screen** — shows "ANDREA AVILA" with typewriter, progress bar fills
2. **Click to enter** — loading screen fades out (0.4s)
3. **Intro fly-in** — camera cranes from far/high to desk, smooth 3.5s
4. **Seated mode** — portfolio appears on monitor screen, aligned to 3D screen edges
5. **Scroll portfolio** — content scrolls inside the overlay, no overflow
6. **Click Arcade button** — camera moves to MacBook with curved bezier, arcade appears
7. **Arcade view** — MacBook screen shows macos-desktop, straight-on view, not tilted
8. **Click Portfolio link** — camera returns to monitor, portfolio appears
9. **Resize window** — both overlays track their respective 3D screens
10. **No black screens** — at no point is there a moment with no visible content during transitions

**Step 3: If all pass, final commit**

```bash
git add -A
git commit -m "chore: screen alignment and camera polish complete"
```

---

## Summary of Changes

| File | Change | Fixes |
|------|--------|-------|
| `src/hooks/useScreenProjection.ts` | NEW — 3D→pixel projection | #1, #5 |
| `src/components/experience/ScreenAlignedOverlay.tsx` | NEW — bridge component | #1, #5 |
| `src/components/experience/DeskScene.tsx` | Extract screen corners, add projectors | #1 |
| `src/components/experience/ExperienceWrapper.tsx` | Use projected rects, fix timing | #1, #4, #5 |
| `src/components/experience/CameraRig.tsx` | Recalibrate all presets | #2, #3 |

## Risk Notes

- **Screen mesh names:** The plan assumes monitor screen meshes contain "monitor_screen", "screen_plane", etc. If GLB mesh names differ, Task 2's `extractCorners` will fall through to hardcoded fallbacks. The implementer should check console logs in dev mode (`GLB mesh names:` log in DeskScene.tsx) and update mesh name filters if needed.
- **Screen orientation:** The plan assumes screens face -Z (toward camera). If the Blender model has screens facing a different axis, the corner extraction in Task 2 needs to pick different axes from the bounding box.
- **Camera values:** Tasks 5-6 provide initial values that may need ±0.3 unit adjustments after visual inspection. The implementer should iterate visually.
