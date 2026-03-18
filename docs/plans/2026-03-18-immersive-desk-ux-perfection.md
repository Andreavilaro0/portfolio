# Immersive Desk UX Perfection — Multi-Agent Visual QA Loop

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Iterate cámaras, overlays, iluminación y transiciones usando un ciclo automatizado: implementar → capturar screenshot con Playwright → evaluar con UX heuristics → corregir errores detectados → repetir hasta 10/10.

**Architecture:** Multi-agent pipeline. Un agente implementa cambios, otro captura screenshots con MCP Playwright, otro evalúa con UX heuristics. Los errores detectados retroalimentan al implementador. Se itera hasta que todos los criterios UX pasen 10/10.

**Tech Stack:** Next.js 16, React Three Fiber, drei, Three.js, GSAP, Tailwind v4, MCP Playwright, Blender MCP (puerto 9876)

**Tools disponibles:**
- **Blender MCP** (socket localhost:9876 via `blender_bridge.py`) — Consultar/ajustar posiciones 3D
- **MCP Playwright** — Capturar screenshots del browser
- **UX Heuristics** — Skill `@ux-heuristics` para evaluar cada screenshot

---

## Context for the Implementer

### Verified Blender Data (2026-03-18)

```
Monitor Screen (Three.js coords):
  center: (0.000, 10.293, 2.039)
  min: (-3.600, 8.241, 2.039)
  max: (3.600, 12.346, 2.049)
  size: 7.2 x 4.1 units

MacBook (Three.js coords):
  center: (-4.633, 7.500, -1.101)
  min: (-6.160, 6.474, -2.284)
  max: (-3.106, 8.526, 0.082)
  size: 3.05 x 2.05 units

Camera_Seated (Blender → Three.js):
  (0.000, 10.290, -4.000)

Camera_MacBook (Blender → Three.js):
  (-4.630, 7.500, -6.000)

Camera_Intro (Blender → Three.js):
  (0.000, 10.290, -16.000)
```

### Current Camera Values in Code (CameraRig.tsx)

```typescript
intro:   pos(0, 18, -40)       lookAt(0, 10.29, 2.04)  // Far+high, 5s fly-in
seated:  pos(0, 10.8, -4.0)    lookAt(0, 10.29, 2.04)
macbook: pos(-4.63, 8.0, -6.0) lookAt(-4.63, 7.5, -1.1)
```

**Intro animation:** 5 segundos, ease power2.inOut. Empieza lejos (Z=-40) y alto (Y=18), vuela suavemente hasta la posición seated (primera persona). El lookAt fijo al monitor mantiene estabilidad visual.

### Key Files

- `src/components/experience/CameraRig.tsx` — Camera presets & GSAP animations
- `src/components/experience/ExperienceWrapper.tsx` — Orchestrator, DOM overlays, mode state
- `src/components/experience/DeskScene.tsx` — 3D scene, GLB, lighting, screen corner extraction
- `src/components/experience/ScreenAlignedOverlay.tsx` — ScreenProjector (3D→pixel bridge)
- `src/components/experience/LoadingScreen.tsx` — Splash + progress bar
- `src/components/experience/DeskInteractions.tsx` — Clickable desk objects
- `src/components/layout/MonitorPortfolio.tsx` — Portfolio content rendered in monitor overlay

### GLB Mesh Names (from DeskScene console.log)

```
MONITOR_SCREEN_PLANE, monitor_screen_glass, monitor_screen_quad,
monitor_body_back, monitor_frame_full, monitor_frame_outer,
monitor_inner_panel, monitor_stand_column, monitor_stand_connector,
monitor_stand_detail, monitor_apple_logo, monitor_apple_logo_light,
Monitor_Glow, macbook, desk.001, razer_mouse, keyboard.001,
coffee_cup, headphones_marshall, desk_lamp.001, daftpunk,
leica_camera, floor_subtle, Key_Light, Fill_Light, Rim_Pink
```

---

## UX Evaluation Criteria (Score 0-10 each)

| # | Criterio | Pregunta clave |
|---|----------|---------------|
| 1 | Visibilidad | ¿El usuario siempre sabe dónde está y qué puede hacer? |
| 2 | Coherencia | ¿Ambas pantallas se sienten parte del mismo setup? |
| 3 | Primera persona | ¿La cámara se siente como si estuvieras sentado en el escritorio? |
| 4 | Sentido de cámara | ¿El movimiento tiene intención cinematográfica? |
| 5 | Sentido de animación | ¿Las transiciones son suaves y predecibles? |
| 6 | Legibilidad | ¿Se puede leer todo el contenido sin esfuerzo? |
| 7 | Affordance | ¿Es obvio cómo navegar entre pantallas? |
| 8 | No pantallas negras | ¿Hay contenido visible en todo momento durante transiciones? |
| 9 | Integración visual | ¿Los overlays parecen estar "en" la pantalla, no flotando? |
| 10 | Premium feel | ¿La experiencia se siente pulida y profesional? |

