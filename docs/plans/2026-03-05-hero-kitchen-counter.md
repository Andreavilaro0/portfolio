# Hero "Kitchen Counter" — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the hero section (Scene 1 from Notion storyboard) — a warm editorial landing with wood-grain counter strip, animated heading, subtitle, description, "Browse the menu" CTA, and featured recipe cards preview with staggered entrance animation.

**Architecture:** The hero is a single `<section>` with two visual zones: (1) a decorative wood-grain counter strip at the top (200px, CSS-only texture), and (2) a content area with Framer Motion entrance animations on heading, subtitle, description, and a scroll-hint CTA. Recipe cards below the hero are NOT part of this plan — they already exist in `RecipeGrid`. The hero uses existing design tokens from `globals.css` and fonts from `layout.tsx`.

**Tech Stack:** React 19, Next.js 15 (App Router), Framer Motion (already installed), Tailwind v4 (existing tokens), CSS custom properties.

**Reference files (read these first):**
- Design tokens: `src/styles/globals.css` (lines 7-23 for colors, 106-114 for wood-grain)
- Fonts: `src/app/layout.tsx` (Playfair Display = display, Source Sans 3 = body)
- Current stub: `src/components/layout/Hero.tsx`

---

### Task 1: Build the static hero layout with all copy

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Write the full hero markup**

Replace the entire file with this layout. No animations yet — just structure and styling.

```tsx
'use client'

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Wood grain counter strip — 200px oak texture, CSS-only */}
      <div className="wood-grain h-[200px] w-full" />

      {/* Hero content — centered, generous whitespace */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        {/* Title — Playfair Display 900, espresso */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl mb-5 leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 900 }}
        >
          Andrea&apos;s Kitchen
        </h1>

        {/* Subtitle — Playfair Display 600, espresso */}
        <p
          className="text-xl md:text-2xl mb-6"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 600 }}
        >
          Recipes for Digital Products
        </p>

        {/* Herb sprig divider — inline SVG, sage-green */}
        <svg
          className="mx-auto mb-8"
          width="80"
          height="16"
          viewBox="0 0 80 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 8 C20 2, 30 14, 40 8 C50 2, 60 14, 76 8"
            stroke="var(--color-sage-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="40" cy="8" r="2" fill="var(--color-sage-green)" />
        </svg>

        {/* Description — Source Sans 3, cocoa */}
        <p
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--color-cocoa)' }}
        >
          Full stack developer based in Madrid.
          I take raw ingredients — React, Python, Three.js —
          and turn them into experiences people actually enjoy.
        </p>

        {/* CTA — label style, steam-grey, uppercase */}
        <p className="label tracking-widest">Browse the menu below.</p>

        {/* Scroll hint arrow */}
        <svg
          className="mx-auto mt-6"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-steam-grey)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}
```

**Step 2: Verify in browser**

Run: `cd "/Users/andreaavila/Projects/Cooking Show" && npx next dev --port 3099`

Open: `http://localhost:3099`

Expected:
- Wood-grain strip visible at top (200px, subtle horizontal line texture)
- "Andrea's Kitchen" in large Playfair Display, espresso color
- "Recipes for Digital Products" below in lighter weight
- Small sage-green decorative sprig SVG divider
- Description paragraph in cocoa, well-spaced
- "BROWSE THE MENU BELOW." in uppercase label style
- Scroll arrow below
- All text on cream background — fully legible, no competing elements
- Mobile (375px): title scales down to `text-5xl`, still legible

**Step 3: Commit**

```bash
git add src/components/layout/Hero.tsx
git commit -m "feat(hero): static kitchen counter layout with all copy and herb divider"
```

---

### Task 2: Add Framer Motion entrance animations

**Files:**
- Modify: `src/components/layout/Hero.tsx`

**Step 1: Add motion imports and animate each element**

Wrap each text element in `motion.X` with staggered fade-up entrances. These match Motion Beat #1 from the Notion storyboard: `opacity: 0→1; translateY(30px→0), 0.5s, cubic-bezier(0.33, 1, 0.68, 1)`.

