'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'

const SKETCHES = [
  { img: '/sketches/sketch-clara.png',    title: 'CLARA — CivicAid',   sub: 'React + Flask + Gemini 2.5', projectId: 'clara' },
  { img: '/sketches/sketch-photo.png',    title: 'Capturing Moments',  sub: 'Vite + GSAP + Tailwind',     projectId: 'photo' },
  { img: '/sketches/sketch-robotics.png', title: 'Zumo 32U4 Robot',    sub: 'C++ + Arduino + 3D Print',   projectId: 'robotics' },
  { img: '/sketches/sketch-todo.png',     title: 'Task Dashboard',     sub: 'React 19 + localStorage',    projectId: 'todo' },
  { img: '/sketches/sketch-os.png',       title: 'Kernel Sim',         sub: 'C + gcc + Linux',            projectId: 'os' },
]

// Handwriting fonts
const HW_FONTS = ['Caveat', 'Indie Flower', 'Nothing You Could Do', 'Reenie Beanie', 'Shadows Into Light']

function seededRand(s: number) {
  const x = Math.sin(s) * 10000
  return x - Math.floor(x)
}

function renderHandwriting(text: string, seed: number): string {
  let html = ''
  let s = seed
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') { html += ' '; continue }
    s++
    const f = HW_FONTS[Math.floor(seededRand(s) * HW_FONTS.length)]
    const r = (seededRand(s + 99) - 0.5) * 7
    const y = (seededRand(s + 199) - 0.5) * 2
    html += `<span style="display:inline-block;font-family:'${f}',cursive;transform:rotate(${r.toFixed(1)}deg) translateY(${y.toFixed(1)}px)">${text[i]}</span>`
  }
  return html
}

// Sketch page annotations per project
const ANNOTATIONS: Record<string, Array<{ text: string; style: React.CSSProperties; seed: number }>> = {
  clara: [
    { text: 'hackathon winner!', style: { top: '3%', left: '5%', color: 'rgba(180,40,40,0.6)', fontSize: '20px' }, seed: 10 },
    { text: 'WhatsApp first', style: { bottom: '8%', left: '5%', color: 'rgba(40,40,150,0.45)', fontSize: '13px' }, seed: 20 },
  ],
  photo: [
    { text: 'no framework!!', style: { top: '3%', right: '5%', color: 'rgba(180,40,40,0.6)', fontSize: '18px' }, seed: 40 },
    { text: 'GSAP + Lenis', style: { bottom: '6%', left: '5%', color: 'rgba(40,40,150,0.45)', fontSize: '12px' }, seed: 50 },
  ],
  robotics: [
    { text: 'finalista nacional!', style: { top: '3%', left: '5%', color: 'rgba(180,40,40,0.6)', fontSize: '20px' }, seed: 70 },
    { text: 'Pololu 3126 · 75:1HP', style: { bottom: '5%', left: '5%', color: 'rgba(40,120,40,0.4)', fontSize: '11px' }, seed: 90 },
  ],
  todo: [
    { text: '12 widgets!', style: { top: '3%', left: '5%', color: 'rgba(180,40,40,0.6)', fontSize: '20px' }, seed: 100 },
    { text: 'no backend needed', style: { bottom: '6%', right: '5%', color: 'rgba(40,40,150,0.45)', fontSize: '13px' }, seed: 110 },
  ],
  os: [
    { text: 'round robin scheduler', style: { top: '3%', left: '5%', color: 'rgba(180,40,40,0.6)', fontSize: '18px' }, seed: 130 },
    { text: 'escrito en C puro', style: { bottom: '5%', right: '5%', color: 'rgba(40,120,40,0.4)', fontSize: '12px' }, seed: 150 },
  ],
}

