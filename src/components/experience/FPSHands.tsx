'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { ExperienceMode } from './ExperienceWrapper'

type HandPose = 'idle' | 'reach' | 'grab' | 'throw' | 'hidden'

const SPRITES: Record<Exclude<HandPose, 'hidden'>, string> = {
  idle:  '/sprites/hand-idle.webp',
  reach: '/sprites/hand-reach.webp',
  grab:  '/sprites/hand-grab.webp',
  throw: '/sprites/hand-throw.webp',
}

interface FPSHandsProps {
  mode: ExperienceMode
  hovered: string | null
  grabbing: boolean
}

export function FPSHands({ mode, hovered, grabbing }: FPSHandsProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [pose, setPose] = useState<HandPose>('hidden')
  const idleTl = useRef<gsap.core.Timeline | null>(null)

  // Determine pose from state
  useEffect(() => {
    if (mode !== 'overview' && mode !== 'seated') {
      setPose('hidden')
      return
    }
    if (grabbing) setPose('grab')
    else if (hovered) setPose('reach')
    else setPose('idle')
  }, [mode, hovered, grabbing])

  // Animate pose transitions
  useEffect(() => {
    if (!imgRef.current || pose === 'hidden') return
    gsap.fromTo(imgRef.current,
      { y: 15, scaleX: 0.95, scaleY: 0.95 },
      { y: 0, scaleX: 1, scaleY: 1, duration: 0.12, ease: 'power2.out' }
    )
  }, [pose])

  // Idle breathing bob
  useEffect(() => {
    idleTl.current?.kill()
    idleTl.current = null
    if (pose !== 'idle' || !imgRef.current) return
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.to(imgRef.current, { y: -6, rotation: 1.5, duration: 2, ease: 'sine.inOut' })
    idleTl.current = tl
    return () => { tl.kill() }
  }, [pose])

  if (pose === 'hidden') return null

  return (
    <div style={{
      position: 'fixed',
      bottom: -20,
      right: '15%',
      zIndex: 35,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
    }}>
      <img
        ref={imgRef}
        src={SPRITES[pose]}
        alt=""
        aria-hidden="true"
        style={{
          width: 280,
          height: 280,
          imageRendering: 'auto',
          opacity: 0.9,
        }}
        onError={(e) => {
          // Hide if sprite not found
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </div>
  )
}
