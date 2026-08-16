import type { PediatricResult } from '../types'

export function calculerPediatric(
  poids: number,
  htPatient: number,
  volumePrime: number
): PediatricResult {
  const vc = poids * 85
  const htCec = (vc * htPatient) / (vc + volumePrime)
  const debit = (poids <= 10 ? 105 : poids <= 20 ? 85 : 70) * poids / 1000
  const doseHeparine = poids * 300
  
  return { vc, debit, htCec, doseHeparine }
}