# Arcade Second Screen — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrar 3 minijuegos (Breakout, Pong, Tetris) en la segunda pantalla (MacBook) del portfolio 3D, creando una experiencia de arcade coherente con attract mode.

**Architecture:** Los juegos se portan como componentes React independientes (no iframes), embebidos en un Arcade launcher que se renderiza en el overlay de la segunda pantalla. Un attract mode rota demos automáticamente cuando no hay interacción.

**Tech Stack:** React 19, Canvas2D, Next.js 16, TypeScript

---

## Análisis de repos (Fase 1 completada)

### Mac-OS-Desktop
- Vanilla HTML/CSS/JS, jQuery, 2557 líneas total
- Apps se abren como divs con class toggles
- **NO lo usamos como base** — nuestro portfolio ya tiene su propio sistema. Solo tomamos inspiración visual del dock/launcher.

### html-css-javascript-games
- 37 juegos, cada uno es `index.html + script.js + style.css`
- Todos usan Canvas2D — perfecto para embedding en React

### Juegos seleccionados (3):
1. **Breakout** (18-Breakout-Game) — Canvas, 1 file JS, visual limpio, buen attract mode
2. **Pong** (19-Ping-Pong-Game) — Canvas, controles simples, ideal para demo automático
3. **Tetris** (20-Tetris-Game) — Canvas, grid-based, icónico, buen idle visual

**Justificación:** Los 3 son arcade clásicos que se ven bien en pantalla pequeña, usan Canvas (no DOM text que no funciona en drei), y tienen gameplay visual que sirve como attract mode.

---

## Plan técnico

### Archivos a crear:
```
src/components/arcade/
  ArcadeLauncher.tsx     — launcher con selector de juegos
  ArcadeBreakout.tsx     — port de Breakout como componente React
  ArcadePong.tsx         — port de Pong como componente React
  ArcadeTetris.tsx       — port de Tetris como componente React
  ArcadeAttractMode.tsx  — rota juegos en modo demo automático
```

### Archivos a modificar:
```
src/components/experience/ExperienceWrapper.tsx  — reemplazar SnakeGame por ArcadeLauncher en el overlay de la segunda pantalla
```

### Archivos a eliminar:
```
src/components/layout/SnakeGame.tsx  — reemplazado por el sistema de arcade
```

---

## Fases de implementación

### Fase 1: Port de juegos a React ✓ (análisis hecho)

### Fase 2: Crear componentes de juegos
- Portar cada juego de vanilla JS a un componente React con useRef + useEffect + Canvas
- Cada juego acepta `active: boolean` y `demoMode: boolean` props
- En demoMode, el juego se juega solo (AI simple)

### Fase 3: Crear ArcadeLauncher
- Grid de 3 juegos con íconos/previews
- Click para jugar
- Botón "Back" para volver al launcher
- Estado idle: si no hay interacción en 10s, entrar en attract mode

### Fase 4: Crear ArcadeAttractMode
- Rota entre los 3 juegos cada 15 segundos
- Cada juego corre en demoMode (AI juega)
- Click/touch sale del attract mode y muestra el launcher

### Fase 5: Integrar en ExperienceWrapper
- Reemplazar SnakeGame por ArcadeLauncher en el overlay de la segunda pantalla
- Mantener el mismo fade-in/fade-out
- El arcade siempre muestra contenido (launcher o juego o attract mode)

### Fase 6: Pulido y verificación
- Estilos coherentes con el tema del portfolio (colores: pink, lime, violet)
- Sin scrollbars, sin cortes, sin parpadeos
- Verificar con Playwright en diferentes tamaños
