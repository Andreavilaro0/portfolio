# 3D Scene Upgrade — Implementation Plan

> **For Claude:** Execute task by task. Don't stop until the scene looks professional.

**Goal:** Make the 3D desk scene feel like a real engineer's workspace — add personal objects via Sketchfab, fix the fake-looking floor/background, add interactive hover tooltips in English.

**Architecture:** Download GLB models from Sketchfab API, load them as separate meshes in DeskScene.tsx alongside the main desk-scene-clean.glb. Update DeskInteractions.tsx with new objects and English descriptions. Fix NoiseBackground and floor material for realism.

**Sketchfab API Key:** 429ae2c5c38d41e78173ad067ebf2fee

---

## Task 1: Search & Download Models from Sketchfab

Objects that represent Andrea (engineer, developer, Mexican woman):

| Object | Search query | Why it represents her |
|--------|-------------|----------------------|
| Mexican skull (calavera) | "mexican sugar skull" | Mexican heritage, Día de Muertos |
| Small robot / Arduino | "small robot arduino" | Robotics finalist |
| Coffee mug | "coffee mug" | Late night coding fuel |
| Rubik's cube | "rubiks cube" | Problem solving, engineering mind |
| Plant / succulent | "small succulent pot" | Life on the desk |
| Books / notebook | "notebook sketch" | "I draw my ideas before coding" |
| Stickers on laptop | Already has Gaming_Laptop | Add stickers texture |

For each model:
1. Search Sketchfab API: `GET https://api.sketchfab.com/v3/search?type=models&q={query}&downloadable=true&max_face_count=50000&sort_by=-likeCount`
2. Get download URL: `GET https://api.sketchfab.com/v3/models/{uid}/download`
3. Download GLB to `public/models/`
4. Test it loads in R3F

## Task 2: Fix Background & Floor

Current problems:
- NoiseBackground has floating color blobs that look artificial
- Floor is a flat plane with no texture — looks like a stage
- Background image (peach arch) doesn't blend with the desk

Fixes:
- Add subtle ambient gradient instead of harsh blobs
- Floor: add a subtle dark wood or concrete texture
- Darken the overall environment to match the dark portfolio theme
- Adjust HDRI/lighting to be more moody and professional

Files: `src/components/layout/NoiseBackground.tsx`, `src/components/experience/DeskScene.tsx`

## Task 3: Load New Models into Scene

Create a new component `AdditionalObjects.tsx` that:
- Loads each downloaded GLB with `useGLTF`
- Positions them on/around the desk
- Scales appropriately
- Adds to the scene graph

## Task 4: Update DeskInteractions with New Objects

Add new entries to the DESK_OBJECTS array with English tooltips:
- Each object gets: name (mesh name), label, description
- Hover: emissive glow
- Click: tooltip with description
- Some objects link to projects

## Task 5: Polish & Iterate

- Adjust positions until objects look natural on the desk
- Check lighting on new objects
- Verify tooltips work
- Test on mobile (objects shouldn't break the fallback)
- Performance check — keep total GLB under 5MB

---

## Execution Order

1. Search Sketchfab → download 3-4 best models
2. Fix background/floor
3. Load models into scene
4. Add interactions
5. Polish until perfect
