# 3D Environment Polish — Match Reference Image

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. All tasks use Blender MCP via Python socket on localhost:9876.

**Goal:** Make the desk scene environment match the reference image (peach wall with recessed arch, fiddle-leaf plants in round pots, soft warm lighting).

**Architecture:** All changes via Blender MCP `execute_code`. Delete broken primitives, create proper wall with arch cutout, position existing downloaded assets (flower_pot.glb), fix lighting. Export final GLB.

**Tech Stack:** Blender 4.x, Blender MCP (socket on port 9876), Python

---

### Blender MCP Helper

Every task uses this Python function to send commands:

```python
import socket, json
def bc(code):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(('localhost', 9876))
    s.sendall(json.dumps({'type': 'execute_code', 'params': {'code': code}}).encode() + b'\n')
    s.settimeout(120)
    d = b''
    while True:
        try:
            c = s.recv(65536)
            if not c: break
            d += c
            try: json.loads(d.decode()); break
            except: continue
        except: break
    s.close()
    return json.loads(d.decode()).get('result', {}).get('result', '')
```

### sRGB Helper (used in all color definitions)

```python
def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92
```

Reference colors (from image):
- Wall peach: RGB(250, 188, 165) `#FABCA5`
- Arch ring (outer): RGB(235, 155, 110) `#EB9B6E`
- Arch fill (inner terracotta): RGB(183, 110, 82) `#B76E52`
- Floor: RGB(235, 200, 185) `#EBC8B9`

---

### Task 1: Delete all broken environment objects

**Step 1: Delete old primitives**

Delete these objects: `Arch_Ring`, `Arch_Inner`, `Arch`, `Arch_Fill`, `Arch_Decor`, `Floor`, `Cyclorama`, all `Plant_*`, all `Flower_Pot_*`, all `PlantL_*`, all `PlantR_*`.

```python
import bpy
deleted = 0
prefixes = ["Arch", "Floor", "Cyclorama", "Plant_", "Flower_Pot", "PlantL_", "PlantR_"]
for o in list(bpy.data.objects):
    if any(o.name.startswith(p) or o.name == p for p in prefixes):
        bpy.data.objects.remove(o, do_unlink=True)
        deleted += 1
bpy.ops.outliner.orphans_purge(do_recursive=True)
print(f"Deleted {deleted} objects")
```

**Step 2: Verify**

```python
print([o.name for o in bpy.data.objects if o.type == "MESH"])
```

Should only show desk objects: desk.001, Monitor, keyboard, mouse, etc.

---

### Task 2: Create physical wall with recessed arch

The reference has a WALL (not just background color) with the arch as a NICHE cut into it. The arch is not a separate floating object — it's a recession in the wall.

**Step 1: Create wall plane**

```python
import bpy, math

def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

# Wall material
mat_wall = bpy.data.materials.new("Wall_Peach")
mat_wall.use_nodes = True
bsdf = mat_wall.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (s2l(250), s2l(188), s2l(165), 1)
bsdf.inputs["Roughness"].default_value = 1.0
bsdf.inputs["Specular IOR Level"].default_value = 0.0

# Create wall - very wide, tall, behind desk
bpy.ops.mesh.primitive_plane_add(size=50, location=(0, -5, 15))
wall = bpy.context.object
wall.name = "Wall"
wall.rotation_euler = (math.radians(90), 0, 0)
wall.data.materials.append(mat_wall)
print("Wall created")
```

**Step 2: Create arch niche (recessed semicircle)**

The arch is TWO layers on the wall:
1. A filled semicircle with the INNER terracotta color (the deep part of the niche)
2. A ring/border around it with the OUTER coral color

