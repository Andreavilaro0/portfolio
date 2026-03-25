'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'
import { CinematicProject } from './CinematicProject'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const header = sectionRef.current.querySelector('[data-section-header]')
    if (header) {
      gsap.fromTo(header, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: header, start: 'top 90%' },
      })
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="projects">
      {projects.map((project) => (
        <CinematicProject key={project.id} project={project} />
      ))}
    </section>
  )
}
