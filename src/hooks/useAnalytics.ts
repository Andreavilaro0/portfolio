'use client'

import { useCallback } from 'react'

type AnalyticsEvent =
  | 'hero_loaded'
  | 'work_viewed'
  | 'project_opened'
  | 'contact_clicked'
  | 'arcade_opened'
  | 'fallback_activated'
  | 'project_viewed'
  | 'project_navigated'
  | 'object_focused'

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, detail?: Record<string, unknown>) => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
      new CustomEvent('portfolio_analytics', {
        detail: { event, timestamp: Date.now(), ...detail },
      })
    )
  }, [])

  return { track }
}
