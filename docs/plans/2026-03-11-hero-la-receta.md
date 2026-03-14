# "La Receta" — Hero Timeline en Capas · Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reemplazar el hero actual con una experiencia narrativa tipo "libro de recetas" que se abre al hacer scroll, revelando capas SVG con momentos clave de la historia de Andrea (México → Madrid → Hackathons → Portfolio), culminando en una escena 3D Spline interactiva.

**Architecture:** Hero pinned con GSAP ScrollTrigger que controla un timeline de 10+ capas SVG (texto + ilustraciones) con parallax entre capas. Una escena Spline 3D de un libro/recetario se integra como pieza central. Framer Motion maneja las animaciones iniciales de entrada; GSAP ScrollTrigger maneja las animaciones de scroll. El componente reemplaza SOLO `Hero.tsx` sin tocar ningún otro archivo del proyecto.

**Tech Stack:** Next.js 16 + React 19 | GSAP + @gsap/react + ScrollTrigger | Framer Motion (existente) | Spline Pro (3D) | SVG pathLength animations | Tailwind CSS 4

**Paleta ampliada para el hero:**
- Fondo base: `#0a0a0a` (--color-cream existente)
- Texto principal: `#f0ece6` (--color-espresso)
- Accent cálido: `#c96b3c` (--color-terracotta) — para años y highlights
- Accent verde: `#7a9a6d` (--color-sage-green) — para líneas decorativas
- Nuevo accent dorado: `#d4a853` — para detalles del libro/páginas
- Nuevo accent cobre: `#b87333` — para bordes del recetario
- Secundario: `#b8a99a` (--color-cocoa) — para textos descriptivos

**Referencia visual:** Hero de https://sirup.online/5th/ — 24 capas SVG apiladas con reveal progresivo.

**REGLA CRÍTICA:** NO se toca ningún archivo fuera de `src/components/layout/Hero.tsx` y archivos nuevos que creemos. `page.tsx`, `layout.tsx`, `globals.css`, y todos los demás componentes permanecen intactos.

---

## Fase 0: Setup — Instalar GSAP + @gsap/react

**Objetivo:** Instalar dependencias necesarias sin romper nada existente.

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Instalar GSAP y el hook de React**

```bash
cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio
npm install gsap @gsap/react
```

**Step 2: Verificar instalación**

```bash
npm ls gsap @gsap/react
```

Expected: ambos paquetes listados sin errores.

**Step 3: Verificar que el dev server sigue funcionando**

```bash
# El server ya corre en localhost:3001
# Abrir en navegador y confirmar que todo sigue igual
```

Expected: El portfolio carga exactamente igual que antes.

**Verificación de fase:** Abrir http://localhost:3001 → el sitio se ve idéntico. No hay errores en consola.

---

## Fase 1: Scaffold — Estructura base del nuevo Hero

**Objetivo:** Crear la estructura HTML/JSX del nuevo hero con el pinning de GSAP, sin animaciones aún. Solo el contenedor que se "pega" al viewport durante el scroll.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Reescribir Hero.tsx con estructura base**

