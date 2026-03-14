# Rediseño "Maximalismo Coherente" — Plan de Implementación

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminar el tema cooking-show y rediseñar el portfolio completo con estilo Maximalismo Coherente — light base, neo-pop, tipografía industrial, elementos superpuestos, anti-design con estructura.

**Architecture:** Single-page Next.js app. Se reemplaza la paleta, tipografía, copy y layout de TODAS las secciones. Se mantiene el stack (Next.js 16 + Tailwind v4 + GSAP + Three.js + Spline + Framer Motion) y la estructura de secciones (Hero, About, Clara, Photography, Robotics, OS, Contact). El Hero tendrá un modelo 3D de Blender (.glb) del escritorio de Andrea cargado con @react-three/fiber.

**Tech Stack:** Next.js 16, Tailwind v4, GSAP + ScrollTrigger, Three.js / @react-three/fiber + @react-three/drei, Framer Motion, Google Fonts

**Referentes de diseño:**
- Collage/scrapbook portfolio (Dribbble)
- TIME SHIFT TEST LAB (industrial + color)
- Transparent video (Wix)
- Neo-pop + brutalist portfolios (Awwwards)

**Specs del 3D (desk-scene.glb):**
- Ver documento completo en la conversación previa
- El usuario proporcionará el .glb creado en Blender
- Robot Zumo: importar desde https://ik.imagekit.io/xwvrhiauz/zumo-32U4-robot.stl
- Cada objeto es un mesh nombrado para interactividad (hover/click)

---

## Task 1: Design System — Paleta y Variables CSS

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: Reemplazar las variables de color**

Borrar la paleta cooking-show y reemplazar con neo-pop:

```css
@theme {
  --font-display: "Bebas Neue", "Impact", sans-serif;
  --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-code: "JetBrains Mono", "Fira Code", "Consolas", monospace;

  /* Neo-pop palette — light base */
  --color-bg: #F2F0ED;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-muted: #6B6B6B;
  --color-pink: #FF2D9B;
  --color-violet: #7B2FFF;
  --color-lime: #BEFF00;
  --color-cyan: #00E5FF;
  --color-yellow: #FFD700;
  --color-border: #1A1A1A;
  --color-noise: rgba(0, 0, 0, 0.03);
}
```

**Step 2: Reemplazar estilos globales del body**

```css
body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
}
```

**Step 3: Eliminar clases cooking-show**

Borrar:
- `.wood-grain` (textura de madera)
- El comentario "Cooking-show palette"

**Step 4: Actualizar .label**

```css
.label {
  font-family: var(--font-code);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-muted);
}
```

**Step 5: Actualizar .section-divider**

```css
.section-divider {
  width: 100%;
  height: 3px;
  background: var(--color-text);
}
```

Bordes gruesos, no gradientes sutiles. Brutalista.

**Step 6: Actualizar .glass-card → .card**

Renombrar y cambiar el estilo:

```css
.card {
  background: var(--color-surface);
  border: 3px solid var(--color-border);
  border-radius: 0px;
  box-shadow: 6px 6px 0px var(--color-text);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 8px 8px 0px var(--color-pink);
  transform: translate(-2px, -2px);
}
```

Esquinas rectas, bordes gruesos, sombra offset sólida. Neo-brutalist.

**Step 7: Actualizar .tag**

```css
.tag {
  font-family: var(--font-code);
  font-size: 11px;
  letter-spacing: 0.03em;
  color: var(--color-text);
  border: 2px solid var(--color-text);
  border-radius: 0px;
  padding: 4px 10px;
  background: transparent;
  transition: background 0.15s, color 0.15s;
}

.tag:hover {
  background: var(--color-lime);
  color: var(--color-text);
}
```

**Step 8: Actualizar grain overlay**

Mantener grain pero ajustar opacity para fondo light:

```css
.grain-overlay {
  /* ... mantener estructura ... */
  opacity: 0.04;
}
```

**Step 9: Actualizar focus-visible**

