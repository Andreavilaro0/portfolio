# Auto-Correct Loop — No Parar Hasta Que Todo Se Vea Perfecto

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Loop autónomo que usa Playwright screenshots + Blender MCP para verificar y corregir la experiencia 3D hasta que se sienta como estar sentado frente a una computadora real viendo una página web, con control de la pantalla del monitor y la Mac. Eliminar brillo rosado. No parar hasta que todo tenga sentido.

**Architecture:** Ciclo infinito: screenshot → evaluar → si hay problema → fix → screenshot → repetir. Usa Blender MCP (localhost:9876) para verificar posiciones 3D reales. Usa Playwright para ver lo que el usuario ve. Cuando TODO pasa, se detiene.

**Tech Stack:** Next.js 16, React Three Fiber, Three.js, GSAP, MCP Playwright, Blender MCP (blender_bridge.py puerto 9876)

---

## Checklist de Perfección (TODOS deben pasar para detenerse)

| # | Criterio | Qué significa "pasa" |
|---|----------|---------------------|
| 1 | Monitor completo visible | La pantalla 3D del monitor se ve entera, no cortada |
| 2 | Overlay centrado EN la pantalla | El DOM overlay cae exactamente sobre la pantalla 3D del monitor, no flotando |
| 3 | Parece una webpage real | Fondo blanco, texto limpio, se ve como un browser abierto |
| 4 | Sin brillo rosado | El pointLight rosa y cualquier tinte rosa están eliminados o neutralizados |
| 5 | MacBook funcional | La cámara del MacBook muestra la pantalla y el overlay del arcade cae sobre ella |
| 6 | Transiciones suaves | Ir de portfolio↔arcade sin pantallas negras ni saltos |
| 7 | Parallax natural | Mover el mouse mueve la cámara sutilmente como girar la cabeza |
| 8 | Intro cinematográfico | El fly-in desde lejos se siente suave y aterriza en primera persona |
| 9 | Sin errores de consola | 0 errors en browser console (warnings de Three.js son OK) |
| 10 | El escritorio se ve completo | Se ve el teclado, mouse, lámpara, etc. alrededor del monitor |

---

## Datos Verificados de Blender MCP

```
Monitor Screen (Three.js coords):
  center: (0.000, 10.293, 2.039)
  size: 7.2 x 4.1 units

MacBook (Three.js coords):
  center: (-4.633, 7.500, -1.101)
  size: 3.05 x 2.05 units

Camera_Seated: (0, 10.29, -4.0) — Blender verified
Camera_MacBook: (-4.63, 7.5, -6.0) — Blender verified
Camera_Intro: (0, 10.29, -16.0) — Blender verified

Lights in Blender:
  Key_Light, Fill_Light, Rim_Pink, Monitor_Glow, monitor_apple_logo_light
```

## Key Files

- `src/components/experience/CameraRig.tsx` — Camera presets, GSAP animations, parallax
- `src/components/experience/ExperienceWrapper.tsx` — Overlays, mode state, clampRect
- `src/components/experience/DeskScene.tsx` — 3D scene, lighting, ScreenProjector, postprocessing
- `src/components/experience/ScreenAlignedOverlay.tsx` — 3D→pixel projection
- `src/components/layout/MonitorPortfolio.tsx` — Portfolio content

---

### Task 1: Eliminar brillo rosado

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Verificar las luces actuales con Blender MCP**

```python
from blender_bridge import execute_code
result = execute_code("""
import bpy
for obj in bpy.data.objects:
    if obj.type == 'LIGHT':
        loc = obj.location
        data = obj.data
        print(f'{obj.name}: type={data.type}, color={tuple(data.color)}, energy={data.energy}')
        print(f'  Three.js pos: ({loc.x:.2f}, {loc.z:.2f}, {-loc.y:.2f})')
""")
```

**Step 2: En DeskScene.tsx, encontrar y eliminar/neutralizar el pointLight rosa**

Buscar:
```typescript
<pointLight position={[0, 8, 4]} intensity={0.8} color="#FF2D9B" distance={15} />
```

Reemplazar con un blanco cálido sutil:
```typescript
<pointLight position={[0, 8, 4]} intensity={0.4} color="#FFF5F0" distance={15} />
```

**Step 3: Verificar el Rim_Pink en Blender**

Si Rim_Pink existe en el GLB exportado, su color se aplica automáticamente. Para contrarrestarlo en Three.js, ajustar el `<directionalLight>` de relleno:

```typescript
// Antes: color="#E0D0FF" (púrpura)
<directionalLight position={[5, 6, -4]} intensity={0.5} color="#F0EDE8" />
```

**Step 4: Screenshot con Playwright, verificar que no hay tinte rosa**

