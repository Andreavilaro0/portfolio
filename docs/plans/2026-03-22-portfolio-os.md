# Portfolio OS — Implementation Plan

> Terminal boot → auto-installs → opens desktop OS with portfolio as app

## Concept

The monitor in the 3D scene shows a terminal. The user watches as `sudo apt install andrea-portfolio` runs. After installation completes, the terminal auto-launches a desktop OS where the portfolio lives as an application. The OS has a Finder (projects as files), Terminal (interactive), and the portfolio web app as a "window".

## Flow

```
1. Camera arrives at monitor (mode: seated)
   → postMessage({type: 'boot'}) to iframe

2. Terminal boot sequence (already built in HeroBoot.tsx)
   → sudo apt install andrea-portfolio
   → Progress bar, fast package download
   → Info reveal (name, stack, tools)
   → "Do you want to explore? [Y/n] y"
   → "Starting portfolio OS..."

3. Transition: terminal fades out → desktop OS fades in
   → Desktop wallpaper (dark, with subtle circuit pattern)
   → Dock at bottom with app icons
   → Auto-opens the Portfolio "app" as a window

4. Desktop OS features:
   → Draggable windows with close/minimize/maximize
   → Finder: navigate Projects/, About/, Contact/ as folders
   → Terminal: real commands (ls, cat, cd, help)
   → Portfolio app: the actual portfolio content (projects, about, contact)
   → All styled with dark theme + accent colors (pink, violet, lime, cyan)
```

## Technical Approach

Keep the vanilla HTML/CSS/JS from the CodePen as-is (jQuery-based). Adapt it:

### Filesystem structure
```
/
├── Projects/
│   ├── clara-civicaid/
│   │   └── README.md     → project description + links
│   ├── capturing-moments/
│   │   └── README.md
│   ├── asti-robotics/
│   │   └── README.md
│   ├── task-dashboard/
│   │   └── README.md
│   └── kernel-sim/
│       └── README.md
├── About/
│   └── andrea.txt        → bio text
├── Contact/
│   └── email.txt         → contact info
├── Skills/
│   └── stack.txt         → tech stack list
└── cv.pdf                → link to CV
```

### Terminal commands
- `ls` — list files/folders
- `cd Projects` — navigate
- `cat README.md` — read project info
- `help` — show available commands
- `open portfolio` — opens the portfolio web app window
- `whoami` — shows neofetch-style info
- `clear` — clear terminal

### Desktop elements
- Wallpaper: dark (#08080c) with CircuitBackground animation
- Dock: Terminal, Finder, Portfolio, GitHub (external link)
- Windows: dark theme (#111118 bg, rgba borders)
- Traffic lights: red/yellow/green (already have this styling)

### Files to create/modify
- Create: `public/portfolio-os/index.html` — the OS page
- Create: `public/portfolio-os/style.css` — dark theme styles
- Create: `public/portfolio-os/app.js` — adapted from CodePen + custom
- Modify: `HeroBoot.tsx` — after boot, redirect to /portfolio-os
- Modify: `DeskScene.tsx` — iframe points to /portfolio-os after boot

### Integration with 3D scene
- iframe loads `/portfolio-os`
- On load: shows terminal boot (HeroBoot logic moved to vanilla JS)
- After boot: transitions to desktop OS
- Portfolio "app" window contains the actual PortfolioContent (projects, about, contact) as an iframe-within-iframe OR as vanilla HTML

### Key decisions
- Keep jQuery for the OS (it's proven, the CodePen works)
- The portfolio content inside the OS window can be:
  a) Vanilla HTML version of the portfolio (simpler, faster)
  b) iframe to /portfolio (React version, but iframe-in-iframe)
  → Recommend (a) for performance

### Colors/theme adaptation
```css
:root {
  --os-bg: #08080c;
  --os-surface: #111118;
  --os-text: #e8e6e3;
  --os-muted: #6B6B7B;
  --os-pink: #FF2D9B;
  --os-violet: #7B2FFF;
  --os-lime: #BEFF00;
  --os-cyan: #00E5FF;
  --os-border: rgba(255,255,255,0.08);
}
```

## Execution

1. Create the OS page with dark theme
2. Adapt filesystem to Andrea's content
3. Implement terminal with custom commands
4. Add boot sequence (port from HeroBoot)
5. Auto-transition from boot to desktop
6. Auto-open portfolio app window
7. Connect to 3D scene iframe
8. Test and polish
