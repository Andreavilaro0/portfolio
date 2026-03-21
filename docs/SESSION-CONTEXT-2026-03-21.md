# Contexto de Sesión — 2026-03-21

## Resumen de lo logrado

### Escena 3D
- Environment map (HDRI studio) — transforma los materiales PBR
- Monitor y teclado con materiales PBR originales (no bakeados)
- Calavera mexicana reemplazó la máscara de lucha (rotada 180°)
- Fondo peach-coral con arco visible
- Sombras deshabilitadas (causaban artefactos)
- Animación intro: fly-in alto → se endereza al monitor
- Objetos: monitor, teclado, mouse, café, F1 car, calavera, Zumo robot, leica

### Textura del sketchbook
- Generada con fal-ai/flux: foto realista de libreta con wireframes, diagramas, código
- Guardada en `public/models/sketch-texture.png`
- Notebook GLB importado (`dl_notebook.glb`) pero NO se ve en la escena web

### p5.brush sketch
- HTML interactivo en `public/models/sketch-art.html`
- Se puede usar como fallback o referencia visual

## Problemas que persisten

### P1: Sketchbook no visible
- El notebook se importó en Blender (Box001/2/3 + 32 Torus spirals)
- Posicionado en (-3.5, 1.0, 6.55) scale (3,3,3)
- Pero en Three.js NO aparece — posiblemente:
  - Los meshes están exportados pero en posición incorrecta (ejes Blender→Three.js)
  - O la escala/posición no coincide con la vista de cámara
- **Fix:** Verificar en Blender que el notebook está visible desde la cámara PreviewCam, renderizar para confirmar, y re-exportar

### P2: Lámpara sigue visible
- Se intentó eliminar `desk_lamp.001` pero sigue en el GLB
- Probablemente el nombre cambió o hay un cache
- **Fix:** Verificar nombres exactos, eliminar, re-exportar

### P3: Gaming Laptop no se puede decimar
- 74K verts, topología resiste decimate
- Se eliminó de Blender pero puede seguir en el GLB cached
- **Fix:** Verificar que no está en la escena, re-exportar limpio

## VISIÓN: Interacción tipo GTA

La user quiere interacciones como GTA cuando el personaje se sienta en un escritorio:

### Concepto
1. **Estado idle**: Cámara en posición "seated", ve el desk completo
2. **Click en un objeto** → cámara hace **dolly/pan animado** hacia el objeto
3. **Vista detallada**: muestra el objeto de cerca con info/animación
4. **Escape/click fuera** → vuelve a seated

### Interacciones por objeto

| Objeto | Animación al click | Vista detallada |
|--------|-------------------|-----------------|
| **Monitor** | Zoom al monitor, centrar | Muestra el portfolio web |
| **Sketchbook** | Pan hacia la libreta | Animación de páginas pasando mostrando ideas/wireframes |
| **F1 Car** | Zoom al F1 | Info sobre la pasión por F1, Alonso |
| **Calavera** | Acercarse | Historia personal MX→ES |
| **Zumo Robot** | Pan izquierda | Video/fotos de la competencia de robótica |
| **Leica Camera** | Zoom | Galería de fotos de street photography |
| **Coffee Cup** | Acercarse | Proyecto CivicAid (café = hackathon) |
| **Teclado** | Zoom al teclado | Skills/tecnologías |

### Implementación técnica
- Cada objeto tiene una posición de cámara definida (como CAMERAS en CameraRig)
- Click → GSAP anima la cámara a esa posición
- El DOM overlay cambia según el objeto seleccionado
- Escape → anima de vuelta a seated

### Archivos a modificar
- `CameraRig.tsx` — añadir posiciones de cámara por objeto
- `DeskInteractions.tsx` — emit evento con el nombre del objeto clickeado
- `ExperienceWrapper.tsx` — manejar el estado de "viéndolo de cerca"
- Nuevo componente: `ObjectDetail.tsx` — renderiza el contenido específico de cada objeto

## Archivos clave
- GLB: `public/models/desk-scene-web-v2.glb` (11.2MB)
- Blend: `public/models/desk-scene-environment.blend`
- Sketch texture: `public/models/sketch-texture.png`
- Sketch HTML: `public/models/sketch-art.html`
- Skull model: `~/Desktop/mexican_skull_with_flower_pattern.glb`
- Notebook model: `~/Desktop/3dIA/modelos/dl_notebook.glb`

## Para retomar

```
Lee docs/SESSION-CONTEXT-2026-03-21.md

Haz esto en orden:
1. Abre Blender con desk-scene-environment.blend
2. Verifica que la lámpara y laptop están eliminadas
3. Verifica que el sketchbook es visible desde la cámara
4. Re-exporta GLB limpio
5. Implementa el sistema de interacción tipo GTA (click objeto → cámara se mueve → vista detallada)
```

## Git log reciente
```
1547e8b feat: enlarge sketchbook, remove lamp, objects link to page sections
2e7e3f9 feat: fal-ai generated sketch texture for notebook
d82f3d5 feat: add sketchbook with hand-drawn wireframe texture (p5.brush)
db772a7 fix: camera ends looking straight at monitor (eye-level)
c342a75 fix: remove laptop (74K undecimatable) and plants, skull faces front
7f84680 fix: intro animation, desk color, remove shadows
3c19dff fix: restore monitor overlay, fix stand checkerboard pattern
```
