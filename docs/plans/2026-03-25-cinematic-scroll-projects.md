# Cinematic Scroll Projects — Design Doc

**Date:** 2026-03-25
**Goal:** Reemplazar la seccion de proyectos en PortfolioContent con un scroll cinematico donde cada proyecto ocupa pantalla completa y se revela dramaticamente por fases.

---

## Concepto

Cada proyecto es una **mini-pelicula** controlada por scroll. No cards, no grids — pantalla completa, palabras gigantes, imagenes que explotan, metricas que cuentan. Inspirado en Joffrey Spitzer, Eduard Bodak, y portfolios ganadores de Awwwards 2025-2026.

## Estructura por proyecto (4 fases, ~350vh total)

### FASE 1 — "El Hook" (100vh, pinned)
- Numero del proyecto (`01`) en tipografia outline gigante (20vw), posicion top-right
- Titulo ENORME en `--font-display`, `clamp(4rem, 12vw, 10rem)`, revelado letra por letra con GSAP SplitText-style stagger
- Subtitulo fade-in debajo (`--font-code`, uppercase, letter-spacing)
- Color accent del proyecto como linea horizontal animada (crece de 0 a ~200px)
- Fondo: negro con glow sutil del color accent

### FASE 2 — "La Historia" (100vh, parallax)
- Texto narrativo grande (`--font-body`, ~28-32px) revelado linea por linea con scroll
- Maximo 3 lineas de contexto — NO descripcion tecnica, sino la HISTORIA:
  - Clara: "300+ participantes. 8 idiomas. Una voz para quien no tiene acceso."
  - Zumo: "50 equipos. Un ring en Burgos. Un robot de 10cm con casco impreso en 3D."
  - Photo: "Street photography. Madrid through my lens."
  - Todo: "Sprint 6. Un dashboard que organiza el caos."
  - OS: "FIFO vs SJF vs Round Robin. Quien gana?"
- Foto de proceso aparece con parallax (offset-y al scrollear):
  - Clara: screenshot del WhatsApp con Clara respondiendo
  - Zumo: foto de la arena en Burgos con spotlight
  - Photo: dark mode hero screenshot
  - Todo: dashboard screenshot
  - OS: screenshot del simulador corriendo

### FASE 3 — "La Solucion" (100vh, scale reveal)
- Screenshot/video principal se expande de escala 0.3 a 1.0 con el scroll
- Clip-path animation: `inset(20% 20% 20% 20%)` → `inset(0)` mientras scrolleas
- Debajo: tags tech flotan en stagger (`React · Python · Gemini`)
- Para Zumo: viewer 3D del robot (ya existe) + foto de batalla real

### FASE 4 — "El Impacto" (50vh)
- Metricas GRANDES con count-up animation:
  - Clara: "1er lugar" + "469+ tests" + "4 personas"
  - Zumo: "Finalista nacional" + "50+ equipos" + "C++ puro"
  - Photo: "100% responsive" + "GSAP animations"
  - Todo: "6 widgets" + "Mapa interactivo"
  - OS: "3 algoritmos" + "Tiempo real"
- CTA button con magnetic hover effect → link a demo/code
- Transicion suave al siguiente proyecto (fade del color accent)

## Implementacion tecnica

### Componente principal: `CinematicProject`
```tsx
interface CinematicProjectProps {
  project: Project
  processImage: string    // foto behind-the-scenes
  narrative: string[]     // 2-3 lineas de historia (no tecnica)
  metrics: { label: string; value: string }[]
}
```

### Animaciones (GSAP ScrollTrigger)
- **Pin:** Fase 1 se pinea durante el scroll de fase 2
- **SplitText manual:** split titulo en spans, stagger `y: 100%` → `y: 0`
- **Parallax:** proceso image con `yPercent` linked to scroll
- **Scale reveal:** screenshot con `scale` + `clipPath` driven by scroll progress
- **CountUp:** metricas con `gsap.to()` cuando entran en viewport
- **Line-by-line:** narrative text con lineas reveladas por scroll progress

### Responsive (mobile)
- Fases se comprimen: Hook (80vh), Historia (auto height), Solucion (80vh), Impacto (auto)
- Titulo clamp baja a `clamp(2.5rem, 8vw, 4rem)`
- Proceso image es full-width (no parallax en mobile)
- Scale reveal simplificado a fade-in

### Accessibility
- `prefers-reduced-motion`: todas las animaciones se deshabilitan, contenido visible estatico
- Scroll hints con `aria-label`
- Semantic HTML: `<article>` por proyecto, `<h2>` para titulos

## Assets disponibles

### Clara — CivicAid
- `/public/projects/clara-desktop.png` — app screenshot
- `/public/projects/clara-mobile.png` — mobile screenshot
- `/public/projects/process/clara-whatsapp.png` — WhatsApp demo (NUEVO)
- `/public/projects/clara-mobile.mp4` — mobile video demo
- `/public/projects/clara-logo.svg` — logo SVG

### ASTI Robotics (Zumo)
- `/public/projects/process/zumo-battle.png` — robots en el ring (NUEVO)
- `/public/projects/process/zumo-arena-burgos.jpg` — PENDIENTE: foto arena con spotlight
- `/public/projects/process/zumo-3d-helmet.png` — PENDIENTE: foto casco 3D impreso
- `/public/models/zumo-robot.stl` — modelo 3D para viewer interactivo
- `/public/sketches/sketch-robotics.png` — sketch estilo notebook

### Capturing Moments (Photography)
- `/public/projects/photo-fullpage-1920.png` — fullpage light mode
- `/public/projects/photo-dark-hero.png` — hero dark mode
- `/public/projects/photo-dark-portfolio.png` — portfolio section dark
- `/public/projects/photo-hero-1920.png` — hero light mode
- `/public/projects/photo-desktop.png` — existing screenshot

### Task Dashboard
- `/public/projects/todo-desktop.png` — dashboard screenshot
- `/public/projects/todo-mobile.mp4` — mobile video

### Kernel Sim (OS)
- `/public/projects/os-simulator.png` — simulator running (NUEVO de GitHub)
- `/public/sketches/sketch-os.png` — sketch estilo notebook

## Archivos a modificar

1. **NUEVO:** `src/components/layout/CinematicProject.tsx` — componente principal
2. **MODIFICAR:** `src/components/layout/ProjectsSection.tsx` — reemplazar con loop de CinematicProject
3. **MODIFICAR:** `src/data/projects.ts` — agregar campos `narrative`, `processImage`, `metrics`
4. **MODIFICAR:** `src/components/layout/PortfolioContent.tsx` — ajustar spacing si es necesario

## Fuera de scope
- Paginas individuales por proyecto (futuro)
- Horizontal scroll (descartado en brainstorming)
- Integracion con escena 3D (fase futura)
- Captura automatizada de screenshots (manual por ahora)