Reemplazar TODO el contenido de `Hero.tsx` con:

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Momentos de la historia ── */
const STORY_MOMENTS = [
  { year: '2017', label: 'México', desc: 'Negocio familiar — aprendí a resolver problemas reales' },
  { year: '2022', label: 'El Salto', desc: 'De gestionar clientes a escribir mi primera línea de código' },
  { year: '2024', label: 'Madrid', desc: 'Universidad, nuevas herramientas, otro idioma' },
  { year: '2025', label: 'Hackathon', desc: 'OdiseIA4Good — Clara, mi primer proyecto real con IA' },
  { year: '2026', label: 'Ahora', desc: 'Full stack developer — construyendo el menú completo' },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !heroRef.current) return

    // Pin the hero for the duration of the scroll narrative
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: heroRef.current,
      pinSpacing: true,
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative" aria-label="Hero — La Receta de Andrea">
      <a href="#projects" className="skip-link">
        Skip to projects
      </a>

      <div ref={heroRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center"
        style={{ background: 'var(--color-cream)' }}
      >
        {/* Capa 0: Título principal */}
        <div className="hero-layer absolute inset-0 flex flex-col items-center justify-center z-10">
          <p className="label tracking-widest mb-4" style={{ color: 'var(--color-sage-green)' }}>
            la receta
          </p>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl leading-[0.95] text-center"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-espresso)',
              fontWeight: 900,
            }}
          >
            Andrea<br />Avila
          </h1>
          <p
            className="mt-6 text-lg md:text-xl text-center max-w-md"
            style={{ color: 'var(--color-cocoa)' }}
          >
            Full stack developer — Madrid
          </p>
        </div>

        {/* Capas SVG decorativas (se animarán en fases posteriores) */}
        {STORY_MOMENTS.map((moment, i) => (
          <div
            key={moment.year}
            className="hero-layer story-moment absolute inset-0 flex items-center justify-center opacity-0 z-20"
            data-index={i}
          >
            <div className="text-center">
              <span
                className="block text-8xl md:text-[12rem] font-black leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-terracotta)',
                  opacity: 0.15,
                }}
              >
                {moment.year}
              </span>
              <span
                className="block text-2xl md:text-4xl mt-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-espresso)',
                  fontWeight: 700,
                }}
              >
                {moment.label}
              </span>
              <p className="mt-3 text-base md:text-lg max-w-sm mx-auto" style={{ color: 'var(--color-cocoa)' }}>
                {moment.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Líneas decorativas SVG */}
        <svg
          className="hero-layer absolute inset-0 w-full h-full z-5 pointer-events-none"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Línea horizontal central */}
          <line
            className="deco-line"
            x1="0" y1="450" x2="1440" y2="450"
            stroke="var(--color-sage-green)"
            strokeWidth="0.5"
            opacity="0.2"
          />
          {/* Línea vertical central */}
          <line
            className="deco-line"
            x1="720" y1="0" x2="720" y2="900"
            stroke="var(--color-sage-green)"
            strokeWidth="0.5"
            opacity="0.2"
          />
          {/* Círculo central decorativo */}
          <circle
            className="deco-circle"
            cx="720" cy="450" r="200"
            stroke="#d4a853"
            strokeWidth="0.5"
            fill="none"
            opacity="0.1"
          />
          <circle
            className="deco-circle"
            cx="720" cy="450" r="350"
            stroke="#b87333"
            strokeWidth="0.3"
            fill="none"
            opacity="0.08"
          />
        </svg>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <p className="label tracking-widest mb-2 text-center" style={{ color: 'var(--color-steam-grey)' }}>
            scroll
          </p>
          <svg
            className="mx-auto"
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="var(--color-steam-grey)"
            strokeWidth="2" strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Guardar y verificar en navegador**

Expected: El hero ahora muestra "Andrea Avila" centrado con el label "la receta" arriba. Los story moments están invisibles (opacity-0). El hero se "pega" al hacer scroll y hay espacio para scrollear. Las líneas decorativas SVG son sutilmente visibles.

**Verificación de fase:**
1. Abrir http://localhost:3001
2. ¿Se ve "la receta" + "Andrea Avila" + "Full stack developer — Madrid" centrado?
3. ¿Al hacer scroll, el hero se queda pinned?
4. ¿Las secciones de abajo (About, CivicAid, etc.) siguen funcionando?
5. ¿No hay errores en consola del navegador?
6. Hacer screenshot con skill `get_screenshot` o revisión visual manual.
7. **Si NO se ve bien:** Revisar que GSAP se importó correctamente, que `'use client'` está al inicio, y que el ScrollTrigger.create tiene los parámetros correctos.

---

## Fase 2: Animación de Entrada — Reveal inicial del título

**Objetivo:** Al cargar la página, el título "Andrea Avila" y los elementos decorativos aparecen con una animación elegante tipo reveal (sin scroll, solo al cargar).

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Añadir animación de entrada con GSAP timeline**

Dentro del `useGSAP`, ANTES del ScrollTrigger.create, añadir:

