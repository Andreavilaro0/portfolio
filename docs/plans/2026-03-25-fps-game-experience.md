# FPS Game Experience — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transformar el portfolio 3D en una experiencia inmersiva tipo GTA San Andreas primera persona, con manos visibles, objetos agarrables/lanzables, sonido ambiente, y HUD de juego.

**Architecture:** 8 fases incrementales. Cada fase es funcional por sí sola — se puede parar en cualquier punto y el portfolio sigue funcionando. Las fases van de menor a mayor riesgo/esfuerzo.

**Tech Stack:** R3F 9.5, Three.js 0.183, drei 10.7, GSAP 3.14, howler.js (nuevo), @react-three/rapier (nuevo), postprocessing 6.38

---

## Fase 1: Mouse-Look Ampliado (GTA Vehicle Style)
**Esfuerzo: 2h | Riesgo: Bajo | Impacto: Alto**

### Task 1.1: Ampliar rango de mouse-look en overview/seated

**Files:**
- Modify: `src/components/experience/CameraRig.tsx:260-310`

**Objetivo:** Cambiar de parallax sutil (0.15x) a rotación esférica real (~100° horizontal, 35° vertical) con damping suave.

**Step 1:** Agregar constantes de rango de visión al inicio del componente:
```tsx
const LOOK_RANGE = {
  overview: { h: 1.8, v: 0.6, damping: 0.06 },   // ~100° H, ~35° V
  seated:   { h: 0.8, v: 0.3, damping: 0.04 },    // ~45° H, ~17° V
  project:  { h: 0.4, v: 0.15, damping: 0.04 },   // ~23° H, ~9° V
}
```

**Step 2:** Reemplazar el cálculo lineal por coordenadas esféricas:
```tsx
// En useFrame, branch de overview/seated/project:
const range = LOOK_RANGE[mode] || LOOK_RANGE.seated
const yaw = mouseRef.current.x * range.h
const pitch = mouseRef.current.y * range.v

// Calcular dirección base
const baseDir = _currentDir.subVectors(baseLookAt.current, basePosition.current).normalize()
const spherical = new THREE.Spherical().setFromVector3(baseDir)
spherical.theta += yaw
spherical.phi = THREE.MathUtils.clamp(spherical.phi - pitch, 0.4, 2.6)

_targetLookAt.setFromSpherical(spherical).add(camera.position)
_currentLookAt.lerp(_targetLookAt, range.damping)
camera.lookAt(_currentLookAt)
```

**Step 3:** Verificar que el early-return por mouse delta siga funcionando.

**Step 4:** Probar: mover mouse en seated mode — la cámara debe rotar visiblemente, no solo parallax sutil.

**Step 5:** Commit: `feat: enhanced FPS-style mouse-look with spherical rotation`

---

## Fase 2: Sonido Ambiente + SFX
**Esfuerzo: 3h | Riesgo: Bajo | Impacto: Alto**

### Task 2.1: Instalar howler.js

**Step 1:** `npm install howler && npm install -D @types/howler`

**Step 2:** Commit: `chore: add howler.js audio library`

### Task 2.2: Descargar/crear assets de sonido

**Files:**
- Create: `public/sounds/` directory

**Step 1:** Descargar sonidos CC0 de freesound.org o mixkit.co:
- `ambient-typing.mp3` — tecleo de keyboard suave (loop, ~10s)
- `ambient-fan.mp3` — ventilador de PC (loop, ~5s)
- `ambient-clock.mp3` — tick-tock reloj (loop, ~2s)
- `ambient-rain.mp3` — lluvia suave exterior (loop, ~15s)
- `sfx-hover.mp3` — blip electrónico sutil (~0.1s)
- `sfx-click.mp3` — click de selección (~0.2s)
- `sfx-whoosh.mp3` — swoosh al mover cámara (~0.3s)
- `sfx-grab.mp3` — pickup sound (~0.2s)
- `sfx-throw.mp3` — lanzar/soltar (~0.3s)
- `sfx-bounce.mp3` — objeto golpea mesa (~0.2s)

**Step 2:** Commit: `feat: add ambient and SFX audio assets`

### Task 2.3: Crear AudioManager hook

**Files:**
- Create: `src/hooks/useAudio.ts`

