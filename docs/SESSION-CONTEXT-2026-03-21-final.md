# Contexto Final — 2026-03-21

## PROBLEMAS CRÍTICOS (resolver en próxima sesión)

### 1. Lámpara sigue visible
- `desk_lamp.001` se eliminó en Blender pero sigue en el GLB
- El GLB no se re-exportó después de eliminarla, o hay un problema de cache
- **Fix:** Reabrir Blender, verificar que no existe, re-exportar GLB, reiniciar dev server

### 2. Calavera al revés
- Los meshes Object_4/5/6 se rotaron 180° en Z pero parece que no se aplicó en el export
- **Fix:** En Blender, rotar los meshes del skull y aplicar rotación (Ctrl+A → Rotation), re-exportar

### 3. Sketchbook no visible
- El notebook (Box001/2/3 + 32 Torus) está en Blender a (-3.5, 1.0, 6.55) scale 3
- Pero no se renderiza en Three.js — puede estar fuera del campo de cámara o detrás de algo
- **Fix:** Verificar con render de Blender que se ve, ajustar posición/escala, re-exportar

### 4. Click va directo a la pantalla del monitor
- El `handleClick` en DeskInteractions llama `onObjectFocus(name)` para TODOS los objetos
- Pero si el objeto no tiene cámara definida en OBJECT_CAMERAS, usa la del monitor como fallback
- **Fix:** Agregar fallback que calcula la cámara basada en la posición del objeto automáticamente

### 5. Animación del sketchbook (páginas pasando)
- Andrea quiere que al clickear el sketchbook se vea una animación de páginas pasando mostrando proyectos
- Esto requiere: modelo 3D con páginas animadas O una secuencia de imágenes como slideshow
- **Approach sugerido:** Usar la textura fal-ai como base, generar 4-5 páginas diferentes (una por proyecto), y hacer un slideshow con transición de "page flip" en CSS/canvas

## QUÉ FUNCIONA
- Environment map (HDRI studio) — materiales PBR se ven bien
- Monitor y teclado con materiales originales (no bakeados)
- Fondo peach-coral con arco
- Animación intro (fly-in que se endereza)
- Sistema GTA implementado (click → camera fly, Escape → back)
- Portfolio overlay en el monitor
- Calavera importada (pero al revés)
- Textura fal-ai del sketchbook generada (pero no visible)

## ARCHIVOS CLAVE
- GLB: `public/models/desk-scene-web-v2.glb` (11.2MB)
- Blend: `public/models/desk-scene-environment.blend`
- Sketch texture: `public/models/sketch-texture.png` (fal-ai generated)
- CameraRig: `src/components/experience/CameraRig.tsx` (tiene OBJECT_CAMERAS)
- DeskInteractions: `src/components/experience/DeskInteractions.tsx`
- DeskScene: `src/components/experience/DeskScene.tsx`
- ExperienceWrapper: `src/components/experience/ExperienceWrapper.tsx`

## PARA RETOMAR

```
Lee docs/SESSION-CONTEXT-2026-03-21-final.md

Pasos en orden:
1. BLENDER: Revert blend, verificar estado de TODOS los objetos
2. BLENDER: Eliminar desk_lamp.001 si existe
3. BLENDER: Rotar skull 180° Y APLICAR rotación (Ctrl+A)
4. BLENDER: Mover sketchbook a posición visible (verificar con render)
5. BLENDER: Re-exportar GLB limpio
6. CODE: Verificar que OBJECT_CAMERAS tiene posición para cada objeto
7. CODE: Arreglar click que siempre va al monitor
8. CODE: Implementar animación de páginas del sketchbook
9. TEST: Verificar en Playwright que todo funciona
```

## Sketchfab API key
`429ae2c5c38d41e78173ad067ebf2fee` — para descargar modelos 3D si necesitamos reemplazar objetos rotos

## Git log
```
5219aa0 fix: destructure onObjectFocus and focusedObject in DeskScene export
3a56ed6 feat: GTA-style object focus — click object, camera flies to it
1547e8b feat: enlarge sketchbook, remove lamp, objects link to page sections
2e7e3f9 feat: fal-ai generated sketch texture for notebook
d82f3d5 feat: add sketchbook with hand-drawn wireframe texture (p5.brush)
db772a7 fix: camera ends looking straight at monitor (eye-level)
c342a75 fix: remove laptop and plants, skull faces front
```
