import { useEffect, useRef, useCallback } from 'react'
import type { RapportCEC } from '../rapport/types'
import { saveRapport } from '../rapport/storage'

export function useAutoSave(rapport: RapportCEC, enabled = true) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string>('')

  const save = useCallback(() => {
    const data = JSON.stringify(rapport)
    if (data !== lastSavedRef.current) {
      saveRapport(rapport)
      lastSavedRef.current = data
    }
  }, [rapport])

  useEffect(() => {
    if (!enabled) return

    timeoutRef.current = setTimeout(() => {
      save()
    }, 30000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [rapport, enabled, save])

  const saveNow = useCallback(() => {
    save()
  }, [save])

  return { saveNow, lastSaved: lastSavedRef.current ? new Date() : null }
}