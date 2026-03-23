'use client'

import { useMemo } from 'react'
import contributionsData from '@/data/github-contributions.json'

const CELL_SIZE = 16
const GAP = 3
const COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(0,229,255,0.2)',
  'rgba(0,229,255,0.35)',
  'rgba(0,229,255,0.55)',
  'rgba(0,229,255,0.85)',
]

function getLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 10) return 3
  return 4
}

export function GitHubCalendar() {
  const data = contributionsData as Record<string, number>

  const { weeks, months, totalContributions, streak, maxDay } = useMemo(() => {
    const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
    const last364 = entries.slice(-364)

    const weeks: { date: string; count: number; level: number }[][] = []
    let currentWeek: { date: string; count: number; level: number }[] = []

    let total = 0
    let maxDay = { date: '', count: 0 }
    let currentStreak = 0
    let bestStreak = 0

    last364.forEach(([date, count]) => {
      total += count
      if (count > maxDay.count) maxDay = { date, count }
      if (count > 0) { currentStreak++; bestStreak = Math.max(bestStreak, currentStreak) }
      else currentStreak = 0

      const day = new Date(date).getDay()
      if (day === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push({ date, count, level: getLevel(count) })
    })
    if (currentWeek.length) weeks.push(currentWeek)

    const months: { label: string; col: number }[] = []
    let lastMonth = ''
    weeks.forEach((week, i) => {
      const date = new Date(week[0].date)
      const month = date.toLocaleString('en', { month: 'short' })
      if (month !== lastMonth) {
        months.push({ label: month, col: i })
        lastMonth = month
      }
    })

    return { weeks, months, totalContributions: total, streak: bestStreak, maxDay }
  }, [data])

  const width = weeks.length * (CELL_SIZE + GAP) + 40
  const height = 7 * (CELL_SIZE + GAP) + 28

  return (
    <div>
      {/* Header with stats */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 900,
            color: '#fff',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#00E5FF' }}>{totalContributions}</span> contributions
          </h3>
          <a
            href="https://github.com/Andreavilaro0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '13px',
              color: '#00E5FF',
              textDecoration: 'none',
            }}
          >
            @Andreavilaro0 ↗
          </a>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#BEFF00',
            }}>
              {streak}
            </div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Best streak
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#FF2D9B',
            }}>
              {maxDay.count}
            </div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Max/day
            </div>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* Month labels */}
          {months.map((m) => (
            <text
              key={m.label + m.col}
              x={40 + m.col * (CELL_SIZE + GAP)}
              y={12}
              fill="rgba(255,255,255,0.3)"
              fontSize="11"
              fontFamily="var(--font-code)"
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {['Mon', 'Wed', 'Fri'].map((day, i) => (
            <text
              key={day}
              x={0}
              y={20 + (i * 2 + 1) * (CELL_SIZE + GAP) + CELL_SIZE * 0.7}
              fill="rgba(255,255,255,0.2)"
              fontSize="10"
              fontFamily="var(--font-code)"
            >
              {day}
            </text>
          ))}

          {/* Grid */}
          {weeks.map((week, wi) =>
            week.map((day, di) => (
              <rect
                key={day.date}
                x={40 + wi * (CELL_SIZE + GAP)}
                y={20 + di * (CELL_SIZE + GAP)}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                fill={COLORS[day.level]}
                style={{ transition: 'fill 0.2s, transform 0.2s' }}
              >
                <title>{`${day.date}: ${day.count} contributions`}</title>
              </rect>
            ))
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        justifyContent: 'flex-end',
        marginTop: '10px',
      }}>
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginRight: '6px' }}>
          Less
        </span>
        {COLORS.map((c, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginLeft: '6px' }}>
          More
        </span>
      </div>
    </div>
  )
}
