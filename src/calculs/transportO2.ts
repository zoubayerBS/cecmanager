import type { TransportO2Result } from '../types'

export function calculerTransportO2(
  hb: number,
  sao2: number,
  pao2: number,
  svo2: number,
  debit: number,
  sca: number
): TransportO2Result {
  const sao2Decimal = sao2 / 100
  const svo2Decimal = svo2 / 100
  
  const cao2 = (1.34 * hb * sao2Decimal) + (0.003 * pao2)
  const cvO2 = (1.34 * hb * svo2Decimal) + (0.003 * 40)
  
  const do2 = debit * cao2 * 10
  const do2i = do2 / sca
  const vo2 = debit * (cao2 - cvO2) * 10
  const o2er = vo2 / do2
  
  return { cao2, do2, do2i, vo2, o2er }
}