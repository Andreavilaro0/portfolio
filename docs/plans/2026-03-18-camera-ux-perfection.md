# Camera & Animation UX Perfection Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Iterar cámaras, objetos y animaciones en Blender MCP + código hasta que UX heuristics dé 10/10 en visibilidad, coherencia, primera persona, sentido de cámara y sentido de animación.

**Architecture:** Ciclo de 3 pasos por iteración: (1) Ajustar en Blender MCP + código, (2) Verificar con Playwright screenshots, (3) Evaluar con UX heuristics. Repetir hasta 10/10.

**Tech Stack:** Blender MCP (blender_bridge.py), CameraRig.tsx, ExperienceWrapper.tsx, MCP Playwright, UX Heuristics skill

---

### Task 1: Capturar estado actual — baseline

**Files:**
- Read: `src/components/experience/CameraRig.tsx`
- Read: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Capturar flujo completo con Playwright**

Capturar 15+ frames del flujo: loading → intro → portfolio → transición → macbook → back

**Step 2: Evaluar con UX Heuristics**

Usar @ux-heuristics para puntuar cada frame en:
- Visibilidad del sistema (¿el usuario sabe dónde está?)
- Coherencia (¿las pantallas se sienten parte del mismo escritorio?)
- Primera persona (¿la cámara se siente natural, como si estuvieras sentado?)
- Sentido de cámara (¿el movimiento tiene intención cinematográfica?)
- Sentido de animación (¿las transiciones son suaves y predecibles?)
- Legibilidad (¿se puede leer el contenido?)
- Affordance (¿el usuario sabe cómo navegar?)

**Step 3: Documentar score y lista de errores**

Escribir: `docs/project-context/ux-iteration-01.md`

---

### Task 2: Ajustar cámaras en Blender MCP

**Files:**
- Modify via Blender MCP: objetos de la escena
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1: Verificar posiciones exactas de pantallas en Blender**

```python
from blender_bridge import execute_code
# Get monitor and macbook screen centers and sizes
```

**Step 2: Ajustar cámara seated para centrar monitor perfectamente**

La cámara debe estar exactamente en el eje de la pantalla del monitor:
- position.x = monitor_center.x
- position.z = monitor_center.z (misma altura)
- position.y = monitor_center.y - distancia (al frente)

**Step 3: Ajustar cámara macbook para centrar MacBook perfectamente**

Misma lógica: cámara centrada en el eje de la pantalla del MacBook.

**Step 4: Ajustar intro para que sea un push-in limpio**

- Mismo eje que seated
- Solo varía la distancia (Y)
- lookAt fijo = sin wobble

**Step 5: Re-exportar GLB si se movieron objetos**

```python
bpy.ops.export_scene.gltf(filepath=..., export_format='GLB', ...)
```

**Step 6: Build y capturar screenshots**

```bash
npx next build && npx next dev --port 3000
```

---

### Task 3: Ajustar overlays para que coincidan con las pantallas 3D

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1: Portfolio overlay — posicionar exactamente sobre la pantalla del monitor**

Calcular porcentajes CSS basados en la proyección del monitor screen en el viewport.

**Step 2: Arcade overlay — posicionar exactamente sobre la pantalla del MacBook**

Misma lógica para el MacBook.

**Step 3: Verificar que no hay parallax desalineación**

Si hay parallax en la cámara, desactivarlo en los modos donde hay overlay DOM.

---

### Task 4: Evaluar con UX Heuristics — Iteración 2

**Step 1: Capturar screenshots con Playwright**

**Step 2: Evaluar con @ux-heuristics**

Criterios de evaluación (cada uno 0-10):

| Criterio | Pregunta clave |
|----------|---------------|
| Visibilidad | ¿El usuario siempre sabe dónde está y qué puede hacer? |
| Coherencia | ¿Pantalla 1 y 2 se sienten como parte del mismo setup? |
| Primera persona | ¿La cámara se siente como si estuvieras sentado en el escritorio? |
| Sentido de cámara | ¿El movimiento de cámara tiene propósito y dirección clara? |
| Sentido de animación | ¿Las transiciones son predecibles y smooth? |
| Legibilidad | ¿Se puede leer todo el contenido sin esfuerzo? |
| Affordance | ¿Es obvio cómo navegar entre pantallas? |
| No pantallas negras | ¿Hay contenido visible en todo momento? |
| Integración visual | ¿Los overlays parecen estar "en" la pantalla, no flotando? |
| Premium feel | ¿La experiencia se siente pulida y profesional? |

**Step 3: Si score < 10/10, volver a Task 2 con los errores específicos**

**Step 4: Si score = 10/10, documentar y cerrar**

---

### Task 5: Iterar hasta perfecto (loop)

**Ciclo:**
```
1. Identificar error más grave del audit UX
2. Fix específico (cámara, overlay, timing, Blender)
3. Build
4. Screenshot con Playwright
5. Re-evaluar con UX heuristics
6. Si hay errores → volver a 1
7. Si 10/10 → DONE
```

**Criterio de salida:**
- Todos los criterios de Task 4 en 10/10
- 0 console errors
- Build PASS
- Screenshots verificados visualmente

---

### Task 6: Documentar resultado final

**Files:**
- Create: `docs/project-context/ux-final-audit.md`
- Update: `docs/project-context/master-status.md`

**Step 1: Escribir audit final con screenshots**

**Step 2: Listar todos los cambios realizados**

**Step 3: Guardar screenshots de referencia**
