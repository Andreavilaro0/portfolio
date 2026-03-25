import { HandDrawnLine } from './HandDrawnLine'

const SKILLS = [
  { label: 'React', rotation: -2, size: '1.4rem', style: 'underline' as const },
  { label: 'TypeScript', rotation: 3, size: '1.2rem', style: 'circled' as const },
  { label: 'Python', rotation: -1, size: '1.5rem', style: 'check' as const },
  { label: 'Three.js', rotation: 4, size: '1.3rem', style: 'underline' as const },
  { label: 'C++', rotation: -3, size: '1.1rem', style: 'circled' as const },
  { label: 'GSAP', rotation: 2, size: '1.2rem', style: 'check' as const },
  { label: 'Next.js', rotation: -2, size: '1.4rem', style: 'check' as const },
  { label: 'Tailwind', rotation: 1, size: '1.1rem', style: 'underline' as const },
  { label: 'Node.js', rotation: -4, size: '1.3rem', style: 'check' as const },
  { label: 'Arduino', rotation: 3, size: '1.1rem', style: 'circled' as const },
  { label: 'Figma', rotation: -1, size: '1.2rem', style: 'check' as const },
  { label: 'Blender', rotation: 2, size: '1.3rem', style: 'underline' as const },
  { label: 'Git', rotation: -3, size: '1rem', style: 'check' as const },
]

export function Marquee() {
  return (
    <div
      style={{
        background: '#F0E8D8',
        padding: 'clamp(32px, 5vh, 56px) clamp(24px, 6vw, 80px)',
        position: 'relative',
      }}
    >
      {/* Top hand-drawn line */}
      <HandDrawnLine variant={0} opacity={0.25} color="var(--color-border)" />

      {/* Handwritten heading */}
      <p
        style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          fontWeight: 600,
          color: 'var(--color-muted)',
          margin: '16px 0 20px',
          textAlign: 'center',
        }}
      >
        cosas que s&eacute; hacer:
      </p>

      {/* Scattered skill labels */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(10px, 2vw, 20px)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {SKILLS.map((skill) => (
          <span
            key={skill.label}
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: skill.size,
              fontWeight: 600,
              color: 'var(--color-pencil)',
              transform: `rotate(${skill.rotation}deg)`,
              display: 'inline-block',
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              ...(skill.style === 'circled'
                ? {
                    border: '2px solid var(--color-pencil)',
                    borderRadius: '50%',
                    padding: '4px 14px',
                  }
                : {}),
              ...(skill.style === 'underline'
                ? {
                    textDecoration: 'underline',
                    textDecorationStyle: 'wavy' as const,
                    textUnderlineOffset: '4px',
                    textDecorationColor: 'var(--color-border)',
                  }
                : {}),
              ...(skill.style === 'check'
                ? {}
                : {}),
            }}
          >
            {skill.style === 'check' ? '✓ ' : ''}{skill.label}
          </span>
        ))}
      </div>

      {/* Blueprint annotation */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--color-muted)',
          }}
        >
          ← 3+ a&ntilde;os →
        </span>
      </div>

      {/* Bottom hand-drawn line */}
      <div style={{ marginTop: '16px' }}>
        <HandDrawnLine variant={2} opacity={0.25} color="var(--color-border)" />
      </div>
    </div>
  )
}
