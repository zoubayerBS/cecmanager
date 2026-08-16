import type { RvsResult } from '../types'

export function calculerRVS(pam: number, pvs: number, debit: number): RvsResult {
  const rvs = ((pam - pvs) * 80) / debit
  const rvsSimplifie = (pam * 80) / debit
  
  return { rvs, rvsSimplifie }
}