function buildPageHTML(sketch: typeof SKETCHES[0], pageNum: number): string {
  const annotations = ANNOTATIONS[sketch.projectId] || []
  const annotHTML = annotations.map(a => {
    const styleStr = Object.entries(a.style).map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${prop}:${v}`
    }).join(';')
    return `<div style="position:absolute;${styleStr};pointer-events:none;z-index:3;line-height:1.3">${renderHandwriting(a.text, a.seed)}</div>`
  }).join('')

  return `<div style="position:relative;width:100%;height:100%;overflow:hidden">
    <img src="${sketch.img}" alt="${sketch.title}" draggable="false" style="width:100%;height:100%;object-fit:cover;display:block">
    ${annotHTML}
    <div style="position:absolute;bottom:8px;right:12px;font-family:'Caveat',cursive;font-size:12px;color:rgba(0,0,0,0.12);z-index:5">${pageNum}</div>
  </div>`
}

interface SketchbookViewerProps {
  onClose: () => void
  onProjectSelect: (projectId: string) => void
}

export function SketchbookViewer({ onClose, onProjectSelect }: SketchbookViewerProps) {
  const bookRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const flapContentRef = useRef<HTMLDivElement>(null)
  const foldGradientRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    width: 0, height: 0, pageWidth: 0, spineX: 0, diagonal: 0,
    leftIndex: 0, activeSide: null as string | null, activeCorner: null as number[] | null,
    isDragging: false, cornerThreshold: 100,
  })
  const [currentTitle, setCurrentTitle] = useState('Sketchbook')
  const [currentSub, setCurrentSub] = useState('')
  const [showInstructions, setShowInstructions] = useState(true)
  const pagesRef = useRef<string[]>([])

  // Build pages array
  useEffect(() => {
    const p: string[] = []
    // Cover
    p.push(`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:#3d2510;position:relative">
      <div style="position:absolute;inset:12px;border:2px solid rgba(201,168,76,0.25);pointer-events:none"></div>
      <div style="font-family:'Caveat',cursive;font-size:38px;color:#c9a84c;text-shadow:0 2px 4px rgba(0,0,0,0.3)">Andrea Avila</div>
      <div style="width:50px;height:2px;background:rgba(201,168,76,0.3);margin:12px 0"></div>
      <div style="font-family:'Caveat',cursive;font-size:18px;color:rgba(201,168,76,0.4)">sketchbook</div>
    </div>`)
    // Blank page
    p.push(`<div style="height:100%;display:flex;align-items:center;justify-content:center">
      <div style="font-family:'Caveat',cursive;font-size:16px;color:rgba(0,0,0,0.1);transform:rotate(-2deg)">project planning notes · 2025-2026</div>
    </div>`)
    // Sketch pages
    SKETCHES.forEach((sk, i) => p.push(buildPageHTML(sk, i + 1)))
    // Pad to even
    if (p.length % 2 !== 0) p.push('<div style="height:100%"></div>')
    // Back cover
    p.push(`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#3d2510">
      <div style="font-family:'Caveat',cursive;font-size:18px;color:rgba(201,168,76,0.3)">fin</div>
    </div>`)
    if (p.length % 2 !== 0) p.push('<div style="height:100%;background:#3d2510"></div>')
    pagesRef.current = p
  }, [])

  const renderPages = useCallback(() => {
    const s = stateRef.current
    const pages = pagesRef.current
    const leftFront = document.getElementById('sb-left-front')
    const rightFront = document.getElementById('sb-right-front')
    if (leftFront) {
      leftFront.innerHTML = pages[s.leftIndex] || ''
      leftFront.style.display = s.leftIndex < 0 ? 'none' : 'block'
    }
    if (rightFront) {
      rightFront.innerHTML = pages[s.leftIndex + 1] || ''
      rightFront.style.display = s.leftIndex + 1 >= pages.length ? 'none' : 'block'
    }
    // Update title
    const sketchIdx = Math.floor((s.leftIndex - 2))
    if (sketchIdx >= 0 && sketchIdx < SKETCHES.length) {
      setCurrentTitle(SKETCHES[sketchIdx].title)
      setCurrentSub(SKETCHES[sketchIdx].sub)
    } else if (s.leftIndex + 1 < pages.length && s.leftIndex >= 2) {
      const rightIdx = s.leftIndex - 1
      if (rightIdx >= 0 && rightIdx < SKETCHES.length) {
        setCurrentTitle(SKETCHES[rightIdx].title)
        setCurrentSub(SKETCHES[rightIdx].sub)
      }
    } else {
      setCurrentTitle('Sketchbook')
      setCurrentSub('drag a corner to flip')
    }
  }, [])

  // Page flip engine
  useEffect(() => {
    const book = bookRef.current
    const flap = flapRef.current
    const flapContent = flapContentRef.current
    const foldGradient = foldGradientRef.current
    if (!book || !flap || !flapContent || !foldGradient) return

    const s = stateRef.current
    const pages = pagesRef.current

    function handleResize() {
      const rect = book!.getBoundingClientRect()
      s.width = rect.width; s.height = rect.height
      s.pageWidth = rect.width / 2; s.spineX = s.pageWidth
      s.diagonal = Math.sqrt(s.pageWidth ** 2 + s.height ** 2)
      if (!s.isDragging) renderPages()
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(book)

    function clipPolygon(points: number[][], a: number, b: number, c: number, keepInside: boolean) {
      const result: number[][] = []
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i], p2 = points[(i + 1) % points.length]
        const d1 = a * p1[0] + b * p1[1] + c
        const d2 = a * p2[0] + b * p2[1] + c
        const in1 = keepInside ? d1 <= 0 : d1 > 0
        const in2 = keepInside ? d2 <= 0 : d2 > 0
        if (in1) result.push(p1)
        if (in1 !== in2) {
          const t = d1 / (d1 - d2)
          result.push([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])])
        }
      }
      return result
    }

    function reflectPoint(p: number[], a: number, b: number, c: number) {
      const d = (a * p[0] + b * p[1] + c) / (a * a + b * b)
      return [p[0] - 2 * d * a, p[1] - 2 * d * b]
    }

    function toClipPath(points: number[][]) {
      if (points.length === 0) return 'polygon(0 0)'
      return 'polygon(' + points.map(p => `${p[0]}px ${p[1]}px`).join(', ') + ')'
    }

    function constrainPoint(mx: number, my: number): [number, number] {
      let x = mx, y = my
      for (let i = 0; i < 3; i++) {
        const c1y = s.activeCorner![1]
        let dx1 = x - s.spineX, dy1 = y - c1y
        let dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
        if (dist1 > s.pageWidth) { x = s.spineX + (dx1 / dist1) * s.pageWidth; y = c1y + (dy1 / dist1) * s.pageWidth }
        const c2y = s.activeCorner![1] === 0 ? s.height : 0
        let dx2 = x - s.spineX, dy2 = y - c2y
        let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        if (dist2 > s.diagonal) { x = s.spineX + (dx2 / dist2) * s.diagonal; y = c2y + (dy2 / dist2) * s.diagonal }
      }
      return [x, y]
    }

    function updateFold(X: number, Y: number) {
      if (X === s.activeCorner![0] && Y === s.activeCorner![1]) return
      const [mx, my] = constrainPoint(X, Y)
      const frontPage = document.getElementById(`sb-${s.activeSide}-front`)!
      const a = s.activeCorner![0] - mx, b = s.activeCorner![1] - my
      const midx = (s.activeCorner![0] + mx) / 2, midy = (s.activeCorner![1] + my) / 2
      const c = -(a * midx + b * midy)

      let basePage: number[][], p1f: number[], p2f: number[], shiftX: number
      if (s.activeSide === 'right') {
        basePage = [[s.pageWidth, 0], [s.pageWidth, s.height], [s.width, s.height], [s.width, 0]]
        p1f = [s.width, 0]; p2f = [s.pageWidth, 0]; shiftX = s.pageWidth
      } else {
        basePage = [[0, 0], [0, s.height], [s.pageWidth, s.height], [s.pageWidth, 0]]
        p1f = [s.pageWidth, 0]; p2f = [0, 0]; shiftX = 0
      }

      frontPage.style.clipPath = toClipPath(clipPolygon(basePage, a, b, c, true).map(p => [p[0] - shiftX, p[1]]))
      flap!.style.clipPath = toClipPath(clipPolygon(basePage, a, b, c, false).map(p => reflectPoint(p, a, b, c)))

      const p1flap = reflectPoint(p1f, a, b, c)
      const p2flap = reflectPoint(p2f, a, b, c)
      const angleRot = Math.atan2(p2flap[1] - p1flap[1], p2flap[0] - p1flap[0])
      flapContent!.style.transformOrigin = '0 0'
      flapContent!.style.transform = `translate(${p1flap[0]}px, ${p1flap[1]}px) rotate(${angleRot}rad)`

      const dxG = mx - s.activeCorner![0], dyG = my - s.activeCorner![1]
      foldGradient!.style.transform = `translate(${midx}px, ${midy}px) rotate(${Math.atan2(dyG, dxG)}rad)`
      foldGradient!.style.opacity = String(Math.sin(Math.abs(mx - s.activeCorner![0]) / s.width * Math.PI).toFixed(3))
    }

    function startDrag(side: string, corner: number[], x: number, y: number) {
      s.activeSide = side; s.activeCorner = corner; s.isDragging = true
      setShowInstructions(false)
      flap!.style.display = 'block'
      const leftUnder = document.getElementById('sb-left-under')!
      const rightUnder = document.getElementById('sb-right-under')!
      if (side === 'right') {
        rightUnder.innerHTML = pages[s.leftIndex + 3] || ''
        flapContent!.innerHTML = pages[s.leftIndex + 2] || ''
        flapContent!.className = 'sb-flap-content is-left'
      } else {
        leftUnder.innerHTML = pages[s.leftIndex - 2] || ''
        flapContent!.innerHTML = pages[s.leftIndex - 1] || ''
        flapContent!.className = 'sb-flap-content is-right'
      }
      updateFold(x, y)
    }

    function onPointerDown(e: PointerEvent) {
      const rect = book!.getBoundingClientRect()
      const x = e.clientX - rect.left, y = e.clientY - rect.top
      const TH = s.cornerThreshold
      book!.setPointerCapture(e.pointerId)

      if (x > s.width - TH && y < TH && s.leftIndex + 1 < pages.length - 1)
        startDrag('right', [s.width, 0], x, y)
      else if (x > s.width - TH && y > s.height - TH && s.leftIndex + 1 < pages.length - 1)
        startDrag('right', [s.width, s.height], x, y)
      else if (x < TH && y < TH && s.leftIndex > 0)
        startDrag('left', [0, 0], x, y)
      else if (x < TH && y > s.height - TH && s.leftIndex > 0)
        startDrag('left', [0, s.height], x, y)
    }

    function onPointerMove(e: PointerEvent) {
      if (!s.isDragging) return
      const rect = book!.getBoundingClientRect()
      updateFold(e.clientX - rect.left, e.clientY - rect.top)
    }

    function onPointerUp(e: PointerEvent) {
      if (!s.isDragging) return
      s.isDragging = false
      const rect = book!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const isComplete = (s.activeSide === 'right' && x < s.width / 2 + 100) || (s.activeSide === 'left' && x > s.width / 2 - 100)
      const targetX = isComplete ? (s.activeSide === 'right' ? 0 : s.width) : s.activeCorner![0]
      const targetY = s.activeCorner![1]
      const startX = x, startY = e.clientY - rect.top, startTime = performance.now()

      function animate(time: number) {
        let progress = Math.min((time - startTime) / 300, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        updateFold(startX + (targetX - startX) * ease, startY + (targetY - startY) * ease)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          flap!.style.display = 'none'
          document.getElementById(`sb-${s.activeSide}-front`)!.style.clipPath = 'none'
          if (isComplete) {
            s.leftIndex += s.activeSide === 'right' ? 2 : -2
            renderPages()
          }
          s.activeSide = null
        }
      }
      requestAnimationFrame(animate)
    }

    book.addEventListener('pointerdown', onPointerDown)
    book.addEventListener('pointermove', onPointerMove)
    book.addEventListener('pointerup', onPointerUp)

    // Keyboard nav
    function onKeyDown(e: KeyboardEvent) {
      if (s.isDragging) return
      if (e.key === 'ArrowRight' && s.leftIndex + 1 < pages.length - 1) {
        e.preventDefault()
        startDrag('right', [s.width, s.height], s.width, s.height)
        const st = performance.now()
        function anim(t: number) {
          const p = Math.min((t - st) / 500, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          updateFold(s.width * (1 - ease), s.height * (1 - ease * 0.3))
          if (p < 1) requestAnimationFrame(anim)
          else {
            if (flap) flap.style.display = 'none'
            const rf = document.getElementById('sb-right-front')
            if (rf) rf.style.clipPath = 'none'
            s.leftIndex += 2; s.isDragging = false; s.activeSide = null
            renderPages()
          }
        }
        requestAnimationFrame(anim)
      }
      if (e.key === 'ArrowLeft' && s.leftIndex > 0) {
        e.preventDefault()
        startDrag('left', [0, s.height], 0, s.height)
        const st = performance.now()
        function anim(t: number) {
          const p = Math.min((t - st) / 500, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          updateFold(s.width * ease, s.height * (1 - ease * 0.3))
          if (p < 1) requestAnimationFrame(anim)
          else {
            if (flap) flap.style.display = 'none'
            const lf = document.getElementById('sb-left-front')
            if (lf) lf.style.clipPath = 'none'
            s.leftIndex -= 2; s.isDragging = false; s.activeSide = null
            renderPages()
          }
        }
        requestAnimationFrame(anim)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      ro.disconnect()
      book.removeEventListener('pointerdown', onPointerDown)
      book.removeEventListener('pointermove', onPointerMove)
      book.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [renderPages])

  // Entry animation
  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1, ease: 'expo.out' }
    )
  }, [])

  // Auto-dismiss instructions after first page flip or 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  const pageStyle: React.CSSProperties = {
    position: 'absolute', top: 0, boxSizing: 'border-box',
    backgroundColor: '#f5f0e6', userSelect: 'none', overflow: 'hidden',
    backgroundImage: `
      linear-gradient(rgba(140,160,180,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(140,160,180,0.07) 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 30,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
        pointerEvents: 'auto', opacity: 0,
      }}
    >
      {/* Book */}
      <div
        ref={bookRef}
        id="sb-book"
        style={{
          width: 'min(1000px, 90vw)', height: 'min(75vh, 700px)',
          position: 'relative', background: '#f5f0e6',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)',
          cursor: 'grab', touchAction: 'none', borderRadius: '2px',
        }}
      >
        <div id="sb-left-under" style={{ ...pageStyle, left: 0, width: '50%', height: '100%',
          backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.10) 0%, transparent 8%), ${pageStyle.backgroundImage}` }} />
        <div id="sb-right-under" style={{ ...pageStyle, left: '50%', width: '50%', height: '100%',
          borderLeft: '1px solid #d8d0c4',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.10) 0%, transparent 8%), ${pageStyle.backgroundImage}` }} />
        <div id="sb-left-front" style={{ ...pageStyle, left: 0, width: '50%', height: '100%', zIndex: 2,
          backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.10) 0%, transparent 8%), ${pageStyle.backgroundImage}` }} />
        <div id="sb-right-front" style={{ ...pageStyle, left: '50%', width: '50%', height: '100%', zIndex: 2,
          borderLeft: '1px solid #d8d0c4',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.10) 0%, transparent 8%), ${pageStyle.backgroundImage}` }} />
        <div ref={flapRef} style={{
          width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5,
          filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.4))', pointerEvents: 'none', display: 'none',
        }}>
          <div ref={flapContentRef} className="sb-flap-content" style={{
            width: '50%', height: '100%', position: 'absolute', top: 0, left: 0,
            boxSizing: 'border-box', backgroundColor: '#f5f0e6', overflow: 'hidden',
          }} />
          <div ref={foldGradientRef} style={{
            position: 'absolute', width: '300%', height: '300%', left: '-150%', top: '-150%',
            background: 'linear-gradient(to right, transparent 49.5%, rgba(0,0,0,0.25) 50%, rgba(255,255,255,0.6) 51.5%, rgba(0,0,0,0.04) 58%, transparent 65%)',
          }} />
        </div>

        {/* Corner drag indicators — pulsing triangles at draggable corners */}
        {showInstructions && (
          <>
            {/* Top-right corner */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 40, height: 40, zIndex: 10,
              background: 'linear-gradient(225deg, rgba(0,0,0,0.15) 0%, transparent 60%)',
              borderBottomLeftRadius: '100%',
              animation: 'cornerPulse 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            {/* Bottom-right corner */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, zIndex: 10,
              background: 'linear-gradient(315deg, rgba(0,0,0,0.15) 0%, transparent 60%)',
              borderTopLeftRadius: '100%',
              animation: 'cornerPulse 2s ease-in-out 0.5s infinite',
              pointerEvents: 'none',
            }} />
            {/* Top-left corner */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 40, height: 40, zIndex: 10,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 60%)',
              borderBottomRightRadius: '100%',
              animation: 'cornerPulse 2s ease-in-out 1s infinite',
              pointerEvents: 'none',
            }} />
            {/* Bottom-left corner */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, zIndex: 10,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.15) 0%, transparent 60%)',
              borderTopRightRadius: '100%',
              animation: 'cornerPulse 2s ease-in-out 1.5s infinite',
              pointerEvents: 'none',
            }} />
          </>
        )}

        {/* Instruction overlay — centered on the book */}
        {showInstructions && (
          <div
            onClick={() => setShowInstructions(false)}
            style={{
              position: 'absolute', inset: 0, zIndex: 15,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '2px',
              cursor: 'pointer',
              animation: 'instrFadeIn 0.5s ease both',
            }}
          >
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '28px',
              color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: '12px',
            }}>
              Drag a corner to flip pages
            </div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              display: 'flex', gap: '20px', alignItems: 'center',
            }}>
              <span style={{
                padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '3px',
                fontSize: '11px',
              }}>← →</span>
              <span>arrow keys</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{
                padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '3px',
                fontSize: '11px',
              }}>ESC</span>
              <span>close</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '16px',
              letterSpacing: '0.05em',
            }}>
              click anywhere to dismiss
            </div>
          </div>
        )}
      </div>

      {/* Info + Back button */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: '22px', color: 'rgba(255,255,255,0.7)' }}>
          {currentTitle}
        </div>
        {currentSub && (
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '4px' }}>
            {currentSub}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'var(--font-code)', fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase' as const, padding: '10px 24px',
          color: '#00FFC8', background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(8px)', border: '1px solid #00FFC8',
          borderRadius: '2px', cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 200, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(10, 10, 10, 0.9)'
        }}
      >
        esc — back to desk
      </button>

      <style>{`
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes instrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
