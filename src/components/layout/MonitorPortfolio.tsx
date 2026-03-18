'use client'

/**
 * MonitorPortfolio — compact portfolio designed for the fixed DOM overlay (~520×380px).
 * Personalized with Andrea's identity: mexicana, F1 fan, sketch artist, builder.
 */

const projects = [
  {
    id: 'clara',
    num: '01',
    color: '#FF2D9B',
    title: 'CLARA — CIVICAID',
    subtitle: 'AI Voice Assistant',
    desc: 'Asistente IA multilingüe que conecta poblaciones vulnerables con trámites del gobierno. Voz + texto en 8 idiomas.',
    highlights: ['OdiseIA4Good 2026 — 300+ participantes', 'Líder de proyecto', '469+ tests automatizados'],
    tags: ['React', 'TypeScript', 'Python', 'Gemini', 'ElevenLabs'],
    links: [
      { label: 'demo', href: 'https://andreavilaro0.github.io/civicaid-voice/' },
      { label: 'code', href: 'https://github.com/Andreavilaro0/civicaid-voice' },
    ],
  },
  {
    id: 'photo',
    num: '02',
    color: '#00E5FF',
    title: 'CAPTURING MOMENTS',
    subtitle: 'Photography',
    desc: 'Portfolio editorial de street photography. Diseño responsive con animaciones scroll-based y galería dinámica.',
    highlights: [],
    tags: ['HTML/CSS', 'JavaScript', 'GSAP'],
    links: [
      { label: 'view', href: 'https://andreavilaro0.github.io/plantilla/' },
    ],
  },
  {
    id: 'robotics',
    num: '03',
    color: '#00E5FF',
    title: 'ASTI ROBOTICS',
    subtitle: 'Zumo 32U4',
    desc: 'Finalista nacional del ASTI Robotics Challenge. De 50+ equipos universitarios, clasificamos a la final.',
    highlights: ['Finalista nacional', 'Software del robot completo'],
    tags: ['C++', 'Arduino'],
    links: [
      { label: 'info', href: 'https://www.udit.es/proyectos-de-exito/tres-nuevos-equipos-de-estudiantes-de-udit-se-clasifican-para-la-final-del-asti-robotics-challenge/' },
    ],
  },
  {
    id: 'os',
    num: '04',
    color: '#7B2FFF',
    title: 'KERNEL SIM',
    subtitle: 'OS Simulation',
    desc: 'Simulación de SO con gestión de procesos y memoria. FIFO, SJF, Round Robin compitiendo en tiempo real.',
    highlights: [],
    tags: ['C', 'Sistemas'],
    links: [
      { label: 'code', href: 'https://github.com/gabrielcclv/SistemasOperativos' },
    ],
  },
]

const currently = [
  { icon: '🏎', text: 'F1 2026 season' },
  { icon: '✏️', text: 'Sketching ideas' },
  { icon: '🔧', text: 'Building this portfolio' },
  { icon: '🎧', text: 'Lo-fi + race commentary' },
]