**Target: 10/10 en todos los criterios**

---

### Task 1: Baseline — Capturar estado actual con Playwright

**Files:** Ninguno (solo captura)

**Step 1: Asegurar que dev server está corriendo**

```bash
cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio
# Si no hay dev server activo:
rm -rf .next && npx next dev --port 3000
```

**Step 2: Capturar flujo completo con MCP Playwright**

Secuencia de capturas (usar `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_click`, `browser_wait_for`):

```
1. Navigate http://localhost:3000
2. Wait 3s for loading screen → Screenshot "01-loading"
3. Click "Explorar" button → Wait 4s for intro animation
4. Screenshot "02-intro-end" (seated mode, portfolio visible)
5. Wait 1s → Screenshot "03-portfolio-on-monitor"
6. Click "Arcade" button → Wait 3s
7. Screenshot "04-transition-midpoint" (during camera move)
8. Wait 1s → Screenshot "05-macbook-arcade"
9. Click "Portfolio" link → Wait 3s
10. Screenshot "06-return-to-portfolio"
```

**Step 3: Evaluar con UX heuristics**

Para cada screenshot, evaluar los 10 criterios de la tabla. Documentar:
- Score por criterio (0-10)
- Lista de errores específicos detectados
- Prioridad de cada error (P0 = blocker, P1 = grave, P2 = menor)

**Step 4: Guardar baseline**

```bash
# Save evaluation to docs/
cat > docs/project-context/ux-iteration-01-baseline.md << 'EOF'
# UX Baseline — Iteration 1
Date: 2026-03-18
[Pegar evaluación completa aquí]
EOF
```

---

### Task 2: Fix — Overlay Alignment (si baseline muestra desalineación)

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`
- Modify: `src/components/experience/ScreenAlignedOverlay.tsx`

**Step 1: Verificar que ScreenProjector encuentra los meshes correctos**

En el browser console (Playwright `browser_evaluate`), verificar:

```javascript
// Check if GLB mesh names log shows monitor screen meshes
// Look for: monitor_screen_glass, monitor_screen_quad
```

Si los meshes NO se encuentran (fallback activo), corregir los nombres en `DeskScene.tsx`:

```typescript
// DeskScene.tsx línea ~135
const monitorCorners = extractCorners(['monitor_screen_glass', 'monitor_screen_quad'])
// Si el GLB usa otros nombres, actualizar aquí
```

**Step 2: Ajustar padding del ScreenProjector**

Si el overlay se ve "flotando" fuera de la pantalla, ajustar el padding:

```typescript
// DeskScene.tsx línea ~261-265
<ScreenProjector corners={monitorCorners3D} onUpdate={onMonitorRect} padding={8} />
<ScreenProjector corners={macbookCorners3D} onUpdate={onMacbookRect} padding={6} />
```

Valores positivos = overlay más pequeño que la pantalla (dentro del bezel).
Valores negativos = overlay más grande que la pantalla.

**Step 3: Si projection no funciona, usar hardcoded values calibrados**

Fallback — medir píxeles exactos del screenshot y hardcodear:

```typescript
// ExperienceWrapper.tsx — reemplazar el fallback CSS
: { top: '50%', left: '50%', transform: 'translate(-50%, -54%)',
    width: 'clamp(300px, 44vw, 720px)', height: 'clamp(200px, 48vh, 480px)' }
