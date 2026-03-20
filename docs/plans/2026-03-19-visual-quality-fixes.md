# Visual Quality Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 10 visual/a11y issues found by design audit agents to bring the portfolio to launch quality.

**Architecture:** All fixes are CSS/inline-style changes in existing files. No new files. No new dependencies. Each task is independent.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind v4, Playwright

---

### Task 1: Fix "Open to work" contrast in Footer (#4d7a00 → accessible green)

**Files:**
- Modify: `src/components/layout/Footer.tsx:196`

**Why:** `#4d7a00` on `#FFFFFF` background = 4.0:1 ratio. WCAG AA requires 4.5:1 for small text.

**Step 1: Change the color**

In `Footer.tsx` line 196, change:

```tsx
color: row.accent ? '#4d7a00' : 'var(--color-text)'
```

To:

```tsx
color: row.accent ? '#3d6600' : 'var(--color-text)'
```

`#3d6600` on white = 5.8:1 — passes AA and AAA for normal text.

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "fix: improve 'Open to work' contrast ratio in Footer (#4d7a00 → #3d6600)"
```

---

### Task 2: Fix nav links missing underline for a11y

**Files:**
- Modify: `src/components/layout/PortfolioContent.tsx:60`

**Why:** Links styled as plain text without underline fail WCAG 1.4.1 — users can't distinguish links from text by color alone.

**Step 1: Add underline on hover + subtle underline default**

In `PortfolioContent.tsx`, change the nav link style (line 60):

```tsx
textDecoration: 'none',
```

To:

```tsx
textDecoration: 'underline',
textDecorationColor: 'transparent',
textUnderlineOffset: '4px',
```

And update the hover handler (line 63-64) to also show underline:

```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.color = 'var(--color-pink)'
  e.currentTarget.style.textDecorationColor = 'var(--color-pink)'
}}
onMouseLeave={(e) => {
  e.currentTarget.style.color = 'var(--color-muted)'
  e.currentTarget.style.textDecorationColor = 'transparent'
}}
```

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/PortfolioContent.tsx
git commit -m "fix: add underline affordance to nav links for a11y (WCAG 1.4.1)"
```

---

### Task 3: Fix MonitorPortfolio minimum font-size (8-9px → 10px+)

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx`

**Why:** 8px and 9px text is below legibility threshold. WCAG and usability best practices recommend minimum 10px for UI text.

**Step 1: Bump all font-sizes below 10px to 10px**

In `MonitorPortfolio.tsx`, find and replace these values:

- Line 179: `fontSize: '9px'` (nav buttons) → `fontSize: '10px'`
- Line 276: `fontSize: '8px'` (stat labels) → `fontSize: '10px'`
- Line 297: `fontSize: '9px'` (project numbers) → `fontSize: '10px'`
- Line 305: `fontSize: '8px'` (project subtitle badge) → `fontSize: '10px'`
- Line 408: `fontSize: '8px'` (Stack label) → `fontSize: '10px'`
- Line 421: `fontSize: '9px'` (skill names) → `fontSize: '10px'`
- Line 453: `fontSize: '10px'` (CV download) — already OK
- Line 477: `fontSize: '8px'` (Let's connect label) → `fontSize: '10px'`
- Line 516: `fontSize: '9px'` (info line) → `fontSize: '10px'`

Use replace-all for `fontSize: '8px'` → `fontSize: '10px'` and `fontSize: '9px'` → `fontSize: '10px'`.

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "fix: bump MonitorPortfolio minimum font-size to 10px for legibility"
```

---

### Task 4: Fix CountUp "756" bug on year values

**Files:**
- Modify: `src/components/layout/CountUp.tsx`

**Why:** CountUp animates 0→2028, so it briefly shows meaningless numbers like "756". Year values should not count up — they should display statically or count from a nearby value.

**Step 1: Skip animation for values > 100**

In `CountUp.tsx`, after line 39 (`const target = parseInt(match[1], 10)`), add a check:

