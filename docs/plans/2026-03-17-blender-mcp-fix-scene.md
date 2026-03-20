# Fix Desk Scene via Blender MCP — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Arreglar la escena 3D del portfolio directamente en Blender usando MCP, re-exportar el GLB optimizado, y verificar visualmente con MCP Playwright hasta que quede perfecto.

**Architecture:** Abrir el .blend original → aplicar fixes de texturas, materiales, y objetos → exportar GLB optimizado → reemplazar en el proyecto Next.js → verificar con Playwright → iterar.

**Tech Stack:** Blender 5.0.1, Blender MCP (puerto 9876), blender_bridge.py, gltf-transform (CLI), MCP Playwright, Next.js

---

## Pre-requisitos

### 1. Abrir Blender con el addon MCP activo

```bash
# Abrir Blender con la escena
/Applications/Blender.app/Contents/MacOS/Blender /Users/andreaavila/Desktop/3dIA/proyecto-desk-scene/desk-scene.blend &
```

Dentro de Blender:
- Edit → Preferences → Add-ons → buscar "MCP" → activar
- El servidor MCP debe estar corriendo en puerto 9876
- Verificar con: `curl -s http://localhost:9876` (debe responder)

### 2. Verificar que el bridge funciona

```bash
cd /Users/andreaavila/Desktop/3dIA
python3 -c "from blender_bridge import get_scene_info; print(get_scene_info())"
```

---

## Task 1: Auditar la escena actual en Blender

**Files:**
- Read: `/Users/andreaavila/Desktop/3dIA/proyecto-desk-scene/desk-scene.blend` (via MCP)

**Step 1: Listar todos los objetos de la escena**

```python
# Via blender_bridge o MCP
import bpy
for obj in bpy.data.objects:
    print(f"{obj.name} | type={obj.type} | visible={not obj.hide_viewport} | pos={obj.location[:]}")
```

**Step 2: Identificar objetos problemáticos**

Buscar:
- `mega_sphere_L` — esfera rosa flotante (ELIMINAR)
- `sphere_cyan_R` — esfera/anillo cyan (ELIMINAR)
- `Object_0001*` — objetos glitch multi-parte (ELIMINAR)
- `Cube_metal1002_0*` — figuritas metálicas glitch (ELIMINAR)
- `environment_dome` — domo de entorno (ELIMINAR)
- `stage_floor` — suelo (EVALUAR — puede ser útil si se arregla)

**Step 3: Documentar estado de materiales**

```python
for mat in bpy.data.materials:
    print(f"{mat.name} | nodes={mat.use_nodes} | users={mat.users}")
```

---

## Task 2: Limpiar objetos no deseados

**Step 1: Eliminar objetos decorativos**

```python
import bpy

delete_names = [
    'mega_sphere_L', 'sphere_cyan_R',
    'Object_0001', 'Object_0001_1', 'Object_0001_2', 'Object_0001_3',
    'Cube_metal1002_0', 'Cube_metal1002_0_1', 'Cube_metal1002_0_2', 'Cube_metal1002_0_3',
    'environment_dome',
]

bpy.ops.object.select_all(action='DESELECT')
for name in delete_names:
    obj = bpy.data.objects.get(name)
    if obj:
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

bpy.ops.object.delete()
print("Deleted decorative objects")
```

**Step 2: Verificar que se eliminaron**

```python
remaining = [o.name for o in bpy.data.objects]
print(f"Remaining objects: {len(remaining)}")
print(remaining)
```

---

## Task 3: Arreglar materiales de las pantallas

**Step 1: Material del monitor principal**

```python
import bpy

# Encontrar el mesh de la pantalla del monitor
screen_obj = bpy.data.objects.get('MONITOR_SCREEN_PLANE') or bpy.data.objects.get('monitor_screen_glass')
if screen_obj:
    mat = bpy.data.materials.new(name="Monitor_Screen_Emissive")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Limpiar nodos por defecto
    for n in nodes:
        nodes.remove(n)

    # Crear nodo Principled BSDF con emissive sutil
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.05, 0.05, 0.12, 1)  # Azul muy oscuro
    bsdf.inputs['Emission Color'].default_value = (0.15, 0.15, 0.25, 1)
    bsdf.inputs['Emission Strength'].default_value = 2.0
    bsdf.inputs['Roughness'].default_value = 0.05
    bsdf.inputs['Metallic'].default_value = 0.3

    output = nodes.new('ShaderNodeOutputMaterial')
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Asignar material
    if screen_obj.data.materials:
        screen_obj.data.materials[0] = mat
    else:
        screen_obj.data.materials.append(mat)

    print(f"Monitor screen material updated: {screen_obj.name}")
```

**Step 2: Material del MacBook screen (similar pero más oscuro)**

```python
# Encontrar MacBook screen
for obj in bpy.data.objects:
    if 'macbook' in obj.name.lower() and 'screen' in obj.name.lower():
        print(f"Found MacBook screen: {obj.name}")
```

---

## Task 4: Arreglar texturas rotas

