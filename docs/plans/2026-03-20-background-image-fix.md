# Background Image Fix — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. All tasks use Blender MCP via Python socket on localhost:9876.

**Goal:** Fix the background image plane so the peach arch backdrop renders correctly behind the desk scene, with proper UV mapping, correct scale, and seamless integration.

**Architecture:** Delete current broken background plane. Recreate with proper UV coordinates. The image (`background-peach-arch.jpg`, 1920x1072) gets mapped onto a flat plane behind the desk using emission material (unaffected by scene lighting). HDRI stays for object lighting only.

**Tech Stack:** Blender 4.x, Blender MCP (socket localhost:9876), Python

---

### Blender MCP Helper

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

---

### Task 1: Delete broken background plane

**Step 1: Remove the current Background object**

```python
import bpy
obj = bpy.data.objects.get("Background")
if obj:
    bpy.data.objects.remove(obj, do_unlink=True)
    print("Background deleted")

# Also remove any leftover wall/arch geometry
for name in ["Wall", "Arch_Deep", "Arch_Ring", "Arch_Edge", "Arch_Step",
             "Niche_Back", "Niche_Rim", "Arch_Cutter", "Arch_Inner"]:
    o = bpy.data.objects.get(name)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)

bpy.ops.outliner.orphans_purge(do_recursive=True)
print("Cleanup done")
```

---

### Task 2: Create new background plane with correct UV mapping

The key issue was the UV mapping — a plane created with `primitive_plane_add` already has correct UVs (0,0 to 1,1), but when we applied scale transforms, the UVs got distorted. This time we create the plane at the correct size directly.

**Step 1: Create plane and assign image material**

```python
import bpy, math

# Load image
bg_path = "/Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio/public/models/background-peach-arch.jpg"
img = bpy.data.images.load(bg_path)
w, h = img.size
aspect = w / h
print(f"Image: {w}x{h}, aspect={round(aspect,2)}")

# Create emission material
mat = bpy.data.materials.new("BG_Image")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
for n in nodes: nodes.remove(n)

output = nodes.new("ShaderNodeOutputMaterial")
output.location = (400, 0)

emission = nodes.new("ShaderNodeEmission")
emission.location = (200, 0)
emission.inputs["Strength"].default_value = 1.2

tex = nodes.new("ShaderNodeTexImage")
tex.location = (0, 0)
tex.image = img
tex.interpolation = "Linear"
tex.extension = "CLIP"

links.new(tex.outputs["Color"], emission.inputs["Color"])
links.new(emission.outputs[0], output.inputs[0])

# Create plane — use size parameter directly for correct proportions
# Target: 24 units tall, width = 24 * aspect
plane_h = 24
plane_w = plane_h * aspect

bpy.ops.mesh.primitive_plane_add(size=2, location=(0, -5.5, plane_h / 2))
bg = bpy.context.object
bg.name = "Background"

# Scale to correct proportions BEFORE applying
bg.scale = (plane_w / 2, 1, plane_h / 2)

# Rotate to face camera (vertical)
bg.rotation_euler = (math.radians(90), 0, 0)

# Apply rotation and scale
bpy.ops.object.transform_apply(rotation=True, scale=True)

# The UV map from primitive_plane_add is already correct (0,0)-(1,1)
# Verify UVs
uv_layer = bg.data.uv_layers.active
if uv_layer:
    uvs = [uv_layer.data[i].uv for i in range(len(uv_layer.data))]
    print(f"UVs: {[(round(u[0],2), round(u[1],2)) for u in uvs]}")

bg.data.materials.append(mat)

# Make it shadow-invisible and unselectable
bg.visible_shadow = False

print(f"Background plane: {round(plane_w,1)} x {round(plane_h,1)}")
print("Material: emission with image, strength=1.2")
```

**Step 2: Verify UVs are correct**