```css
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-violet);
  outline-offset: 2px;
  border-radius: 0px;
}
```

**Step 10: Añadir nuevas utilidades maximalistas**

```css
/* Badge — pill de color sólido */
.badge {
  font-family: var(--font-code);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 0px;
  font-weight: 700;
  display: inline-block;
}

.badge-pink { background: var(--color-pink); color: #fff; }
.badge-violet { background: var(--color-violet); color: #fff; }
.badge-lime { background: var(--color-lime); color: var(--color-text); }
.badge-cyan { background: var(--color-cyan); color: var(--color-text); }

/* Marquee — ticker tape */
.marquee {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}

.marquee-content {
  display: inline-block;
  animation: marquee 20s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

/* Sticker — rotated floating element */
.sticker {
  display: inline-block;
  padding: 6px 14px;
  font-family: var(--font-code);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid var(--color-text);
  background: var(--color-lime);
  color: var(--color-text);
  position: absolute;
  transform: rotate(var(--rotation, -3deg));
  box-shadow: 3px 3px 0px var(--color-text);
}
```

**Step 11: Verificar que el dev server compila sin errores**

Run: `cd portfolio && npm run dev`
Expected: Compila. La web se ve con fondo light y las nuevas variables (pero con contenido roto — normal, lo arreglamos en los siguientes tasks).

---

## Task 2: Tipografía — Google Fonts

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Reemplazar imports de fonts**

Cambiar Playfair Display + Source Sans 3 + Fira Code por Bebas Neue + Inter + JetBrains Mono:

```tsx
import { Bebas_Neue, Inter, JetBrains_Mono } from 'next/font/google'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-code',
  display: 'swap',
})
```

**Step 2: Actualizar className del html**

