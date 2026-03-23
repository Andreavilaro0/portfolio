# Sketchbook Interactivo — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When the user clicks the sketchbook on the desk, the camera flies to a top-down view and a page-flip slideshow appears showing hand-drawn sketches of each project. Clicking a page navigates to that project.

**Architecture:** Pure CSS/GSAP page-flip animation over a DOM overlay (no 3D page mesh). The sketchbook focus triggers a special mode `'sketchbook'` that shows a fixed overlay with 5 project sketch pages. Navigation via arrows or click. No new dependencies — GSAP handles all animation.

**Tech Stack:** React 19, GSAP 3, Next.js 16, TypeScript, CSS transforms (perspective + rotateY for page flip)

---

## Context for the implementer

### Project structure
```
src/components/experience/
├── CameraRig.tsx         — camera positions & animations
├── DeskInteractions.tsx   — hover/click on desk objects
├── DeskScene.tsx          — GLB loader, materials, lighting
├── ExperienceWrapper.tsx  — global state machine, overlays
└── (NEW) SketchbookViewer.tsx — page-flip slideshow

src/data/projects.ts       — 5 projects with id, title, tech, etc.

public/sketches/
├── sketch-clara.jpg       — CLARA voice assistant sketch
├── sketch-photo.jpg       — Photography portfolio sketch
├── sketch-robotics.jpg    — Zumo robot sketch
├── sketch-todo.jpg        — Task dashboard sketch
└── sketch-os.jpg          — Kernel simulator sketch
```

### Mode state machine (ExperienceWrapper)
```
loading → intro → seated ↔ macbook
                        ↕
                     focused (any object)
                        ↕
                     sketchbook (NEW — special focused)
```

### Key conventions
- Object names in GLB: `Box003` = sketchbook pages mesh
- Camera for sketchbook: `OBJECT_CAMERAS['Box003']` exists at `(-3.0, 9.0, -3.0)` lookAt `(-3.5, 6.5, 1.0)`
- Need a NEW top-down camera for reading pages: position directly above, looking straight down
- Escape or "Back" returns to `seated`
- GSAP is the ONLY animation library — no framer-motion
- All overlays are fixed-position DOM (not drei `<Html>`) — drei `transform` kills text rendering

### Sketch images mapping
```typescript
const SKETCH_PAGES = [
  { projectId: 'clara',    image: '/sketches/sketch-clara.jpg',    title: 'CLARA — CivicAid' },
  { projectId: 'photo',    image: '/sketches/sketch-photo.jpg',    title: 'Capturing Moments' },
  { projectId: 'robotics', image: '/sketches/sketch-robotics.jpg', title: 'ASTI Robotics' },
  { projectId: 'todo',     image: '/sketches/sketch-todo.jpg',     title: 'Task Dashboard' },
  { projectId: 'os',       image: '/sketches/sketch-os.jpg',       title: 'Kernel Sim' },
]
```

---

## Task 1: Add `'sketchbook'` mode to ExperienceWrapper

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Add mode type**

In the `ExperienceMode` type union, add `'sketchbook'`:

```typescript
export type ExperienceMode = 'loading' | 'intro' | 'overview' | 'seated' | 'macbook' | 'project' | 'focused' | 'sketchbook'
```

**Step 2: Add sketchbook state + handlers**

After the `unfocusObject` callback (~line 174), add:

```typescript
const openSketchbook = useCallback(() => {
  setFocusedObject('Box003')
  setIsTransitioning(true)
  setMode('sketchbook')
  track('object_focused', { object: 'sketchbook' })
  setTimeout(() => setIsTransitioning(false), 2000)
}, [track])

const closeSketchbook = useCallback(() => {
  setFocusedObject(null)
  setIsTransitioning(true)
  setMode('seated')
  setTimeout(() => setIsTransitioning(false), 2000)
}, [])
```

**Step 3: Update focusObject to intercept Box003**

Modify the existing `focusObject` callback to detect Box003 and redirect:

```typescript
const focusObject = useCallback((objectName: string) => {
  if (objectName === 'Box003') {
    openSketchbook()
    return
  }
  setFocusedObject(objectName)
  setIsTransitioning(true)
  setMode('focused')
  track('object_focused', { object: objectName })
  setTimeout(() => setIsTransitioning(false), 2000)
}, [track, openSketchbook])
```

**Step 4: Update overlay sync to hide monitor in sketchbook mode**

The `activeScreen` sync `useEffect` already handles `'focused'` → `'none'`. The `'sketchbook'` mode also needs `'none'`:

