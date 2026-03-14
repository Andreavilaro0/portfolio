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
