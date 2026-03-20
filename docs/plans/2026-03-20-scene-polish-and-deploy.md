# Scene Polish & Deploy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix visual issues in the new GLB scene (pixelated plants, missing monitor screen mesh, broken hitbox names), optimize FPS, commit, and deploy preview.

**Architecture:** The portfolio uses a Three.js (R3F) canvas with a GLB model (`desk-scene-web-v2.glb`) exported from Blender. DOM overlays project onto 3D screen surfaces. DeskInteractions uses mesh names for hover/click hitboxes. Camera positions are hardcoded in CameraRig.tsx.

**Tech Stack:** Next.js 16, React Three Fiber, drei, GSAP, Three.js, Playwright (testing)

---

## Context: GLB Mesh Names

New GLB mesh names (from Blender export):
```
FRHIeNGciselOUD (×9 submeshes) — Monitor
desk001 — Desk
razer_mouse — Mouse
keyboard001 — Keyboard
coffee_cup — Coffee cup
Object_0001 (×4 submeshes) — Gaming Laptop
desk_lamp001 — Desk lamp
Object_6 (×6 submeshes) — Leica Camera
F1_Car — F1 car ornament
Wrestling_Mask — Mexican wrestling mask
Chair — Garden chair
Zumo_Robot — Zumo robot
Plant_Left — Flower pot left
Plant_Right — Flower pot right
```

**Key problem:** `DeskInteractions.tsx` references `keyboard.001` (with dot) but GLB has `keyboard001` (no dot). Same for `desk_lamp.001` → `desk_lamp001`. Also `headphones_marshall` and `macbook` don't exist in new GLB.

---

### Task 1: Fix DeskInteractions mesh name mappings

**Files:**
- Modify: `src/components/experience/DeskInteractions.tsx:11-23`

**Step 1: Update DESK_OBJECTS array to match new GLB mesh names**

```typescript
const DESK_OBJECTS: {
  name: string
  label: string
  description: string
  projectId?: string
}[] = [
  { name: 'razer_mouse', label: 'Razer Mouse', description: 'Precision instrument' },
  { name: 'keyboard001', label: 'Teclado', description: '4am hackathon mode' },
  { name: 'coffee_cup', label: 'Café de Olla', description: 'Fuel from home — MX → ES', projectId: 'clara' },
  { name: 'desk_lamp001', label: 'Lámpara', description: 'Burning midnight oil since 2022' },
  { name: 'F1_Car', label: 'Aston Martin AMR23', description: 'Alonso P1 or nothing', projectId: 'robotics' },
  { name: 'Wrestling_Mask', label: 'Máscara de Lucha', description: 'From Guadalajara with love' },
  { name: 'Zumo_Robot', label: 'Zumo 32U4', description: 'National robotics finalist', projectId: 'robotics' },
  { name: 'Gaming_Laptop', label: 'Gaming Laptop', description: 'Try the arcade →' },
]
```

Note: `headphones_marshall` and `macbook` removed (not in new GLB). `Gaming_Laptop` replaces `macbook` for arcade reference. New objects (F1_Car, Wrestling_Mask, Zumo_Robot) added with personality descriptions. `Gaming_Laptop` is the parent node for `Object_0001` submeshes — need to verify this resolves via `getObjectByName`.

**Step 2: Verify mesh lookup works with parent node names**

The `getObjectByName('Gaming_Laptop')` call should find the parent node even though the meshes are `Object_0001`, `Object_0001_1`, etc. Same for `F1_Car` (mesh is `F1_Car`). Test by checking browser console for hitbox count after reload.

**Step 3: Commit**

```bash
git add src/components/experience/DeskInteractions.tsx
git commit -m "fix: update DeskInteractions mesh names for new GLB export"
```

---