**Step 5: Commit**

```bash
git add src/components/experience/DeskScene.tsx
git commit -m "fix: remove pink point light, neutralize purple fill light"
```

---

### Task 2: Centrar overlay EXACTAMENTE sobre la pantalla del monitor

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`
- Modify: `src/components/experience/ScreenAlignedOverlay.tsx`

**Step 1: Verificar qué valores da el ScreenProjector ahora**

Con Playwright `browser_run_code`, evaluar:
```javascript
const overlays = document.querySelectorAll('div[style*="zIndex"]');
// Log the computed position of each overlay
```

**Step 2: Si la proyección da valores fuera de rango, el problema es la cámara demasiado cerca**

Opciones:
a) Alejar la cámara seated (Z más negativo, e.g. -8 o -9)
b) Reducir FOV (e.g. 30°)
c) Ambos

Iterar hasta que `clampRect` NO necesite clampar — la proyección natural debe dar valores dentro del viewport.

**Step 3: Verificar con Blender MCP que la cámara ve toda la pantalla**

```python
from blender_bridge import execute_code
# Calculate what FOV/distance shows the full monitor
# Monitor width = 7.2 units, at distance D with FOV F:
# visible_width = 2 * D * tan(F/2)
# For visible_width >= 7.2 * 1.3 (30% margin):
# D * tan(F/2) >= 4.68
```

Para FOV 35° y que el monitor ocupe ~60% del viewport:
- `visible_width = 2 * D * tan(17.5°) = 2 * D * 0.3153 = 0.6306 * D`
- Necesitamos `0.6306 * D >= 7.2 / 0.6` (monitor ocupa 60%)
- `D >= 12 / 0.6306 = 19.0` — pero eso es desde el monitor, no desde el origen
- Monitor está en Z=2.04, así que cámara en Z = 2.04 - 19 = **Z ≈ -17** ← demasiado lejos

Alternativa: FOV 50° con cámara más cerca:
- `visible_width = 2 * D * tan(25°) = 0.9326 * D`
- Para monitor al 60%: `0.9326 * D >= 12` → `D >= 12.87`
- Cámara en Z = 2.04 - 12.87 = **Z ≈ -10.8**

O FOV 45° con Z=-9:
- `visible_width = 2 * 11.04 * tan(22.5°) = 2 * 11.04 * 0.4142 = 9.15`
- Monitor (7.2) / viewport (9.15) = **78%** — un poco grande pero puede funcionar

**La clave: iterar FOV y Z hasta que el ScreenProjector dé valores que quepan en el viewport sin clampar.**

**Step 4: Ajustar CameraRig.tsx y DeskScene.tsx**

```typescript
// CameraRig.tsx
seated: {
  position: new THREE.Vector3(0, 11.5, -9.0),  // más lejos
  lookAt: new THREE.Vector3(0, 10.29, 2.04),
},