Replace the full file:

```tsx
'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Wood grain counter strip */}
      <div className="wood-grain h-[200px] w-full" />

      {/* Hero content */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-5xl md:text-7xl lg:text-8xl mb-5 leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 900 }}
        >
          Andrea&apos;s Kitchen
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="text-xl md:text-2xl mb-6"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-espresso)', fontWeight: 600 }}
        >
          Recipes for Digital Products
        </motion.p>

        {/* Herb sprig divider — draws on with stroke animation */}
        <motion.svg
          className="mx-auto mb-8"
          width="80"
          height="16"
          viewBox="0 0 80 16"
          fill="none"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.path
            d="M4 8 C20 2, 30 14, 40 8 C50 2, 60 14, 76 8"
            stroke="var(--color-sage-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="40"
            cy="8"
            r="2"
            fill="var(--color-sage-green)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          />
        </motion.svg>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--color-cocoa)' }}
        >
          Full stack developer based in Madrid.
          I take raw ingredients — React, Python, Three.js —
          and turn them into experiences people actually enjoy.
        </motion.p>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="label tracking-widest"
        >
          Browse the menu below.
        </motion.p>

        <motion.svg
          className="mx-auto mt-6"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-steam-grey)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </div>
    </section>
  )
}
```

**Step 2: Verify in browser**

Reload `http://localhost:3099`

Expected:
- Title fades up first (0s delay)
- Subtitle fades up (0.15s delay)
- Herb sprig SVG draws itself on with stroke animation (0.5s delay)
- Description fades up (0.4s delay)
- "Browse the menu" fades up (0.6s delay)
- Arrow fades in last (0.8s delay)
- Total entrance sequence: ~1.5 seconds, feels organic and unhurried
- All animations feel like `cubic-bezier(0.33, 1, 0.68, 1)` — fast start, gentle deceleration

**Step 3: Commit**

```bash
git add src/components/layout/Hero.tsx
git commit -m "feat(hero): add Framer Motion staggered fade-up entrance animations"
```

---

### Task 3: Enhance wood-grain strip with depth and warmth

**Files:**
- Modify: `src/styles/globals.css` (wood-grain class)
- Modify: `src/components/layout/Hero.tsx` (add bottom gradient fade)

**Step 1: Improve the wood-grain texture in CSS**

In `globals.css`, replace the `.wood-grain` block (lines 106-114) with a richer texture that has depth:

```css
.wood-grain {
  background-color: var(--color-cream);
  background-image:
    /* Primary grain lines */
    repeating-linear-gradient(
      90deg,
      rgba(92, 61, 46, 0.05) 0px,
      rgba(92, 61, 46, 0.02) 2px,
      transparent 2px,
      transparent 6px
    ),
    /* Secondary finer grain */
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      rgba(92, 61, 46, 0.015) 1px,
      transparent 1px,
      transparent 3px
    ),
    /* Subtle vertical warmth gradient */
    linear-gradient(
      180deg,
      rgba(201, 107, 60, 0.04) 0%,
      transparent 40%,
      rgba(92, 61, 46, 0.03) 100%
    );
}
```

**Step 2: Add a bottom fade on the wood-grain in Hero.tsx**

After the wood-grain `<div>`, add a gradient that softly blends the counter into the cream content area. Find:

```tsx
<div className="wood-grain h-[200px] w-full" />
```

Replace with:

```tsx
{/* Wood grain counter strip with bottom fade */}
<div className="relative">
  <div className="wood-grain h-[200px] w-full" />
  <div
    className="absolute bottom-0 left-0 w-full h-16"
    style={{
      background: 'linear-gradient(180deg, transparent 0%, var(--color-cream) 100%)',
    }}
  />
</div>
```

**Step 3: Verify in browser**

Expected:
- Wood-grain strip has more visible grain texture (two layered repeating gradients)
- A subtle terracotta warmth at the top of the strip
- The bottom 64px fades smoothly into cream — no hard edge between counter and content
- Overall feel: a warm wooden kitchen counter that Andrea's content "sits on"

