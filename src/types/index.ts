declare global {
  const __APP_VERSION__: string
}

export type Tab =
  | 'transport-o2'
  | 'sca'
  | 'debit'
  | 'hemodilution'
  | 'rvs'
  | 'heparine'
  | 'gaz'
  | 'ultrafiltration'
  | 'pediatric'

export interface TabConfig {
  id: Tab
  label: string
  icon: string
}

export interface TransportO2Result {
  cao2: number
  do2: number
  do2i: number
  vo2: number
  o2er: number
}

export interface ScaResult {
  mosteller: number
  dubois: number
  haycock: number
  boyd: number
}

export interface DebitResult {
  debit: number
  ic: number
  debitIndexe: number
}

export interface HemodilutionResult {
  vc: number
  htCec: number
  volSang: number
  df: number
}

export interface RvsResult {
  rvs: number
  rvsSimplifie: number
}

export interface HeparineResult {
  doseInit: number
  doseSupp: number
  protamineFixe: number
  protamineHC: number
}

export interface GazResult {
  phCorrige: number
  pco2Corrige: number
  pao2Corrige: number
  mode: string
}

export interface UltrafiltrationResult {
  volRetirer: number
  temps: number
  htFinal: number
}

export interface PediatricResult {
  vc: number
  debit: number
  htCec: number
  doseHeparine: number
}