# Fix All Errors — Portfolio 3D Desk Experience

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix every visual, functional, and structural error in the 3D desk portfolio experience.

**Architecture:** Next.js 16 + React Three Fiber canvas with GLB desk scene. Portfolio renders inside monitor via `<Html>`. Snake game on MacBook. NoiseBackground behind transparent canvas. Navigation arrows switch camera between monitor ↔ MacBook.

**Tech Stack:** Next.js 16, React 19, R3F, drei, GSAP, Tailwind v4, TypeScript

---

## Errors Found (Playwright Audit — 2026-03-16)

### CRITICAL

| # | Error | Location | Screenshot |
|---|-------|----------|------------|
| C1 | **Mobile completely broken** — 3D canvas overflows, portfolio content escapes monitor frame, footer visible below canvas, no usable layout on 390px | `ExperienceWrapper.tsx`, `DeskScene.tsx` | audit-6-mobile.png |
| C2 | **GLB is 146MB** — takes 30-50s to load on localhost, unusable on real network. Original optimized GLB (`desk-scene-opt.glb`, 3.2MB) exists but unused | `DeskScene.tsx:43` | - |
| C3 | **CivicAid iframe loads full external site** inside the monitor scroll — heavy, breaks scroll performance, pulls in entire app with its own Three.js | `CivicAidSection.tsx` | audit-3-civicaid.png |

### HIGH

| # | Error | Location |
|---|-------|----------|
| H1 | **Monitor screen shows blue/lavender background** instead of just the portfolio content — the `<Html>` background `#F2F0ED` doesn't match the screen glass material, creating a visible blue border around the content | `DeskScene.tsx:109-132` |
| H2 | **Navigation arrow overlaps MacBook** in seated view — the `>` button at right edge sits on top of the 3D MacBook, looks messy | `ExperienceWrapper.tsx` |
| H3 | **`environment_dome` and `stage_floor` hidden** — removes the scene's ground plane, objects float in void with only noise blobs behind. Desk has no surface reflection/ground | `DeskScene.tsx:73-75` |
| H4 | **Snake game keyboard input conflicts with page** — pressing arrow keys or WASD when in macbook mode also scrolls the page or triggers other behaviors | `SnakeGame.tsx` |
| H5 | **Spline `@splinetool/react-spline` still loaded** — NoiseBackground replaced it but the Spline runtime (1.2MB) still gets bundled because `SplineShowcase` import chain exists in `PortfolioContent` | `PortfolioContent.tsx` references `SplineShowcase` |

### MEDIUM

| # | Error | Location |
|---|-------|----------|
| M1 | **No loading indicator for GLB** — `LoadingScreen` exists but progress bar may not update correctly with the v2 GLB (meshoptimizer loader) | `LoadingScreen.tsx`, `DeskScene.tsx:58-64` |
| M2 | **Console warnings** — THREE.Clock deprecated, PCFSoftShadowMap x4, Spline version mismatch. Not errors but noisy | Various |
| M3 | **`desk-scene-v2.glb` not in .gitignore** — 146MB binary would bloat the repo | `.gitignore` |
| M4 | **Orphaned files** — `SplineExperience.tsx`, `NoiseBackground.tsx` created but SplineExperience no longer used as entry point | `src/components/experience/SplineExperience.tsx` |
| M5 | **Debug console.logs left in production code** — `[DeskScene] Monitor bbox center`, `[DeskScene] MacBook bbox center` | `DeskScene.tsx` |
| M6 | **No `<meta viewport>` explicit** — relies on Next.js default, mobile scaling may be off | `layout.tsx` |
| M7 | **RobotViewer loads STL from ImageKit CDN** inside the monitor scroll — another heavy 3D scene inside the portfolio content, competes with main R3F canvas for GPU | `RobotViewer.tsx` |

### LOW / POLISH

| # | Error | Location |
|---|-------|----------|
| L1 | **Arrow buttons have inline styles** with onMouseEnter/Leave handlers — fragile, should use CSS :hover | `ExperienceWrapper.tsx` |
| L2 | **No favicon** — `/icon.svg` referenced but may not exist (404 in console) | `public/icon.svg` |
| L3 | **Footer says "Built with Next.js + Three.js"** — should be updated if architecture changed | `Footer.tsx` |
| L4 | **`getBBoxCenter` computed every render** — should be stable ref since scene doesn't change | `DeskScene.tsx` |

---

## Fix Plan — Ordered by Impact

### Task 1: Switch to optimized GLB (C2)

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** Change GLB path from `desk-scene-v2.glb` to `desk-scene-opt.glb`

```typescript
// Line 43: change path
const { scene, nodes } = useGLTF('/models/desk-scene-opt.glb', ...)
// Line 158: change preload
useGLTF.preload('/models/desk-scene-opt.glb')
```

**Step 2:** Test that the scene still loads (check if `desk-scene-opt.glb` has the same node names). If nodes differ, fall back to `desk-scene-v2.glb` but add it to `.gitignore`.

**Step 3:** Verify visually with Playwright screenshot.

---

### Task 2: Remove debug logs (M5)

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** Remove all `console.log('[DeskScene]` lines and the `useEffect` that logs node names.

---