```tsx
<html lang="es" className={`${bebasNeue.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
```

**Step 3: Eliminar metáforas cooking del metadata**

```tsx
export const metadata: Metadata = {
  title: 'Andrea Avila — Developer',
  description:
    'Full stack developer based in Madrid. Building with React, Python, Three.js — turning ideas into experiences.',
  // ... rest stays
}
```

**Step 4: Verificar fonts cargan**

Run: Abrir localhost, inspeccionar elementos, verificar que font-family muestra Bebas Neue para display, Inter para body, JetBrains Mono para code.

---

## Task 3: Hero — Estructura Base (sin 3D todavía)

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Reescribir el Hero completo**

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin()

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Stickers fly in from random directions
    const stickers = gsap.utils.toArray<HTMLElement>('.hero-sticker')
    stickers.forEach((s, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 200
      gsap.set(s, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        rotation: (Math.random() - 0.5) * 40,
        scale: 0.5,
      })
      tl.to(s, {
        x: 0, y: 0, opacity: 1,
        rotation: parseFloat(s.dataset.rotation || '0'),
        scale: 1,
        duration: 0.6,
      }, 0.8 + i * 0.08)
    })

    // Name clips in
    tl.fromTo('.hero-name',
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power4.inOut' },
      0
    )

    // Subtitle fades up
    tl.fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.6
    )

    // Scroll indicator
    tl.fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      1.2
    )
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative" aria-label="Hero">
      <a href="#projects" className="skip-link">Skip to projects</a>

      <div
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        {/* Decorative shapes */}
        <div
          className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full"
          style={{ background: 'var(--color-pink)', opacity: 0.15 }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[15%] right-[8%] w-48 h-48"
          style={{ background: 'var(--color-lime)', opacity: 0.12 }}
          aria-hidden="true"
        />
        <div
          className="absolute top-[30%] right-[15%] w-24 h-24 rounded-full"
          style={{ background: 'var(--color-violet)', opacity: 0.1 }}
          aria-hidden="true"
        />

        {/* 3D Scene placeholder — se reemplaza con desk-scene.glb en Task 5 */}
        <div className="hero-3d absolute inset-0 z-[5]" />

        {/* Name — ENORMOUS */}
        <div className="relative z-10 text-center px-4">
          <h1
            className="hero-name"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 15vw, 14rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              fontWeight: 400,
            }}
          >
            ANDREA<br />AVILA
          </h1>

          <p
            className="hero-subtitle mt-4"
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
            }}
          >
            Full Stack Developer — Madrid
          </p>
        </div>

        {/* Stickers / Badges flotantes */}
        <div
          className="hero-sticker badge badge-pink absolute top-[12%] right-[10%] z-20"
          data-rotation="-5"
          style={{ transform: 'rotate(-5deg)' }}
        >
          FULL STACK
        </div>
        <div
          className="hero-sticker badge badge-lime absolute bottom-[20%] left-[8%] z-20"
          data-rotation="3"
          style={{ transform: 'rotate(3deg)' }}
        >
          MADRID, ES
        </div>
        <div
          className="hero-sticker badge badge-violet absolute top-[25%] left-[12%] z-20"
          data-rotation="-8"
          style={{ transform: 'rotate(-8deg)' }}
        >
          4° SEM
        </div>
        <div
          className="hero-sticker badge badge-cyan absolute bottom-[25%] right-[12%] z-20"
          data-rotation="6"
          style={{ transform: 'rotate(6deg)' }}
        >
          MX → ES
        </div>

        {/* Micro data labels */}
        <div
          className="absolute top-6 left-6 z-20"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            letterSpacing: '0.1em',
          }}
        >
          40.4168°N, 3.7038°W
        </div>
        <div
          className="absolute top-6 right-6 z-20"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            color: 'var(--color-muted)',
            letterSpacing: '0.1em',
          }}
        >
          © 2026
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center">
          <p
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              marginBottom: '8px',
            }}
          >
            scroll
          </p>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'var(--color-text)',
              margin: '0 auto',
            }}
          />
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verificar que el Hero renderiza**

Run: Abrir localhost. Debe verse: nombre ENORME en Bebas Neue, fondo light, badges de color flotando, shapes decorativas, datos en las esquinas.

---

## Task 4: About Section — Sin Cooking

**Files:**
- Modify: `src/components/layout/AboutSection.tsx`

**Step 1: Reescribir AboutSection**

Eliminar toda referencia a cooking ("The Cook", etc.). Reemplazar con:

```tsx
'use client'

import { ScrollReveal } from './ScrollReveal'
import { CountUp } from './CountUp'

export function AboutSection() {
  return (
    <section
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 'clamp(48px, 8vh, 96px) clamp(32px, 6vw, 96px)',
      }}
    >
      <div style={{ flex: '1 1 480px', maxWidth: '600px' }}>
        <ScrollReveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span className="label">00</span>
            <span className="badge badge-violet">About</span>
            <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              lineHeight: 0.95,
              color: 'var(--color-text)',
              margin: '0 0 24px 0',
            }}
          >
            MEXICANA.<br />
            INGENIERA.<br />
            <span style={{ color: 'var(--color-pink)' }}>BUILDER.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'var(--color-muted)',
              maxWidth: '480px',
            }}
          >
            Gestioné un negocio familiar en México antes de tocar una línea
            de código. En 2022 todo cambió. Me mudé a Madrid, entré a
            ingeniería, y desde entonces: hackathones ganados, finalista
            nacional en robótica, IA que ayuda a gente real.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'var(--color-muted)',
              maxWidth: '480px',
              marginTop: '16px',
            }}
          >
            No espero a que me enseñen — busco los retos. Cada oportunidad
            de construir algo es una oportunidad de aprender.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[
              { number: '4°', label: 'Semestre' },
              { number: '10+', label: 'Tecnologías' },
              { number: '2028', label: 'Graduación' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={{ padding: '16px 24px', textAlign: 'center' }}
              >
                <CountUp
                  value={stat.number}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--color-text)',
                  }}
                />
                <div className="label" style={{ marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right side — stickers/collage de identidad */}
      <div
        style={{
          flex: '1 1 400px',
          minHeight: '400px',
          position: 'relative',
        }}
      >
        <div className="sticker" style={{ top: '10%', left: '20%', '--rotation': '-5deg', background: 'var(--color-lime)' } as React.CSSProperties}>
          REACT + TYPESCRIPT
        </div>
        <div className="sticker" style={{ top: '30%', left: '50%', '--rotation': '4deg', background: 'var(--color-pink)', color: '#fff' } as React.CSSProperties}>
          PYTHON
        </div>
        <div className="sticker" style={{ top: '55%', left: '15%', '--rotation': '-8deg', background: 'var(--color-cyan)' } as React.CSSProperties}>
          THREE.JS
        </div>
        <div className="sticker" style={{ top: '45%', left: '55%', '--rotation': '7deg', background: 'var(--color-violet)', color: '#fff' } as React.CSSProperties}>
          C++ / ARDUINO
        </div>
        <div className="sticker" style={{ top: '70%', left: '35%', '--rotation': '-3deg', background: 'var(--color-yellow)' } as React.CSSProperties}>
          GSAP
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verificar visualmente**

About section debe verse: título en Bebas Neue, bio directa sin cooking, stats en cards con borde grueso y sombra offset, stickers de skills flotando a la derecha.

---

## Task 5: Hero 3D — Integrar desk-scene.glb

**Files:**
- Create: `src/components/layout/DeskScene.tsx`
- Modify: `src/components/layout/Hero.tsx`
- Add: `public/models/desk-scene.glb` (el usuario debe proporcionar este archivo)

**Step 1: Crear DeskScene component**

```tsx
'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

function Desk() {
  const { nodes, materials } = useGLTF('/models/desk-scene.glb')
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // Idle float
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
  })

  // Mouse parallax
  const { viewport } = useThree()
  useFrame(({ pointer }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.05,
      0.05
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.05,
      0.05
    )
  })

  return (
    <group ref={groupRef}>
      {Object.entries(nodes).map(([name, node]) => {
        if (!(node instanceof THREE.Mesh)) return null
        return (
          <mesh
            key={name}
            geometry={node.geometry}
            material={node.material}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
            onPointerOver={() => {
              setHovered(name)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(null)
              document.body.style.cursor = 'auto'
            }}
          />
        )
      })}
    </group>
  )
}

export function DeskScene() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <OrthographicCamera
        makeDefault
        zoom={120}
        position={[5, 5, 5]}
        near={0.1}
        far={100}
      />
      <ambientLight intensity={0.8} color="#FFF5E6" />
      <directionalLight position={[-2, 5, 3]} intensity={2} color="#ffffff" />
      <directionalLight position={[3, 2, -1]} intensity={0.8} color="#E8E0FF" />
      <Desk />
    </Canvas>
  )
}

useGLTF.preload('/models/desk-scene.glb')
```

**Step 2: Integrar en Hero.tsx**

Reemplazar el placeholder `<div className="hero-3d" />` con:

```tsx
import dynamic from 'next/dynamic'

const DeskScene = dynamic(
  () => import('./DeskScene').then((m) => ({ default: m.DeskScene })),
  { ssr: false }
)

// Dentro del JSX, reemplazar el placeholder:
<div className="hero-3d absolute inset-0 z-[5] opacity-80">
  <DeskScene />
</div>
```

**Step 3: Verificar**

El escritorio 3D debe aparecer detrás del nombre, en isométrica, con parallax al mouse. Los objetos deben ser hovereables.

> ⚠️ **PAUSA**: Este task requiere que el usuario proporcione `desk-scene.glb`. Si no está listo, skip y continuar con Tasks 6+. Volver a este cuando el archivo esté disponible.

---

## Task 6: CivicAid Section — Sin Cooking

**Files:**
- Modify: `src/components/layout/CivicAidSection.tsx`

**Step 1: Actualizar estilos y copy**

Cambios principales:
- Reemplazar `glass-card` → `card` en el contenedor de Spline
- Reemplazar colores inline: `var(--color-sage-green)` → badge violet, `var(--color-espresso)` → `var(--color-text)`, `var(--color-cocoa)` → `var(--color-muted)`, `var(--color-terracotta)` → `var(--color-pink)`
- Cambiar la section label de cooking style a maximalista:
  ```tsx
  <span className="label">01</span>
  <span className="badge badge-pink">Clara</span>
  <span className="label">/ AI Voice Assistant</span>
  <div style={{ flex: 1, height: '3px', background: 'var(--color-text)' }} />
  ```
- Actualizar h2 a font-display Bebas Neue style (uppercase, huge)
- Actualizar tags hover con nuevo estilo
- Cambiar link colors de terracotta a pink

**Step 2: Verificar visualmente**

Clara section con la nueva paleta: fondo light, tipografía industrial, cards con borde grueso, tags con hover lime.

---

## Task 7: CapturingMoments Section — Sin Cooking

**Files:**
- Modify: `src/components/layout/CapturingMomentsSection.tsx`

**Step 1: Mismos cambios de paleta que Task 6**

- Reemplazar todas las variables cooking por neo-pop
- Section label maximalista con badge
- h2 en Bebas Neue uppercase
- `glass-card` → `card`
- Link colors actualizados

**Step 2: Verificar**

---

## Task 8: Robotics Section — Sin Cooking

**Files:**
- Modify: `src/components/layout/RoboticsSection.tsx`

**Step 1: Mismos cambios de paleta**

- Variables cooking → neo-pop
- Section label con badge cyan
- h2 uppercase
- `glass-card` → `card`
- "Finalista Nacional" badge en lugar de terracotta label

**Step 2: Verificar**

---

## Task 9: OS Section — Sin Cooking

**Files:**
- Modify: `src/components/layout/OSSection.tsx`

**Step 1: Actualizar paleta**

- Section label con badge violet
- h2 uppercase
- Terminal window: mantener dark pero con colores neo-pop
  - Window dots: `#FF2D9B`, `#BEFF00`, `#7B2FFF` (en lugar de los standard rojo/amarillo/verde)
  - Running state → `#BEFF00` (lime en lugar de sage green)
  - Blocked state → `var(--color-muted)`
  - CPU high → `#FF2D9B` (pink en lugar de terracotta)

**Step 2: Verificar**

La terminal ahora tiene colores neo-pop pero mantiene su estética dark (contraste con el fondo light de la web).

---

## Task 10: Footer / Contact — Sin Cooking

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Reescribir copy y estilos**

Cambios:
- "Ready to cook something new?" → "LET'S BUILD SOMETHING" (Bebas Neue, enorme)
- "Open Kitchen" → badge con "Contact"
- Reemplazar todos los colores cooking → neo-pop
- CTA button: background pink, border 3px solid text, shadow offset, border-radius 0
- Channel links: border-bottom 3px en lugar de 1px, hover → pink
- Info panel: `glass-card` → `card`
- "Open to work" → badge lime en lugar de sage green
- Bottom line: border grueso, no dashed

**Step 2: Verificar**

Footer con estética maximalista: título enorme, botón brutalist, info panel con bordes gruesos.

---

## Task 11: Marquee / Ticker Tape

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/layout/Marquee.tsx`

**Step 1: Crear componente Marquee**

```tsx
export function Marquee() {
  const items = [
    'REACT', 'TYPESCRIPT', 'PYTHON', 'THREE.JS', 'NEXT.JS',
    'GSAP', 'C++', 'ARDUINO', 'TAILWIND', 'NODE.JS',
    'FIGMA', 'BLENDER', 'GIT', 'FRAMER MOTION',
  ]
  const repeated = [...items, ...items]

  return (
    <div className="marquee" style={{
      borderTop: '3px solid var(--color-text)',
      borderBottom: '3px solid var(--color-text)',
      padding: '12px 0',
      background: 'var(--color-lime)',
    }}>
      <div className="marquee-content">
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'var(--color-text)',
              marginRight: '48px',
            }}
          >
            {item} ★
          </span>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Añadir Marquee a page.tsx**

Insertar entre Hero y AboutSection:

```tsx
<Hero />
<Marquee />
<AboutSection />
```

**Step 3: Verificar**

Ticker tape de skills scrolleando infinito, fondo lime, texto en Bebas Neue, bordes gruesos arriba y abajo.

---

## Task 12: Limpiar Archivos Cooking

**Files:**
- Delete: `src/components/recipes/RecipeCard.tsx`
- Delete: `src/components/recipes/RecipeDetail.tsx`
- Delete: `src/components/recipes/RecipeGrid.tsx`
- Delete: `src/data/recipes.ts`
- Delete: `src/app/recipe/[slug]/page.tsx`
- Delete: `src/components/layout/HeroParticles.tsx` (ya no se usa)
- Modify: `package.json` — cambiar name de "cooking-show" a "andrea-portfolio"

**Step 1: Borrar archivos**

```bash
rm -rf src/components/recipes
rm -rf src/data/recipes.ts
rm -rf src/app/recipe
rm src/components/layout/HeroParticles.tsx
```

**Step 2: Actualizar package.json name**

```json
"name": "andrea-portfolio"
```

**Step 3: Verificar que no hay imports rotos**

Run: `npm run build`
Expected: Build sin errores. Si hay imports a archivos borrados, eliminarlos.

---

## Task 13: Renombrar glass-card → card en todo el proyecto

**Files:**
- Grep and replace all instances of `glass-card` → `card` across all .tsx files

**Step 1: Buscar y reemplazar**

```bash
grep -r "glass-card" src/ --include="*.tsx" -l
```

Reemplazar en cada archivo encontrado.

**Step 2: Verificar build**

Run: `npm run build`

---

## Task 14: Revisión Visual Completa

**Step 1: Scroll completo de la web**

Verificar sección por sección:
- [ ] Hero: nombre enorme, badges, shapes, fondo light
- [ ] Marquee: ticker tape lime con skills
- [ ] About: título maximalista, bio directa, stats en cards, stickers
- [ ] Clara: card con borde grueso, colores neo-pop, Spline funciona
- [ ] Photography: card, video funciona, colores actualizados
- [ ] Robotics: robot 3D funciona, colores neo-pop
- [ ] OS: terminal con colores nuevos
- [ ] Footer: CTA enorme, button brutalist, info panel

**Step 2: Verificar responsive**

Mobile (375px), Tablet (768px), Desktop (1440px):
- [ ] Hero nombre no se corta
- [ ] Badges no se salen del viewport en mobile
- [ ] Marquee funciona
- [ ] Cards stack correctamente
- [ ] Footer legible en mobile

**Step 3: Verificar dark mode no se rompe**

El diseño es light-only por ahora. Verificar que `prefers-color-scheme: dark` no rompe nada (no hay implementación dark, pero no debe haber conflictos).

---

## Task 15: Performance Check

**Step 1: Run Lighthouse**

```bash
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless"
```

Targets:
- Performance: ≥ 85 (el 3D puede bajar esto, aceptable)
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**Step 2: Fix top issues si hay**

Common fixes:
- Lazy load el DeskScene con dynamic import (ya hecho)
- Optimizar imágenes
- Preload fonts críticos

---

## Orden de Ejecución Recomendado

```
Task 1  → Design System (CSS)        ← PRIMERO, todo depende de esto
Task 2  → Fonts (layout.tsx)          ← Segundo, visual base
Task 3  → Hero (sin 3D)              ← Tercero, primera impresión
Task 11 → Marquee                    ← Quick win visual
Task 4  → About                      ← Sección 00
Task 6  → CivicAid                   ← Sección 01
Task 7  → Photography                ← Sección 02
Task 8  → Robotics                   ← Sección 03
Task 9  → OS                         ← Sección 04
Task 10 → Footer                     ← Sección 05
Task 12 → Limpiar cooking files      ← Cleanup
Task 13 → Rename glass-card          ← Cleanup
Task 5  → Hero 3D (cuando el .glb esté listo)
Task 14 → Revisión visual
Task 15 → Performance
```
