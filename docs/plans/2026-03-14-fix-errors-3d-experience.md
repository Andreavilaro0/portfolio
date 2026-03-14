# Fix All Errors — 3D Experience Portfolio

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix every build error, runtime bug, and dead code issue so the 3D hybrid experience compiles cleanly and works end-to-end.

**Architecture:** Delete orphaned files that reference deleted modules, wire up the GLB loading progress to the loading bar, remove no-op code, then verify with build + dev server.

**Tech Stack:** Next.js 16 (Turbopack), React Three Fiber, GSAP, meshoptimizer

---

## Phase 1: Fix Build-Breaking Error

### Task 1: Delete orphaned ProjectsSection.tsx

**Files:**
- Delete: `src/components/layout/ProjectsSection.tsx`

**Step 1: Verify no other file imports ProjectsSection**

Run: `grep -r "ProjectsSection" src/ --include="*.tsx" --include="*.ts"`
Expected: Only `src/components/layout/ProjectsSection.tsx` itself

**Step 2: Delete the file**

```bash
rm src/components/layout/ProjectsSection.tsx
```

**Step 3: Run build to verify it passes**

Run: `npx next build 2>&1 | tail -20`
Expected: "Compiled successfully" — no type errors

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: delete orphaned ProjectsSection importing deleted recipes module"
```

---

## Phase 2: Fix Loading Progress Bug

### Task 2: Wire onProgress to THREE.DefaultLoadingManager

The `onProgress` prop is passed to `DeskScene` but never called — the loading bar stays at 0%.

**Files:**
- Modify: `src/components/experience/DeskScene.tsx` (Scene component, lines 19-48)

**Step 1: Add onProgress to Scene props and wire to LoadingManager**

In `DeskScene.tsx`, the `Scene` component needs to:
1. Accept `onProgress` as a prop
2. Use `THREE.DefaultLoadingManager.onProgress` to report loading

Replace the Scene function signature and the useEffect:

```tsx
function Scene({ onLoaded, onProgress, onEnterPortfolio, mode, onIntroComplete }: {
  onLoaded: () => void
  onProgress: (p: number) => void
  onEnterPortfolio: () => void
  mode: ExperienceMode
  onIntroComplete: () => void
}) {
```

Add a useEffect at the top of Scene (before the existing one) to wire the loading manager:

```tsx
useEffect(() => {
  const manager = THREE.DefaultLoadingManager
  manager.onProgress = (_url, loaded, total) => {
    if (total > 0) {
      onProgress(Math.round((loaded / total) * 100))
    }
  }
  return () => {
    manager.onProgress = () => {}
  }
}, [onProgress])
```

**Step 2: Pass onProgress to Scene in the Canvas**

In the DeskScene export, pass `onProgress` to `<Scene>`:

```tsx
<Scene
  onLoaded={onLoaded}
  onProgress={onProgress}
  onEnterPortfolio={onEnterPortfolio}
  mode={mode}
  onIntroComplete={onIntroComplete}
/>
```

**Step 3: Run dev server and check loading bar moves**

Run: `npx next dev`
Expected: Loading bar advances from 0% to 100% as GLB loads, then scene starts intro

**Step 4: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "fix: wire GLB loading progress to loading bar via DefaultLoadingManager"
```

---

## Phase 3: Clean Up Hero.tsx No-Op

### Task 3: Remove gsap.registerPlugin() with no arguments

**Files:**
- Modify: `src/components/layout/Hero.tsx` (line 7)

**Step 1: Remove the no-op line**

Delete line 7: `gsap.registerPlugin()`

This call with zero arguments does nothing and is a leftover from when ScrollTrigger or another plugin was intended.

**Step 2: Verify build still passes**

Run: `npx next build 2>&1 | tail -10`
Expected: Compiled successfully

**Step 3: Commit**

```bash
git add src/components/layout/Hero.tsx
git commit -m "fix: remove no-op gsap.registerPlugin() call"
```

---

## Phase 4: End-to-End Verification

### Task 4: Full build + runtime test

**Step 1: Clean build**

Run: `npx next build 2>&1 | tail -20`
Expected: Compiled successfully, 0 errors

**Step 2: Start dev server and test the full flow**

Run: `npx next dev`

Test checklist:
- [ ] Loading screen appears with "ANDREA AVILA" and progress bar
- [ ] Progress bar advances to 100% (not stuck at 0%)
- [ ] After load, camera animates from intro position to seated position
- [ ] In seated mode, mouse look-around works (subtle rotation)
- [ ] "Enter Portfolio →" button visible on/near monitor
- [ ] Clicking "Enter Portfolio →" transitions to portfolio content
- [ ] All portfolio sections render (Hero, Marquee, About, CivicAid, CapturingMoments, Robotics, OS, Footer)
- [ ] "← Back to desk" button returns to 3D scene
- [ ] No console errors

**Step 3: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "fix: verified 3D experience works end-to-end"
```

---

## Summary of Errors Fixed

| # | Type | File | Issue |
|---|------|------|-------|
| 1 | BUILD BREAKER | ProjectsSection.tsx | Imports deleted `@/data/recipes` |
| 2 | RUNTIME BUG | DeskScene.tsx | `onProgress` never called → loading bar stuck at 0% |
| 3 | CODE SMELL | Hero.tsx | `gsap.registerPlugin()` with no arguments (no-op) |
