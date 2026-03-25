'use client'
import { useRef, useEffect, useCallback } from 'react'
import { Howl, Howler } from 'howler'

const SOUNDS = {
  ambientTyping: { src: '/sounds/ambient-typing.mp3', loop: true, volume: 0.12 },
  ambientFan:    { src: '/sounds/ambient-fan.mp3',    loop: true, volume: 0.06 },
  ambientClock:  { src: '/sounds/ambient-clock.mp3',  loop: true, volume: 0.08 },
  ambientRain:   { src: '/sounds/ambient-rain.mp3',   loop: true, volume: 0.04 },
  hover:   { src: '/sounds/sfx-hover.mp3',  volume: 0.25 },
  click:   { src: '/sounds/sfx-click.mp3',  volume: 0.4 },
  whoosh:  { src: '/sounds/sfx-whoosh.mp3', volume: 0.25 },
  grab:    { src: '/sounds/sfx-grab.mp3',   volume: 0.35 },
  throw:   { src: '/sounds/sfx-throw.mp3',  volume: 0.3 },
  bounce:  { src: '/sounds/sfx-bounce.mp3', volume: 0.2 },
} as const

type SoundName = keyof typeof SOUNDS

export function useAudio() {
  const howls = useRef<Map<string, Howl>>(new Map())
  const muted = useRef(false)

  useEffect(() => {
    // Lazy-init on first user gesture (browser autoplay policy)
    const init = () => {
      if (howls.current.size > 0) return
      for (const [key, config] of Object.entries(SOUNDS)) {
        howls.current.set(key, new Howl(config))
      }
      document.removeEventListener('click', init)
      document.removeEventListener('keydown', init)
    }
    document.addEventListener('click', init, { once: true })
    document.addEventListener('keydown', init, { once: true })
    return () => {
      document.removeEventListener('click', init)
      document.removeEventListener('keydown', init)
      howls.current.forEach(h => h.unload())
    }
  }, [])

  const play = useCallback((name: SoundName) => {
    if (muted.current) return
    howls.current.get(name)?.play()
  }, [])

  const startAmbient = useCallback(() => {
    if (muted.current) return
    ;(['ambientTyping', 'ambientFan', 'ambientClock', 'ambientRain'] as SoundName[]).forEach(k =>
      howls.current.get(k)?.play()
    )
  }, [])

  const stopAmbient = useCallback(() => {
    ;(['ambientTyping', 'ambientFan', 'ambientClock', 'ambientRain'] as SoundName[]).forEach(k =>
      howls.current.get(k)?.stop()
    )
  }, [])

  const toggleMute = useCallback(() => {
    muted.current = !muted.current
    Howler.mute(muted.current)
  }, [])

  return { play, startAmbient, stopAmbient, toggleMute, muted }
}