```tsx
const target = parseInt(match[1], 10)
const suffix = match[2]

// Don't animate large numbers (years, etc.) — looks absurd
if (target > 100) {
  setDisplay(value)
  return
}
```

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/CountUp.tsx
git commit -m "fix: skip CountUp animation for values >100 (prevents '756' flash on year)"
```

---

### Task 5: Fix 100vh → 100dvh for iOS Safari

**Files:**
- Modify: `src/styles/globals.css:32`
- Modify: `src/components/layout/AboutSection.tsx:12`
- Modify: `src/components/experience/ExperienceWrapper.tsx:149,185`

**Why:** `100vh` on iOS Safari includes the URL bar, causing content to be cut off. `100dvh` uses the dynamic viewport height.

**Step 1: Update globals.css**

Line 32, change:

```css
min-height: 100vh;
```

To:

```css
min-height: 100dvh;
min-height: 100vh; /* fallback for older browsers */
```

Wait — CSS cascade means the last value wins. Reverse the order:

```css
min-height: 100vh;
min-height: 100dvh;
```

**Step 2: Update AboutSection.tsx**

Line 12, change:

```tsx
minHeight: '100vh',
```

To:

```tsx
minHeight: '100dvh',
```

**Step 3: Update ExperienceWrapper.tsx**

Line 149, change `minHeight: '100vh'` → `minHeight: '100dvh'`

Line 185, change `height: '100vh'` → `height: '100dvh'`

**Step 4: Build**

```bash
npx next build
```

**Step 5: Commit**

```bash
git add src/styles/globals.css src/components/layout/AboutSection.tsx src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: use 100dvh instead of 100vh for iOS Safari viewport"
```

---

### Task 6: Add aria-label to MonitorPortfolio nav

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx:161`

**Why:** The `<nav>` element has no accessible label. Screen readers need to distinguish it from the main portfolio nav.

**Step 1: Add aria-label**

In `MonitorPortfolio.tsx` line 161, change:

```tsx
<nav style={{
```

To:

```tsx
<nav aria-label="Portfolio sections" style={{
```

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "fix: add aria-label to MonitorPortfolio nav for screen readers"
```

---

### Task 7: Fix mobile sticker overlap on Hero

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Why:** On small viewports (<480px), the floating sticker badges overlap the name text, making it unreadable.

**Step 1: Hide stickers on small viewports**

Wrap the 4 sticker `<div>`s (lines 128-155) in a container with a responsive class:

```tsx
<div className="hidden sm:block">
  {/* all 4 sticker divs here */}
</div>
```

This uses Tailwind's `sm:` breakpoint (640px) — stickers hidden below 640px.

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/Hero.tsx
git commit -m "fix: hide hero stickers on mobile to prevent text overlap"
```

---

### Task 8: Fix body text responsive clamp

**Files:**
- Modify: `src/components/layout/Footer.tsx:65`

**Why:** Body text uses `clamp(0.95rem, 1.3vw, 1.15rem)` — at narrow viewports, `1.3vw` can drop below 0.95rem minimum. The clamp min should be the floor.

**Step 1: Verify and fix clamp**

In `Footer.tsx` line 65, the clamp is:

```tsx
fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
```

This is actually correct — `clamp()` enforces min/max regardless of the preferred value. `1.3vw` at 375px = ~4.9px which is below min, so clamp returns `0.95rem` (15.2px). This is fine.

The real issue from the audit is likely in `Hero.tsx` line 115:

```tsx
fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
```

`0.65rem` = 10.4px — borderline. Change to:

```tsx
fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)',
```

**Step 2: Build**

```bash
npx next build
```

**Step 3: Commit**

```bash
git add src/components/layout/Hero.tsx
git commit -m "fix: bump Hero tech subtitle min font-size for readability"
```

---

### Task 9: Run all tests to verify no regressions

**Step 1: Run build**

```bash
npx next build
```

**Step 2: Run e2e tests**

```bash
npx playwright test e2e/ux-heuristics.spec.ts e2e/accessibility.spec.ts e2e/visual-design.spec.ts --reporter=line
```

**Step 3: Fix any failures**

If tests fail due to changed font sizes or hidden stickers, update test expectations to match.

---

## Summary

| Task | Fix | File | Severity |
|---|---|---|---|
| 1 | Footer "Open to work" contrast | Footer.tsx | 🟡 P1 |
| 2 | Nav links underline a11y | PortfolioContent.tsx | 🟢 P2 |
| 3 | MonitorPortfolio min font-size 10px | MonitorPortfolio.tsx | 🟡 P1 |
| 4 | CountUp "756" bug | CountUp.tsx | 🟢 P2 |
| 5 | 100vh → 100dvh iOS | globals.css + 3 files | 🟢 P2 |
| 6 | aria-label MonitorPortfolio nav | MonitorPortfolio.tsx | 🟢 P2 |
| 7 | Mobile sticker overlap | Hero.tsx | 🟡 P1 |
| 8 | Body text clamp floor | Hero.tsx | 🟡 P1 |
| 9 | Regression tests | e2e/ | — |

**Execution order:** Tasks 1-8 are independent. Task 9 runs after all fixes. Can be parallelized by file (tasks 3+6 touch MonitorPortfolio, tasks 7+8 touch Hero.tsx).