```

**Step 4: Build & verify**

```bash
npx next build 2>&1 | tail -5
```

**Step 5: Screenshot & evaluate**

Repetir Step 2-3 de Task 1. Comparar scores con baseline.

**Step 6: Commit**

```bash
git add src/components/experience/DeskScene.tsx src/components/experience/ScreenAlignedOverlay.tsx
git commit -m "fix: calibrate overlay alignment from Playwright screenshots"
```

---

### Task 3: Fix — Camera First-Person Feel

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Consultar Blender MCP para posiciones exactas**

```python
# Via blender_bridge.py
from blender_bridge import execute_code
result = execute_code("""
import bpy
for name in ['Camera_Seated', 'Camera_MacBook', 'Camera_Intro']:
    obj = bpy.data.objects.get(name)
    if obj:
        loc = obj.location
        # Blender Y→Three.js -Z, Blender Z→Three.js Y
        print(f'{name} Three.js: ({loc.x:.3f}, {loc.z:.3f}, {-loc.y:.3f})')
""")
```

**Step 2: Update CameraRig.tsx with exact Blender values**

Si los screenshots muestran que la cámara no se siente primera persona:

Ajustes típicos:
- **Seated too far:** Acercar Z (menos negativo, e.g., -4.0 → -3.5)
- **Seated too high:** Bajar Y (e.g., 10.8 → 10.5)
- **MacBook tilted:** Ajustar lookAt Y para que coincida con el centro de la pantalla
- **Intro too dramatic:** Reducir Y de inicio (e.g., 13 → 11.5)

```typescript
const CAMERAS = {
  intro: {
    position: new THREE.Vector3(0, 11.5, -14),
    lookAt: new THREE.Vector3(0, 10.29, 2.04),
  },
  seated: {
    position: new THREE.Vector3(0, 10.5, -3.5),
    lookAt: new THREE.Vector3(0, 10.29, 2.04),
  },
  macbook: {
    position: new THREE.Vector3(-4.63, 8.2, -5.5),
    lookAt: new THREE.Vector3(-4.63, 7.5, -1.1),
  },
}
```

**NOTA:** Estos valores son iniciales. El agente evaluador comparará screenshots y refinará ±0.3 unidades por iteración.

**Step 3: Ajustar FOV si es necesario**

Si la escena se siente distorsionada:

```typescript
// DeskScene.tsx — Canvas camera prop
camera={{ fov: 38, near: 0.1, far: 200, position: [0, 12, -12] }}
// fov 35-42 es el rango natural para primera persona
```

**Step 4: Build, screenshot, evaluate**

**Step 5: Commit**

```bash
git add src/components/experience/CameraRig.tsx
git commit -m "fix: calibrate cameras from Playwright visual verification"
```

---

### Task 4: Fix — Transition Smoothness

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Capturar transición frame-by-frame**

Con Playwright, capturar múltiples screenshots durante la transición seated→macbook:

```javascript
// Click arcade, then capture every 500ms for 3 seconds
// 6 screenshots: transition-0ms, transition-500ms, ..., transition-2500ms
```

**Step 2: Evaluar cada frame de transición**

Buscar:
- ¿Hay un frame donde no se ve ni portfolio ni arcade? (pantalla negra)
- ¿El overlay se mueve smoothly o tiene saltos?
- ¿La curva bezier se siente natural o robótica?

**Step 3: Ajustar TRANSITION_MID si la curva no es suave**

```typescript
// CameraRig.tsx
const TRANSITION_MID = new THREE.Vector3(-2.3, 11.0, -5.0)
const TRANSITION_MID_LOOKAT = new THREE.Vector3(-2.3, 9.0, 0.5)
```

El midpoint Y alto (11.0) crea un "arco" — como una grúa cinematográfica. Si es demasiado dramático, bajar Y. Si es demasiado lineal, subir Y.

**Step 4: Ajustar timing de cross-fade**

Si hay gap de contenido durante transición:

```typescript
// ExperienceWrapper.tsx — Cross-fade timing
opacity: isPortfolioVisible ? 1 : 0,
transition: 'opacity 0.4s ease', // Reducir de 0.6s a 0.4s para cross-fade más rápido
```

**Step 5: Build, screenshot, evaluate**

**Step 6: Commit**

```bash
git add src/components/experience/CameraRig.tsx src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: smooth transitions from frame-by-frame visual analysis"
```

---

### Task 5: Fix — Lighting & Premium Feel

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Evaluar iluminación en screenshots**

Criterios:
- ¿El monitor screen glow se ve como una pantalla real encendida?
- ¿Las sombras dan profundidad o son flat?
- ¿El spotlight del MacBook crea un focus dramático?
- ¿El bloom es sutil o exagerado?

**Step 2: Ajustar bloom/vignette si es necesario**

```typescript
// DeskScene.tsx — EffectComposer
<Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.25} mipmapBlur />
<Vignette eskil={false} offset={0.25} darkness={0.4} />
```

**Step 3: Ajustar screen glow breathing**

```typescript
// DeskScene.tsx — screen glow animation
const proxy = { intensity: 0.6 }
gsap.to(proxy, {
  intensity: 1.0,
  duration: 4,  // Más lento = más sutil
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
})
```

**Step 4: Consultar Blender MCP para verificar luces**

```python
from blender_bridge import execute_code
result = execute_code("""
import bpy
for obj in bpy.data.objects:
    if obj.type == 'LIGHT':
        loc = obj.location
        print(f'{obj.name}: type={obj.data.type}, energy={obj.data.energy}')
        print(f'  Three.js pos: ({loc.x:.2f}, {loc.z:.2f}, {-loc.y:.2f})')
""")
```

**Step 5: Build, screenshot, evaluate**

**Step 6: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "fix: calibrate lighting and postprocessing for premium feel"
```

---

### Task 6: Fix — Loading Screen & Intro Polish

