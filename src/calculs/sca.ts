import type { ScaResult } from '../types'

export function calculerSCA(taille: number, poids: number): ScaResult {
  const logW = Math.log10(poids)
  
  return {
    mosteller: Math.sqrt((taille * poids) / 3600),
    dubois: 0.007184 * Math.pow(taille, 0.725) * Math.pow(poids, 0.425),
    haycock: 0.024265 * Math.pow(taille, 0.3964) * Math.pow(poids, 0.5378),
    boyd: 0.0003207 * Math.pow(taille, 0.3) * Math.pow(poids, 0.7285 - 0.0188 * logW)
  }
}