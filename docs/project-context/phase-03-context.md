# Phase 3 Context

## What was done
- Added `sceneReady` boolean state to ExperienceWrapper
- `onSceneLoaded` no longer auto-transitions to 'intro' — sets `sceneReady=true` instead
- LoadingScreen now accepts `ready` and `onEnter` props
- When `ready=true`, shows clickable "Click to enter" with pulse animation
- Click triggers GSAP fade-out (0.6s opacity→0), then calls `onEnter()` which sets mode='intro'
- Fixed timer leak: subtitle cycling setTimeout is now tracked in a ref and cleared on unmount

## Timing analysis
- No race condition between click-to-enter and skip-intro:
  - Click fires on LoadingScreen → 0.6s GSAP fade → onEnter() → setMode('intro')
  - CameraRig's skip-intro listener registers AFTER mode='intro' — original click is 0.6s old
