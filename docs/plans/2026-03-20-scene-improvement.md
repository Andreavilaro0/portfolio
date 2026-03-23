# Mejora del Escenario 3D — Plan de Implementación

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformar la escena 3D del portfolio de un "desk con objetos" a un escenario interactivo profesional, aplicando los fundamentos de composición, color, iluminación y narrativa visual del documento de referencia.

**Architecture:** La escena se compone de un GLB exportado desde Blender (`desk-scene-web-v2.glb`) renderizado con React Three Fiber. Los overlays DOM se proyectan sobre las superficies del monitor. Las interacciones se manejan con hitboxes invisibles en `DeskInteractions.tsx`. La cámara tiene estados (intro → seated → macbook → project) controlados por GSAP en `CameraRig.tsx`.

**Tech Stack:** Blender 5.0 (MCP socket localhost:9876), Next.js 16, React Three Fiber, drei, GSAP, Three.js

**Referencia teórica:** `/Users/andreaavila/Desktop/Creación de un escenario interactivo en Blender  fundamentos teóricos y flujo de trabajo profesional.md`

---

## Diagnóstico del estado actual

### Lo que funciona
- Monitor como punto focal central ✅
- Overlay DOM alineado con el monitor ✅
- Animación ambiental (DustParticles, screen glow breathing) ✅
- Temperatura cálida en primer plano (peach background) ✅
- Intro cinematic fly-in ✅
- Parallax sutil con mouse ✅

### Problemas detectados (screenshot analysis)

| # | Problema | Principio violado |
|---|---------|-------------------|
| P1 | **Triángulo negro grande** a la derecha — Gaming_Laptop con geometría rota post-decimate | Coherencia de materiales |
| P2 | **Objetos sueltos sin composición** — los props están colocados al azar, no guían la mirada | Composición y puntos focales |
| P3 | **Sin suelo visible** — el desk flota sobre el fondo peach, sin ground plane | Verosimilitud y escala |
| P4 | **Iluminación plana** — no hay separación de planos, todo tiene la misma luminosidad | Esquema 3-puntos, temperatura |
| P5 | **Sin profundidad atmosférica** — no hay fog ni degradado de color con la distancia | Atmósfera y profundidad |
| P6 | **Objetos no reconocibles** — la máscara de lucha y el F1 car parecen manchas oscuras | Legibilidad visual |
| P7 | **Sin señalización de interactividad** — no hay pista visual de qué objetos son clickeables | Señalización lumínica |
| P8 | **Bisel negro del monitor muy grande** — la barra oscura arriba ocupa mucho espacio visual | Proporción y detalle |

---

## Fase 1: Limpiar geometría rota (Blender MCP)

### Task 1: Ocultar/arreglar Gaming_Laptop

El triángulo negro es el Gaming_Laptop con geometría destruida por el decimate. Opciones:
- A) Ocultar completamente (como hicimos con plants/chair)
- B) Re-importar el modelo original en Blender SIN decimate y re-exportar

**Opción recomendada: A** (ocultar). El laptop no aporta narrativamente — el MacBook arcade ya no existe en el GLB.

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:22-24`

**Step 1: Add Gaming_Laptop to HIDE_OBJECTS**

```typescript
const HIDE_OBJECTS: string[] = [
  'plant_left', 'plant_right', 'chair', 'object_0001',
]
```

Nota: Gaming_Laptop se exportó como `Object_0001` (×4 submeshes). Ocultar por prefijo `object_0001`.

**Step 2: Also remove from DeskInteractions**

En `DeskInteractions.tsx`, eliminar la entrada `Gaming_Laptop` del array `DESK_OBJECTS` ya que no será visible.

**Step 3: Commit**

```bash
git commit -m "fix: hide broken Gaming_Laptop geometry"
```

---

## Fase 2: Composición y puntos focales

### Task 2: Reorganizar objetos en Blender para composición triangular

Principio del documento: *"definir uno o varios puntos focales hacia los que se dirija la mirada, mediante líneas de fuga, contraste de iluminación o diferencias de saturación"*

Composición objetivo: **triángulo dorado** con el monitor en el ápice.

```
         Monitor (apex, punto focal)
        /                          \
   Máscara (izq)              F1 Car (der)
     Zumo Robot               Leica Camera
        \                          /
         -------- Teclado --------
```

**Ejecutar via Blender MCP** — reposicionar objetos:

```python
import bpy

# Wrestling Mask: más cerca del monitor, ligeramente elevada, visible
mask = bpy.data.objects['Wrestling_Mask']
mask.location = (-3.5, -0.5, 6.8)
mask.scale = (1.2, 1.2, 1.2)  # slightly bigger for visibility

