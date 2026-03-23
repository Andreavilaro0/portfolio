# Sketchbook Portfolio Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the entire 2D portfolio (PortfolioContent / mobile fallback) as the personal sketchbook of Andrea Avila — an engineering student who draws her ideas before coding them. The visitor flips through her creative notebook.

**Architecture:** Three 2026 design trends fused into one identity:
- **Naive Design (#1)** — hand-drawn warmth, wobbly lines, sketchy imperfection, doodles. p5.brush generates real hand-drawn art (flow fields, margin doodles, pencil sketches). Caveat font for handwritten annotations.
- **Blueprint Design (#3)** — technical annotations, labeled arrows, measurement lines, grid paper background, exploded views of tech stack. Andrea is an engineer — her sketchbook has technical notes mixed with creative doodles.
- **Punk Grunge (#5)** — masking tape holding photos/mockups, sticker-like tech badges, torn edges between pages. The physical texture of "I taped this into my notebook".

Keep existing data (projects.ts), mockup components (PhoneMockup, BrowserMockup, LaptopMockup), ScrollReveal, CountUp, and all project assets (screenshots, videos in `/public/projects/`).

**Tech Stack:** Next.js, React, p5.brush (embedded HTML via iframe or inline canvas), Caveat + Space Grotesk (Google Fonts), existing Tailwind/CSS tokens

---

## Design System: Engineer's Sketchbook

### Visual DNA
- **Paper as canvas**: aged cream background with graph-paper grid (24px, faint blue/gray lines)
- **Two handwriting modes**: Caveat for personal notes ("esto fue increible!"), Space Grotesk for printed/stamped titles
- **Blueprint annotations**: arrows with labels, measurement lines, callout boxes pointing to mockups
- **Physical textures**: masking tape on mockup corners, torn paper edges between sections, sticker badges for tech
- **Margin doodles**: p5.brush generates small sketches (stars, arrows, circles, flow lines) in the margins
- **Highlighted notes**: yellow highlighter behind key achievements ("1er lugar!", "finalista nacional")
- **Pencil underlines**: HandDrawnLine component (already exists) for all separators

### Colors
- `--color-bg: #F5F0E8` — aged paper/cream
- `--color-text: #2C2C2C` — soft pencil black (not pure #000)
- `--color-muted: #8B8680` — faded pencil
- `--color-ink: #1a1a2e` — dark ink for emphasis
- `--color-pencil: #4a4a4a` — graphite
- Keep accents: pink `#FF2D9B`, violet `#7B2FFF`, lime `#BEFF00`, cyan `#00E5FF`
- `--color-tape: #F5E6C8` — masking tape color
- `--color-highlight: #FFF176` — yellow highlighter

### Fonts
- `--font-hand: "Caveat", cursive` — handwritten annotations, margin notes
- `--font-display: "Space Grotesk", sans-serif` — project titles (printed/stamped feel)
- `--font-body: "Inter", sans-serif` — readable body text
- `--font-code: "JetBrains Mono", monospace` — code/tech labels

### Textures
- **Graph paper grid**: `background-size: 24px 24px; background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`
- **Paper grain**: SVG noise filter at very low opacity
- **Pencil underlines**: Hand-drawn SVG paths (HandDrawnLine component, already exists)
- **Masking tape**: CSS transforms + gradients simulating tape strips holding photos/mockups

### Interactions
- Hover on project "pages": slight paper lift (translateY -4px + subtle shadow)
- Annotations fade in with ScrollReveal (like being written)
- p5.brush decorative sketches as static background elements

---

### Task 1: Design Tokens + Fonts

**Files:**
- Modify: `src/styles/globals.css`

**Step 1: Update design tokens**

Replace the current @theme block and add Caveat font import. Change neo-brutalist tokens to sketchbook tokens:

- Import Caveat: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap')`
- `--font-hand: "Caveat", cursive`
- `--color-bg: #F5F0E8` (aged paper)
- `--color-text: #2C2C2C` (pencil)
- `--color-muted: #8B8680` (faded)
- `--color-border: #C4BFB5` (light pencil line)
- Remove neo-brutalist utility classes (.neo-card, .neo-btn, .neo-badge, .halftone-bg, .grid-bg, .text-stroke)
- Add sketchbook utility classes:
  - `.paper-bg` — graph paper grid background
  - `.tape` — masking tape strip (rotated, semi-transparent)
  - `.annotation` — handwritten note style (Caveat, slight rotation)
  - `.sketch-border` — hand-drawn border using existing HandDrawnLine approach
  - `.pencil-underline` — wavy underline
  - `.page` — paper page with subtle shadow + slight rotation
  - `.highlight` — yellow highlighter background
  - `.circled` — hand-drawn SVG circle around text (for achievements)
  - `.blueprint-label` — monospaced annotation with arrow
- Update `.card` to look like a notebook page (light shadow, paper bg, no harsh borders)
- Update `.badge` to look like a circled/highlighted note
- Update `.tag` to look like a handwritten label

**Step 2: Verify**

Run: `npx tsc --noEmit`

**Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "style: sketchbook design tokens, Caveat font, paper textures"
```

---

### Task 2: Generate p5.brush Decorative Sketches

**Files:**
- Create: `public/sketches/hero-doodles.html`
- Create: `public/sketches/flow-field.html`
- Create: `public/sketches/margin-doodles.html`
- Create: `src/components/ui/SketchEmbed.tsx`

**Step 1: Generate hero doodles**

Use p5.brush skill to create a canvas (1200x400) with:
- Warm paper background (#F5F0E8)
- Scattered flow lines in graphite (#4a4a4a) with "curved" field
- Small circles, arrows, x-marks like margin doodles
- A few measurement-style lines (blueprint: horizontal line with vertical ticks at each end)
- Very organic, like an engineer doodled while thinking
- Save as `public/sketches/hero-doodles.html`

**Step 2: Generate flow field art**

Use p5.brush skill to create a canvas (800x800) with:
- "waves" field, cpencil brush in muted colors (#4a4a4a, #8B8680)
- Abstract flowing lines that look like pencil sketches on graph paper
- For use as section divider/background
- Save as `public/sketches/flow-field.html`

**Step 3: Generate margin doodles**

Use p5.brush skill to create small (200x600) vertical strip with:
- Tiny stars, circles, arrows, dots, small x-marks
- Like margin doodles in an engineering notebook
- A few small gear/cog shapes (engineer vibes)
- Save as `public/sketches/margin-doodles.html`

**Step 4: Create SketchEmbed component**

A reusable component that embeds p5.brush HTML files as iframes with proper sizing:

```tsx
interface SketchEmbedProps {
  src: string
  width?: string
  height?: string
  style?: React.CSSProperties
}
export function SketchEmbed({ src, width = '100%', height = '400px', style }: SketchEmbedProps)
```

Uses `<iframe>` with `scrolling="no"`, `frameBorder="0"`, `pointerEvents: 'none'`, blends with paper bg.

**Step 5: Commit**

```bash
git add public/sketches/ src/components/ui/SketchEmbed.tsx
git commit -m "feat: p5.brush generative sketches + embed component"
```

---

### Task 3: MaskingTape Component

**Files:**
- Create: `src/components/ui/MaskingTape.tsx`

**Step 1: Create reusable tape component**

CSS-only masking tape strip that goes on corners of "taped" elements:

```tsx
interface MaskingTapeProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  rotation?: number
  color?: string
}
```

- Semi-transparent strip (~30px wide, 80px long)
- Slight gradient for translucency
- Color: `#F5E6C8` (beige) or `#E8E0D0` (aged)
- Rotation varies per position
- Absolutely positioned over parent

**Step 2: Commit**

```bash
git add src/components/ui/MaskingTape.tsx
git commit -m "feat: MaskingTape component for taped-in photos/mockups"
```

---

### Task 4: Nav + Hero — Sketchbook Cover

**Files:**
- Modify: `src/components/layout/PortfolioContent.tsx`
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Redesign nav**

Minimal pencil-style nav:
- Paper bg (#F5F0E8) with graph-paper grid
- Logo "AA" in handwriting font (Caveat), circled with hand-drawn SVG circle
- Links in Caveat font, underlined with HandDrawnLine on hover
- Bottom border: HandDrawnLine (not solid 4px)

**Step 2: Redesign Hero as sketchbook cover**

The hero IS the cover of the sketchbook:
- Full viewport, graph paper background
- "Andrea" in Caveat (handwritten, large), "AVILA" in Space Grotesk (stamped, larger)
- Below: "desarrolladora full stack" as handwritten annotation with arrow
- Photo of Andrea "taped" to the page (slight rotation, MaskingTape on two corners)
- BLUEPRINT: Small tech stack diagram — boxes labeled "React", "Python", "Three.js" connected by arrows
- NAIVE: Margin doodles — small sketched stars, "MX -> ES" with arrow, "2026" circled
- GRUNGE: "open to work" as a sticky note (yellow bg, tape, slight rotation), "hackathon winner" highlighted
- p5.brush hero-doodles embedded as background decoration (SketchEmbed, absolute, low opacity)
- Bottom: "scroll" as handwritten note with arrow down

**Step 3: Verify + Commit**

```bash
git add src/components/layout/PortfolioContent.tsx src/components/layout/Hero.tsx
git commit -m "feat: sketchbook hero — handwritten cover page"
```

---

### Task 5: Marquee -> Notebook Divider

**Files:**
- Modify: `src/components/layout/Marquee.tsx`

**Step 1: Replace marquee with notebook page divider**

Instead of a scrolling marquee, create a "torn edge" divider:
- HandDrawnLine across the page
- Skills listed as handwritten labels scattered along it: "React", "TypeScript", "Python", "Three.js", "C++", "GSAP"
- Each label: Caveat font, slightly rotated (random -3 to 3deg), different sizes
- Some with checkmarks, some circled, some underlined — like someone listing what they know
- Background: slightly warmer paper shade (#F0E8D8)
- BLUEPRINT element: one skill has a measurement arrow showing "5 years" or similar

**Step 2: Commit**

```bash
git add src/components/layout/Marquee.tsx
git commit -m "feat: notebook divider with handwritten skill labels"
```

---

### Task 6: Project Sections — Notebook Pages (NAIVE + BLUEPRINT + GRUNGE)

**Files:**
- Modify: `src/components/layout/CivicAidSection.tsx`
- Modify: `src/components/layout/CapturingMomentsSection.tsx`
- Modify: `src/components/layout/RoboticsSection.tsx`
- Modify: `src/components/layout/TodoSection.tsx`
- Modify: `src/components/layout/OSSection.tsx`

**Step 1: Shared page layout pattern**

Each project = a "page" in the sketchbook. Common pattern:
- Graph paper background with `.paper-bg`
- "pg. 01" page number in margin (Caveat, muted color)
- Title in Space Grotesk (stamped/printed feel) with HandDrawnLine underline
- BLUEPRINT element: technical diagram or wireframe SVG unique to each project
- NAIVE element: handwritten annotations (Caveat), highlighted achievements, circled notes
- GRUNGE element: mockups "taped" with MaskingTape component on corners
- Tags as handwritten circled words (Caveat)
- Links as underlined text with arrow annotations
- HandDrawnLine separator between sections

**Step 2: CivicAidSection (Project 01)**

- "pg. 01" in margin
- "CLARA — CIVICAID" in Space Grotesk + HandDrawnLine underline
- BLUEPRINT: Architecture pipeline SVG — boxes "React" -> "Python" -> "Gemini" -> "ElevenLabs" with arrows and label "procesamiento de voz"
- NAIVE: "1er lugar!" circled in pink (Caveat), "300+ participantes" with `.highlight` (yellow bg)
- GRUNGE: LaptopMockup (`/projects/clara-desktop.png`) with MaskingTape. PhoneMockup (`/projects/clara-mobile.mp4`) with MaskingTape.
- Blueprint callout: "8 idiomas" with arrow pointing to mockup
- Tags handwritten, links as "[live demo ->]" underlined

**Step 3: CapturingMomentsSection (Project 02)**

- "pg. 02" in margin
- "CAPTURING MOMENTS" in Space Grotesk + underline
- BLUEPRINT: Page wireframe SVG — boxes labeled "hero", "gallery", "about" with scroll flow arrows
- NAIVE: "diseno editorial" annotation with arrow, "GSAP" checkmark
- GRUNGE: BrowserMockup (video `/videos/plantilla-showcase.mp4`) + PhoneMockup (`/projects/photo-mobile.mp4`) with MaskingTape

**Step 4: RoboticsSection (Project 03)**

- "pg. 03" in margin
- "ASTI ROBOTICS" in Space Grotesk
- BLUEPRINT: Zumo 32U4 exploded view SVG — labeled parts: "sensores IR", "motores", "cuchilla", measurement arrows. Like an engineer's real technical sketch.
- NAIVE: "finalista nacional!" circled in pink, "50+ equipos" margin note
- RobotViewer (SVG animation) in sketch-border frame
- GRUNGE: "ASTI CHALLENGE 2026" sticker taped on

**Step 5: TodoSection (Project 04)**

- "pg. 04" in margin
- "TASK DASHBOARD" in Space Grotesk
- BLUEPRINT: Dashboard wireframe SVG — labeled boxes "mapa", "calendario", "filtros", "tareas" with arrows
- NAIVE: "Sprint 6 — Frontend I" annotation, "UDIT Madrid" circled
- GRUNGE: BrowserMockup (`/projects/todo-desktop.png`) + PhoneMockup (`/projects/todo-mobile.mp4`) with MaskingTape

**Step 6: OSSection (Project 05)**

- "pg. 05" in margin
- "KERNEL SIM" in Space Grotesk
- BLUEPRINT: Scheduling diagram SVG — "FIFO", "SJF", "Round Robin" boxes with time arrows and measurement annotations
- NAIVE: "cual gana?" handwritten question next to diagram
- Terminal mockup in sketch-border frame, process animation kept (existing IntersectionObserver logic)
- GRUNGE: Torn edge divider at top

**Step 7: Commit**

```bash
git add src/components/layout/CivicAidSection.tsx src/components/layout/CapturingMomentsSection.tsx src/components/layout/RoboticsSection.tsx src/components/layout/TodoSection.tsx src/components/layout/OSSection.tsx
git commit -m "feat: project pages — naive + blueprint + grunge sketchbook style"
```

---

### Task 7: About Section — Personal Page

**Files:**
- Modify: `src/components/layout/AboutSection.tsx`

**Step 1: Redesign as a personal sketchbook page**

This is the "about me" page in the notebook:
- Photo "taped" in with MaskingTape, rotated -3deg
- Bio as handwritten text (Caveat, larger size)
- Stats as circled numbers with labels (keep CountUp component)
- BLUEPRINT: Timeline drawn with pencil — MX (2018) -> Cambridge (2023) -> Madrid (2024) -> graduation (2028). Each point annotated with handwritten notes. Measurement lines between points showing years.
- NAIVE: "dibujo mis ideas antes de programarlas" in pink — her key quote, highlighted
- Skills as handwritten list with checkmarks: "React", "TypeScript", "Python", "Three.js", "C++", "GSAP"
- GRUNGE: Tech stickers taped around the photo (like stickers on a laptop)
- Small p5.brush flow-field sketch embedded as decoration

**Step 2: Commit**

```bash
git add src/components/layout/AboutSection.tsx
git commit -m "feat: about page as personal sketchbook spread"
```

---

### Task 8: Footer — Back Cover

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Redesign as notebook back cover**

- Dark paper background (#2C2C2C) — like the back of a Moleskine
- "let's talk" in large handwriting (Caveat, white)
- Email as handwritten text, circled with SVG circle
- Social links as handwritten underlined labels: "[github]", "[linkedin]", "[email]"
- "open to work" as a sticky note (slight rotation, yellow bg, MaskingTape)
- "BUSCANDO EXPERIENCIA LABORAL" small handwritten note
- BLUEPRINT: Small "contact diagram" — arrow from email to "tu inbox"
- Bottom: "Andrea Avila 2026 — Madrid" in pencil (muted)
- Small p5.brush closing doodle

**Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: footer as sketchbook back cover"
```

---

### Task 9: Final Polish + Build Verification

**Files:**
- Modify: any files needing fixes

**Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 2: Build**

Run: `npx next build`
Expected: successful build

**Step 3: Visual check**

Run: `npx playwright screenshot --viewport-size '375,812' --wait-for-timeout 8000 http://localhost:3000 /tmp/sketchbook-mobile.png`
Verify all sections render correctly.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete sketchbook portfolio redesign — naive + blueprint + grunge"
```