### Task 2: Fix monitor screen detection

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:91-101` and `138-139`

**Step 1: Identify the monitor screen mesh in new GLB**

The Monitor is exported as `FRHIeNGciselOUD` (scrambled Blender name) with 9 submeshes. The screen is likely one of these submeshes. The code looks for `monitor_screen`, `screen_plane`, `screen_glass`, `screen_quad` — none of which exist in the new GLB.

The monitor overlay still works because it falls back to viewport-center positioning when no screen mesh is found (line 313 in ExperienceWrapper.tsx). But the emissive glow effect won't apply.

Update the screen detection to check for the Monitor's specific submesh that represents the screen surface. Since we can't know which submesh is the screen without inspection, use a heuristic: find the flattest submesh of FRHIeNGciselOUD (smallest Z extent) that's at the correct height.

Alternative simpler approach: since the overlay fallback works fine, just update the emissive material to apply to the correct mesh name prefix:

```typescript
// Monitor screen: subtle glow so it looks "on"
// The monitor mesh is FRHIeNGciselOUD — apply emissive to largest flat submesh
if (nameLower.includes('frhiengciseloud')) {
  // Check if this submesh is likely the screen (flat, facing forward)
  const geo = child.geometry
  if (geo) {
    geo.computeBoundingBox()
    const bb = geo.boundingBox!
    const depth = bb.max.z - bb.min.z
    // Screen is very thin in depth
    if (depth < 0.1) {
      child.material = new THREE.MeshStandardMaterial({
        color: '#1a1a2e',
        emissive: '#2a2a4a',
        emissiveIntensity: 0.8,
        roughness: 0.05,
        metalness: 0.3,
        side: THREE.DoubleSide,
      })
      return
    }
  }
}
```

Also update `extractCorners` to use the new monitor name:

```typescript
const monitorCorners = extractCorners(['frhiengciseloud'])
```

**Step 2: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "fix: update monitor screen detection for new GLB mesh names"
```

---

### Task 3: Fix ShadowMap warning spam

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:286`

**Step 1: Change shadow type to BasicShadowMap to eliminate PCFSoftShadowMap warnings**

The `PCFSoftShadowMap has been removed` warning floods the console (100+ per second). This is because Three.js r160+ removed PCFSoftShadowMap. The Canvas `shadows` prop defaults to it. Fix:

```typescript
<Canvas
  style={{ width: '100%', height: '100%', background: 'transparent' }}
  camera={{ fov: 45, near: 0.1, far: 200, position: [0, 12, -12] }}
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  shadows="basic"
>
```

Or better, use `shadows={{ type: THREE.PCFShadowMap }}` if available.

**Step 2: Test — reload page, console should be clean (no shadow warnings)**

**Step 3: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "fix: eliminate PCFSoftShadowMap warning spam"
```

---

### Task 4: Performance — reduce shadow map and post-processing cost

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:229,248-255,299-303`

**Step 1: Reduce shadow map size and disable ContactShadows**

FPS is ~44-49 (Playwright detected). Targets:
- Shadow map: 2048→1024
- ContactShadows: remove entirely (expensive, adds a second render pass)
- Bloom: reduce or remove (costs ~3-5ms per frame)

```typescript
// Shadow map reduction
shadow-mapSize={[1024, 1024]}

// Remove ContactShadows entirely (comment out or delete the block)

// Simplify post-processing — keep only ToneMapping
<EffectComposer multisampling={0}>
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
</EffectComposer>
```

**Step 2: Test — FPS should improve to 55+**

**Step 3: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "perf: reduce shadow map, remove ContactShadows and Bloom for better FPS"
```

---

### Task 5: Add background color to canvas

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Add a scene background color**

The scene currently has `alpha: true` with transparent background, which shows whatever is behind. Add a warm peach/cream background to match the Blender scene:

```typescript
// Inside Scene component, after primitive:
<color attach="background" args={['#FAC8A5']} />
```

This matches the Blender world color RGB(250,188,165).

**Step 2: Verify visually in browser**

**Step 3: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "feat: add peach background color to match Blender environment"
```

---

### Task 6: Commit new GLB and deploy-prep

**Files:**
- Stage: `public/models/desk-scene-web-v2.glb`
- Modify: `.gitignore`

**Step 1: Add new GLB to git**

```bash
git add public/models/desk-scene-web-v2.glb
git commit -m "feat: add optimized GLB with all desk objects (5.3MB, no Draco)"
```

**Step 2: Run production build**

```bash
npx next build
```

Expected: Build passes with 0 errors.

**Step 3: Commit any build fixes if needed**

---

### Task 7: Playwright visual verification

**Files:**
- Test: `e2e/visual-design.spec.ts` (existing)

**Step 1: Run visual tests**

```bash
npx playwright test e2e/visual-design.spec.ts --project=chromium
```

**Step 2: Fix any failures**

**Step 3: Commit fixes**

```bash
git commit -m "test: update visual tests for new GLB scene"
```

---

### Task 8: Deploy preview

**Step 1: Push to remote**

```bash
git push origin main
```

**Step 2: Verify deploy (if Vercel is configured)**

Check deployment URL for visual correctness.