# F1 Car: simetría derecha, como bookend
f1 = bpy.data.objects['F1_Car']
f1.location = (3.5, -0.8, 6.5)

# Zumo Robot: primer plano izquierdo, hero object
zumo = bpy.data.objects['Zumo_Robot']
zumo.location = (-2.0, 1.5, 6.5)
zumo.scale = (1.5, 1.5, 1.5)  # scale up — it's a key piece

# Coffee cup: near keyboard, intimate
cup = bpy.data.objects['coffee_cup']
cup.location = (2.5, 1.5, 6.5)

# Leica: right side, near F1
cam = bpy.data.objects['leica_camera']
cam.location = (4.5, 0.0, 6.4)
```

**Step 1: Execute repositioning via Blender MCP socket**
**Step 2: Verify in Blender viewport**
**Step 3: Re-export GLB (sin Draco, JPEG q72, max 1024px textures)**

```bash
git add public/models/desk-scene-web-v2.glb
git commit -m "feat: recompose desk objects in triangular focal composition"
```

---

## Fase 3: Suelo y profundidad

### Task 3: Añadir ground plane en Three.js

Principio: *"personajes o maniquíes de referencia para garantizar proporciones verosímiles"*

El desk flota en el vacío sobre peach. Necesita un plano de suelo que ancle la escena.

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Add a simple ground plane**

Después de `<primitive object={scene} />`:

```tsx
{/* Ground plane — anchors the desk in space */}
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
  <planeGeometry args={[60, 60]} />
  <meshStandardMaterial color="#E8D5C4" roughness={0.9} metalness={0} />
</mesh>
```

Color `#E8D5C4` = beige cálido que armoniza con el peach background pero es más oscuro para dar contraste.

**Step 2: Commit**

```bash
git commit -m "feat: add ground plane to anchor desk in scene"
```

---

## Fase 4: Iluminación con separación de planos

### Task 4: Implementar esquema de 3 puntos + señalización

Principio: *"esquema de tres puntos: key, fill, rim. La iluminación también cumple función de señalización: iluminar más intensamente zonas interactivas"*

Estado actual: 1 directional + 1 directional fill + 1 point + 1 ambient. No hay rim light ni separación cálido/frío.

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:233-257`

**Step 1: Reemplazar lighting setup**

```tsx
{/* === Lighting — 3-point setup with warm/cool separation === */}

{/* Key light: warm, from upper-left-front — main illumination */}
<ambientLight ref={ambientRef} intensity={0.15} color="#F5F0E8" />
<directionalLight
  position={[-5, 14, -8]}
  intensity={2.5}
  color="#FFF0E0"
  castShadow
  shadow-mapSize={[1024, 1024]}
  shadow-camera-left={-8}
  shadow-camera-right={8}
  shadow-camera-top={8}
  shadow-camera-bottom={-8}
  shadow-camera-near={0.5}
  shadow-camera-far={30}
/>

{/* Fill light: cooler, from right — creates warm/cool contrast */}
<directionalLight position={[6, 8, -4]} intensity={0.5} color="#E0E8FF" />

{/* Rim/back light: warm accent from behind — separates objects from background */}
<directionalLight position={[0, 6, 8]} intensity={0.8} color="#FFD4B0" />

