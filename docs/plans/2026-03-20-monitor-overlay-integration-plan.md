# Monitor Overlay Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the monitor overlay feel like a real screen in the 3D desk scene, reduce About to minimum, add hand-drawn SVG separators.

**Architecture:** Three visual-only changes to the existing overlay system. No structural/logic changes. The monitor overlay in ExperienceWrapper gets warm styling. MonitorPortfolio's About section gets trimmed. A new HandDrawnLine component replaces straight dividers.

**Tech Stack:** React, inline styles, SVG paths

---

### Task 1: Warm tint + vignette + glow on monitor overlay

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx:309-323`

**Step 1: Update monitor overlay styles**

Change the monitor overlay div (line 309-323) from:

```tsx
style={{
  position: 'fixed',
  ...(hasMonitorRect && clampedMonitor
    ? { top: `${clampedMonitor.top}px`, left: `${clampedMonitor.left}px`, width: `${clampedMonitor.width}px`, height: `${clampedMonitor.height}px` }
    : { top: '18%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 42vw, 520px)', height: 'clamp(200px, 50vh, 480px)' }
  ),
  zIndex: 20,
  overflow: 'hidden',
  background: '#ffffff',
  borderRadius: '2px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
  pointerEvents: isMonitorActive ? 'auto' : 'none',
  opacity: isMonitorActive ? 1 : 0,
  transition: 'opacity 1.2s ease, top 0.8s ease, left 0.8s ease, width 0.8s ease, height 0.8s ease',
}}
```

To:

```tsx
style={{
  position: 'fixed',
  ...(hasMonitorRect && clampedMonitor
    ? { top: `${clampedMonitor.top}px`, left: `${clampedMonitor.left}px`, width: `${clampedMonitor.width}px`, height: `${clampedMonitor.height}px` }
    : { top: '18%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 42vw, 520px)', height: 'clamp(200px, 50vh, 480px)' }
  ),
  zIndex: 20,
  overflow: 'hidden',
  background: '#FDFBF7',
  borderRadius: '2px',
  boxShadow: '0 0 40px rgba(255,200,150,0.12), 0 4px 24px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.1)',
  pointerEvents: isMonitorActive ? 'auto' : 'none',
  opacity: isMonitorActive ? 1 : 0,
  transition: 'opacity 1.2s ease, top 0.8s ease, left 0.8s ease, width 0.8s ease, height 0.8s ease',
}}
```

**Step 2: Add screen effects overlay (ambient reflection + scanlines)**

Inside the monitor overlay div, right after the opening tag (after line 324), add a decorative div before the monitor-scroll div:

```tsx
{/* Screen effects — ambient reflection + scanlines */}
<div
  aria-hidden="true"
  style={{
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 2,
    background: `
      linear-gradient(180deg, rgba(255,210,160,0.04) 0%, transparent 30%),
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)
    `,
  }}
/>
```

**Step 3: Verify visually**

Run: `npm run dev`
Check: The monitor overlay should have a warm tint, subtle vignette at edges, soft peach glow, faint scanlines, and a barely-visible warm gradient at the top.

**Step 4: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "style: warm tint, vignette, and glow on monitor overlay"
```

---

### Task 2: Create HandDrawnLine component

**Files:**
- Create: `src/components/layout/HandDrawnLine.tsx`

**Step 1: Create the component**

```tsx
'use client'

/**
 * HandDrawnLine — SVG separator with irregular hand-drawn stroke.
 * 3 path variants to avoid visual repetition.
 */

const PATHS = [
  // Variant A — gentle wave
  'M0,1 C8,0.2 16,2.2 24,1 C32,-0.2 40,2 48,1.2 C56,0.4 64,2.4 72,1 C80,-0.4 88,2.2 96,1 C100,0.6 100,1 100,1',
  // Variant B — quick wobble
  'M0,1.2 C6,0 14,2.4 22,1.4 C30,0.4 36,2 44,0.8 C52,2.2 60,0 68,1.6 C76,2.4 84,0.2 92,1 C98,1.8 100,1 100,1',
  // Variant C — slow drift
  'M0,0.8 C12,2 24,0 36,1.4 C48,2.4 60,0.2 72,1.2 C84,2.2 96,0.4 100,1',
]

interface HandDrawnLineProps {
  variant?: 0 | 1 | 2
  opacity?: number
  color?: string
  style?: React.CSSProperties
}

export function HandDrawnLine({
  variant = 0,
  opacity = 0.35,
  color = 'var(--color-text)',
  style,
}: HandDrawnLineProps) {
  return (
    <svg
      viewBox="0 0 100 3"
      preserveAspectRatio="none"
      style={{
        width: '100%',
        height: '4px',
        display: 'block',
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <path
        d={PATHS[variant % PATHS.length]}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
```