```tsx
'use client'
import { useRef, useEffect, useCallback } from 'react'
import { Howl } from 'howler'

const SOUNDS = {
  ambientTyping: { src: '/sounds/ambient-typing.mp3', loop: true, volume: 0.12 },
  ambientFan:    { src: '/sounds/ambient-fan.mp3',    loop: true, volume: 0.06 },
  ambientClock:  { src: '/sounds/ambient-clock.mp3',  loop: true, volume: 0.08 },
  ambientRain:   { src: '/sounds/ambient-rain.mp3',   loop: true, volume: 0.04 },
  hover:   { src: '/sounds/sfx-hover.mp3',  volume: 0.25 },
  click:   { src: '/sounds/sfx-click.mp3',  volume: 0.4 },
  whoosh:  { src: '/sounds/sfx-whoosh.mp3', volume: 0.25 },
  grab:    { src: '/sounds/sfx-grab.mp3',   volume: 0.35 },
  throw:   { src: '/sounds/sfx-throw.mp3',  volume: 0.3 },
  bounce:  { src: '/sounds/sfx-bounce.mp3', volume: 0.2 },
} as const

export function useAudio() {
  const howls = useRef<Map<string, Howl>>(new Map())
  const muted = useRef(false)

  useEffect(() => {
    // Lazy-init on first user gesture (browser autoplay policy)
    const init = () => {
      if (howls.current.size > 0) return
      for (const [key, config] of Object.entries(SOUNDS)) {
        howls.current.set(key, new Howl(config))
      }
      document.removeEventListener('click', init)
      document.removeEventListener('keydown', init)
    }
    document.addEventListener('click', init, { once: true })
    document.addEventListener('keydown', init, { once: true })
    return () => { howls.current.forEach(h => h.unload()) }
  }, [])

  const play = useCallback((name: keyof typeof SOUNDS) => {
    if (muted.current) return
    howls.current.get(name)?.play()
  }, [])

  const startAmbient = useCallback(() => {
    if (muted.current) return
    ;['ambientTyping','ambientFan','ambientClock','ambientRain'].forEach(k =>
      howls.current.get(k)?.play()
    )
  }, [])

  const stopAmbient = useCallback(() => {
    ;['ambientTyping','ambientFan','ambientClock','ambientRain'].forEach(k =>
      howls.current.get(k)?.stop()
    )
  }, [])

  const toggleMute = useCallback(() => {
    muted.current = !muted.current
    Howler.mute(muted.current)
  }, [])

  return { play, startAmbient, stopAmbient, toggleMute, muted }
}
```

**Step 3:** Commit: `feat: useAudio hook with howler.js`

### Task 2.4: Integrar audio en ExperienceWrapper

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** Importar useAudio y llamar `startAmbient()` cuando mode cambia a `seated`:
```tsx
const audio = useAudio()
useEffect(() => {
  if (mode === 'seated') audio.startAmbient()
  if (mode === 'loading') audio.stopAmbient()
}, [mode])
```

**Step 2:** Pasar `audio.play` a DeskInteractions para hover/click SFX.

**Step 3:** Commit: `feat: ambient sound on seated mode + SFX on interactions`

