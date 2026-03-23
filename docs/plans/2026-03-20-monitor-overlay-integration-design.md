# Monitor Overlay Integration Design

**Date**: 2026-03-20
**Goal**: Make the monitor overlay feel like a real screen in the 3D desk scene, reduce About to minimum, add hand-drawn SVG separators.

## 1. Monitor overlay — real screen feel

### Current
- `background: #ffffff`
- `box-shadow: 0 4px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)`
- `borderRadius: 2px`

### Changes (ExperienceWrapper.tsx, monitor overlay div)
- Warm background: `#FDFBF7`
- Inner vignette: `inset 0 0 60px rgba(0,0,0,0.06)`
- Ambient glow: `0 0 40px rgba(255,200,150,0.12)`
- Keep existing shadow for depth
- Add pseudo-element or inner div for:
  - Top ambient reflection: `linear-gradient(rgba(255,210,160,0.04), transparent 30%)`
  - Subtle scanlines: `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)`

### Files affected
- `src/components/experience/ExperienceWrapper.tsx` — overlay styles

## 2. About section — minimal

### Current (MonitorPortfolio.tsx)
- 2 paragraphs of bio text
- 3 stats (4° Semestre, 10+ Tecnologías, 2028 Graduación)
- Wrapped in bordered section

### Changes
- Remove both paragraphs
- Keep header (ANDREA AVILA + subtitle)
- Keep stats row
- Remove the bordered box wrapper around About (use hand-drawn separator instead)

### Files affected
- `src/components/layout/MonitorPortfolio.tsx` — About section

## 3. Hand-drawn SVG separators

### Current
- `<div style={{ height: '2px', background: 'var(--color-text)' }} />`
- `border: 2px solid var(--color-border)` on About box

### Changes
- Create `HandDrawnLine` component with 3 SVG path variants
- Wavy irregular paths, opacity 0.3-0.4
- Replace all straight dividers in MonitorPortfolio
- Replace About section border with hand-drawn border (4 SVG paths for each edge, or a single SVG rect with irregular stroke)

### SVG approach
- viewBox scales to container width
- `preserveAspectRatio="none"` for horizontal lines
- Stroke: `var(--color-text)`, strokeWidth: 1.5-2
- 3 path variants to avoid repetition

### Files affected
- New: `src/components/layout/HandDrawnLine.tsx`
- `src/components/layout/MonitorPortfolio.tsx` — replace dividers
