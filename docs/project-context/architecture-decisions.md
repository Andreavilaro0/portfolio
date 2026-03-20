# Architecture Decisions

## ADR-1: Html overlay (NOT RenderTexture)
- **Decision:** Use drei `<Html>` for monitor content
- **Reason:** Portfolio needs clickable links and scrollable content — RenderTexture loses all DOM interactivity
- **Trade-off:** Html renders on top of postprocessing (no bloom/vignette on the content itself)
- **Mitigation:** Content designed with dark-edge-compatible background; `zIndexRange` controls layering

## ADR-2: Hybrid navigation (OrbitControls + GSAP snap)
- **Decision:** OrbitControls in overview, GSAP tweens to snap-points for seated/macbook
- **Reason:** PointerLock captures mouse → impossible to click links. OrbitControls allows both orbiting and DOM interaction.
- **Constraint:** OrbitControls must be disabled during GSAP transitions

## ADR-3: MonitorPortfolio (compact) vs PortfolioContent (full-page)
- **Decision:** Separate component for monitor viewport (480×273px)
- **Reason:** Full-page sections with min-height:100vh are unusable in a 273px scroll container
- **PortfolioContent preserved for:** mobile fallback only

## ADR-4: MacBook as discoverable easter egg
- **Decision:** MacBook is not a primary nav target — accessed by clicking the MacBook object in the 3D scene
- **Reason:** Snake game doesn't contribute to portfolio credibility; shouldn't compete with project showcase
