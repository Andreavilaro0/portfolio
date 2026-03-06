'use client'

import { recipes } from '@/data/recipes'

export function ProjectsSection() {
  return (
    <section
      style={{
        width: '100%',
        padding: 'clamp(64px, 12vh, 120px) clamp(32px, 6vw, 96px)',
        background: '#0a0a0a',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-code)',
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '48px',
        }}
      >
        Projects
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {recipes.map((recipe, i) => (
          <a
            key={recipe.slug}
            href={`/recipe/${recipe.slug}`}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '24px',
              padding: '24px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {/* Number */}
            <span
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.2)',
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Title */}
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: 700,
                color: '#fff',
                flex: 1,
              }}
            >
              {recipe.title}
            </span>

            {/* Category */}
            <span
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.05em',
                flexShrink: 0,
                textAlign: 'right',
              }}
            >
              {recipe.category}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
