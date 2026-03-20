# Next Step — Morning QA

## Quick Test
```bash
cd /Users/andreaavila/Documents/02-Freelance/marca-personal/pagina-web/portfolio
npm run dev
```

## What to Check
1. **Loading screen:** "mexicana · ingeniera · builder" tagline, rotating subtitles (developer, photographer, F1 fan, sketch artist, builder), gradient progress bar
2. **Click to enter:** Gate works, fade-out, then intro fly-in FROM THE FRONT of the desk
3. **Overview:** Clean desk, no floating spheres, dark atmospheric background, "← ARCADE" and "PORTFOLIO →" buttons, mode indicator bottom-right
4. **Portfolio (press 2):** Overlay with fade-in, personal story, "Currently" section, skills bars, scroll indicator
5. **Arcade (press 3):** Snake game on MacBook, contextual lighting dims
6. **Keyboard:** 1/2/3/Esc switch modes
7. **Orbit:** Drag in overview to orbit around desk

## Known Limitations
- Dust particles are very subtle in still images (better in motion)
- Background blobs are mostly hidden behind the 3D scene (visible at edges)
- Portfolio overlay is a DOM element, not "inside" the 3D monitor (trade-off for text legibility)
- Some desk objects (headphones, camera parts) may be partially visible as dark silhouettes

## What to Do Next
1. **Content:** Replace project descriptions with final copy, add project images
2. **GLB model:** In Blender, add personal items (F1 car, sketchbook, Mexican flag sticker)
3. **Deploy:** Push to Vercel, configure custom domain
4. **SEO:** Add OG image, structured data, sitemap

## Research Sources Used
- [Codrops shader backgrounds](https://tympanus.net/codrops/2024/10/31/how-to-code-a-subtle-shader-background-effect-with-react-three-fiber/)
- [2026 design trends](https://aigoodies.beehiiv.com/p/aesthetics-2026)
- [R3F particles](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)
- [Drei Environment docs](https://drei.docs.pmnd.rs/staging/environment)
- [GSAP showcase](https://gsap.com/showcase/)
- [Awwwards hero animations](https://www.awwwards.com/inspiration/hero-section-animations-mosey)