```tsx
// ── Entrada inicial (no depende del scroll) ──
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

// Líneas decorativas: dibujar
tl.fromTo('.deco-line',
  { attr: { 'stroke-dasharray': '1440', 'stroke-dashoffset': '1440' } },
  { attr: { 'stroke-dashoffset': '0' }, duration: 1.5, stagger: 0.2 },
  0
)

// Círculos: escalar desde el centro
tl.fromTo('.deco-circle',
  { attr: { r: 0 }, opacity: 0 },
  { attr: { r: (i: number) => i === 0 ? 200 : 350 }, opacity: (i: number) => i === 0 ? 0.1 : 0.08, duration: 1.2, stagger: 0.15 },
  0.3
)

// Label "la receta"
tl.fromTo('.hero-layer:first-child .label',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.6 },
  0.5
)

// Título "Andrea Avila"
tl.fromTo('.hero-layer:first-child h1',
  { opacity: 0, y: 40, scale: 0.95 },
  { opacity: 1, y: 0, scale: 1, duration: 0.8 },
  0.7
)

// Subtítulo
tl.fromTo('.hero-layer:first-child p:last-of-type',
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.6 },
  1.0
)

// Scroll indicator
tl.fromTo('[class*="bottom-8"]',
  { opacity: 0, y: -10 },
  { opacity: 1, y: 0, duration: 0.5 },
  1.3
)
```

**Step 2: Verificar en navegador**

Expected: Al cargar la página, las líneas SVG se "dibujan", los círculos se expanden desde el centro, y el texto aparece con stagger elegante. Todo en ~2 segundos.

**Verificación de fase:**
1. Refrescar http://localhost:3001 (hard refresh: Cmd+Shift+R)
2. ¿Las líneas SVG se dibujan suavemente?
3. ¿Los círculos se expanden?
4. ¿El título aparece con fade-up + scale?
5. ¿El timing se siente fluido, no robótico?
6. **Si las líneas NO se dibujan:** Verificar que los SVG line tienen el className `deco-line` y que stroke-dasharray se calcula correctamente. Puede que necesites calcular el pathLength real de cada línea.
7. **Si se siente lento:** Reducir duraciones a 0.6-0.8s. Si se siente robótico, cambiar ease a `'power2.out'` o `'expo.out'`.

---

## Fase 3: Scroll Timeline — Los momentos de la historia

**Objetivo:** Al hacer scroll, los 5 momentos de la historia (México, El Salto, Madrid, Hackathon, Ahora) aparecen secuencialmente con transiciones suaves. Cada momento entra, se muestra, y sale para dar paso al siguiente.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Añadir scroll timeline dentro del useGSAP**

Después de la animación de entrada, añadir:

```tsx
// ── Scroll narrative: story moments ──
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: '+=300%',
    pin: heroRef.current,
    pinSpacing: true,
    scrub: 1, // suaviza el scroll
  },
})

// Fade out título principal al empezar a scrollear
scrollTl.to('.hero-layer:first-child', {
  opacity: 0,
  scale: 0.9,
  duration: 0.5,
})

// Cada story moment: entra → se muestra → sale
const moments = gsap.utils.toArray<HTMLElement>('.story-moment')
moments.forEach((moment, i) => {
  // Entrada
  scrollTl.fromTo(moment,
    { opacity: 0, y: 60, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1 },
  )
  // Pausa visual (hold)
  scrollTl.to(moment, { duration: 0.5 })
  // Salida (excepto el último)
  if (i < moments.length - 1) {
    scrollTl.to(moment, {
      opacity: 0, y: -40, scale: 1.02, duration: 0.8,
    })
  }
})
```

**Step 2: Eliminar el ScrollTrigger.create anterior** (ya lo reemplaza el que está en scrollTl).

**Step 3: Verificar en navegador**

Expected: Al scrollear, "Andrea Avila" se desvanece → aparece "2017 México" → se desvanece → "2022 El Salto" → etc. Todo controlado por la posición del scroll.

**Verificación de fase:**
1. Scrollear lentamente por todo el hero
2. ¿Cada momento aparece y desaparece suavemente?
3. ¿El último momento ("2026 Ahora") se queda visible antes de pasar a las secciones?
4. ¿El scroll se siente responsivo (no laggy)?
5. ¿Al scrollear hacia arriba, todo se revierte correctamente?
6. **Si los momentos no se ven:** Verificar que `.story-moment` matchea los divs. Probar con `console.log(moments.length)` — debe ser 5.
7. **Si se siente choppy:** Aumentar `scrub` a 1.5 o 2. Si es demasiado lento, reducir durations.

---

## Fase 4: SVG Decorativos — Líneas de conexión entre momentos

