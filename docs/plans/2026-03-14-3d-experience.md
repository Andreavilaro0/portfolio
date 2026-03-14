# 3D Desk Experience — Implementation Plan

## Goal
Hybrid 3D → portfolio experience. User starts in an abstract 3D workspace, camera animates to seated desk position, monitor acts as portal into the real interactive portfolio.

## Architecture

```
page.tsx
└── ExperienceWrapper (state machine)
    ├── MODE: LOADING → LoadingScreen
    ├── MODE: INTRO → 3D scene, camera animates intro → seated
    ├── MODE: SEATED → 3D scene, subtle look-around, monitor CTA visible
    ├── MODE: TRANSITIONING → camera → monitor, fade to portfolio
    └── MODE: PORTFOLIO → real DOM portfolio (scroll, click, navigate)
                          + "Back to desk" button
```

### State Machine
```
LOADING → INTRO → SEATED ⇄ PORTFOLIO
                     ↑          ↓
                     └──────────┘ (back to desk)
```

### Key Components
1. **ExperienceWrapper** — top-level state manager
2. **DeskScene** — R3F Canvas with loaded GLB
3. **CameraRig** — manages intro anim, seated look-around, monitor focus
4. **MonitorPortal** — CTA overlay on monitor, triggers transition
5. **PortfolioContent** — existing sections (Hero, About, Clara, etc.)
6. **LoadingScreen** — progress while GLB loads

### File Structure
```
src/
  components/
    experience/
      ExperienceWrapper.tsx   ← state machine
      DeskScene.tsx           ← R3F scene
      CameraRig.tsx           ← camera system
      MonitorPortal.tsx       ← monitor click/CTA
      LoadingScreen.tsx       ← loading UI
    layout/
      PortfolioContent.tsx    ← wrapper for all sections
      (existing sections unchanged)
```

## Camera Data (from handoff.json, Blender coords → Three.js)

Blender exports to glTF as Y-up. Camera positions in handoff are Blender coords.
glTF exporter converts: Blender(X,Y,Z) → Three.js(X,Z,-Y)

| Camera | Blender | Three.js (estimated) |
|--------|---------|---------------------|
| INTRO_START | (0, 12, 12) | (0, 12, -12) |
| SEATED_MAIN | (0, 2.2, 8.63) | (0, 8.63, -2.2) |
| MONITOR_FOCUS | (0, 2.5, 8.63) | (0, 8.63, -2.5) |

> NOTE: Will verify actual positions by inspecting exported camera objects in GLB.

## Monitor Portal Strategy

1. In SEATED mode: show subtle "Enter Portfolio" CTA near monitor
2. On click: GSAP animates camera toward monitor focus
3. At peak zoom: crossfade opacity — 3D canvas fades out, DOM portfolio fades in
4. Portfolio takes over: full scroll, click, navigation
5. "Back to desk" button visible — reverses the transition

The portfolio is REAL web content, not a texture. The monitor is the narrative bridge.

## Performance Plan

- GLB compressed from 132MB → target <30MB (meshopt + webp textures)
- Lazy load 3D scene with dynamic import
- Loading screen with progress bar
- Dispose scene materials/geometries when in portfolio mode (optional)
- RequestAnimationFrame only when 3D is visible

## Execution Order

1. ✅ Compress GLB
2. Create ExperienceWrapper with state machine
3. Create DeskScene (load GLB, verify render)
4. Create CameraRig (intro animation)
5. Add seated look-around
6. Add MonitorPortal (CTA + transition)
7. Wire up portfolio handoff
8. Add return path
9. Polish + loading screen
10. Test all modes
