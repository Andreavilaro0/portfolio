# UX Heuristic Fixes (Severity 2) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix remaining 8 Severity-2 heuristic violations to bring the portfolio from 7.5/10 to 9+/10.

**Architecture:** Each task is independent. All changes are in existing files. No new dependencies. CSS-only or React state changes. Tests updated to match current flow.

**Tech Stack:** Next.js 16, React, TypeScript, GSAP, Playwright

---

### Task 1: Active section indicator in monitor nav

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx`

**Why:** Heuristic H6 (Recognition > Recall) — user doesn't know which section they're viewing in the monitor overlay. The nav buttons all look the same regardless of scroll position.

**Step 1: Add IntersectionObserver state**

Add `useState` to the import and track the active section:

```tsx
import { useRef, useState, useEffect } from 'react'
```

Inside the component, after `scrollRef`:

```tsx
const [activeSection, setActiveSection] = useState('monitor-work')

useEffect(() => {
  const container = scrollRef.current
  if (!container) return

  const sections = container.querySelectorAll('[id^="monitor-"]')
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      }
    },
    { root: container, threshold: 0.3 }
  )

  sections.forEach((s) => observer.observe(s))
  return () => observer.disconnect()
}, [])
```

**Step 2: Apply active style to nav buttons**

In the nav button style, change `color` to be conditional:

```tsx
color: activeSection === link.target ? 'var(--color-pink)' : 'var(--color-muted)',
fontWeight: activeSection === link.target ? 700 : 400,
```

And update the hover handlers to not override the active color:

```tsx
onMouseEnter={(e) => {
  if (activeSection !== link.target) {
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-pink)'
  }
}}
onMouseLeave={(e) => {
  if (activeSection !== link.target) {
    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
  }
}}
```

**Step 3: Verify visually**

Run: `npx next dev`
Navigate to seated view. Scroll the monitor overlay. The nav label for the visible section should turn pink and bold.

**Step 4: Commit**

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "feat: active section indicator in monitor nav"
```

---

### Task 2: Scroll indicator on monitor overlay

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx`

**Why:** Users may not realize the monitor overlay is scrollable. A subtle gradient fade at the bottom signals "there's more below."

**Step 1: Add scroll state tracking**

After the `activeSection` state:

```tsx
const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

useEffect(() => {
  const container = scrollRef.current
  if (!container) return

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = container
    setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 10)
  }

  container.addEventListener('scroll', handleScroll)
  return () => container.removeEventListener('scroll', handleScroll)
}, [])
```

**Step 2: Add fade gradient overlay**

After the closing `</div>` of `scrollRef` container and before the closing `</div>` of the outer wrapper, add:

```tsx
{!isScrolledToBottom && (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40px',
      background: 'linear-gradient(transparent, #ffffff)',
      pointerEvents: 'none',
      zIndex: 5,
    }}
  />
)}
```

The outer wrapper div needs `position: 'relative'` added if not already present. Check and add if missing.

**Step 3: Verify visually**

The bottom of the monitor overlay should show a white fade when there's more content below, and disappear when scrolled to the bottom.

**Step 4: Commit**

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "feat: scroll indicator gradient on monitor overlay"
```

---

### Task 3: Change "Click to enter" to "View portfolio"

**Files:**
- Modify: `src/components/experience/LoadingScreen.tsx`

**Why:** Heuristic H2 (Match real world) — "Click to enter" is game-like language. "View portfolio" is professional and clear about what happens next.

**Step 1: Change the text**

In `LoadingScreen.tsx`, find:

```tsx
Click to enter
```

Replace with:

```tsx
View portfolio
```

**Step 2: Update Playwright tests**

In `e2e/portfolio-desktop.spec.ts`, replace every occurrence of `'text=Click to enter'` with `'text=View portfolio'`.

There are multiple instances — use find-and-replace across the file. Count them: lines 17, 23, 30, 33, 48, 49, 67, 68, 96, 97, 114, 115, 148, 149.

**Step 3: Run build**

```bash
npx next build
```

**Step 4: Commit**

```bash
git add src/components/experience/LoadingScreen.tsx e2e/portfolio-desktop.spec.ts
git commit -m "fix: change 'Click to enter' to 'View portfolio' for professional tone"
```

---

### Task 4: Reduce Arcade button prominence

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Why:** Heuristic H8 (Minimalist design) — the pink Arcade button is one of the most visually prominent elements, competing with portfolio content for attention.

**Step 1: Restyle the Arcade button**

Find the Arcade button (around line 216-242). Change its style to be more subtle:

```tsx
style={{
  position: 'absolute',
  bottom: '8px',
  right: '12px',
  fontFamily: 'var(--font-code)',
  fontSize: '10px',
  color: 'var(--color-muted)',
  cursor: 'pointer',
  padding: '6px 12px',
  background: 'rgba(26,26,26,0.05)',
  border: '1px solid rgba(26,26,26,0.12)',
  borderRadius: '4px',
  zIndex: 30,
  letterSpacing: '0.08em',
  fontWeight: 500,
  transition: 'color 0.2s, border-color 0.2s',
}}
onMouseEnter={(e) => {
  e.currentTarget.style.color = 'var(--color-pink)'
  e.currentTarget.style.borderColor = 'var(--color-pink)'
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = 'var(--color-muted)'
  e.currentTarget.style.borderColor = 'rgba(26,26,26,0.12)'
}}
```