**Step 1: Identificar texturas missing o rotas**

```python
for img in bpy.data.images:
    if img.filepath:
        import os
        exists = os.path.exists(bpy.path.abspath(img.filepath))
        print(f"{img.name} | path={img.filepath} | exists={exists} | size={img.size[:]}")
    else:
        print(f"{img.name} | PACKED/GENERATED | size={img.size[:]}")
```

**Step 2: Re-bakear texturas procedurales a image textures**

Para cada material que use nodos procedurales (no image textures):
```python
# Seleccionar objeto, crear image texture node, bakear
# (Este paso requiere configuración específica por objeto)
```

---

## Task 5: Optimizar y exportar GLB

**Step 1: Configurar export settings**

```python
import bpy

output_path = "/Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio/public/models/desk-scene-v3.glb"

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False,
    export_animations=False,
    export_image_format='AUTO',
)

import os
size_mb = os.path.getsize(output_path) / (1024*1024)
print(f"Exported to {output_path} ({size_mb:.1f}MB)")
```

**Step 2: Optimizar con gltf-transform (opcional)**

```bash
npx gltf-transform optimize public/models/desk-scene-v3.glb public/models/desk-scene-v3-opt.glb \
  --compress draco \
  --texture-compress webp
```

---

## Task 6: Actualizar el proyecto Next.js

**Files:**
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1: Cambiar la ruta del modelo**

```typescript
// En DeskScene.tsx, cambiar:
const MODEL_PATH = '/models/desk-scene-opt.glb'
// A:
const MODEL_PATH = '/models/desk-scene-v3.glb'
```

**Step 2: Actualizar HIDE_OBJECTS (puede ser vacío si ya se eliminaron en Blender)**

```typescript
// Si los objetos ya se eliminaron en Blender, simplificar:
const HIDE_OBJECTS = [
  'stage_floor', // si aún existe
]
```

**Step 3: Verificar que el material del monitor ya viene correcto del GLB**

Si el material se configuró bien en Blender, no necesitamos sobreescribirlo en código.

---

## Task 7: Verificar con MCP Playwright

**Step 1: Rebuild y test**

```bash
kill $(lsof -ti:3000) 2>/dev/null
npx next build
rm -f .next/dev/lock && npx next dev --port 3000 &
sleep 8
```

**Step 2: Capturar screenshots del flujo completo**

Usar MCP Playwright para:
1. Loading screen → click → intro push-in
2. Portfolio overlay visible
3. Transición a MacBook arcade
4. Todas las pantallas visibles (no negras)
5. Texturas correctas

**Step 3: Comparar con el estado anterior**

Verificar:
- [ ] No hay objetos flotantes (esferas, anillos)
- [ ] No hay figuritas glitch
- [ ] Monitor screen tiene brillo sutil (no negro, no lavanda)
- [ ] MacBook screen se ve correcto
- [ ] Texturas no están rotas/missing
- [ ] Sombras de contacto funcionan
- [ ] Tamaño del GLB < 5MB

---

## Task 8: Iterar hasta perfecto

**Ciclo de iteración:**

```
1. Identificar defecto en Playwright screenshot
2. Abrir Blender MCP
3. Aplicar fix (material, posición, textura)
4. Re-exportar GLB
5. Rebuild Next.js
6. Capturar screenshot en Playwright
7. Si hay más defectos → volver a 1
8. Si perfecto → commit
```

**Criterios de "perfecto":**
- [ ] Intro push-in smooth y centrado
- [ ] Pantalla del monitor con brillo sutil (no negra)
- [ ] MacBook centrada y frontal
- [ ] Transiciones suaves con curva bezier
- [ ] Overlays con fade crossfade
- [ ] Texturas limpias sin artefactos
- [ ] Sin objetos flotantes ni glitch
- [ ] Build pasa sin errores
- [ ] 0 console errors
- [ ] GLB < 5MB

---

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `/Users/andreaavila/Desktop/3dIA/proyecto-desk-scene/desk-scene.blend` | Archivo Blender original |
| `/Users/andreaavila/Desktop/3dIA/blender_bridge.py` | Bridge para comunicarse con Blender |
| `public/models/desk-scene-opt.glb` | GLB actual (3.2MB) |
| `public/models/desk-scene-v3.glb` | GLB nuevo (post-fix) |
| `src/components/experience/DeskScene.tsx` | Escena R3F |
| `src/components/experience/CameraRig.tsx` | Animaciones de cámara |
| `src/components/experience/ExperienceWrapper.tsx` | Overlays DOM |

---

## Notas técnicas

- **Blender 5.0.1**: El motor se llama `BLENDER_EEVEE`, NO `BLENDER_EEVEE_NEXT`
- **GLTF export**: Solo soporta image textures, NO procedurales. Bakear antes de exportar.
- **Draco compression**: Nivel 6 es buen balance entre compresión y calidad
- **drei Html con transform**: NO renderiza texto DOM. Usar overlay DOM fijo.
- **blender_bridge socket**: Se cuelga en operaciones largas. Para renders/exports, usar CLI.
