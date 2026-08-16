import type { UltrafiltrationResult } from '../types'

export function calculerUltrafiltration(
  hctActuel: number,
  hctCible: number,
  volCircuit: number,
  debitUF: number
): UltrafiltrationResult {
  const volRetirer = volCircuit * (1 - hctActuel / hctCible)
  const temps = volRetirer / debitUF * 60
  const htFinal = hctCible
  
  return { volRetirer, temps, htFinal }
}