**Objetivo:** Añadir líneas SVG que se "dibujan" progresivamente con el scroll, conectando visualmente los momentos de la historia como una línea de tiempo.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Añadir SVG timeline path al JSX**

Dentro del div `heroRef`, añadir un nuevo SVG antes del scroll indicator:

```tsx
{/* Timeline path — se dibuja con el scroll */}
<svg
  className="absolute inset-0 w-full h-full z-15 pointer-events-none"
  viewBox="0 0 1440 900"
  fill="none"
  preserveAspectRatio="xMidYMid slice"
  aria-hidden="true"
>
  {/* Línea principal del timeline — curva sinuosa */}
  <path
    className="timeline-path"
    d="M 200 450 C 400 200, 500 700, 720 450 C 940 200, 1040 700, 1240 450"
    stroke="var(--color-terracotta)"
    strokeWidth="1"
    fill="none"
    opacity="0.4"
    strokeLinecap="round"
  />
  {/* Puntos en los nodos del timeline */}
  {[200, 460, 720, 980, 1240].map((cx, i) => (
    <circle
      key={i}
      className="timeline-dot"
      cx={cx}
      cy={450}
      r="4"
      fill="var(--color-terracotta)"
      opacity="0"
    />
  ))}
  {/* Líneas radiantes desde cada nodo */}
  {[200, 460, 720, 980, 1240].map((cx, i) => (
    <circle
      key={`ring-${i}`}
      className="timeline-ring"
      cx={cx}
      cy={450}
      r="20"
      stroke="#d4a853"
      strokeWidth="0.5"
      fill="none"
      opacity="0"
    />
  ))}
</svg>
```

**Step 2: Animar el timeline path con el scroll**

Dentro del `scrollTl`, ANTES del fade out del título, añadir:

```tsx
// Calcular longitud del path para stroke-dasharray
const timelinePath = document.querySelector('.timeline-path') as SVGPathElement
if (timelinePath) {
  const pathLength = timelinePath.getTotalLength()
  gsap.set(timelinePath, {
    attr: { 'stroke-dasharray': pathLength, 'stroke-dashoffset': pathLength },
  })
  // Dibujar la línea a lo largo de todo el scroll
  scrollTl.to(timelinePath, {
    attr: { 'stroke-dashoffset': 0 },
    duration: 5, // se dibuja durante toda la narrativa
    ease: 'none',
  }, 0)
}

// Dots y rings aparecen sincronizados con cada momento
const dots = gsap.utils.toArray<SVGCircleElement>('.timeline-dot')
const rings = gsap.utils.toArray<SVGCircleElement>('.timeline-ring')
```

Y dentro del loop de moments, al entrar cada momento:

```tsx
// Después del fromTo de cada moment, añadir:
if (dots[i]) {
  scrollTl.to(dots[i], { opacity: 1, duration: 0.3 }, '<')
  scrollTl.fromTo(rings[i],
    { opacity: 0, attr: { r: 4 } },
    { opacity: 0.3, attr: { r: 30 }, duration: 0.5 },
    '<'
  )
}
```

**Verificación de fase:**
1. Al scrollear, ¿la línea curva terracotta se dibuja progresivamente?
2. ¿Los puntos aparecen sincronizados con cada momento de la historia?
3. ¿Los anillos dorados se expanden como un "pulse"?
4. ¿La línea se siente como una "ruta" que conecta toda la historia?
5. **Si el path no se dibuja:** Verificar `getTotalLength()` — solo funciona con paths, no con lines. Asegurarse de que el path d="" es válido.
6. **Si los dots no sincronizan:** Ajustar la posición temporal dentro del scrollTl usando `'<'` o `'>-0.3'`.

---

## Fase 5: Escena Spline 3D — El Libro de Recetas

**Objetivo:** Integrar una escena Spline 3D de un libro/recetario abierto como pieza central del hero. El libro aparece después del último momento de la historia.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Buscar/Crear escena en Spline**