```python
import bpy, bmesh, math

def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

# Inner fill material (terracotta - the deep wall of the niche)
mat_inner = bpy.data.materials.new("Arch_Terracotta")
mat_inner.use_nodes = True
bsdf = mat_inner.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (s2l(183), s2l(110), s2l(82), 1)
bsdf.inputs["Roughness"].default_value = 1.0
bsdf.inputs["Specular IOR Level"].default_value = 0.0

# Outer ring material (coral border)
mat_ring = bpy.data.materials.new("Arch_Coral_Ring")
mat_ring.use_nodes = True
bsdf = mat_ring.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (s2l(235), s2l(155), s2l(110), 1)
bsdf.inputs["Roughness"].default_value = 1.0
bsdf.inputs["Specular IOR Level"].default_value = 0.0

# INNER FILL: semicircle, radius 6.5, centered on monitor
# Position: slightly in front of wall (y=-4.9) so it reads as a niche
bpy.ops.mesh.primitive_circle_add(vertices=64, radius=6.5, fill_type="NGON", location=(0, -4.9, 7))
inner = bpy.context.object
inner.name = "Arch_Inner"
inner.rotation_euler = (math.radians(90), 0, 0)

# Delete bottom half
bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(inner.data)
bm.verts.ensure_lookup_table()
wm = inner.matrix_world
to_del = [v for v in bm.verts if (wm @ v.co).z < 7]
bmesh.ops.delete(bm, geom=to_del, context="VERTS")
bmesh.update_edit_mesh(inner.data)
bpy.ops.object.mode_set(mode="OBJECT")
inner.data.materials.append(mat_inner)

# OUTER RING: slightly larger semicircle behind the inner
bpy.ops.mesh.primitive_circle_add(vertices=64, radius=7.5, fill_type="NGON", location=(0, -4.95, 7))
ring = bpy.context.object
ring.name = "Arch_Ring"
ring.rotation_euler = (math.radians(90), 0, 0)

bpy.ops.object.mode_set(mode="EDIT")
bm = bmesh.from_edit_mesh(ring.data)
bm.verts.ensure_lookup_table()
wm = ring.matrix_world
to_del = [v for v in bm.verts if (wm @ v.co).z < 7]
bmesh.ops.delete(bm, geom=to_del, context="VERTS")
bmesh.update_edit_mesh(ring.data)
bpy.ops.object.mode_set(mode="OBJECT")
ring.data.materials.append(mat_ring)

print("Arch niche created: inner terracotta + outer coral ring")
```

**Step 3: Verify** — take screenshot, arch should be visible as colored semicircle on the wall behind the monitor.

---

### Task 3: Create floor with seamless transition

**Step 1: Create floor**

```python
import bpy

def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

mat_floor = bpy.data.materials.new("Floor_Warm")
mat_floor.use_nodes = True
bsdf = mat_floor.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (s2l(235), s2l(200), s2l(185), 1)
bsdf.inputs["Roughness"].default_value = 0.9
bsdf.inputs["Specular IOR Level"].default_value = 0.05

bpy.ops.mesh.primitive_plane_add(size=50, location=(0, 10, 0))
floor = bpy.context.object
floor.name = "Floor"
floor.data.materials.append(mat_floor)
print("Floor created")
```

**Step 2: Set world background to match wall** so there's no visible edge

```python
import bpy

def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

world = bpy.context.scene.world
if not world:
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
bg.inputs[0].default_value = (s2l(250), s2l(188), s2l(165), 1)
bg.inputs[1].default_value = 1.0

# Viewport uses scene world
for area in bpy.context.screen.areas:
    if area.type == "VIEW_3D":
        for space in area.spaces:
            if space.type == "VIEW_3D":
                space.shading.use_scene_world = True
                break
        break
print("World bg = wall color, viewport scene world ON")
```

---

### Task 4: Import and position flower_pot.glb as plants

The user downloaded `flower_pot.glb` (80KB). Import it twice, scale large, position on floor flanking the desk like in the reference.

**Step 1: Import left plant**

```python
import bpy, mathutils

bpy.ops.import_scene.gltf(filepath="/Users/andreaavila/Desktop/flower_pot.glb")

# Find and join all new meshes
known = {o.name for o in bpy.data.objects}  # snapshot before
# ... actually, select imported objects
imported = bpy.context.selected_objects
meshes = [o for o in imported if o.type == "MESH"]
if len(meshes) > 1:
    bpy.ops.object.select_all(action="DESELECT")
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()

plant = bpy.context.object
plant.name = "Plant_Left"

# Scale to ~2 units tall (big floor plant like reference)
dims = plant.dimensions
scale = 2.0 / max(dims)
plant.scale = (scale, scale, scale)
bpy.ops.object.transform_apply(scale=True)

# Position: left side of desk, on floor
min_z = min((plant.matrix_world @ mathutils.Vector(v)).z for v in plant.bound_box)
plant.location = (-7, -1, -min_z)

# Clean empties
for o in list(bpy.data.objects):
    if o.type == "EMPTY":
        bpy.data.objects.remove(o, do_unlink=True)

print("Left plant placed")
```

