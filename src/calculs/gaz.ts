import type { GazResult } from '../types'

export function calculerGaz(
  ph: number,
  pco2: number,
  pao2: number,
  temp: number,
  mode: 'alpha' | 'phstat'
): GazResult {
  const deltaT = temp - 37
  
  if (mode === 'alpha') {
    const phCorrige = ph - 0.008 * deltaT
    const pco2Corrige = pco2 * Math.pow(10, 0.019 * deltaT)
    const pao2Corrige = pao2 * Math.pow(10, 0.013 * deltaT)
    return { phCorrige, pco2Corrige, pao2Corrige, mode: 'Alpha-stat (37°C)' }
  } else {
    const phCorrige = ph - 0.0147 * deltaT
    const pco2Corrige = pco2 * Math.pow(10, 0.031 * deltaT)
    const pao2Corrige = pao2 * Math.pow(10, 0.027 * deltaT)
    return { phCorrige, pco2Corrige, pao2Corrige, mode: 'pH-stat (T° patient)' }
  }
}

export function regleSimple(deltaT: number) {
  return {
    pco2: -2 * deltaT,
    ph: 0.012 * deltaT,
    pao2: -5 * deltaT
  }
}