# Desk Scene Interactive Portfolio — Full Polish Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all visual/technical errors in the 3D desk portfolio, calibrate the monitor screen, implement first-person camera, create a cinematic intro animation, and clean up dead code.

**Architecture:** Next.js 16 + React Three Fiber canvas loads desk-scene-v2.glb. NoiseBackground (CSS animated blobs) renders behind the transparent R3F canvas. Portfolio HTML renders inside the 3D monitor via drei's `<Html>`. Camera uses GSAP for intro animation, then settles into first-person seated view with mouse look-around.

**Tech Stack:** Next.js 16, React 19, React Three Fiber 9, drei 10, Three.js 0.183, GSAP 3.14, Tailwind 4, TypeScript 5.9

---

## Phase 1: Clean Up Dead Code & Fix Warnings

### Task 1.1: Remove unused Spline components and dependencies

**Files:**
- Delete: `src/components/experience/SplineExperience.tsx`
- Modify: `src/components/layout/PortfolioContent.tsx` (remove SplineShowcase if imported)
- Check: `src/components/layout/SplineShowcase.tsx` — delete if unused
- Check: `src/components/layout/SplineScene.tsx` — delete if unused

**Step 1:** Check if SplineShowcase or SplineScene are imported anywhere besides dead files

Run: `grep -r "SplineShowcase\|SplineScene" src/ --include="*.tsx" --include="*.ts"`

**Step 2:** If only imported in dead/unused files, delete:
- `src/components/experience/SplineExperience.tsx`
- `src/components/layout/SplineShowcase.tsx`
- `src/components/layout/SplineScene.tsx`

**Step 3:** Remove `@splinetool/react-spline` and `@splinetool/runtime` from package.json if no other Spline imports exist

Run: `grep -r "splinetool\|Spline" src/ --include="*.tsx" --include="*.ts"`

If clean: `npm uninstall @splinetool/react-spline @splinetool/runtime`

**Step 4:** Verify build

Run: `npx next build 2>&1 | tail -20`
Expected: Compiled successfully

**Step 5:** Commit

```bash
git add -A
git commit -m "chore: remove unused Spline components and dependencies"
```

---

### Task 1.2: Fix stale comments in DeskScene.tsx

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:13-23`

**Step 1:** Update the comment block to reflect v2 GLB reality:

```typescript
/**
 * Monitor screen overlay.
 *
 * Uses MONITOR_SCREEN_CENTER anchor from desk-scene-v2.glb.
 * The Html is positioned at the anchor's world position, facing the camera
 * with rotation [0, π, 0].
 *
 * Screen aspect ratio: 1.756 (from Blender MONITOR_SCREEN_PLANE measurement)
 * distanceFactor: 2.5 (calibrated visually)
 */
```

**Step 2:** Commit

---

### Task 1.3: Hide floating decorative objects that don't work without dome

**Files:**
- Modify: `src/components/experience/DeskScene.tsx` — scene.traverse block

**Step 1:** Add these names to the hide list in the traverse:

```typescript
const HIDE_OBJECTS = [
  'environment_dome', 'stage_floor',
  'capsule_big_mint', 'capsule_pink',
  'mega_ring_pink', 'mega_sphere_L',
  'ring_blue_low', 'rounded_cube',
  'sphere_cyan_R', 'sphere_warm_near',
]

scene.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    if (HIDE_OBJECTS.includes(child.name)) {
      child.visible = false
      return
    }
    child.castShadow = true
    child.receiveShadow = true
  }
})
```

**Step 2:** Verify visually with Playwright screenshot — only desk objects should remain

**Step 3:** Commit

---

## Phase 2: Fix Monitor Screen Alignment

### Task 2.1: Debug monitor anchor position in new GLB

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** Add temporary debug logging to find the correct monitor position:

```typescript
const monitorCenter = useMemo(() => {
  const anchor = nodes.MONITOR_SCREEN_CENTER
    || nodes.MONITOR_SCREEN_PLANE
    || nodes.MONITOR_ROOT
  if (!anchor) {
    console.warn('No monitor anchor found. Available nodes:', Object.keys(nodes).filter(k => k.toLowerCase().includes('monitor')))
    return null
  }
  anchor.updateWorldMatrix(true, false)
  const pos = new THREE.Vector3()
  anchor.getWorldPosition(pos)
  console.log('Monitor anchor:', anchor.name, 'World position:', pos.toArray().map(v => +v.toFixed(3)))
  return pos
}, [nodes])
```

**Step 2:** Load page, check console for the actual position values. Note them.

**Step 3:** Compare the logged position with the Blender handoff data:
- Expected from handoff-v2.json: MONITOR_SCREEN_CENTER at [0.0, -2.036, 10.293]
- Note: GLB exports as Y-up, so Blender Z becomes Three.js Y, Blender Y becomes -Three.js Z

**Step 4:** If position is wrong, manually set the correct position:

```typescript
// Blender coords (Z-up): [0, -2.036, 10.293]
// Three.js (Y-up): [0, 10.293, 2.036]  (Z→Y, -Y→Z)
const MONITOR_SCREEN_POS = new THREE.Vector3(0, 10.293, 2.036)
```

**Step 5:** Remove debug logging after calibration. Commit.

---

### Task 2.2: Calibrate Html distanceFactor and screen dimensions

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:25-28, 99-133`