**Files:**
- Modify: `src/components/experience/LoadingScreen.tsx`

**Step 1: Verificar loading screen en screenshot**

Evaluar:
- ¿El nombre "ANDREA AVILA" se lee bien?
- ¿La progress bar es visible y útil?
- ¿El botón "Explorar" tiene affordance clara?
- ¿La transición loading→intro es smooth?

**Step 2: Ajustar si necesario**

Ajustes típicos:
- Tagline debajo del nombre
- Progress bar más visible
- Hover state del botón más obvio
- Background blur o gradient más atmospheric

**Step 3: Build, screenshot, evaluate**

**Step 4: Commit**

```bash
git add src/components/experience/LoadingScreen.tsx
git commit -m "fix: polish loading screen for first impression impact"
```

---

### Task 7: Fix — Responsive & Edge Cases

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Test responsive con Playwright resize**

```javascript
// Test at 3 sizes: desktop (1920x1080), laptop (1440x900), tablet landscape (1024x768)
// Capture screenshot at each size
```

**Step 2: Verificar overlay sizing at each breakpoint**

Si los overlays son demasiado grandes/pequeños, ajustar clamp values:

```typescript
// ExperienceWrapper.tsx — fallback styles
width: 'clamp(280px, 44vw, 720px)'
height: 'clamp(180px, 48vh, 480px)'
```

**Step 3: Build, screenshot at all sizes, evaluate**

**Step 4: Commit**

```bash
git add src/components/experience/ExperienceWrapper.tsx
git commit -m "fix: responsive overlay sizing from multi-viewport testing"
```

---

### Task 8: Iteration Loop — Repeat Until 10/10

**This is the core loop. Repeat until ALL criteria score 10/10.**

**Step 1: Full screenshot capture** (same as Task 1 Step 2)

**Step 2: UX Heuristics evaluation** (same as Task 1 Step 3)

**Step 3: Compare with previous iteration scores**

```markdown
| Criterio | Iter 1 | Iter 2 | Iter 3 | ... |
|----------|--------|--------|--------|-----|
| Visibilidad | 6 | 8 | 9 | ... |
| ... | ... | ... | ... | ... |
```

**Step 4: If any criterion < 10, identify the fix**

Map each failed criterion to the relevant task:
- Visibilidad/Affordance → Task 6 (loading), Task 4 (transitions)
- Primera persona/Cámara → Task 3 (cameras)
- Integración visual → Task 2 (overlays)
- Premium feel → Task 5 (lighting)
- Legibilidad → Task 7 (responsive)

**Step 5: Apply fix, build, re-screenshot, re-evaluate**

**Step 6: When all 10/10, commit final state**

```bash
git add -A
git commit -m "feat: achieve 10/10 UX heuristics score — immersive desk experience complete"
```

---

### Task 9: Final Documentation

**Files:**
- Create: `docs/project-context/ux-final-audit.md`

**Step 1: Document final scores**

```markdown
# UX Final Audit — 2026-03-18
All criteria: 10/10

## Iterations
- Iteration 1 (baseline): avg 6.2
- Iteration 2: avg 7.8
- Iteration 3: avg 9.1
- Iteration 4 (final): avg 10.0

## Changes Made
[List all commits and what they fixed]

## Screenshots
[Reference screenshots from each iteration]
```

**Step 2: Commit documentation**

```bash
git add docs/project-context/ux-final-audit.md
git commit -m "docs: add UX audit trail with iteration history"
```

---

## Multi-Agent Execution Strategy

When running this plan, dispatch agents as follows:

### Agent 1: Implementer
- Reads task, modifies code, builds
- Uses Blender MCP for 3D data queries
- Commits after each fix

### Agent 2: Visual QA (Playwright)
- Navigates to localhost:3000
- Captures screenshots at key moments
- Returns screenshots for evaluation

### Agent 3: UX Evaluator
- Receives screenshots from Agent 2
- Applies @ux-heuristics criteria
- Returns scored evaluation + error list

### Pipeline per iteration:
```
Agent 1 (implement) → build → Agent 2 (screenshot) → Agent 3 (evaluate)
                                                         ↓
                                               errors? → Agent 1 (fix)
                                               10/10? → DONE
```

---

## Risk Notes

- **Playwright vs dev server:** Dev server must be running BEFORE Playwright navigates. Start it in background.
- **WebGL in headless:** Playwright may not render WebGL/Three.js properly in headless mode. Use `headless: false` or capture with visible browser.
- **Camera values are iterative:** Don't expect first values to be perfect. Budget 3-5 iterations.
- **Screen mesh names:** If GLB mesh names don't match the extractCorners filter, projection falls back to hardcoded values. Check console.log in dev mode.
- **Blender MCP timeout:** First command sometimes fails. Retry once.