### Task 3: Fix mobile layout (C1)

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** On mobile (< 768px), hide the 3D canvas entirely and show a flat version of the portfolio:

```tsx
// Add state for mobile detection
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth < 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])

// In render: if mobile, skip 3D entirely
if (isMobile) {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <NoiseBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <PortfolioContent />
      </div>
    </div>
  )
}
```

---

### Task 4: Restore ground plane (H3)

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** Remove the lines that hide `environment_dome` and `stage_floor`. Instead, make `stage_floor` semi-transparent so noise shows through but desk has ground context:

```typescript
if (child.name === 'stage_floor') {
  child.material = child.material.clone()
  child.material.transparent = true
  child.material.opacity = 0.3
  return
}
if (child.name === 'environment_dome') {
  child.visible = false
  return
}
```

---

### Task 5: Fix monitor screen blue border (H1)

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** The Html overlay background should perfectly match. The blue/lavender comes from the monitor glass material bleeding around the edges. Reduce the distanceFactor slightly or clip the Html to hide the border:

```typescript
style={{
  width: `${SCREEN_CSS_W}px`,
  height: `${SCREEN_CSS_H}px`,
  overflow: 'hidden',
  background: '#F2F0ED',
  borderRadius: '0px', // remove border radius
  pointerEvents: 'auto',
  boxShadow: '0 0 0 2px #F2F0ED', // bleed match color outward
}}
```

---

### Task 6: Fix navigation arrows (H2, L1)

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** Move arrow buttons to use CSS classes instead of inline styles. Position them better so they don't overlap 3D content:

- Right arrow: `right: 1.5rem, top: 50%` with `backdrop-filter` and semi-transparent bg
- Left arrow: `left: 1.5rem, top: 50%`
- Add hover via CSS class, not JS handlers
- Add `z-index: 30` to ensure above canvas

---

### Task 7: Fix Snake keyboard conflict (H4)

**Files:**
- Modify: `src/components/layout/SnakeGame.tsx`

**Step 1:** Add `e.stopPropagation()` and `e.preventDefault()` to the keydown handler. Only capture keys when the game container is focused:

```typescript
// In useEffect keydown handler:
const handleKey = (e: KeyboardEvent) => {
  // ...existing code...
  e.preventDefault()
  e.stopPropagation()
}
```

---

### Task 8: Remove CivicAid iframe from monitor scroll (C3)

**Files:**
- Modify: `src/components/layout/CivicAidSection.tsx`

**Step 1:** Replace the live iframe with a static screenshot or a link. The full CivicAid app loading inside the monitor kills performance:

```tsx
// Replace iframe with image + link
<a href="https://andreavilaro0.github.io/civicaid-voice/" target="_blank">
  <img src="/images/civicaid-preview.png" alt="Clara - CivicAid Voice" />
</a>
```

If no preview image exists, remove the iframe entirely and keep just the text description + link.

---

### Task 9: Remove Spline dependency from bundle (H5)

**Files:**
- Modify: `src/components/layout/PortfolioContent.tsx`

**Step 1:** Check if `SplineShowcase` is still imported. If yes, remove it from PortfolioContent since Spline scenes are no longer used (NoiseBackground replaced them):

```typescript
// Remove: import { SplineShowcase } from './SplineShowcase'
// Remove: <SplineShowcase /> from JSX
```

---

### Task 10: Clean up orphaned files (M4)

**Files:**
- Delete: `src/components/experience/SplineExperience.tsx`
- Keep: `src/components/layout/NoiseBackground.tsx` (still used)
- Delete: `src/components/layout/SplineScene.tsx` (already deleted per git status)
- Delete: `src/components/layout/SplineShowcase.tsx` (already deleted per git status)

---

### Task 11: Add GLB to gitignore (M3)

**Files:**
- Modify: `.gitignore`

**Step 1:** Add:
```
public/models/*.glb
```

---

### Task 12: Disable RobotViewer inside monitor (M7)

**Files:**
- Modify: `src/components/layout/RoboticsSection.tsx`

**Step 1:** The RobotViewer creates a second Three.js canvas inside the portfolio scroll. Replace with a static image of the robot, or use `IntersectionObserver` to only load when actually scrolled into view AND only on desktop.

---

### Task 13: Final Playwright validation

**Step 1:** Desktop screenshot — seated view, portfolio centered
**Step 2:** Desktop screenshot — macbook view, snake centered
**Step 3:** Mobile screenshot — flat portfolio, readable
**Step 4:** Console — 0 errors, minimal warnings
**Step 5:** Build — `next build` passes clean
**Step 6:** Load time — GLB loads in < 5s on localhost

---

## Priority Execution Order

1. **Task 1** — Switch GLB (biggest perf win, 146MB → 3.2MB)
2. **Task 2** — Remove debug logs
3. **Task 3** — Fix mobile
4. **Task 8** — Remove CivicAid iframe
5. **Task 9** — Remove Spline from bundle
6. **Task 4** — Restore ground plane
7. **Task 5** — Fix blue border
8. **Task 6** — Fix arrows
9. **Task 7** — Fix Snake keyboard
10. **Task 10** — Clean orphaned files
11. **Task 11** — Gitignore GLBs
12. **Task 12** — Disable RobotViewer
13. **Task 13** — Final validation
