# Phase 4 Context — Camera Transitions

## Bugs fixed
1. OrbitControls was conditionally mounted (`{mode === 'overview' && <OrbitControls>}`) — state lost on every mode change
2. `startLookAt` used static preset `CAMERAS[from].lookAt` instead of actual orbit target
3. OrbitControls ref could be null during GSAP transitions (race with unmount)

## Solution
- OrbitControls always mounted, `enabled={mode === 'overview' && !isAnimating.current}`
- On transition from overview: `startLookAt = orbitRef.current.target.clone()` (actual orbit position)
- On entering overview (from intro or other mode): `orbitRef.current.target.copy(CAMERAS.overview.lookAt)` + `update()`
- OrbitControls disabled during all GSAP tweens

## Validation evidence
- MCP Playwright full navigation cycle: overview → seated → overview → macbook → overview
- All transitions smooth, 0 console errors
- Screenshots confirm correct camera positions at each state