{/* Monitor spotlight: draws eye to focal point */}
<pointLight position={[0, 12, 2]} intensity={0.6} color="#FFFFFF" distance={12} />
```

Cambios clave:
- **Ambient reducido** (0.3→0.15): más contraste, sombras más profundas
- **Fill light fría** (#E0E8FF): separa planos por temperatura
- **Rim light cálida** desde atrás: separa objetos del fondo
- **Point light en monitor**: refuerza el punto focal

**Step 2: Commit**

```bash
git commit -m "feat: implement 3-point lighting with warm/cool separation"
```

---

## Fase 5: Niebla atmosférica

### Task 5: Añadir fog para profundidad

Principio: *"usar fondos relativamente desaturados con focal points saturados"* e *"iluminación cálida en primer plano y fría en el fondo para incrementar la sensación de profundidad"*

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Add exponential fog**

Después de `<color attach="background" .../>`:

```tsx
<fog attach="fog" args={['#E8C4A8', 15, 45]} />
```

Esto crea niebla que empieza a 15 unidades y es completa a 45. Color ligeramente más desaturado que el background para crear transición.

**Step 2: Commit**

```bash
git commit -m "feat: add atmospheric fog for depth perception"
```

---

## Fase 6: Señalización de interactividad

### Task 6: Glow en objetos interactivos

Principio: *"iluminar más intensamente zonas interactivas ayuda a dirigir al usuario sin necesidad de instrucciones explícitas"*

Ya existe idle glow en `DeskInteractions.tsx` pero solo para objetos con `projectId`. Extender a TODOS los objetos interactivos con un sutil outline o emissive.

**Files:**
- Modify: `src/components/experience/DeskInteractions.tsx`

**Step 1: Enable idle glow for all objects, not just project-linked**

Cambiar línea ~106:
```typescript
// Was: const projectObjects = DESK_OBJECTS.filter(d => d.projectId)
const projectObjects = DESK_OBJECTS // all objects glow subtly
```

**Step 2: Reduce glow intensity for non-project objects**

```typescript
projectObjects.forEach((obj, i) => {
  const maxGlow = obj.projectId ? 0.08 : 0.03 // subtler for non-project
  // ... rest of tween with maxGlow
})
```

**Step 3: Commit**

```bash
git commit -m "feat: subtle glow on all interactive objects for discoverability"
```

---

## Fase 7: Animación ambiental enriquecida

### Task 7: Añadir animaciones ambientales sutiles

Principio: *"ventiladores en rotación, cables que se balancean, partículas de polvo en haces de luz contribuyen a que el entorno parezca vivo"*

Ya tenemos DustParticles. Añadir:

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Animate desk lamp with subtle sway**

```tsx
{/* Desk lamp subtle idle animation */}
useEffect(() => {
  const lamp = scene.getObjectByName('desk_lamp001')
  if (!lamp) return
  const tween = gsap.to(lamp.rotation, {
    z: 0.02,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
  return () => { tween.kill() }
}, [scene])
```

**Step 2: Float the coffee cup steam effect via a small particle system or emissive pulse**

Simple approach — pulsing emissive on the coffee cup:

```tsx
useEffect(() => {
  const cup = scene.getObjectByName('coffee_cup')
  if (!cup) return
  cup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material as THREE.MeshStandardMaterial
      if (mat.emissive) {
        mat.emissive = new THREE.Color('#4a2800')
        const proxy = { i: 0 }
        gsap.to(proxy, {
          i: 0.15,
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          onUpdate: () => { mat.emissiveIntensity = proxy.i },
        })
      }
    }
  })
}, [scene])
```

**Step 3: Commit**

```bash
git commit -m "feat: add ambient animations (lamp sway, coffee warmth)"
```

---

## Fase 8: Paleta de color coherente

### Task 8: Ajustar paleta cromática global

Principio: *"limitar la paleta a unos pocos colores dominantes y usar los tonos altamente saturados de forma localizada, reservándolos para acentos visuales (puntos de interacción, elementos hero)"*

Paleta objetivo:
- **Dominante**: Peach/Cream (#FAC8A5, #E8D5C4) — fondo y suelo
- **Neutro**: Grises cálidos (#3A3632, #1A1A1A) — desk, monitor frame
- **Acento 1**: Pink (#FF2D9B) — ya usado en tags y hover (mantener)
- **Acento 2**: Verde neon (#BEFF00) — ya usado en hints interactivos (mantener)

No hay cambios de código necesarios — la paleta ya está bien definida. Este task es una verificación.

**Step 1: Verificar en escala de grises**

Principio: *"comprobar la escena en valores (sin color) para verificar que las masas de luz y sombra guían correctamente"*

Tomar screenshot y convertir a grayscale para verificar legibilidad.

**Step 2: Documentar paleta en el plan**

---

## Fase 9: Verificación final

### Task 9: Playtesting visual con Playwright

**Step 1: Screenshot en 3 viewports**
- Desktop 1280×800
- Tablet 768×1024
- Mobile 375×667 (debería mostrar fallback 2D)

**Step 2: Verificar FPS post-cambios**

**Step 3: Production build**

```bash
npx next build
```

**Step 4: Commit final y tag**

```bash
git tag v0.3.0-scene-polish
```

---

## Resumen de la transformación

| Antes | Después |
|-------|---------|
| Objetos colocados al azar | Composición triangular con punto focal |
| Iluminación plana | 3-point setup con warm/cool separation |
| Desk flotando en vacío | Ground plane + fog atmosférico |
| Sin pistas de interactividad | Glow sutil en todos los objetos clickeables |
| Solo DustParticles | + lamp sway + coffee warmth |
| Geometría rota visible | Objetos rotos ocultos |
| Sin verificación de legibilidad | Test en escala de grises |
