# Fix Mouse Movement — Camera Follows Mouse Correctly

## Problem
When the user moves the mouse to the right to click an object on the right side of the desk, the camera moves TOO MUCH or in a way that makes it impossible to interact. Objects feel like they run away from the cursor.

## Root Cause
In `src/components/experience/CameraRig.tsx`, the mouse-look uses lookAt offset:
```
const lookX = baseLookAt.current.x + mouseRef.current.x * range.x
```
With `range.x = 2.0` for overview and `0.6` for seated, the camera rotation is too aggressive. The user's cursor and the 3D objects don't align — the camera moves so much that the objects slide away from where the mouse is pointing.

## Solution
The mouse-look should be VERY subtle in seated/project modes (the user needs to click objects!) and slightly more in overview mode (exploring the desk). The ORIGINAL values before our changes were:
- Overview: X=1.2, Y=0.6, damping=0.06
- Seated: X=0.15, Y=0.08, damping=0.04

These worked for interaction. We should go BACK to values close to the original but slightly improved.

## Fix

**File:** `src/components/experience/CameraRig.tsx`

### Step 1: Change LOOK_RANGE values
Find:
```tsx
const LOOK_RANGE = {
  overview: { x: 2.0, y: 1.0, damping: 0.06 },
  seated:   { x: 0.6, y: 0.3, damping: 0.04 },
  project:  { x: 0.3, y: 0.15, damping: 0.04 },
}
```

Replace with:
```tsx
const LOOK_RANGE = {
  overview: { x: 1.5, y: 0.8, damping: 0.06 },
  seated:   { x: 0.2, y: 0.1, damping: 0.04 },
  project:  { x: 0.15, y: 0.08, damping: 0.04 },
}
```

These values:
- Overview: slightly more than original (1.5 vs 1.2) — lets you look around the desk more
- Seated: very subtle (0.2 vs original 0.15) — objects stay where you see them, easy to click
- Project: minimal — focus on the iframe content

### Step 2: Verify the math direction is correct
The lookAt offset should ADD mouse position (mouse right → look right → objects move slightly left but cursor stays on them):
```tsx
const lookX = baseLookAt.current.x + mouseRef.current.x * range.x
const lookY = baseLookAt.current.y + mouseRef.current.y * range.y
```
This IS correct. The issue was purely the magnitude (2.0 was way too much).

### Step 3: Test
- In seated mode: move mouse to right → camera barely moves → you can hover/click objects on the right
- In overview mode: move mouse → camera follows gently → exploring the desk feels natural
- Click Rubik's Cube → camera animates TO the cube (not away)
- Click Mexican Skull → camera animates TO the skull

### Step 4: Commit
`fix: reduce mouse-look intensity for usable interaction`

## Also verify:
- Object camera presets in OBJECT_CAMERAS are pointing toward the correct objects (we fixed Mexican_Skull and Rubiks_Cube earlier)
- The animateCamera function moves TOWARD the lookAt target, not away
