# Phase 1+2 Context

## Critical Discovery: drei Html `transform` kills DOM text

**Root cause found via MCP Playwright debugging:**

drei's `<Html transform>` component applies a CSS `matrix3d` with scale factors of ~0.004 (varies with `distanceFactor`). At this scale, browsers **completely skip text rasterization** — text elements exist in the DOM but produce zero visible pixels. Background colors survive because they fill continuous areas, but individual text glyphs are below the browser's rasterization threshold.

This was confirmed empirically:
- Setting font-size to 200px + font-weight 900 + color red: still invisible
- Changing distanceFactor from 1.8 to 8 (scale 0.0045 → 0.02): still invisible
- Removing negative scale (positive 0.02): still invisible
- **Only Canvas2D content survives** (the Snake game uses `<canvas>`, which rasterizes internally before the CSS transform)

**Solution implemented:** Render portfolio content as a **fixed DOM overlay** in ExperienceWrapper (outside the Three.js canvas), not inside drei Html. The overlay is positioned with CSS `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -55%)`.

**Trade-off:** Content doesn't deform with 3D perspective (doesn't "sit inside" the monitor screen). But text is fully legible, links are clickable, scroll works.

## What was done
- Created `MonitorPortfolio.tsx` — compact card-based layout for the monitor viewport
- Removed `PortfolioContent` from DeskScene (reserved for mobile fallback)
- Removed `occlude="blending"` (conflicts with EffectComposer)
- Moved EffectComposer inside Suspense
- Fixed SpotLight target with useEffect
- Removed unused `monitorCenter` computation
- Portfolio rendered as fixed DOM overlay at z-index 20

## Architecture Decision Update (ADR-1 revised)
**Html overlay with `transform` is NOT viable for text content.** The only options are:
1. Fixed DOM overlay (current implementation) — legible, interactive, no 3D integration
2. Canvas2D/OffscreenCanvas rendering — could embed in 3D, but loses DOM interactivity
3. RenderTexture — loses all DOM interaction (no clicks, no scroll)

Option 1 is the correct choice for a portfolio where links and readability are essential.
