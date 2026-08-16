import type { HeparineResult } from '../types'

export function calculerHeparine(
  poids: number,
  actCible: number,
  actActuel: number,
  hcMesuree: number
): HeparineResult {
  const doseInit = poids * 300
  let doseSupp = 0
  
  if (actActuel > 0 && actActuel < actCible) {
    doseSupp = Math.ceil((actCible - actActuel) / 100) * 100 * (poids / 70)
  }
  
  const tbv = poids * 70
  const protamineFixe = doseInit / 100
  const protamineHC = (hcMesuree * tbv * 0.8) / 100
  
  return { doseInit, doseSupp, protamineFixe, protamineHC }
}