**Step 2: Verify it renders**

Import in MonitorPortfolio temporarily and check in browser that the SVG renders as a subtle wavy line.

**Step 3: Commit**

```bash
git add src/components/layout/HandDrawnLine.tsx
git commit -m "feat: add HandDrawnLine SVG separator component"
```

---

### Task 3: Reduce About section + replace dividers with HandDrawnLine

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx:1-2` (add import)
- Modify: `src/components/layout/MonitorPortfolio.tsx:174-231` (About section + divider)
- Modify: `src/components/layout/MonitorPortfolio.tsx:341` (project divider)
- Modify: `src/components/layout/MonitorPortfolio.tsx:413` (CV/skills divider)

**Step 1: Add import**

At the top of MonitorPortfolio.tsx (after line 12), add:

```tsx
import { HandDrawnLine } from './HandDrawnLine'
```

**Step 2: Replace About section (lines 174-228)**

Replace the entire About section from `{/* About */}` through the closing `</section>` with:

```tsx
{/* About — minimal, the desk tells the story */}
<section id="monitor-about" style={{ marginBottom: '12px' }}>
  <div style={{ display: 'flex', gap: '16px' }}>
    {[
      { n: '4', s: 'o', label: 'Semestre' },
      { n: '10', s: '+', label: 'Tecnologias' },
      { n: '2028', s: '', label: 'Graduacion' },
    ].map((s) => (
      <div key={s.label} style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--color-text)',
          lineHeight: 1,
        }}>
          {s.n}<span style={{ fontSize: '12px', color: 'var(--color-pink)' }}>{s.s}</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
        }}>
          {s.label}
        </div>
      </div>
    ))}
  </div>
</section>
```

Key changes:
- Removed both `<p>` paragraphs (bio text)
- Removed `border: 2px solid`, `padding: 14px`, `background` from the section
- Stats row stays as-is

**Step 3: Replace straight divider after About (line 231)**

Replace:
```tsx
<div style={{ height: '2px', background: 'var(--color-text)', marginBottom: '12px' }} />
```

With:
```tsx
<HandDrawnLine variant={0} style={{ marginBottom: '12px' }} />
```

**Step 4: Replace project separator lines (line 341)**

Replace:
```tsx
<div style={{ height: '1px', background: 'var(--color-border)', marginTop: '12px', opacity: 0.2 }} />
```

With:
```tsx
<HandDrawnLine variant={(projects.indexOf(p) % 3) as 0 | 1 | 2} opacity={0.2} style={{ marginTop: '12px' }} />
```

Note: We use project index to cycle through the 3 variants so adjacent projects get different line styles.

**Step 5: Replace divider before Contact (line 413)**

Replace:
```tsx
<div style={{ height: '2px', background: 'var(--color-text)', marginBottom: '12px' }} />
```

With:
```tsx
<HandDrawnLine variant={2} style={{ marginBottom: '12px' }} />
```

**Step 6: Verify visually**

Run: `npm run dev`
Check:
- About section shows only stats row (no bio paragraphs, no bordered box)
- All dividers are wavy hand-drawn SVG lines
- Each project separator uses a different variant
- Overall feel: sketch notebook aesthetic, not cartoon

**Step 7: Commit**

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "style: reduce About to minimum, replace dividers with hand-drawn SVG lines"
```

---

### Task 4: Also update MonitorPortfolio background to match warm tint

**Files:**
- Modify: `src/components/layout/MonitorPortfolio.tsx:102` (root div background)
- Modify: `src/components/layout/MonitorPortfolio.tsx:109` (nav background)

**Step 1: Update root background**

Line 102, change:
```tsx
background: 'var(--color-surface)',
```
To:
```tsx
background: '#FDFBF7',
```

**Step 2: Update nav background**

Line 109, change:
```tsx
background: 'var(--color-surface)',
```
To:
```tsx
background: '#FDFBF7',
```

This ensures the sticky nav and content background match the warm overlay tint instead of being cold white.

**Step 3: Verify + Commit**

Run: `npm run dev`
Check: No white flashes when scrolling. Nav and content have same warm tint as the overlay.

```bash
git add src/components/layout/MonitorPortfolio.tsx
git commit -m "style: match MonitorPortfolio backgrounds to warm overlay tint"
```
