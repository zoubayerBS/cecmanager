import type { DebitResult } from '../types'

export function calculerDebit(debit: number, sca: number): DebitResult {
  const ic = debit / sca
  
  return { debit, ic, debitIndexe: debit / sca }
}