```python
import bpy
bg = bpy.data.objects.get("Background")
if bg:
    uv = bg.data.uv_layers.active
    if uv:
        coords = [(round(uv.data[i].uv[0],3), round(uv.data[i].uv[1],3)) for i in range(len(uv.data))]
        print(f"UV coords: {coords}")
        # Should be: (0,0), (1,0), (1,1), (0,1) or similar covering full 0-1 range
    print(f"Materials: {[m.name for m in bg.data.materials]}")
    print(f"Location: {[round(l,2) for l in bg.location]}")
    print(f"Dimensions: {[round(d,2) for d in bg.dimensions]}")
```

---

### Task 3: Verify floor exists and matches

**Step 1: Check floor and adjust color to match background image**

```python
import bpy

def s2l(c):
    c = c / 255.0
    return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92

floor = bpy.data.objects.get("Floor")
if not floor:
    bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 10, 0))
    floor = bpy.context.object
    floor.name = "Floor"
    mat = bpy.data.materials.new("Floor_Warm")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    # Match the bottom of the background image (light cream pink)
    bsdf.inputs["Base Color"].default_value = (s2l(240), s2l(210), s2l(195), 1)
    bsdf.inputs["Roughness"].default_value = 0.88
    bsdf.inputs["Specular IOR Level"].default_value = 0.05
    floor.data.materials.append(mat)
    print("Floor created")
else:
    # Update floor color to match background image bottom
    for mat in floor.data.materials:
        if mat and mat.use_nodes:
            bsdf = mat.node_tree.nodes.get("Principled BSDF")
            if bsdf:
                bsdf.inputs["Base Color"].default_value = (s2l(240), s2l(210), s2l(195), 1)
    print("Floor color updated")
```

---

### Task 4: Set viewport and camera for composition

**Step 1: Set viewport to show the full scene like the reference**

```python
import bpy, math
from mathutils import Vector, Euler

# Set viewport
for area in bpy.context.screen.areas:
    if area.type == "VIEW_3D":
        for space in area.spaces:
            if space.type == "VIEW_3D":
                r3d = space.region_3d
                r3d.view_perspective = "PERSP"
                r3d.view_location = Vector((0, 0, 5))
                r3d.view_distance = 22
                r3d.view_rotation = Euler((math.radians(78), 0, math.radians(180))).to_quaternion()

                # Use scene world for HDRI lighting
                space.shading.type = "MATERIAL"
                space.shading.use_scene_world = True
                space.overlay.show_floor = False
                space.overlay.show_axis_x = False
                space.overlay.show_axis_y = False
                space.overlay.show_axis_z = False
                break
        break

# Also update the camera
cam = bpy.data.objects.get("PreviewCam")
if cam:
    cam.location = (0, 16, 7)
    cam.rotation_euler = (math.radians(78), 0, math.radians(180))
    cam.data.lens = 35
    cam.data.clip_end = 100

print("Viewport and camera set for reference-like composition")
```

---

### Task 5: Save and take verification screenshot

**Step 1: Save the blend file**

```python
import bpy
bpy.ops.wm.save_mainfile()
print("Saved")
```

**Step 2: Take screenshot**

```bash
open -a Blender && sleep 4 && screencapture -x /tmp/bl-final-bg.png
```

**Step 3: Verify** — the screenshot should show:
- Peach arch background image filling the view behind the desk
- Floor matching the bottom of the image
- All desk objects in front
- HDRI lighting on objects
- No visible edges or seams

---

## Summary

| Task | What | Why |
|---|---|---|
| 1 | Delete broken background | Clean slate |
| 2 | New plane with correct UVs | Fix the stripe/mapping issue |
| 3 | Floor color match | Seamless transition with bg image |
| 4 | Viewport + camera | Composition like reference |
| 5 | Save + verify | Confirm it works |

**Key insight:** The previous background had broken UVs because we applied scale transforms after creation. This plan creates the plane at the right size from the start and doesn't touch the UVs.
