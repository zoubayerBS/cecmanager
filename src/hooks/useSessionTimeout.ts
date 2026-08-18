import { useEffect, useRef, useCallback } from 'react'
import { logout } from '../lib/supabase'

const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export function useSessionTimeout(onTimeout: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      await logout()
      onTimeout()
    }, TIMEOUT_MS)
  }, [onTimeout])

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => document.removeEventListener(e, resetTimer))
    }
  }, [resetTimer])
}