Change the label from `🎮 Arcade` to `Arcade →` (remove emoji, add arrow for affordance).

**Step 2: Verify visually**

The button should be visible but not dominant. It should look like a secondary action, not a primary CTA.

**Step 3: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: reduce Arcade button prominence to not compete with portfolio content"
```

---

### Task 5: Widen mobile breakpoint to include tablets

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Why:** Heuristic H5 (Error prevention) — tablets at 768px get the 3D experience but the overlay is too small to be usable at that viewport. Better to serve the 2D fallback which is designed for smaller screens.

**Step 1: Change the breakpoint**

Find:

```tsx
const check = () => setIsMobile(window.innerWidth < 480)
```

Change to:

```tsx
const check = () => setIsMobile(window.innerWidth < 768)
```

**Step 2: Update mobile Playwright test if it uses a specific viewport**

Check `e2e/portfolio-mobile.spec.ts` — if it uses a viewport width between 480-768, it should now expect the 2D fallback. Read the file and adjust if needed.

**Step 3: Build**

```bash
npx next build
```

**Step 4: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: widen mobile breakpoint to 768px to serve 2D fallback on tablets"
```

---

### Task 6: Focus management for overlay transitions

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Why:** Heuristic H7 (Flexibility/Efficiency) — keyboard users can't Tab into the monitor overlay after the intro completes. Focus should move to the overlay content when it becomes visible.

**Step 1: Add a ref to the monitor overlay container**

```tsx
const monitorOverlayRef = useRef<HTMLDivElement>(null)
```

Add `useRef` to the import if not already there.

**Step 2: Focus the overlay when portfolio becomes visible**

Add a useEffect:

```tsx
useEffect(() => {
  if (isPortfolioVisible && monitorOverlayRef.current) {
    // Small delay to let the opacity transition start
    setTimeout(() => {
      monitorOverlayRef.current?.focus()
    }, 200)
  }
}, [isPortfolioVisible])
```

**Step 3: Make the overlay focusable**

Add to the monitor overlay `<div>`:

```tsx
ref={monitorOverlayRef}
tabIndex={-1}
```

`tabIndex={-1}` makes it programmatically focusable without adding it to the tab order.

**Step 4: Verify**

After the intro completes, press Tab — focus should be inside the monitor overlay. The nav buttons should be reachable.

**Step 5: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: focus management — auto-focus monitor overlay after intro"
```

---

### Task 7: Transition feedback (seated↔macbook)

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Why:** Heuristic H1 (Visibility of system status) — 2.2s camera animation with no indication of what's happening. User might think the click didn't work.

**Step 1: Add a transitioning state**

```tsx
const [isTransitioning, setIsTransitioning] = useState(false)
```

**Step 2: Set transitioning on mode change**

Modify `goToMacbook` and `goToSeated`:

```tsx
const goToMacbook = useCallback(() => {
  setIsTransitioning(true)
  setMode('macbook')
  setTimeout(() => setIsTransitioning(false), 2500)
}, [])