Buscar en Spline community o crear una escena nueva:
- Buscar en https://spline.design/examples o https://community.spline.design/ una escena de libro abierto
- Si no hay una adecuada, crear una nueva en Spline con:
  - Un libro abierto con páginas visibles
  - Colores que coincidan con la paleta: fondo oscuro, libro en tonos dorado/cobre (#d4a853, #b87333)
  - Animación idle sutil (rotación lenta o páginas moviéndose)
  - Interacción: hover para rotar suavemente
- Exportar como "Code > React" para obtener la URL del scene

**Step 2: Añadir contenedor Spline al JSX**

Después del último story-moment div:

```tsx
{/* Escena 3D — Libro de recetas */}
<div
  className="hero-layer spline-book absolute inset-0 z-25 opacity-0 flex items-center justify-center"
>
  <div className="relative w-[60vw] max-w-[700px] aspect-square">
    <SplineScene scene="URL_DE_TU_ESCENA_SPLINE" />
  </div>
  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center z-30">
    <p
      className="text-2xl md:text-3xl"
      style={{
        fontFamily: 'var(--font-display)',
        color: 'var(--color-espresso)',
        fontWeight: 700,
      }}
    >
      Cada proyecto, una nueva receta.
    </p>
    <p className="mt-2 text-base" style={{ color: 'var(--color-cocoa)' }}>
      Browse the menu below.
    </p>
  </div>
</div>
```

**Step 3: Añadir import de SplineScene**

```tsx
import { SplineScene } from './SplineScene'
```

**Step 4: Animar la aparición del libro en el scrollTl**

Después del último story moment en el timeline:

```tsx
// Transición final: aparece el libro 3D
scrollTl.fromTo('.spline-book',
  { opacity: 0, scale: 0.8 },
  { opacity: 1, scale: 1, duration: 1.5 },
)
```

**Verificación de fase:**
1. ¿La escena Spline carga correctamente?
2. ¿Aparece después del último momento de la historia al scrollear?
3. ¿El texto "Cada proyecto, una nueva receta" se ve debajo del libro?
4. ¿La interacción del libro funciona (hover/rotación)?
5. ¿El rendimiento no se degrada significativamente? (mantener 30+ FPS)
6. **Si Spline no carga:** Verificar la URL del scene. Probar con la URL del chef que ya funciona como fallback.
7. **Si el performance baja:** Añadir loading lazy con Intersection Observer (como ya hacen las otras secciones).

---

## Fase 6: Color y Atmósfera — Gradientes y ambient light

**Objetivo:** Añadir cambios de color de fondo sincronizados con cada momento de la historia. El fondo va evolucionando sutilmente para crear atmósfera.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Añadir capa de fondo gradiente**

En el JSX, como primer hijo dentro de `heroRef`:

```tsx
{/* Fondo dinámico — cambia con cada momento */}
<div
  className="hero-bg absolute inset-0 z-0 transition-none"
  style={{ background: 'var(--color-cream)' }}
/>
```

**Step 2: Animar el fondo en el scrollTl**

Dentro del loop de moments, sincronizar cambios de fondo:

```tsx
const BG_COLORS = [
  'radial-gradient(ellipse at center, #1a1208 0%, #0a0a0a 70%)',  // México — cálido oscuro
  'radial-gradient(ellipse at center, #0d1117 0%, #0a0a0a 70%)',  // El Salto — azul código
  'radial-gradient(ellipse at center, #12100e 0%, #0a0a0a 70%)',  // Madrid — neutro
  'radial-gradient(ellipse at center, #0f1510 0%, #0a0a0a 70%)',  // Hackathon — verde IA
  'radial-gradient(ellipse at center, #1a0f08 0%, #0a0a0a 70%)',  // Ahora — terracotta
]

// Dentro del loop de moments, al entrar cada uno:
scrollTl.to('.hero-bg', {
  background: BG_COLORS[i],
  duration: 0.5,
}, '<')
```

**Step 3: Añadir vignette overlay**

En el JSX, después del hero-bg:

```tsx
{/* Vignette — profundidad visual */}
<div
  className="absolute inset-0 z-1 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
  }}
  aria-hidden="true"
/>
```

**Verificación de fase:**
1. ¿El fondo cambia sutilmente con cada momento?
2. ¿Los cambios de color son apenas perceptibles pero crean atmósfera?
3. ¿La vignette añade profundidad sin ocultar contenido?
4. ¿Los colores NO son chillones ni distraen del texto?
5. **Si los gradientes son demasiado visibles:** Reducir la diferencia entre los colores del centro. Mantener el centro del gradiente solo 1-2 tonos lejos del negro.
6. **Si no se nota la diferencia:** Aumentar ligeramente la saturación del centro del gradiente.

---

## Fase 7: Micro-detalles — Partículas flotantes y ornamentos

**Objetivo:** Añadir partículas sutiles tipo "especias/polvo" flotando, y ornamentos SVG que refuercen la metáfora del recetario.

**Files:**
- Create: `src/components/layout/HeroParticles.tsx`
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Crear componente de partículas**

```tsx
// src/components/layout/HeroParticles.tsx
'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 30
const COLORS = ['#d4a853', '#c96b3c', '#7a9a6d', '#b87333']

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1, // drift upward
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.3 + 0.05,
    }))

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        // Wrap around
        if (p.x < 0) p.x = canvas.offsetWidth
        if (p.x > canvas.offsetWidth) p.x = 0
        if (p.y < 0) p.y = canvas.offsetHeight
        if (p.y > canvas.offsetHeight) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-2 pointer-events-none"
      aria-hidden="true"
    />
  )
}
```

**Step 2: Importar y añadir al Hero**

En `Hero.tsx`, importar:
```tsx
import { HeroParticles } from './HeroParticles'
```

En el JSX, después del vignette:
```tsx
<HeroParticles />
```

**Step 3: Añadir ornamentos SVG de recetario**

En el SVG decorativo principal, añadir esquinas tipo recetario:

```tsx
{/* Esquinas decorativas tipo recetario */}
<g className="book-corners" opacity="0.15">
  {/* Top-left corner */}
  <path d="M 80 80 L 80 40 Q 80 30 90 30 L 130 30" stroke="#d4a853" strokeWidth="1" fill="none" />
  {/* Top-right corner */}
  <path d="M 1360 80 L 1360 40 Q 1360 30 1350 30 L 1310 30" stroke="#d4a853" strokeWidth="1" fill="none" />
  {/* Bottom-left corner */}
  <path d="M 80 820 L 80 860 Q 80 870 90 870 L 130 870" stroke="#d4a853" strokeWidth="1" fill="none" />
  {/* Bottom-right corner */}
  <path d="M 1360 820 L 1360 860 Q 1360 870 1350 870 L 1310 870" stroke="#d4a853" strokeWidth="1" fill="none" />
</g>
```

**Verificación de fase:**
1. ¿Se ven partículas sutiles flotando hacia arriba?
2. ¿Los colores de las partículas coinciden con la paleta?
3. ¿Las partículas NO distraen del contenido principal?
4. ¿Las esquinas doradas del recetario se ven en las 4 esquinas?
5. ¿El rendimiento sigue bien? (canvas + GSAP + Spline no deben causar drops)
6. **Si las partículas son muy visibles:** Reducir PARTICLE_COUNT a 15 y opacity max a 0.15.
7. **Si no se ven:** Aumentar size a 1-3 y opacity a 0.1-0.4.
8. Probar en `prefers-reduced-motion`: las partículas NO deberían animarse.

---

## Fase 8: Tipografía Cinética — Años como capas al estilo SIRUP

**Objetivo:** Los años (2017, 2022, 2024, 2025, 2026) se muestran como grandes capas tipográficas SVG superpuestas con diferentes opacidades, rotaciones y escalas, creando la composición layered del estilo SIRUP.

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Crear componente de año SVG**

Dentro de `Hero.tsx`, crear un array de configuraciones para las capas tipográficas:

```tsx
const YEAR_LAYERS = [
  { year: '2017', x: '15%', y: '20%', size: '18vw', rotation: -5, opacity: 0.04, color: '#c96b3c' },
  { year: '2022', x: '70%', y: '15%', size: '14vw', rotation: 3, opacity: 0.03, color: '#d4a853' },
  { year: '2024', x: '25%', y: '70%', size: '16vw', rotation: -2, opacity: 0.035, color: '#b87333' },
  { year: '2025', x: '75%', y: '65%', size: '12vw', rotation: 4, opacity: 0.03, color: '#7a9a6d' },
  { year: '2026', x: '50%', y: '45%', size: '22vw', rotation: 0, opacity: 0.05, color: '#c96b3c' },
]
```

**Step 2: Renderizar las capas en el JSX**

Después del hero-bg y vignette, antes de las partículas:

```tsx
{/* Year layers — tipografía cinética estilo SIRUP */}
{YEAR_LAYERS.map((layer, i) => (
  <div
    key={`year-${i}`}
    className="year-layer absolute pointer-events-none z-3"
    style={{
      left: layer.x,
      top: layer.y,
      transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
      fontSize: layer.size,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      color: layer.color,
      opacity: 0, // empiezan invisibles
      lineHeight: 0.85,
      letterSpacing: '-0.03em',
    }}
  >
    {layer.year}
  </div>
))}
```

**Step 3: Animar las capas de años con el scroll**

En el scrollTl, al inicio (mientras se desvanece el título):

```tsx
// Year layers aparecen gradualmente con parallax
const yearLayers = gsap.utils.toArray<HTMLElement>('.year-layer')
yearLayers.forEach((layer, i) => {
  scrollTl.to(layer, {
    opacity: YEAR_LAYERS[i].opacity,
    y: -30 * (i % 2 === 0 ? 1 : -1), // parallax sutil
    duration: 4,
    ease: 'none',
  }, 0)
})
```

**Step 4: Añadir parallax de fondo con el scroll**

Cada year-layer se mueve a distinta velocidad:

```tsx
// Parallax independiente para cada year layer
yearLayers.forEach((layer, i) => {
  const speed = 0.5 + (i * 0.2) // cada capa se mueve a distinta velocidad
  scrollTl.to(layer, {
    y: `-=${50 * speed}`,
    duration: 5,
    ease: 'none',
  }, 0)
})
```

**Verificación de fase:**
1. ¿Se ven los años grandes como "watermarks" detrás del contenido?
2. ¿Cada año tiene un color diferente de la paleta?
3. ¿Al hacer scroll, los años se mueven a diferentes velocidades (parallax)?
4. ¿Las opacidades son SUTILES (3-5%) — no deben competir con el contenido principal?
5. ¿La composición se siente "layered" y con profundidad, similar a SIRUP?
6. **Si los años son muy visibles:** Reducir opacidades a 0.02-0.03.
7. **Si no se nota el parallax:** Aumentar el multiplicador de speed o el desplazamiento Y.

---

## Fase 9: Responsive + Accesibilidad + Performance

**Objetivo:** Asegurar que el hero funciona en mobile, respeta `prefers-reduced-motion`, y tiene buen rendimiento.

**Files:**
- Modify: `src/components/layout/Hero.tsx`
- Modify: `src/components/layout/HeroParticles.tsx`

**Step 1: Responsive — ajustar para mobile**

En el Hero, ajustar tamaños para mobile:

```tsx
// En YEAR_LAYERS, cambiar size a clamp() para responsive:
// size: 'clamp(60px, 18vw, 280px)' etc.

// En los story moments, reducir el tamaño del año en mobile:
// className: 'text-6xl md:text-8xl lg:text-[12rem]' en vez de 'text-8xl md:text-[12rem]'
```

Ajustar el ScrollTrigger end para mobile:

```tsx
ScrollTrigger.create({
  // ...
  end: () => `+=${window.innerHeight * 3}`, // dinámico
  invalidateOnRefresh: true, // recalcula en resize
})
```

**Step 2: Reduced motion**

En el useGSAP:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Mostrar todo sin animaciones
  gsap.set('.hero-layer:first-child', { opacity: 1 })
  gsap.set('.story-moment', { opacity: 0 }) // solo mostrar título
  gsap.set('.year-layer', {
    opacity: (i: number) => YEAR_LAYERS[i].opacity,
  })
  // No crear ScrollTrigger ni timeline
  return
}
```

En HeroParticles:

```tsx
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // ... resto del efecto
}, [])
```

**Step 3: Performance — lazy load Spline**

Modificar el contenedor Spline para usar dynamic import:

```tsx
import dynamic from 'next/dynamic'