```typescript
} else if (mode === 'focused' || mode === 'sketchbook') {
  setActiveScreen('none')
}
```

**Step 5: Update Escape handler to include sketchbook**

```typescript
useEffect(() => {
  if (mode !== 'project' && mode !== 'focused' && mode !== 'sketchbook') return
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (mode === 'sketchbook') {
        closeSketchbook()
      } else if (mode === 'focused') {
        setFocusedObject(null)
        setMode('seated')
      } else {
        exitProject()
      }
    }
  }
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [mode, closeSketchbook])
```

**Step 6: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: add sketchbook mode to experience state machine"
```

---

## Task 2: Add top-down camera for sketchbook in CameraRig

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Update Box003 camera to top-down reading view**

Change the existing `OBJECT_CAMERAS['Box003']` entry to look straight down at the notebook — like you're reading it on the desk:

```typescript
// Sketchbook: top-down reading view (looking straight down at pages)
'Box003': { position: new THREE.Vector3(-3.5, 10.0, 1.0), lookAt: new THREE.Vector3(-3.5, 6.5, 1.0) },
```

This places the camera directly above the notebook at Y=10, looking down to Y=6.5 (the desk surface).

**Step 2: Handle 'sketchbook' mode in the focused camera effect**

The existing `useEffect` for focused mode (line ~210) checks `mode !== 'focused'`. Update the condition to also trigger on `'sketchbook'`:

```typescript
useEffect(() => {
  if (mode !== 'focused' && mode !== 'sketchbook') return
  if (!focusedObject) return
  // ... rest stays the same
```

**Step 3: Disable parallax in sketchbook mode**

In the `useFrame` callback, add `'sketchbook'` to the exit-early check:

```typescript
if (mode !== 'seated' && mode !== 'macbook' && mode !== 'project' && mode !== 'focused' && mode !== 'sketchbook') return
```

Actually the parallax should be disabled (no head movement when reading). Simpler: only allow parallax in the modes that want it:

```typescript
useFrame(() => {
  if (mode !== 'seated' && mode !== 'macbook' && mode !== 'project') return
  // 'focused' and 'sketchbook' intentionally excluded — no parallax when looking at objects
```

**Step 4: Commit**

```bash
git add src/components/experience/CameraRig.tsx
git commit -m "feat: top-down camera for sketchbook reading view"
```

---

## Task 3: Create SketchbookViewer component

**Files:**
- Create: `src/components/experience/SketchbookViewer.tsx`

**Step 1: Create the component**

```tsx
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

const SKETCH_PAGES = [
  { projectId: 'clara',    image: '/sketches/sketch-clara.jpg',    title: 'CLARA — CivicAid',    num: '01' },
  { projectId: 'photo',    image: '/sketches/sketch-photo.jpg',    title: 'Capturing Moments',   num: '02' },
  { projectId: 'robotics', image: '/sketches/sketch-robotics.jpg', title: 'ASTI Robotics',        num: '03' },
  { projectId: 'todo',     image: '/sketches/sketch-todo.jpg',     title: 'Task Dashboard',       num: '04' },
  { projectId: 'os',       image: '/sketches/sketch-os.jpg',       title: 'Kernel Sim',           num: '05' },
]

interface SketchbookViewerProps {
  onClose: () => void
  onProjectSelect: (projectId: string) => void
}

export function SketchbookViewer({ onClose, onProjectSelect }: SketchbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Entry animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: 'power2.out' }
      )
    }
  }, [])

  const flipTo = useCallback((nextPage: number) => {
    if (isFlipping || nextPage < 0 || nextPage >= SKETCH_PAGES.length) return
    if (nextPage === currentPage) return

    setIsFlipping(true)
    const direction = nextPage > currentPage ? 1 : -1

    if (pageRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentPage(nextPage)
          setIsFlipping(false)
        },
      })

      // Flip out current page
      tl.to(pageRef.current, {
        rotateY: direction * -90,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        transformOrigin: direction > 0 ? 'left center' : 'right center',
      })
      // Snap to flipped-in position and animate in
      tl.set(pageRef.current, {
        rotateY: direction * 90,
      })
      tl.call(() => setCurrentPage(nextPage))
      tl.to(pageRef.current, {
        rotateY: 0,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
        transformOrigin: direction > 0 ? 'right center' : 'left center',
      })
    }
  }, [currentPage, isFlipping])

  // Arrow keys navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        flipTo(currentPage + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        flipTo(currentPage - 1)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentPage, flipTo])

  const page = SKETCH_PAGES[currentPage]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        opacity: 0,
      }}
    >
      {/* Page container with perspective */}
      <div style={{ perspective: '1200px', width: 'clamp(300px, 55vw, 680px)' }}>
        <div
          ref={pageRef}
          onClick={() => onProjectSelect(page.projectId)}
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* Sketch image */}
          <img
            src={page.image}
            alt={page.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />

          {/* Page number tab */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'rgba(60,50,40,0.6)',
            background: 'rgba(255,250,240,0.7)',
            padding: '3px 8px',
            borderRadius: '2px',
          }}>
            {page.num} / {String(SKETCH_PAGES.length).padStart(2, '0')}
          </div>

          {/* Hover overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            background: 'linear-gradient(transparent, rgba(26,26,26,0.85))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#F2F0ED',
                letterSpacing: '0.05em',
              }}>
                {page.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: '9px',
                color: '#BEFF00',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                Click to view project →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
      }}>
        <button
          onClick={() => flipTo(currentPage - 1)}
          disabled={currentPage === 0 || isFlipping}
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '18px',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            color: currentPage === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px',
            cursor: currentPage === 0 ? 'default' : 'pointer',
          }}
        >
          ←
        </button>

        {/* Page dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SKETCH_PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => flipTo(i)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: i === currentPage ? '#BEFF00' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => flipTo(currentPage + 1)}
          disabled={currentPage === SKETCH_PAGES.length - 1 || isFlipping}
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '18px',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            color: currentPage === SKETCH_PAGES.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px',
            cursor: currentPage === SKETCH_PAGES.length - 1 ? 'default' : 'pointer',
          }}
        >
          →
        </button>
      </div>

      {/* Back button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '10px 24px',
          color: 'rgba(255,255,255,0.7)',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back to desk
      </button>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/experience/SketchbookViewer.tsx
git commit -m "feat: create SketchbookViewer with page-flip animation"
```

---

## Task 4: Wire SketchbookViewer into ExperienceWrapper

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Import SketchbookViewer**

Add import at the top:

```typescript
import { SketchbookViewer } from './SketchbookViewer'
```

**Step 2: Add SketchbookViewer overlay in the JSX**

After the focused-object back button block (~line 367) and before the monitor overlay block, add:

```tsx
{/* SKETCHBOOK VIEWER — page flip slideshow */}
{mode === 'sketchbook' && !isTransitioning && (
  <SketchbookViewer
    onClose={closeSketchbook}
    onProjectSelect={(projectId) => {
      closeSketchbook()
      // Small delay to let camera return, then open project
      setTimeout(() => goToProject(projectId), 800)
    }}
  />
)}
```

**Step 3: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: wire SketchbookViewer into experience overlay"
```