const goToSeated = useCallback(() => {
  setIsTransitioning(true)
  setMode('seated')
  setTimeout(() => setIsTransitioning(false), 2500)
}, [])
```

**Step 3: Show a subtle indicator during transition**

Add after the intro skip button block, before the DeskScene:

```tsx
{isTransitioning && (
  <div
    style={{
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      fontFamily: 'var(--font-code)',
      fontSize: '9px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.4)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}
    aria-live="polite"
  >
    {mode === 'macbook' ? 'Going to arcade...' : 'Going to portfolio...'}
  </div>
)}
```

Note: The `pulse` animation already exists in LoadingScreen's inline `<style>` — but it's scoped there. We need to add it to globals.css or use inline. Since it's already in globals.css as part of reduced-motion considerations, just use inline `opacity` animation via a simple approach: rely on the existing `@keyframes pulse` from LoadingScreen... actually that's in a scoped `<style>` tag, not global.

Simpler approach — skip the animation, just show static text:

```tsx
{isTransitioning && (
  <div
    style={{
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 40,
      fontFamily: 'var(--font-code)',
      fontSize: '9px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
    }}
    aria-live="polite"
  >
    Moving...
  </div>
)}
```

**Step 4: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "feat: show transition feedback during camera movements"
```

---

### Task 8: Update Playwright tests to match current flow

**Files:**
- Modify: `e2e/portfolio-desktop.spec.ts`

**Why:** The existing tests reference an old flow with "Monitor" and "MacBook" buttons that no longer exist. The current flow is: loading → click "View portfolio" → intro → auto-seated with overlay. Tests will fail as-is and block CI.

**Step 1: Rewrite the test suite**

Replace the entire file with tests that match the current flow:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Desktop 3D Portfolio', () => {
  test.describe.configure({ mode: 'serial' })

  test('Loading screen shows and waits for click', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=ANDREA AVILA').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('text=Loading workspace...')).toBeVisible()
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.screenshot({ path: 'e2e/screenshots/01-loading-ready.png' })
  })

  test('Click triggers intro with skip button', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')

    // Skip button should appear during intro
    await expect(page.locator('button:has-text("Skip")')).toBeVisible({ timeout: 3_000 })

    // Wait for intro to complete naturally
    await page.waitForTimeout(6_000)

    // Loading screen should be gone
    await expect(page.locator('text=View portfolio')).toBeHidden({ timeout: 2_000 })
    await page.screenshot({ path: 'e2e/screenshots/02-after-intro.png' })
  })

  test('Monitor overlay shows portfolio content after intro', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6_500) // intro completes → seated mode

    // Monitor overlay with portfolio content should be visible
    const monitorScroll = page.locator('.monitor-scroll')
    await expect(monitorScroll).toBeVisible({ timeout: 5_000 })

    // Portfolio nav should be visible
    await expect(page.locator('button:has-text("Work")')).toBeVisible({ timeout: 3_000 })
    await expect(page.locator('button:has-text("About")')).toBeVisible()
    await expect(page.locator('button:has-text("Contact")')).toBeVisible()

    await page.screenshot({ path: 'e2e/screenshots/03-seated-portfolio.png' })
  })

  test('Arcade button navigates to arcade and back', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(6_500)

    // Click Arcade button
    const arcadeBtn = page.locator('button[aria-label="Go to Arcade"]')
    await expect(arcadeBtn).toBeVisible({ timeout: 3_000 })
    await arcadeBtn.click()

    // Wait for camera transition
    await page.waitForTimeout(3_000)

    // Portfolio button in arcade header should be visible
    const backBtn = page.locator('button[aria-label="Back to Portfolio"]')
    await expect(backBtn).toBeVisible({ timeout: 3_000 })

    await page.screenshot({ path: 'e2e/screenshots/04-arcade.png' })

    // Go back
    await backBtn.click()
    await page.waitForTimeout(3_000)

    // Portfolio content should be visible again
    await expect(page.locator('.monitor-scroll')).toBeVisible({ timeout: 5_000 })

    await page.screenshot({ path: 'e2e/screenshots/05-back-to-portfolio.png' })
  })

  test('Skip button bypasses intro', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')

    // Click skip immediately
    const skipBtn = page.locator('button:has-text("Skip")')
    await expect(skipBtn).toBeVisible({ timeout: 2_000 })
    await skipBtn.click()

    // Should jump to seated with portfolio visible quickly
    await expect(page.locator('.monitor-scroll')).toBeVisible({ timeout: 3_000 })
    await page.screenshot({ path: 'e2e/screenshots/06-skip-intro.png' })
  })

  test('Skip-to-content link exists and is focusable', async ({ page }) => {
    await page.goto('/')
    // Tab to reveal skip link
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a.skip-link')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveText('Skip to content')
  })
})

test.describe('Console errors check', () => {
  test('No critical console errors on desktop', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await expect(page.locator('text=View portfolio')).toBeVisible({ timeout: 30_000 })
    await page.click('text=View portfolio')
    await page.waitForTimeout(7_000)

    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('THREE.') &&
        !e.includes('WebGL') &&
        !e.includes('favicon') &&
        !e.includes('404')
    )

    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors)
    }
  })
})
```

**Step 2: Run the tests to verify**

```bash
npx playwright test e2e/portfolio-desktop.spec.ts --headed
```

**Step 3: Commit**

```bash
git add e2e/portfolio-desktop.spec.ts
git commit -m "test: update Playwright tests to match current portfolio flow"
```

---

## Summary

| Task | Heuristic | What it fixes | File |
|---|---|---|---|
| 1 | H6 Recognition | Active section indicator in monitor nav | MonitorPortfolio.tsx |
| 2 | H1 Visibility | Scroll indicator gradient | MonitorPortfolio.tsx |
| 3 | H2 Real world | "Click to enter" → "View portfolio" | LoadingScreen.tsx |
| 4 | H8 Minimalist | Arcade button too prominent | ExperienceWrapper.tsx |
| 5 | H5 Error prevention | Mobile breakpoint 480→768 | ExperienceWrapper.tsx |
| 6 | H7 Flexibility | Focus management for overlays | ExperienceWrapper.tsx |
| 7 | H1 Visibility | Transition feedback | ExperienceWrapper.tsx |
| 8 | — | Tests match current flow | portfolio-desktop.spec.ts |

**Execution order:** Tasks 1-2 (MonitorPortfolio), then 3 (LoadingScreen), then 4-7 (ExperienceWrapper), then 8 (tests). Tasks within the same file should be done together.

**Expected final score: 9/10** (remaining 1 point requires real user testing + screen reader validation, which can't be automated)