const SplineScene = dynamic(
  () => import('./SplineScene').then(mod => ({ default: mod.SplineScene })),
  { ssr: false, loading: () => <div style={{ background: '#0a0a0a' }} className="w-full h-full" /> }
)
```

**Step 4: Cleanup GSAP en unmount**

El hook `useGSAP` de @gsap/react ya maneja cleanup automáticamente con `scope`, pero verificar que no hay memory leaks.

**Verificación de fase:**
1. **Mobile (375px):** Abrir DevTools → toggle device toolbar → iPhone 14
   - ¿El hero se ve bien en mobile?
   - ¿Los textos son legibles?
   - ¿El scroll funciona suavemente?
2. **Reduced motion:** En DevTools → Rendering → Emulate prefers-reduced-motion: reduce
   - ¿Se muestra solo el título estático?
   - ¿No hay animaciones corriendo?
3. **Performance:** DevTools → Performance → Record durante scroll
   - ¿Frame rate > 30fps?
   - ¿No hay layout thrashing?
4. **Si mobile no se ve bien:** Ajustar breakpoints de texto y reducir YEAR_LAYERS a 3 en mobile.
5. **Si performance es baja:** Reducir PARTICLE_COUNT, desactivar Spline en mobile, usar `will-change: transform` en layers animadas.

---

## Fase 10: Polish Final — Timing, easing, y cohesión

**Objetivo:** Refinar todos los timings, easings, y detalles visuales para que el hero se sienta cohesivo, premium, y cuente la historia de forma impactante.

**Files:**
- Modify: `src/components/layout/Hero.tsx`
- Modify: `src/components/layout/HeroParticles.tsx`

**Step 1: Refinar easings globales**

Reemplazar easings genéricos con curvas custom:

```tsx
// Easing para entrada de elementos narrativos
const EASE_REVEAL = 'power3.out'       // suave y elegante
const EASE_EXIT = 'power2.inOut'       // salida natural
const EASE_DRAW = 'power1.inOut'       // para SVG drawing
```

**Step 2: Añadir transición final al contenido principal**

Después del libro 3D, el hero debe hacer una transición suave a las secciones:

```tsx
// Al final del scrollTl, fade out del libro y transición
scrollTl.to('.spline-book', {
  opacity: 0,
  y: -40,
  duration: 0.8,
})
```

**Step 3: Revisar copy final**

Asegurarse de que el copy en cada momento es conciso y emotivo:

```tsx
const STORY_MOMENTS = [
  { year: '2017', label: 'México', desc: 'Negocio familiar. Aprendí a entregar resultados, no excusas.' },
  { year: '2022', label: 'El Salto', desc: 'Primera línea de código. No hubo vuelta atrás.' },
  { year: '2024', label: 'Madrid', desc: 'Nueva ciudad, nuevo idioma, misma hambre.' },
  { year: '2025', label: 'OdiseIA', desc: 'Clara — IA con voz para quienes más la necesitan.' },
  { year: '2026', label: 'Ahora', desc: 'Full stack. Cada proyecto es una nueva receta.' },
]
```

**Step 4: Testear flujo completo**

Hacer un recorrido completo del hero varias veces:

1. Carga de página → animación de entrada
2. Scroll lento → todos los momentos
3. Scroll rápido → se siente suave
4. Scroll reverso → todo se revierte
5. Resize ventana → se adapta
6. Mobile → funciona
7. Reduced motion → fallback estático

**Verificación de fase FINAL:**
1. ¿El hero cuenta una historia coherente de principio a fin?
2. ¿Los timings se sienten "musicales" — no robóticos ni erráticos?
3. ¿Los colores crean atmósfera sin ser invasivos?
4. ¿La tipografía cinética (años) añade profundidad sin distraer?
5. ¿El libro 3D es un climax visual satisfactorio?
6. ¿La transición a las secciones es suave?
7. ¿Todo el hero se siente como UNA pieza, no como partes pegadas?
8. **Si algo se siente "off":** Identificar qué fase necesita ajuste y reformular las instrucciones de esa fase.

---

## Resumen de Archivos

| Archivo | Acción |
|---------|--------|
| `package.json` | Modificar (npm install gsap @gsap/react) |
| `src/components/layout/Hero.tsx` | Reescribir completo |
| `src/components/layout/HeroParticles.tsx` | Crear nuevo |
| Spline scene | Crear/encontrar en Spline Pro |
| Todos los demás archivos | **NO TOCAR** |

## Dependencias Nuevas

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `gsap` | ^3.x | Animaciones + ScrollTrigger |
| `@gsap/react` | ^2.x | useGSAP hook para cleanup |

## No se necesita commit hasta que todo esté verificado.