### Task 2.5: Agregar botón mute al HUD

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx` (o RetroHUD)

**Step 1:** Icono de speaker en esquina inferior derecha, toggle `audio.toggleMute()`.

**Step 2:** Commit: `feat: mute toggle button in HUD`

---

## Fase 3: Post-Processing Cinematográfico
**Esfuerzo: 1h | Riesgo: Bajo | Impacto: Medio-Alto**

### Task 3.1: Agregar Noise + ChromaticAberration

**Files:**
- Modify: `src/components/experience/DeskScene.tsx:319-322`

**Step 1:** Agregar imports:
```tsx
import { Noise, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
```

**Step 2:** Agregar efectos al EffectComposer:
```tsx
<EffectComposer multisampling={0}>
  <Vignette eskil={false} offset={0.25} darkness={0.7} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
  <ChromaticAberration offset={[0.0004, 0.0004]} radialModulation />
</EffectComposer>
```

**Step 3:** Verificar FPS no baja más de 5 frames.

**Step 4:** Commit: `feat: film grain + chromatic aberration post-processing`

---

## Fase 4: FPS Hands (Sprites 2D estilo Doom)
**Esfuerzo: 4h | Riesgo: Medio | Impacto: Alto**

### Task 4.1: Crear/obtener sprites de mano

**Files:**
- Create: `public/sprites/hand-idle.webp`
- Create: `public/sprites/hand-reach.webp`
- Create: `public/sprites/hand-grab.webp`
- Create: `public/sprites/hand-throw.webp`

**Step 1:** Generar sprites con IA (fal.ai o similar):
- Prompt: "pixel art first person hand from below, open palm relaxed, retro doom style, 512x512, transparent background, dark skin tone"
- Variantes: open (idle), reaching forward (reach), closed fist (grab), throwing motion (throw)

**Step 2:** Convertir a WebP: `cwebp -q 90 hand-idle.png -o public/sprites/hand-idle.webp`

**Step 3:** Commit: `feat: add FPS hand sprites`

### Task 4.2: Crear componente FPSHands

**Files:**
- Create: `src/components/experience/FPSHands.tsx`

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

type HandPose = 'idle' | 'reach' | 'grab' | 'throw' | 'hidden'

const SPRITES: Record<Exclude<HandPose, 'hidden'>, string> = {
  idle:  '/sprites/hand-idle.webp',
  reach: '/sprites/hand-reach.webp',
  grab:  '/sprites/hand-grab.webp',
  throw: '/sprites/hand-throw.webp',
}

interface FPSHandsProps {
  mode: ExperienceMode
  hovered: string | null
  grabbing: boolean
}

export function FPSHands({ mode, hovered, grabbing }: FPSHandsProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [pose, setPose] = useState<HandPose>('hidden')

  // Determine pose from state
  useEffect(() => {
    if (mode !== 'overview' && mode !== 'seated') {
      setPose('hidden')
      return
    }
    if (grabbing) setPose('grab')
    else if (hovered) setPose('reach')
    else setPose('idle')
  }, [mode, hovered, grabbing])

  // Animate transitions
  useEffect(() => {
    if (!imgRef.current || pose === 'hidden') return
    gsap.fromTo(imgRef.current,
      { y: 15, scaleX: 0.95, scaleY: 0.95 },
      { y: 0, scaleX: 1, scaleY: 1, duration: 0.12, ease: 'power2.out' }
    )
  }, [pose])

  if (pose === 'hidden') return null

  return (
    <div style={{
      position: 'fixed',
      bottom: -20,
      right: '15%',
      zIndex: 35,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
    }}>
      <img
        ref={imgRef}
        src={SPRITES[pose]}
        alt=""
        aria-hidden="true"
        style={{
          width: 280,
          height: 280,
          imageRendering: 'auto',
          opacity: 0.9,
        }}
      />
    </div>
  )
}
```

**Step 3:** Commit: `feat: FPSHands component with 4 poses`

### Task 4.3: Integrar FPSHands en ExperienceWrapper

**Files:**
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** Importar FPSHands, agregar `grabbing` state, renderizar fuera del Canvas:
```tsx
<FPSHands mode={mode} hovered={hoveredObject} grabbing={isGrabbing} />
```

**Step 2:** Pasar `onHoverChange` callback de DeskInteractions a ExperienceWrapper para sincronizar `hoveredObject`.

**Step 3:** Commit: `feat: integrate FPS hands with interaction state`

### Task 4.4: Idle hand bob animation

**Files:**
- Modify: `src/components/experience/FPSHands.tsx`

**Step 1:** Agregar GSAP timeline loop para idle sway:
```tsx
useEffect(() => {
  if (pose !== 'idle' || !imgRef.current) return
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(imgRef.current, { y: -6, rotation: 1.5, duration: 2, ease: 'sine.inOut' })
  return () => tl.kill()
}, [pose])
```

**Step 2:** Commit: `feat: idle hand breathing animation`

---

## Fase 5: Grab & Drag con GSAP (Sin Física)
**Esfuerzo: 5h | Riesgo: Medio | Impacto: Alto**

### Task 5.1: Agregar grab state a DeskInteractions

**Files:**
- Modify: `src/components/experience/DeskInteractions.tsx`

**Step 1:** Agregar estados:
```tsx
const [grabbedObject, setGrabbedObject] = useState<string | null>(null)
const dragOffset = useRef(new THREE.Vector3())
const mouseVelocity = useRef(new THREE.Vector3())
const prevMouseWorld = useRef(new THREE.Vector3())
```

**Step 2:** En pointerDown: si ya estamos en overview/seated y el objeto es agarrable, setGrabbedObject.

**Step 3:** En pointerMove (nuevo handler): si hay objeto grabbed, mover el mesh siguiendo el mouse vía raycasting al plano del desk.

**Step 4:** Commit: `feat: grab objects with mouse drag`

### Task 5.2: Implementar throw con GSAP

**Files:**
- Modify: `src/components/experience/DeskInteractions.tsx`

**Step 1:** En pointerUp: calcular velocidad del mouse, aplicar como "throw":
```tsx
const DESK_Y = 6.4
const GRAVITY = -15
const BOUNCE = 0.3
const FRICTION = 0.92

function throwObject(mesh: THREE.Object3D, velocity: THREE.Vector3) {
  const pos = mesh.position.clone()
  const vel = velocity.clone()

  const update = () => {
    vel.y += GRAVITY * 0.016
    vel.multiplyScalar(FRICTION)
    pos.add(vel.clone().multiplyScalar(0.016))

    if (pos.y <= DESK_Y) {
      pos.y = DESK_Y
      vel.y *= -BOUNCE
      audio.play('bounce')
      if (Math.abs(vel.y) < 0.1) vel.y = 0
    }

    mesh.position.copy(pos)
    mesh.rotation.x += vel.z * 0.05
    mesh.rotation.z -= vel.x * 0.05

    if (vel.length() < 0.05 && Math.abs(pos.y - DESK_Y) < 0.01) {
      gsap.ticker.remove(update)
      gsap.to(mesh.rotation, { x: 0, z: 0, duration: 0.3, ease: 'power2.out' })
    }
  }
  gsap.ticker.add(update)
}
```

**Step 2:** Sync throw con FPSHands pose (brief 'throw' pose → back to 'idle').

**Step 3:** Commit: `feat: throw objects with GSAP fake physics`

### Task 5.3: Snap-back si objeto sale del desk

**Step 1:** Si pos.x/z sale del rango del desk, animación de vuelta a posición original:
```tsx
if (Math.abs(pos.x) > 6 || Math.abs(pos.z) > 3) {
  gsap.ticker.remove(update)
  gsap.to(mesh.position, { ...originalPosition, duration: 0.5, ease: 'back.out(1.5)' })
  gsap.to(mesh.rotation, { x: 0, y: originalRotation.y, z: 0, duration: 0.5 })
}
```

**Step 2:** Commit: `feat: snap-back for objects thrown off desk`

---

## Fase 6: HUD de Juego Persistente
**Esfuerzo: 3h | Riesgo: Bajo | Impacto: Medio**

### Task 6.1: Crear GameHUD component

**Files:**
- Create: `src/components/experience/GameHUD.tsx`

**Elementos:**
- **Top-left:** "ANDREA AVILA" + zona actual (DESK / WORKSTATION)
- **Top-right:** Reloj real (hora actual)
- **Bottom-left:** "X/12 objects discovered" + interaction count
- **Bottom-right:** Controls hint (MOUSE look · CLICK interact · ESC back)
- **Center-bottom:** "[E] Inspect {objectName}" cuando crosshair está sobre un objeto

**Estilo:** Monospace, semi-transparente, colores cyan/verde (#00E5FF, #BEFF00)

**Step 1:** Crear componente con 5 zonas.
**Step 2:** Integrar en ExperienceWrapper.
**Step 3:** Commit: `feat: persistent game-style HUD`

### Task 6.2: Object discovery tracker

**Files:**
- Modify: `src/components/experience/GameHUD.tsx`
- Modify: `src/components/experience/DeskInteractions.tsx`

**Step 1:** localStorage para trackear objetos descubiertos.
**Step 2:** Incrementar contador al hacer click por primera vez en cada objeto.
**Step 3:** Commit: `feat: object discovery tracking in HUD`

---

## Fase 7: Físicas Reales con Rapier (Upgrade)
**Esfuerzo: 8h | Riesgo: Alto | Impacto: Muy Alto**

### Task 7.1: Instalar Rapier

**Step 1:** `npm install @react-three/rapier`

**Step 2:** Commit: `chore: add @react-three/rapier physics engine`

### Task 7.2: Envolver desk objects en RigidBody

**Files:**
- Modify: `src/components/experience/DeskObjects.tsx`
- Modify: `src/components/experience/DeskScene.tsx`

**Step 1:** Envolver la escena con `<Physics gravity={[0, -9.81, 0]}>`.

**Step 2:** Cada DeskObject pasa a ser un `<RigidBody type="dynamic">` con `<CuboidCollider>`.

**Step 3:** Agregar desk surface como `<RigidBody type="fixed">` con collider plano.

**Step 4:** Commit: `feat: physics rigid bodies on desk objects`

### Task 7.3: Grab → Kinematic, Release → Dynamic

**Step 1:** Mientras se arrastra: `rigidBody.setBodyType(RigidBodyType.KinematicPositionBased)`.
**Step 2:** Al soltar: cambiar a Dynamic + aplicar `setLinvel()` con velocidad del mouse.
**Step 3:** Commit: `feat: kinematic grab + dynamic throw with Rapier`

### Task 7.4: Colisiones entre objetos

**Step 1:** Los objetos ahora chocan entre sí naturalmente con Rapier.
**Step 2:** Agregar damping para que se estabilicen: `linearDamping: 2, angularDamping: 1`.
**Step 3:** Sonido de bounce en `onCollisionEnter`.
**Step 4:** Commit: `feat: object-to-object collisions with sound`

---

## Fase 8: Easter Eggs + Polish
**Esfuerzo: 6h | Riesgo: Bajo | Impacto: Alto (engagement)**

### Task 8.1: Breathing idle sway

**Files:**
- Modify: `src/components/experience/CameraRig.tsx`

**Step 1:** Cuando mouse quieto >2s, agregar sutil sine wave:
```tsx
const breathe = Math.sin(clock.elapsedTime * 0.8) * 0.015
const sway = Math.sin(clock.elapsedTime * 0.3) * 0.008
```

**Step 2:** Commit: `feat: idle camera breathing animation`

### Task 8.2: Desk lamp toggle

**Step 1:** Agregar SpotLight que se enciende/apaga al click en desk_lamp area.
**Step 2:** Sonido de click switch.
**Step 3:** Commit: `feat: toggleable desk lamp`

### Task 8.3: Reactivar mini-juego en monitor

**Files:**
- Restore: `src/components/_archived/ArcadePong.tsx` → activo
- Modify: `src/components/experience/ExperienceWrapper.tsx`

**Step 1:** Cuando usuario está en 'seated' mode mirando al monitor, opción de jugar Pong.
**Step 2:** Commit: `feat: easter egg arcade pong in monitor`

### Task 8.4: Hidden messages

**Step 1:** Tooltip secreto debajo del keyboard ("// TODO: sleep more").
**Step 2:** Mensaje en el fondo de la taza de café ("Hecho en México").
**Step 3:** QR code en la parte trasera del skull (lleva a GitHub).
**Step 4:** Commit: `feat: hidden easter eggs on desk objects`

### Task 8.5: Descubrimiento completo

**Step 1:** Cuando 12/12 objetos descubiertos, animación especial + confetti.
**Step 2:** Commit: `feat: discovery completion celebration`

---

## Resumen de Fases

| Fase | Qué | Esfuerzo | Deps Nuevas | Riesgo |
|------|-----|----------|-------------|--------|
| 1 | Mouse-look ampliado | 2h | 0 | Bajo |
| 2 | Sonido ambiente + SFX | 3h | howler.js | Bajo |
| 3 | Post-processing cinematográfico | 1h | 0 | Bajo |
| 4 | FPS Hands (sprites 2D) | 4h | 0 | Medio |
| 5 | Grab & Throw (GSAP) | 5h | 0 | Medio |
| 6 | HUD de juego | 3h | 0 | Bajo |
| 7 | Físicas reales (Rapier) | 8h | @react-three/rapier | Alto |
| 8 | Easter eggs + polish | 6h | 0 | Bajo |
| **TOTAL** | | **32h** | **2 deps** | |

## Verificación por Fase

Cada fase se puede testear independientemente:

1. **Mouse-look:** Mover mouse en seated → cámara rota visiblemente ~45°
2. **Audio:** Entrar a seated → se escucha typing + fan + clock
3. **Post-processing:** Film grain visible + aberración cromática sutil en bordes
4. **Hands:** Mover mouse sobre objeto → mano se extiende; click → puño cerrado
5. **Grab/Throw:** Click + drag objeto → sigue mouse; soltar rápido → vuela y rebota
6. **HUD:** "3/12 discovered" visible, controles en esquina, prompt "[E] Inspect"
7. **Physics:** Lanzar skull contra rubik's → chocan y ruedan
8. **Easter eggs:** Click debajo del keyboard → tooltip secreto; 12/12 → confetti