**Step 2: Duplicate for right plant**

```python
import bpy

plant_l = bpy.data.objects.get("Plant_Left")
bpy.ops.object.select_all(action="DESELECT")
plant_l.select_set(True)
bpy.context.view_layer.objects.active = plant_l
bpy.ops.object.duplicate()
plant_r = bpy.context.object
plant_r.name = "Plant_Right"
plant_r.location = (7, -1, plant_l.location.z)
print("Right plant placed")
```

**Step 3: Verify** — screenshot should show two flower pots flanking the desk.

---

### Task 5: Fix lighting — soft warm studio

The reference has very soft, diffuse, warm lighting with subtle contact shadows. No hard shadows. Almost like a product photo studio.

**Step 1: Delete all current lights and create studio setup**

```python
import bpy, math

# Delete existing lights
for o in list(bpy.data.objects):
    if o.type == "LIGHT":
        bpy.data.objects.remove(o, do_unlink=True)

# KEY: Huge soft overhead light
bpy.ops.object.light_add(type="AREA", location=(0, 2, 18))
key = bpy.context.object
key.name = "Key_Soft"
key.data.energy = 1000
key.data.color = (1.0, 0.93, 0.87)
key.data.size = 25  # enormous for super soft shadows
key.rotation_euler = (math.radians(70), 0, 0)
key.data.use_shadow = True

# FILL: Front-bottom fill to reduce harsh shadows
bpy.ops.object.light_add(type="AREA", location=(0, 12, 4))
fill = bpy.context.object
fill.name = "Fill_Front"
fill.data.energy = 300
fill.data.color = (1.0, 0.92, 0.85)
fill.data.size = 20
fill.rotation_euler = (math.radians(-15), 0, 0)
fill.data.use_shadow = False

# ACCENT: Subtle warm rim from behind
bpy.ops.object.light_add(type="AREA", location=(0, -6, 12))
rim = bpy.context.object
rim.name = "Rim_Warm"
rim.data.energy = 200
rim.data.color = (1.0, 0.85, 0.72)
rim.data.size = 10
rim.rotation_euler = (math.radians(30), 0, math.radians(180))
rim.data.use_shadow = False

print("Studio lighting: 1 key (huge soft) + 1 fill (front) + 1 rim (warm accent)")
```

---

### Task 6: Final cleanup and save

**Step 1: Purge orphan data**

```python
import bpy
bpy.ops.outliner.orphans_purge(do_recursive=True)
```

**Step 2: Set viewport to Material Preview with scene world**

```python
import bpy
for area in bpy.context.screen.areas:
    if area.type == "VIEW_3D":
        for space in area.spaces:
            if space.type == "VIEW_3D":
                space.shading.type = "MATERIAL"
                space.shading.use_scene_world = True
                space.overlay.show_floor = False
                space.overlay.show_axis_x = False
                space.overlay.show_axis_y = False
                space.overlay.show_axis_z = False
                break
        break
```

**Step 3: Save**

```python
import bpy
bpy.ops.wm.save_mainfile()
print("Saved")
```

**Step 4: Take screenshot and verify against reference**

```bash
osascript -e 'tell application "Blender" to activate' && sleep 3 && screencapture -x /tmp/bl-final-check.png
```

Compare against reference: wall peach visible, arch as niche, plants flanking, soft lighting.

---

## Summary

| Task | What | Impact |
|---|---|---|
| 1 | Delete broken primitives | Clean slate |
| 2 | Wall + arch niche (2-layer) | 🔴 Main missing element |
| 3 | Floor + world bg seamless | 🟡 Transition fix |
| 4 | Import flower_pot.glb × 2 | 🔴 Plants quality |
| 5 | Studio lighting (huge soft key) | 🟡 Depth + warmth |
| 6 | Cleanup + save + verify | Final check |

**Execution order:** Sequential 1→6. Each task is independent after Task 1.