---

## Task 5: Build & smoke test

**Files:** None (testing only)

**Step 1: Run build**

```bash
npx next build
```

Expected: Build PASS, no TypeScript errors.

**Step 2: Start dev server and test**

```bash
npm run dev
```

Test checklist:
- [ ] Load page, wait for intro, arrive at seated view
- [ ] Hover over sketchbook (bottom-left) — green glow appears
- [ ] Click sketchbook — camera flies to top-down view
- [ ] After ~1.5s, page-flip overlay appears with CLARA sketch
- [ ] Click → and ← arrows — pages flip with 3D rotation
- [ ] Arrow keys (←/→) navigate pages
- [ ] Page dots update current position
- [ ] Click a page — navigates to project in monitor
- [ ] Press Escape — returns to seated view
- [ ] "← Back to desk" button works
- [ ] Click other objects (F1 car, skull) — normal focused mode, NOT sketchbook

**Step 3: Commit if all passes**

```bash
git add -A
git commit -m "feat: interactive sketchbook with page-flip slideshow (phase 3)"
```

---

## Summary

| Task | What | Files | Time est. |
|------|------|-------|-----------|
| 1 | Add `'sketchbook'` mode to state machine | ExperienceWrapper.tsx | ~3 min |
| 2 | Top-down camera for sketchbook | CameraRig.tsx | ~2 min |
| 3 | Create SketchbookViewer component | SketchbookViewer.tsx (new) | ~5 min |
| 4 | Wire viewer into overlay system | ExperienceWrapper.tsx | ~2 min |
| 5 | Build + smoke test | — | ~3 min |

**Total: ~15 minutes, 5 commits**

**Assets ready:**
- `public/sketches/sketch-clara.jpg` (121 KB)
- `public/sketches/sketch-photo.jpg` (143 KB)
- `public/sketches/sketch-robotics.jpg` (217 KB)
- `public/sketches/sketch-todo.jpg` (133 KB)
- `public/sketches/sketch-os.jpg` (119 KB)
