# Plan: Mejorar Animaciones y Escena Blender para Web

## Investigación realizada
Fuentes consultadas:
- [Codrops: Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)
- [Codrops: Building Efficient Three.js Scenes](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
- [Blender to Three.js export guide](https://github.com/funwithtriangles/blender-to-threejs-export-guide)
- [3D Optimization: 26MB → 560KB](https://echobind.com/post/3D-Optimization-for-Web-26mb-down-to-560kb)
- [Animating Camera Transitions with GSAP](https://waelyasmina.net/articles/animating-camera-transitions-in-three-js-using-gsap/)
- [NY Times three-story-controls](https://github.com/nytimes/three-story-controls)
- [Homestyler: Optimizing Blender for Web](https://www.homestyler.com/article/optimizing-blender-files-for-web)

---

## Estado actual del GLB
- Archivo: `desk-scene-opt.glb` (3.2MB, Draco compressed)
- Meshes: 29 objetos, 8 ocultos programáticamente
- Texturas: incluidas en el GLB (no optimizadas externamente)
- No hay animaciones embebidas en el GLB
- Todas las animaciones de cámara se hacen en código (GSAP)

---

## Plan de mejoras

### Fase 1: Optimizar el GLB actual (en Blender)

**Sin re-exportar — mejoras en código:**
1. Reducir el emissive del monitor screen para que se vea más realista
2. Mejorar las ContactShadows (blur, opacity, position Y)
3. Ajustar los materiales de objetos que se ven "flat" o sin detalle

**En Blender (requiere re-export):**
1. **Bake de texturas**: Los materiales procedurales no exportan a GLTF. Bakear todo a image textures (1024x1024 para objetos principales, 512x512 para secundarios)
2. **Texture atlas**: Combinar texturas de objetos pequeños en un atlas para reducir draw calls
3. **Retopología**: Simplificar meshes con demasiados polígonos (el café, los headphones)
4. **Limpieza**: Eliminar vertices duplicados, faces internas, normales invertidas
5. **UV mapping**: Verificar que todos los UVs están correctos antes de bakear

**Target:**
- GLB final < 2MB con Draco
- < 50K polígonos totales
- Texturas: WebP o JPEG, no PNG (50-70% más pequeñas)

### Fase 2: Mejorar la pantalla del monitor en Blender

**Problema actual:** La pantalla del monitor es un mesh plano con material emissive asignado en código. Se ve como un rectángulo azul, no como una pantalla real.

**Solución en Blender:**
1. Crear una textura para la pantalla que simule un desktop/OS (gradient oscuro, íconos sutiles)
2. Bakear esa textura en el UV del screen mesh
3. En código, no sobreescribir el material — dejar el baked texture visible
4. El overlay DOM se superpone sobre esta textura baked

**Alternativa sin Blender:** Usar emissive con un mapa de textura (gradient image) cargado como `emissiveMap` en Three.js

### Fase 3: Animaciones de cámara premium (en código)

**Mejoras basadas en la investigación:**

1. **Dolly-in con ligero crane (ya implementado):**
   - Posición inicial: `(0, 10.3, -22)` → `(0, 10.3, -6)` (push-in puro en Z)
   - Mejora: añadir un sutil descenso vertical: start en Y=11 → end en Y=10.3
   - Esto crea una sensación de "establecer la escena desde arriba y bajar al nivel del monitor"

2. **Easing cinematográfico:**
   - Actual: `power2.inOut` → correcto pero genérico
   - Mejora: `CustomEase` de GSAP con una curva que tenga slow start + fast middle + slow end
   - O usar `power3.inOut` para un ease más dramático

3. **Transición Monitor → MacBook:**
   - Actual: lerp lineal de posición + lookAt
   - Mejora: usar una trayectoria curva (bezier path) para que la cámara no se mueva en línea recta
   - GSAP `motionPath` plugin permite esto
   - La cámara primero se eleva ligeramente (Y+1), se desplaza lateralmente, y baja al MacBook

4. **Ambient motion — escena viva:**
   - Sutil bobbing de la cámara en idle (amplitud 0.01, frecuencia lenta)
   - Las partículas de dust ya añaden vida
   - Pulsación sutil del emissive del monitor (breathing effect)

### Fase 4: Textura de pantalla del MacBook

**Problema:** El MacBook muestra la textura de Catalina del GLB, que se ve pixelada a distancia corta.

**Solución:**
1. En Blender: Asignar una textura de pantalla más oscura/neutra al MacBook screen
2. En código: No sobreescribir — dejar que la textura original se vea como "desktop detrás del arcade overlay"
3. El overlay DOM del arcade se superpone naturalmente

### Fase 5: Iluminación mejorada

**Basado en la investigación de Codrops sobre escenas eficientes:**

1. **Environment map**: Añadir `<Environment preset="night" />` de drei para reflejos metálicos realistas en el monitor, teclado, y soporte
2. **Rim light**: Ya implementado (pointLight rosa)
3. **Area light**: Simular la luz que emite la pantalla del monitor sobre el teclado y los objetos cercanos
4. **Contact shadows mejoradas**: Ajustar position Y al nivel real del suelo del GLB

### Fase 6: Efectos post-procesado mejorados

1. **Depth of Field**: Usar `<DepthOfField>` de @react-three/postprocessing con focus en el monitor (seated) o MacBook (macbook mode)
2. **Chromatic Aberration**: Muy sutil, solo en los bordes
3. **Screen glow breathing**: El monitor emissive pulsa sutilmente (GSAP tween en loop)

---

## Prioridades

| # | Mejora | Impacto | Dificultad | Requiere Blender |
|---|--------|---------|------------|------------------|
| 1 | Curva bezier en transición monitor→macbook | Alto | Medio | No |
| 2 | Screen glow breathing | Medio | Bajo | No |
| 3 | Depth of Field sutil | Alto | Bajo | No |
| 4 | Environment map para reflejos | Alto | Bajo | No |
| 5 | Sutil crane en intro (Y descent) | Medio | Bajo | No |
| 6 | Bake texturas en Blender | Alto | Alto | Sí |
| 7 | Textura de pantalla monitor | Medio | Medio | Sí |
| 8 | Retopología + optimización | Medio | Alto | Sí |
| 9 | Texture atlas | Bajo | Alto | Sí |

---

## Cambios inmediatos (sin Blender, solo código)

Estos se pueden implementar ahora:

```
1. Intro con crane shot: Y empieza en 11.5 y baja a 10.3
2. Transición monitor→macbook con curva (GSAP motionPath o bezier manual)
3. Screen glow breathing (emissive pulsa con GSAP)
4. Environment map para reflejos metálicos
5. Depth of Field cuando la cámara está quieta
6. Ajuste fino del parallax mouse (más sutil)
```
