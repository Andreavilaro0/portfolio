# Open Issues

## Must fix (next phases)
1. **OrbitControls transition bug** — When transitioning FROM overview, `startLookAt` uses static preset instead of actual orbit target. OrbitControls mount/unmount loses state. (Phase 4)
2. **ContactShadows Y position** — Currently at y=0, may not match GLB floor plane. Needs visual tuning. (Phase 5)
3. **DeskInteractions** — `hovered` state declared but never read. Emissive clone logic is fragile. Click-outside-to-dismiss missing. (Phase 6)
4. **MacBook easter egg** — Currently a primary nav button. Should be discoverable via 3D click, not UI button. (Phase 7)
5. **Unused deps in node_modules** — framer-motion, howler, occt-import-js removed from package.json but may still be in node_modules. Need `npm prune`. (Phase 8)

## Visual QA required (by user)
- MonitorPortfolio legibility at 480×273
- Postprocessing not interfering with Html overlay
- Click-to-enter gate working
- ContactShadows visible under desk