**Step 4: Commit**

```bash
git add src/styles/globals.css src/components/layout/Hero.tsx
git commit -m "feat(hero): enhance wood-grain texture with depth layers and bottom fade"
```

---

### Task 4: Add skip-to-content link and ARIA for accessibility

**Files:**
- Modify: `src/components/layout/Hero.tsx`
- Modify: `src/styles/globals.css` (skip link styles)

**Step 1: Add skip link CSS to globals.css**

Add this after the `.label` block (after line 81):

```css
/* Skip-to-content link (accessibility) */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 8px 16px;
  background-color: var(--color-terracotta);
  color: var(--color-warm-white);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border-radius: 0 0 8px 0;
}

.skip-link:focus {
  left: 0;
}
```

**Step 2: Add skip link to Hero.tsx**

At the very top of the `<section>`, before the wood-grain div, add:

```tsx
<a href="#recipes" className="skip-link">
  Skip to recipes
</a>
```

And on the `<section>`, ensure it has `aria-label`:

```tsx
<section className="relative w-full overflow-hidden" aria-label="Hero — Andrea's Kitchen">
```

**Step 3: Add the `id="recipes"` target to RecipeGrid**

Modify: `src/components/recipes/RecipeGrid.tsx`

On the outer `<section>`, add `id="recipes"`:

```tsx
<section id="recipes" className="max-w-6xl mx-auto px-6 py-16">
```

**Step 4: Verify**

- Press Tab on page load → skip link appears in top-left with terracotta background
- Press Enter → focus jumps to the recipe grid
- Tab away → skip link disappears
- Screen reader: `<section>` announces "Hero — Andrea's Kitchen"

**Step 5: Commit**

```bash
git add src/styles/globals.css src/components/layout/Hero.tsx src/components/recipes/RecipeGrid.tsx
git commit -m "feat(hero): add skip-to-content link and ARIA labels for a11y"
```

---

### Task 5: Verify build and Lighthouse basics

**Files:**
- No modifications — verification only

**Step 1: Run production build**

```bash
cd "/Users/andreaavila/Projects/Cooking Show" && npx next build
```

Expected: Build succeeds, no TypeScript errors, no warnings.

**Step 2: Check accessibility basics**

Open `http://localhost:3099` in Chrome.

Run Lighthouse (Accessibility category only):
- Expected: 90+ accessibility score
- Check: All text has sufficient contrast (espresso on cream = 14.1:1, cocoa on cream = 8.3:1)
- Check: Heading hierarchy is h1 → h2 (no skipped levels)
- Check: All SVGs have `aria-hidden="true"`
- Check: Skip link is functional

**Step 3: Test reduced motion**

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`

Expected:
- All Framer Motion animations complete instantly (Framer Motion respects reduced motion by default)
- No motion on the herb sprig SVG
- Page still looks correct with all elements visible

**Step 4: Commit (only if fixes were needed)**

```bash
git add -A
git commit -m "fix(hero): address Lighthouse/a11y findings"
```

---

## Summary

| Task | What it builds | Files touched | Risk |
|------|---------------|---------------|------|
| 1 | Static layout with all copy, herb sprig SVG, correct typography | `Hero.tsx` | None — pure markup |
| 2 | Framer Motion staggered entrance + SVG stroke draw | `Hero.tsx` | Low — Framer Motion already installed |
| 3 | Wood-grain depth + bottom fade to cream | `globals.css`, `Hero.tsx` | Cosmetic only |
| 4 | Skip-to-content, ARIA labels, recipe grid anchor | `globals.css`, `Hero.tsx`, `RecipeGrid.tsx` | None |
| 5 | Build verification + Lighthouse a11y check | None (verification) | None |

**Result:** A warm, editorial hero that immediately communicates "developer portfolio" through clear copy, with a distinctive cooking-show flavor via the wood-grain counter and herb sprig divider. Fully accessible, animated with restraint, and ready for the recipe cards below.
