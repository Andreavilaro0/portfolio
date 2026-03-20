# Contexto de Sesión — 2026-03-20 noche

## Lo que se logró hoy

1. **Commit de 2 días de trabajo** — `2f0cfe6` (183 archivos, 16K+ líneas)
2. **GLB exportado desde Blender** con texturas bakeadas y Environment map
3. **Environment map (HDRI)** — la pieza clave para que los materiales PBR se vean bien
4. **Monitor/teclado con materiales PBR originales** — no bakeados, se ven bien con HDRI
5. **Calavera mexicana importada** — reemplaza la máscara de lucha
6. **Overlays removidos** — sin monitor portfolio ni arcade, escena 3D pura
7. **Iluminación reducida** — env 0.4, ambient 0.1, directional 0.8
8. **Múltiples plans documentados** en docs/plans/

## Problemas pendientes

### P1: Calavera no visible
- El skull se importó como `Object_4/5/6` en Blender
- Se movió a `(2.5, -1.5, 6.7)` con scale `(0.5, 0.5, 0.5)`
- Pero en el GLB puede estar exportándose con materiales bakeados de la sesión anterior
- **Fix:** Verificar que Object_4/5/6 tienen sus materiales originales (no baked), y que están en la posición correcta en el GLB

### P2: Base del monitor con cuadros B&W
- El bake del Monitor creó una textura con patrón de cuadros en la base/soporte
- El código en DeskScene.tsx ya NO tiene override para monitor (se quitó)
- **Fix:** El GLB actual tiene los materiales PBR originales del monitor (reverted), pero la base puede tener el bake viejo. Verificar en Blender si Monitor tiene el material original o el bakeado.

### P3: FPS muy bajo (8-14 en Playwright)
- Gaming_Laptop: 75K verts (demasiado)
- Skull: ~31K verts
- Monitor: 29K verts
- Total: ~165K verts en la escena
- **Fix:** Decimar más agresivamente Gaming_Laptop y skull

### P4: Plantas pixeladas (ocultas)
- `plant_left` y `plant_right` están en HIDE_OBJECTS
- Las texturas originales eran buenas pero se degradaron con el resize a 1024px
- **Fix:** Si se quieren, re-importar los flower_pot.glb originales

## Lo que hay que hacer cuando retomes

1. **Abrir Blender** con el .blend actual (desk-scene-environment.blend)
2. **Verificar estado** — `bpy.ops.wm.revert_mainfile()` para limpiar el blend
3. **Re-importar skull** desde `/Users/andreaavila/Desktop/mexican_skull_with_flower_pattern.glb`
4. **Posicionar skull** en `(2.5, -1.5, 6.7)` scale `(0.5, 0.5, 0.5)`
5. **Verificar Monitor** tiene material PBR original (no bakeado)
6. **NO bakear** Monitor ni keyboard — solo bakear objetos oscuros
7. **Decimar** Gaming_Laptop a ~5K verts, skull a ~5K verts
8. **Re-exportar GLB** sin Draco, JPEG q85, texturas max 2048px

## Archivos clave
- GLB actual: `public/models/desk-scene-web-v2.glb` (8.8MB)
- Blend: `public/models/desk-scene-environment.blend`
- Skull: `~/Desktop/mexican_skull_with_flower_pattern.glb`
- DeskScene: `src/components/experience/DeskScene.tsx`
- CameraRig: `src/components/experience/CameraRig.tsx`
- DeskInteractions: `src/components/experience/DeskInteractions.tsx`

## Git log (últimos commits de hoy)
```
e0ec43b feat: selective bake, skull replaces mask, original PBR on monitor/keyboard
83d768c fix: position skull on desk, reduce lighting brightness
f55ea42 refactor: remove monitor/arcade overlays, focus on pure 3D scene
f0a8a88 feat: baked Blender lighting into textures for true visual parity
31122b0 feat: add Environment map (studio HDRI) for realistic PBR lighting
2e382f6 feat: high-quality scene from original blend, improved camera angle
```