// DeskScene.tsx
camera={{ fov: 45, near: 0.1, far: 200, position: [0, 12, -12] }}
```

**Step 5: Screenshot, verificar que overlay cae sobre la pantalla**

**Step 6: Si no está centrado, ajustar ±0.5 en Z y ±2° en FOV. Repetir.**

**Step 7: Commit cuando overlay y pantalla coinciden**

---

### Task 3: Hacer que el escritorio se vea completo

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Screenshot actual — ¿se ve el teclado, mouse, lámpara?**

Si no, la cámara está demasiado centrada en el monitor. Necesitamos que el lookAt esté un poco más abajo para mostrar más escritorio:

```typescript
seated: {
  position: new THREE.Vector3(0, 11.5, -9.0),
  lookAt: new THREE.Vector3(0, 9.5, 1.0),  // más abajo → muestra más escritorio
},
```

**Step 2: Verificar con Blender MCP dónde están los objetos del escritorio**

```python
from blender_bridge import execute_code
result = execute_code("""
import bpy
desk_objects = ['razer_mouse', 'keyboard.001', 'coffee_cup', 'desk_lamp.001', 'headphones_marshall', 'leica_camera']
for name in desk_objects:
    obj = bpy.data.objects.get(name)
    if obj:
        loc = obj.location
        print(f'{name}: Three.js pos ({loc.x:.2f}, {loc.z:.2f}, {-loc.y:.2f})')
""")
```

**Step 3: Screenshot y verificar que se ven los objetos**

**Step 4: Commit**

---

### Task 4: Alinear overlay del arcade con la pantalla del MacBook

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Ir al modo arcade (click Arcade button via Playwright)**

**Step 2: Screenshot — ¿el overlay cae sobre la pantalla del MacBook?**

**Step 3: Si no, ajustar la cámara macbook**

La cámara del MacBook debe estar a una distancia donde la pantalla del MacBook quepa en ~55% del viewport.

```typescript
macbook: {
  position: new THREE.Vector3(-4.63, 8.5, -8.0),  // más lejos
  lookAt: new THREE.Vector3(-4.63, 7.5, -1.1),
},
```

**Step 4: Screenshot y verificar**

**Step 5: Commit**

---

### Task 5: Transiciones suaves sin pantallas negras

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Capturar transición con Playwright (screenshots cada 500ms)**

```javascript
// Click arcade, capture 6 frames over 3 seconds
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `transition-${i}.jpeg` });
}
```

**Step 2: Verificar que en ningún frame ambos overlays están invisibles**

Si hay un frame negro: el cross-fade timing está mal. Ajustar `transition: 'opacity Xs ease'` donde X debe ser al menos la mitad de la duración del camera transition (2.2s / 2 = 1.1s).

**Step 3: Si hay un flash de contenido viejo, agregar un delay al hideOld**

**Step 4: Commit**

---

### Task 6: Verificar intro fly-in con Playwright

**Files:** Ninguno (solo verificación)

**Step 1: Capturar el intro frame-by-frame**

```javascript
// Click to enter, capture 10 frames over 5 seconds
await page.click('body');
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(500);
  await page.screenshot({ path: `intro-${i}.jpeg` });
}
```

**Step 2: Verificar que:**
- Frame 0: escena lejana (se ve todo el escritorio pequeño)
- Frames 1-8: acercamiento progresivo
- Frame 9: posición seated, monitor al frente

**Step 3: Si el intro se siente brusco, ajustar la easing**

```typescript
gsap.to(proxy, {
  t: 1,
  duration: 5.0,
  ease: 'power2.inOut',  // Si es brusco, probar 'power1.inOut' o 'sine.inOut'
```

**Step 4: Commit si hay cambios**

---

### Task 7: THE LOOP — Verificar TODO y repetir hasta perfecto

**Este es el task principal. No para hasta que todos los 10 criterios pasan.**

**Step 1: Screenshot completo del flujo**

```
1. Navigate localhost:3000
2. Screenshot loading screen
3. Click to enter
4. Screenshot intro (5 frames)
5. Screenshot portfolio seated
6. Click Arcade
7. Screenshot transition (4 frames)
8. Screenshot arcade macbook
9. Click Portfolio
10. Screenshot return
```

**Step 2: Evaluar cada screenshot contra los 10 criterios**

Para cada criterio, responder PASS o FAIL con evidencia específica del screenshot.

**Step 3: Si algún criterio FALLA:**

Identificar el fix:
| Criterio fallido | Qué tocar |
|-----------------|-----------|
| Monitor cortado | CameraRig Z o FOV |
| Overlay descentrado | ExperienceWrapper clampRect o camera position |
| No parece webpage | MonitorPortfolio estilos |
| Brillo rosado | DeskScene luces |
| MacBook desalineado | CameraRig macbook preset |
| Transición con gap | ExperienceWrapper opacity timing |
| Parallax no funciona | CameraRig useFrame conditions |
| Intro brusco | CameraRig GSAP easing/duration |
| Errores consola | Fix el error específico |
| Escritorio cortado | CameraRig lookAt Y |

Aplicar fix → screenshot → re-evaluar → repetir.

**Step 4: Cuando los 10 criterios pasan, commit final**

```bash
git add -A
git commit -m "feat: all 10 UX criteria pass — immersive desk experience complete"
```

**Step 5: Verificar una última vez con Blender MCP**

```python
# Confirm camera positions match what looks good
from blender_bridge import execute_code
result = execute_code("""
import bpy
for name in ['Camera_Seated', 'Camera_MacBook']:
    obj = bpy.data.objects.get(name)
    if obj:
        loc = obj.location
        print(f'{name}: Blender ({loc.x:.2f}, {loc.y:.2f}, {loc.z:.2f})')
        print(f'  Three.js ({loc.x:.2f}, {loc.z:.2f}, {-loc.y:.2f})')
""")
```

Si los valores finales en el código difieren mucho de Blender, actualizar las cámaras en Blender para mantener sincronía.

---

## Regla de Oro

**NO PARAR hasta que los 10 criterios pasen.** Cada iteración del loop en Task 7 debe:
1. Capturar screenshots reales con Playwright
2. Evaluar contra los 10 criterios
3. Fix lo que falle
4. Volver a capturar
5. Solo parar cuando TODO pasa

El agente tiene autonomía total para ajustar valores de cámara, luces, overlays, timing, FOV — lo que sea necesario. La evidencia viene de los screenshots, no de suposiciones.