const skills = [
  { name: 'React / Next.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'Python', level: 80 },
  { name: 'Three.js / R3F', level: 75 },
  { name: 'C++ / Arduino', level: 70 },
  { name: 'GSAP', level: 75 },
]

const channels = [
  { label: 'github', href: 'https://github.com/Andreavilaro0' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/andrea-avila-dev' },
  { label: 'email', href: 'mailto:andrea15one@icloud.com' },
]

export function MonitorPortfolio() {
  return (
    <div style={{
      width: '100%',
      padding: '20px 24px',
      fontFamily: 'var(--font-body)',
      color: '#1a1a1a',
      background: '#ffffff',
    }}>
      {/* Header */}
      <header style={{ marginBottom: '16px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          lineHeight: 1,
          margin: '0 0 4px 0',
          color: 'var(--color-text)',
        }}>
          ANDREA AVILA
        </h1>
        <p style={{
          fontFamily: 'var(--font-code)',
          fontSize: '10px',
          letterSpacing: '0.15em',
          color: 'var(--color-muted)',
          margin: 0,
          textTransform: 'uppercase',
        }}>
          Full Stack Developer — Madrid, Spain
        </p>
      </header>

      {/* About — personal */}
      <section style={{
        marginBottom: '14px',
        padding: '14px',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-border)',
      }}>
        <p style={{
          fontSize: '12px',
          lineHeight: 1.6,
          color: 'var(--color-muted)',
          margin: '0 0 10px 0',
        }}>
          Mexicana. Ingeniera. Builder. De gestionar un negocio familiar en
          Mexico a ganar hackathones y llegar a la final nacional de
          robotica en Madrid. Sketch my ideas before I code them.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { n: '4', s: 'o', label: 'Semestre' },
            { n: '10', s: '+', label: 'Tecnologias' },
            { n: '2028', s: '', label: 'Graduacion' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                color: 'var(--color-text)',
                lineHeight: 1,
              }}>
                {s.n}<span style={{ fontSize: '12px', color: 'var(--color-pink)' }}>{s.s}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: '8px',
                letterSpacing: '0.08em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Currently */}
      <section style={{
        marginBottom: '14px',
        padding: '10px 14px',
        background: 'rgba(26,26,26,0.03)',
        border: '1px solid rgba(26,26,26,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '8px',
          letterSpacing: '0.15em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          Currently
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {currently.map((c) => (
            <span key={c.text} style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: 'var(--color-text)',
            }}>
              {c.icon} {c.text}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '2px', background: 'var(--color-text)', marginBottom: '12px' }} />

      {/* Projects */}
      {projects.map((p) => (
        <section key={p.id} style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              letterSpacing: '0.1em',
              color: 'var(--color-muted)',
            }}>
              {p.num}
            </span>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: '8px',
              padding: '2px 8px',
              background: p.color,
              color: '#fff',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {p.subtitle}
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            lineHeight: 1.1,
            margin: '0 0 4px 0',
            color: 'var(--color-text)',
          }}>
            {p.title}
          </h2>

          <p style={{
            fontSize: '11px',
            lineHeight: 1.5,
            color: 'var(--color-muted)',
            margin: '0 0 6px 0',
          }}>
            {p.desc}
          </p>

          {p.highlights.length > 0 && (
            <div style={{ marginBottom: '6px' }}>
              {p.highlights.map((h) => (
                <div key={h} style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  color: 'var(--color-muted)',
                  lineHeight: 1.4,
                }}>
                  → {h}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
            {p.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: 'var(--font-code)',
                fontSize: '9px',
                padding: '2px 6px',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {p.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: '10px',
                  color: p.color,
                  textDecoration: 'none',
                }}
              >
                [{link.label}]
              </a>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--color-border)', marginTop: '12px', opacity: 0.2 }} />
        </section>
      ))}

      {/* Skills */}
      <section style={{ marginBottom: '14px' }}>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '8px',
          letterSpacing: '0.15em',
          color: 'var(--color-muted)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Stack
        </div>
        {skills.map((s) => (
          <div key={s.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: '9px',
              color: 'var(--color-text)',
              width: '110px',
              flexShrink: 0,
            }}>
              {s.name}
            </span>
            <div style={{
              flex: 1,
              height: '3px',
              background: 'rgba(26,26,26,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${s.level}%`,
                height: '100%',
                background: 'var(--color-pink)',
              }} />
            </div>
          </div>
        ))}
      </section>

      <div style={{ height: '2px', background: 'var(--color-text)', marginBottom: '12px' }} />

      {/* Contact */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: '8px',
            letterSpacing: '0.15em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}>
            Let&apos;s connect
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.label === 'email' ? undefined : '_blank'}
              rel={ch.label === 'email' ? undefined : 'noopener noreferrer'}
              style={{
                fontFamily: 'var(--font-code)',
                fontSize: '10px',
                color: 'var(--color-pink)',
                textDecoration: 'none',
              }}
            >
              [{ch.label}]
            </a>
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '9px',
          color: 'var(--color-muted)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <span>Madrid, Spain</span>
          <span>ES / EN</span>
          <span style={{ color: 'var(--color-lime)' }}>Open to work</span>
        </div>
      </section>
    </div>
  )
}
