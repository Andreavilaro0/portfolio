# Monitor Embed Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the PortfolioContent page appear perfectly inside the 3D monitor screen with a browser chrome bar on top, so it looks like you're looking at a real browser on a real monitor. The page must follow the monitor in 3D when the camera moves (free-look).

**Architecture:** Use drei `<Html transform>` positioned at the exact center of the monitor screen mesh (`FRHIeNGciselOUD`). The position/scale must be calibrated iteratively using Playwright screenshots until it fits the monitor bezel perfectly. A browser chrome bar (macOS style with traffic lights + URL bar) sits on top.

**Tech Stack:** React Three Fiber, drei `<Html>`, Playwright MCP for visual verification

---

## Known values from codebase

- Monitor mesh name: `FRHIeNGciselOUD` (inside `Monitor` node)
- Monitor node translation: `[0, 10.608, 1.616]`, scale: `[1.06, 1.10, 1.06]`
- Monitor screen center (from CameraRig comment): `(0, 10.293, 2.04)`, size `7.2 x 4.1`
- Seated camera: position `(0, 10.5, -8.0)`, lookAt `(0, 10.5, 2)`
- The `<Html>` z position must be LESS than the monitor screen z (~2.04) to appear IN FRONT
- Current values: position `[0, 10.3, 0.2]`, scale `0.24` — too far forward, doesn't fill screen

## The problem

The `<Html>` position/scale/size don't match the monitor screen. We need to find the exact values by iterating: adjust → screenshot → compare → adjust again.

---

### Task 1: Extract exact monitor screen bounds at runtime

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Add console.log to extract exact screen bounding box**

Inside the `useEffect` that traverses the scene (after `onLoaded()`), add a log that prints the exact world-space bounding box of the monitor screen mesh:

```typescript
// After the extractCorners call for monitor (~line 177)
scene.traverse((child) => {
  if (child instanceof THREE.Mesh && child.name.toLowerCase().includes('frhiengciseloud')) {
    const box = new THREE.Box3().setFromObject(child)
    console.log('MONITOR SCREEN BOUNDS:', {
      min: { x: box.min.x.toFixed(3), y: box.min.y.toFixed(3), z: box.min.z.toFixed(3) },
      max: { x: box.max.x.toFixed(3), y: box.max.y.toFixed(3), z: box.max.z.toFixed(3) },
      center: {
        x: ((box.min.x + box.max.x) / 2).toFixed(3),
        y: ((box.min.y + box.max.y) / 2).toFixed(3),
        z: ((box.min.z + box.max.z) / 2).toFixed(3),
      },
      size: {
        w: (box.max.x - box.min.x).toFixed(3),
        h: (box.max.y - box.min.y).toFixed(3),
      }
    })
  }
})
```

**Step 2: Open in browser, read the console output**

Use Playwright to navigate to localhost:3000, click the loading screen to enter, wait for the scene to load, then read console messages to get exact values.

**Step 3: Record the values**

Write down: center X, center Y, center Z, width, height of the monitor screen in world space. These are the GROUND TRUTH values.

---

### Task 2: Calculate correct Html position and scale

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Calculate the correct values**

Given:
- Monitor screen center: `(cx, cy, cz)` from Task 1
- Monitor screen size: `(sw, sh)` from Task 1
- Html content size: `1280 x 800` pixels
- We need `<Html>` to appear on the surface of the screen

The Html position should be:
- X = cx (centered horizontally)
- Y = cy (centered vertically)
- Z = cz - 0.01 (just barely in front of the screen surface)

The Html scale should be calculated so the rendered HTML fills the monitor:
- The `distanceFactor` and `scale` together determine the rendered size
- Start with: `scale = sw / (1280 * SOME_FACTOR)`
- This needs iteration — start with a value, screenshot, adjust

**Step 2: Apply the calculated position**

Update the `<Html>` props:
```tsx
position={[cx, cy, cz - 0.01]}
scale={calculated_scale}
```

**Step 3: Verify with Playwright screenshot**

Take a screenshot and visually check:
- Does the page fill the monitor screen?
- Is the browser chrome visible at the top?
- Are there white gaps around the edges?
- Is any content clipped?

**Step 4: Adjust and re-screenshot**

If not perfect:
- Too big → decrease scale by 0.02
- Too small → increase scale by 0.02
- Off-center horizontally → adjust X
- Off-center vertically → adjust Y
- Behind monitor → decrease Z (move forward)
- Floating in front → increase Z (move back)

Repeat steps 3-4 until the page fits the monitor bezel perfectly.

---

### Task 3: Fix the browser chrome appearance

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Verify browser chrome is visible**

The browser chrome (traffic lights + URL bar) should be visible at the TOP of the monitor content. If it's cut off or invisible:
- The `height` of the Html style might need to be taller to include the 36px chrome bar
- The scroll container height must be `height - 36px`

**Step 2: Style the chrome to look like real Arc/Chrome**

Ensure:
- Dark background (#1e1e1e) contrasts with page content
- Traffic lights are red/yellow/green circles
- URL bar shows lock icon + "andreaavila.dev"
- No white borders or gaps

**Step 3: Screenshot and verify**

---

### Task 4: Verify free-look camera tracking

**Step 1: Test with Playwright**

Navigate to the page, enter the 3D experience, then simulate mouse movement to trigger the free-look parallax. Take screenshots at different mouse positions.

**Step 2: Verify the page stays on the monitor**

The `<Html transform>` should automatically track the 3D monitor position. Verify:
- Page doesn't lag behind camera movement
- Page doesn't float away from monitor
- Page perspective matches the 3D scene

---

### Task 5: Remove unused overlay code

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Clean up ExperienceWrapper**

Remove:
- `monitorOverlayRef` (no longer needed)
- `monitorRect` / `setMonitorRect` state (no longer needed)
- `clampedMonitor` / `hasMonitorRect` calculations (no longer needed)
- `onMonitorRect` prop passing to DeskScene
- The `MonitorPortfolio` import (replaced by PortfolioContent in DeskScene)
- The `ScreenProjector` for monitor corners (no longer needed for DOM overlay)

Keep:
- `macbookRect` / ScreenProjector for macbook (if still used)
- All sketchbook/focused mode code

**Step 2: Clean up DeskScene**

Remove:
- `onMonitorRect` prop and its usage
- `monitorCorners3D` state if only used for ScreenProjector
- The monitor ScreenProjector component

Keep:
- The `<Html transform>` with PortfolioContent (this is the replacement)

**Step 3: Build and verify**

```bash
npx next build
```

Expected: PASS with no TypeScript errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: embed PortfolioContent in 3D monitor with Html transform"
```

---

## Iteration Protocol

If after Task 2-3 the page still doesn't look right:

1. Take a Playwright screenshot
2. Identify the specific problem (too big, too small, offset, clipped)
3. Adjust ONE value at a time (position, scale, or size)
4. Save file, wait for HMR, take another screenshot
5. Repeat until perfect

**Never change more than one parameter at a time** — this makes it impossible to know which change fixed/broke things.
