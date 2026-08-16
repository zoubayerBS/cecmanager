import type { RapportCEC } from './types'

const STORAGE_KEY = 'cec-rapports'

export function loadRapports(): RapportCEC[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveRapport(rapport: RapportCEC): void {
  const rapports = loadRapports()
  const index = rapports.findIndex((r) => r.id === rapport.id)
  if (index >= 0) {
    rapports[index] = rapport
  } else {
    rapports.unshift(rapport)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rapports))
}

export function deleteRapport(id: string): void {
  const rapports = loadRapports().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rapports))
}

export function getRapport(id: string): RapportCEC | null {
  return loadRapports().find((r) => r.id === id) || null
}