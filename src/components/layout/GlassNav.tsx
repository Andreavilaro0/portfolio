'use client'

import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Inicio', href: '#top' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function GlassNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Show nav when hero text appears (listen for custom event or timer)
  useEffect(() => {
    const handleVisible = () => setVisible(true)
    window.addEventListener('hero-text-visible', handleVisible)
    // Fallback: show after 4s
    const timer = setTimeout(() => setVisible(true), 4000)
    return () => {
      window.removeEventListener('hero-text-visible', handleVisible)
      clearTimeout(timer)
    }
  }, [])

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3 }
    )

    const sections = document.querySelectorAll('#projects, #about, #contact')
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 8px',
        borderRadius: '50px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.href.slice(1)
        return (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              if (item.href === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            style={{
              fontFamily: 'var(--font-code)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'linear-gradient(135deg, rgba(255,45,155,0.15), rgba(0,229,255,0.15))' : 'transparent',
              padding: '8px 16px',
              borderRadius: '40px',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