**Step 1:** After fixing position, take Playwright screenshot at seated camera

**Step 2:** If the portfolio HTML is too big/small/offset, adjust these values iteratively:
- `SCREEN_DISTANCE_FACTOR` — controls visual size (larger = bigger on screen)
- `SCREEN_CSS_W` / `SCREEN_CSS_H` — pixel dimensions of the HTML container
- `rotation` — may need adjustment if screen faces wrong direction in v2 GLB

**Step 3:** Take screenshot after each adjustment until the portfolio fills the monitor screen exactly

**Step 4:** Also hide the MONITOR_SCREEN_PLANE mesh (the emissive blue plane we created in Blender) since the `<Html>` component replaces it:

```typescript
if (child.name === 'MONITOR_SCREEN_PLANE' || child.name === 'MACBOOK_SCREEN_PLANE') {
  child.visible = false
  return
}
```

**Step 5:** Commit when calibrated

---

## Phase 3: First-Person Camera

### Task 3.1: Calculate correct first-person seated position

**Files:**
- Modify: `src/components/experience/CameraRig.tsx:9-19`

**Step 1:** The current "seated" camera is at `(0, 9.5, -5)` looking at `(0, 7, 2)`. This was for the old GLB. For the v2 GLB:

From handoff-v2.json (Blender coords):
- PLAYER_HEAD: [0, 2.2, 8.63]
- CAMERA_SEATED_MAIN: position [0, 2.2, 8.63], looking at monitor

Convert Blender Z-up to Three.js Y-up:
- Blender [x, y, z] → Three.js [x, z, -y]
- PLAYER_HEAD: [0, 8.63, -2.2]

**Step 2:** Update CameraRig positions:

```typescript
const CAMERAS = {
  intro: {
    position: new THREE.Vector3(0, 14, -16),
    lookAt: new THREE.Vector3(0, 8, 0),
  },
  seated: {
    position: new THREE.Vector3(0, 8.63, -2.2),
    lookAt: new THREE.Vector3(0, 10.29, 2.04), // monitor screen center
  },
}
```

**Step 3:** Test with Playwright — take screenshot at seated mode. The view should feel like sitting at the desk looking at the monitor.

**Step 4:** Fine-tune position if needed. The monitor should fill ~60% of the viewport width.

**Step 5:** Commit

---

### Task 3.2: Improve mouse look-around for first-person feel

**Files:**
- Modify: `src/components/experience/CameraRig.tsx:77-89`

**Step 1:** Increase mouse look range for more immersive first-person:

```typescript
useFrame(() => {
  if (mode !== 'seated' || isAnimating.current) return

  const maxRotX = 0.12  // was 0.08
  const maxRotY = 0.20  // was 0.15
  const damping = 0.04  // slightly smoother

  const targetRotX = baseRotation.current.x + mouseRef.current.y * maxRotX
  const targetRotY = baseRotation.current.y + mouseRef.current.x * maxRotY

  camera.rotation.x += (targetRotX - camera.rotation.x) * damping
  camera.rotation.y += (targetRotY - camera.rotation.y) * damping
})
```

**Step 2:** Test interactively — move mouse to edges, verify smooth head-turn effect

**Step 3:** Commit

---

## Phase 4: Cinematic Intro Animation

### Task 4.1: Create dramatic flythrough intro

**Files:**
- Modify: `src/components/experience/CameraRig.tsx:43-73`

**Step 1:** Replace the simple 3s lerp with a multi-stage cinematic intro:

```typescript
useEffect(() => {
  if (mode !== 'intro') return
  isAnimating.current = true

  // Start far away and high — establishing shot
  camera.position.set(20, 18, -20)
  camera.lookAt(new THREE.Vector3(0, 8, 0))

  const lookTarget = { x: 0, y: 8, z: 0 }

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating.current = false
      camera.lookAt(CAMERAS.seated.lookAt)
      baseRotation.current.copy(camera.rotation)
      onIntroComplete()
    },
  })

  // Stage 1: Sweep in from far (2s)
  tl.to(camera.position, {
    x: 5, y: 12, z: -10,
    duration: 2,
    ease: 'power2.inOut',
  }, 0)
  tl.to(lookTarget, {
    x: 0, y: 9, z: 0,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
  }, 0)

  // Stage 2: Arc around to front of desk (2s)
  tl.to(camera.position, {
    x: 0, y: 10, z: -5,
    duration: 2,
    ease: 'power2.inOut',
  }, 2)
  tl.to(lookTarget, {
    x: 0, y: 10, z: 2,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
  }, 2)

  // Stage 3: Settle into seated position (1.5s)
  tl.to(camera.position, {
    x: CAMERAS.seated.position.x,
    y: CAMERAS.seated.position.y,
    z: CAMERAS.seated.position.z,
    duration: 1.5,
    ease: 'power3.inOut',
  }, 4)
  tl.to(lookTarget, {
    x: CAMERAS.seated.lookAt.x,
    y: CAMERAS.seated.lookAt.y,
    z: CAMERAS.seated.lookAt.z,
    duration: 1.5,
    ease: 'power3.inOut',
    onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
  }, 4)
}, [mode, camera, onIntroComplete])
```

