import type { HemodilutionResult } from '../types'

export function calculerHemodilution(
  poids: number,
  htPatient: number,
  volumePrime: number
): HemodilutionResult {
  const vc = poids * 70
  const htCec = (vc * htPatient) / (vc + volumePrime)
  const volSang = vc * htPatient
  const df = volumePrime / (vc + volumePrime)
  
  return { vc, htCec, volSang, df }
}

export function calculerVolumeTransfusion(
  poids: number,
  htActuel: number,
  htCible: number
): number {
  const vc = poids * 70
  return vc * (htCible - htActuel) / htCible
}