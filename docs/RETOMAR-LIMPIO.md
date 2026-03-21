# RETOMAR LIMPIO — Portfolio 3D

> Dale este archivo a Claude en una sesión nueva:
> `Lee docs/RETOMAR-LIMPIO.md y ejecuta la fase 1 completa.`

---

## Estado actual

El portfolio 3D tiene una escena con objetos en un escritorio renderizada con React Three Fiber. La escena funciona pero tiene problemas visuales acumulados de múltiples re-exports de Blender.

### Lo que funciona
- Environment map HDRI (drei `preset="studio"`) — materiales PBR se ven bien
- Animación intro fly-in (se endereza al acercarse)
- Sistema GTA implementado (click objeto → cámara vuela, Escape → vuelve)
- Portfolio overlay en el monitor
- Fondo peach-coral con arco
- Dev server en localhost:3000

### Problemas a resolver

| # | Problema | Causa |
|---|---------|-------|
| 1 | **Lámpara visible sin textura** | Se eliminó en Blender pero el GLB no se re-exportó limpio |
| 2 | **Calavera al revés** | Rotación 180° no se aplicó al exportar |
| 3 | **Sketchbook invisible** | Está en Blender pero no se ve en Three.js |
| 4 | **Click siempre va al monitor** | OBJECT_CAMERAS no tiene fallback para objetos sin cámara definida |
| 5 | **Laptop eliminada pero ~74K verts desperdiciados** | Meshes huérfanos pueden seguir en el GLB |

---

## FASE 1: Blender limpio (hacer TODO antes de exportar)

### Paso 1: Revertir el .blend
```python
bpy.ops.wm.revert_mainfile()
```
Esto recupera el estado original con todos los materiales PBR intactos.

### Paso 2: Auditar objetos
Listar TODOS los objetos y decidir qué queda:

| Objeto | Acción | Notas |
|--------|--------|-------|
| Monitor | KEEP | Materiales PBR originales, NO bakear |
| desk.001 | KEEP | Materiales PBR originales |
| keyboard.001 | KEEP | Materiales PBR originales |
| razer_mouse | KEEP | |
| coffee_cup | KEEP | |
| leica_camera | KEEP | |
| F1_Car | KEEP + decimate 0.15 | 40K → ~6K |
| Zumo_Robot | KEEP | 4K verts, OK |
| Chair | KEEP | Monobloc, da contexto |
| Wrestling_Mask | DELETE | Reemplazar por skull |
| Gaming_Laptop | DELETE | 100K verts, no se puede decimar |
| desk_lamp.001 | DELETE | Se pierde en la escena |
| Plant_Left | DELETE | Texturas pixeladas |
| Plant_Right | DELETE | Texturas pixeladas |
| Background | KEEP | Plano con imagen peach-arch |
| Floor | KEEP | Plano cream |

### Paso 3: Importar modelos nuevos

**Calavera mexicana:**
- Archivo: `~/Desktop/mexican_skull_with_flower_pattern.glb`
- Posición: `(2.5, -1.5, 6.7)`
- Escala: `(0.4, 0.4, 0.4)`
- Rotación: `Z = 180°` (que mire al frente)
- **APLICAR rotación** con `Ctrl+A` o `bpy.ops.object.transform_apply(rotation=True)`
- Decimar meshes >5K verts con ratio 0.05

**Notebook/Sketchbook:**
- Archivo: `~/Desktop/3dIA/modelos/dl_notebook.glb`
- Posición: `(-3.5, 1.0, 6.55)`
- Escala: `(3.0, 3.0, 3.0)`
- Rotación: `Z = 0.25 rad` (ligeramente inclinado)
- Aplicar textura `public/models/sketch-texture.png` al mesh de las páginas (Box003)

### Paso 4: Decimar objetos pesados
Solo Monitor (115K→~15K) y F1_Car (40K→~6K). NO decimar keyboard ni desk.

### Paso 5: Resize texturas >2048px a 2048

### Paso 6: Verificar con render de Blender
Poner la cámara en la posición de Three.js y renderizar para confirmar que todo se ve.

### Paso 7: Exportar GLB UNA sola vez
```python
bpy.ops.export_scene.gltf(
    filepath=path,
    use_selection=True,
    export_format='GLB',
    export_draco_mesh_compression_enable=False,
    export_materials='EXPORT',
    export_image_format='JPEG',
    export_image_quality=85,
)
```

---

## FASE 2: Código limpio

### DeskScene.tsx
- Background plane → MeshBasicMaterial (unlit)
- Monitor stand → override material plateado (fix checkerboard)
- Desk → material warm white `#f0ece6`
- Floor → material cream `#e8d8c8`, no shadows
- NO emissive glow en monitor
- NO shadows (`shadows={false}` en Canvas)
- Environment preset="studio" intensity 0.4

### CameraRig.tsx
- Intro: `(0, 20, -25)` → seated `(0, 10.5, -8.0)` lookAt `(0, 10.5, 2)`
- LookAt interpola durante intro (se endereza)
- OBJECT_CAMERAS: posición de cámara para CADA objeto del desk
- Mode `'focused'`: anima cámara al objeto clickeado

### DeskInteractions.tsx
- Click → `onObjectFocus(name)` (GTA-style, no tooltip)
- Hover → glow emissive verde (#BEFF00)
- Todos los objetos clickeables

### ExperienceWrapper.tsx
- Mode `'focused'` + `focusedObject` state
- Escape → vuelve a seated
- Botón "← Back to desk"
- Monitor overlay solo visible en mode `'seated'`

---

## FASE 3: Sketchbook interactivo

Cuando el usuario clickea el sketchbook:
1. Cámara vuela al sketchbook (vista desde arriba)
2. Slideshow de "páginas" con los proyectos
3. Cada página es una imagen generada con fal-ai mostrando sketches de cada proyecto
4. Transición tipo "page flip" entre páginas
5. Click en página → navega al proyecto

---

## Archivos clave

```
src/components/experience/
├── CameraRig.tsx        — posiciones de cámara, animaciones
├── DeskInteractions.tsx  — hover/click en objetos
├── DeskScene.tsx         — GLB loader, materiales, lighting
├── ExperienceWrapper.tsx — estado global, overlays DOM
├── DustParticles.tsx     — partículas ambientales
└── LoadingScreen.tsx     — pantalla de carga

public/models/
├── desk-scene-web-v2.glb        — escena 3D (RE-EXPORTAR)
├── desk-scene-environment.blend — archivo Blender fuente
├── sketch-texture.png           — textura fal-ai para notebook
└── background-peach-arch.jpg    — fondo generado con IA

Modelos externos:
├── ~/Desktop/mexican_skull_with_flower_pattern.glb
├── ~/Desktop/3dIA/modelos/dl_notebook.glb
└── ~/Desktop/3dIA/modelos/gaming_laptop.glb (NO USAR)
```

## Config

- Blender MCP: `localhost:9876`
- Dev server: `localhost:3000` (Next.js 16 Turbopack)
- Sketchfab API: `429ae2c5c38d41e78173ad067ebf2fee`
- fal-ai: disponible via MCP
- Sentry: org=andrea-c1, project=javascript-nextjs