**Step 2:** Test the full animation — reload page, watch the camera sweep

**Step 3:** Adjust positions/timing if the arc doesn't look natural

**Step 4:** Commit

---

### Task 4.2: Delay portfolio Html until camera settles

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:104-134`

**Step 1:** Add a fade-in delay so the portfolio doesn't pop in abruptly. Wrap the Html in a state:

```typescript
const [showPortfolio, setShowPortfolio] = useState(false)

useEffect(() => {
  if (mode === 'seated') {
    const timer = setTimeout(() => setShowPortfolio(true), 500)
    return () => clearTimeout(timer)
  } else {
    setShowPortfolio(false)
  }
}, [mode])
```

Then use `showPortfolio` instead of `mode === 'seated'`:

```typescript
{showPortfolio && monitorCenter && (
  <Html ... >
```

**Step 2:** Verify the transition feels smooth

**Step 3:** Commit

---

## Phase 5: Visual Polish & Performance

### Task 5.1: Improve lighting for desk without dome

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:96-100`

**Step 1:** Without the environment dome, the scene needs stronger ambient and a bottom fill:

```typescript
<ambientLight intensity={0.6} color="#E8E0FF" />
<directionalLight position={[-3, 12, 5]} intensity={1.8} color="#ffffff" castShadow />
<directionalLight position={[4, 6, -2]} intensity={0.5} color="#D0C0FF" />
<pointLight position={[-4, 8, 6]} intensity={0.6} color="#FFE8D0" distance={20} />
<pointLight position={[0, 4, 0]} intensity={0.3} color="#E0E8FF" distance={15} />
```

**Step 2:** Take Playwright screenshot, compare with before

**Step 3:** Commit

---

### Task 5.2: Add loading progress to NoiseBackground

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** Show "Loading workspace..." text over the noise background while GLB loads, with a minimal progress indicator.

The LoadingScreen already handles this. Ensure it renders OVER the noise by checking z-index:

```typescript
{mode === 'loading' && (
  <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
    <LoadingScreen progress={loadProgress} />
  </div>
)}
```

**Step 2:** Verify loading screen appears and disappears correctly

**Step 3:** Commit

---

## Phase 6: Final Validation

### Task 6.1: Full Playwright visual regression

**Step 1:** Navigate to localhost:3000, wait for full load
**Step 2:** Take screenshot at each stage:
- Loading screen
- Intro animation mid-point (use `setTimeout` or wait 3s)
- Seated view (final)
- Scrolled portfolio inside monitor
**Step 3:** Check for:
- No console errors (0 errors required)
- Warnings reduced to minimum (Three.js internals only)
- Monitor portfolio centered and readable
- Noise background visible around edges
- No floating objects in space
- Desk objects visible and lit correctly
**Step 4:** Run production build: `npx next build`
**Step 5:** Verify no TypeScript errors

### Task 6.2: Document final state

**Files:**
- Modify: handoff-v2.json or create a quick ARCHITECTURE.md

Document:
- Camera positions used (intro stages + seated)
- Monitor anchor name used
- Hide list of objects
- Noise background component location
- How to swap Spline URL back in if desired later

---

## Execution Order Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | 1.1, 1.2, 1.3 | Clean dead code, fix warnings, hide floating objects |
| 2 | 2.1, 2.2 | Fix monitor screen position and calibrate HTML overlay |
| 3 | 3.1, 3.2 | First-person camera at correct desk height |
| 4 | 4.1, 4.2 | Cinematic intro flythrough animation |
| 5 | 5.1, 5.2 | Lighting polish, loading UX |
| 6 | 6.1, 6.2 | Playwright validation, documentation |

## Risks

- **GLB coordinate conversion** (Blender Z-up → Three.js Y-up) may need trial-and-error for exact screen position
- **146MB GLB** will be slow to load — Phase 5 could add Draco compression but that's a stretch goal
- **`<Html>` component** from drei can have z-fighting with the monitor glass mesh — hiding MONITOR_SCREEN_PLANE fixes this
- **GSAP + R3F** camera animations need manual lookAt updates since R3F doesn't use GSAP natively

## Acceptance Criteria

1. Zero console errors
2. Portfolio readable inside monitor screen, correctly aligned
3. First-person seated camera feels natural (desk-height view)
4. Cinematic intro animation from far→seated in ~5.5 seconds
5. Noise background visible through transparent canvas
6. No floating decorative objects in space
7. Production build passes
8. No dead/unused files remaining
