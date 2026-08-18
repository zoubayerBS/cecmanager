export interface CaseSummary {
  id: string
  date: string
  type: string
  chirurgien: string
  dureeCEC: number
  dureeClampage: number
  poids: number
  taille: number
  sexe: 'M' | 'F'
  asa: string
  groupeSanguin: string
  bilanNet: number
  lactatesFin: number
  htDebut: number
  htFin: number
  pamMoyenne: number
  nbEvenements: number
  nbAdminCardio: number
  volumeCardio: number
  debutCEC: number
  finCEC: number
  age: number
}

export interface TendancePoint {
  date: string
  value: number
}

export interface DistributionEntry {
  name: string
  value: number
}

export interface CorrelationEntry {
  x: string
  y: string
  r: number
}

export interface RegressionLine {
  slope: number
  intercept: number
  r2: number
  label: string
  color: string
}

export interface RiskScore {
  patientId: string
  nom: string
  prenom: string
  date: string
  score: number
  level: 'faible' | 'modere' | 'eleve' | 'critique'
  factors: string[]
}

export interface MonthlyStats {
  month: string
  count: number
  dureeMoyenne: number
  bilanMoyen: number
}

export interface SurgeonStats {
  name: string
  totalCases: number
  dureeMoyenne: number
  bilanMoyen: number
  lactatesMoyens: number
  tauxEvenements: number
}

export interface ParamCurvePoint {
  minute: number
  debit: number
  pam: number
  temperature: number
  hct: number
  pao2: number
  hb: number
  lactates: number
  k: number
}

export interface StatsGlobales {
  totalDossiers: number
  dureeCECMoyenne: number
  dureeCECMediane: number
  dureeCECMin: number
  dureeCECMax: number
  dureeCECEcartType: number
  bilanNetMoyen: number
  bilanNetEcartType: number
  lactatesMoyen: number
  lactatesEcartType: number
  pamMoyenne: number
  pamEcartType: number
  htMoyen: number
  ageMoyen: number
  tauxEvenementsMoyen: number
  repartitionTypes: DistributionEntry[]
  repartitionSexe: DistributionEntry[]
  repartitionASA: DistributionEntry[]
  repartitionGroupeSanguin: DistributionEntry[]
  tendanceDureeCEC: TendancePoint[]
  tendanceLactates: TendancePoint[]
  tendanceBilanNet: TendancePoint[]
  tendancePAM: TendancePoint[]
  correlations: CorrelationEntry[]
  regressionDureeVsLactates: RegressionLine
  regressionBilanVsDuree: RegressionLine
  riskScores: RiskScore[]
  monthlyStats: MonthlyStats[]
  surgeonStats: SurgeonStats[]
  paramCurves: ParamCurvePoint[]
  scoreMoyen: number
  nbRisqueEleve: number
}
