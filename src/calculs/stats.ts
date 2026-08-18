import type { CaseData } from '../store/useWorkflowStore'
import type {
  CaseSummary, StatsGlobales, TendancePoint, DistributionEntry,
  CorrelationEntry, RegressionLine, RiskScore, MonthlyStats,
  SurgeonStats, ParamCurvePoint,
} from '../types/stats'

export function summarizeCase(c: CaseData): CaseSummary {
  const dureeCEC = c.startTime && c.endTime
    ? Math.round((new Date(c.endTime).getTime() - new Date(c.startTime).getTime()) / 60000)
    : 0

  const dureeClampage = c.clampStartTime && c.clampEndTime
    ? Math.round((new Date(c.clampEndTime).getTime() - new Date(c.clampStartTime).getTime()) / 60000)
    : 0

  const totalEntrees = c.bilan.filter(b => b.type === 'entree').reduce((s, b) => s + b.volume, 0)
  const totalSorties = c.bilan.filter(b => b.type === 'sortie').reduce((s, b) => s + b.volume, 0)
  const bilanNet = totalEntrees - totalSorties

  const pamValues = c.paramHistory.map(h => h.pam).filter(v => v > 0)
  const pamMoyenne = pamValues.length > 0 ? Math.round(pamValues.reduce((a, b) => a + b, 0) / pamValues.length) : c.parametres.pam

  const debutCEC = c.paramHistory.length > 0 ? c.paramHistory[0].pam : c.parametres.pam
  const finCEC = c.paramHistory.length > 0 ? c.paramHistory[c.paramHistory.length - 1].pam : c.parametres.pam

  const naissance = c.patient.dateNaissance ? new Date(c.patient.dateNaissance) : null
  const age = naissance ? Math.floor((Date.now() - naissance.getTime()) / (365.25 * 24 * 3600 * 1000)) : 0

  return {
    id: c.id,
    date: c.intervention.date || '',
    type: c.intervention.type || 'Non renseigné',
    chirurgien: c.intervention.chirurgien || 'Non renseigné',
    dureeCEC,
    dureeClampage,
    poids: c.patient.poids,
    taille: c.patient.taille,
    sexe: c.patient.sexe,
    asa: c.patient.asa || 'N/A',
    groupeSanguin: c.patient.groupeSanguin || 'N/A',
    bilanNet,
    lactatesFin: c.parametres.lactates,
    htDebut: c.parametres.hct,
    htFin: c.paramHistory.length > 0 ? c.paramHistory[c.paramHistory.length - 1].hct : c.parametres.hct,
    pamMoyenne,
    nbEvenements: c.evenements.length,
    nbAdminCardio: c.cardioplegie.administrations.length,
    volumeCardio: c.cardioplegie.volume,
    debutCEC,
    finCEC,
    age,
  }
}

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function stdDev(arr: number[]): number {
  if (arr.length === 0) return 0
  const m = mean(arr)
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length)
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length)
  if (n < 3) return 0
  const mx = mean(x.slice(0, n))
  const my = mean(y.slice(0, n))
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx
    const dy = y[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  const denom = Math.sqrt(dx2 * dy2)
  return denom === 0 ? 0 : num / denom
}

function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
  const n = Math.min(x.length, y.length)
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }
  const xs = x.slice(0, n)
  const ys = y.slice(0, n)
  const mx = mean(xs)
  const my = mean(ys)
  let num = 0, den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  const slope = den === 0 ? 0 : num / den
  const intercept = my - slope * mx
  const r = pearsonCorrelation(xs, ys)
  return { slope, intercept, r2: r * r }
}

export function computeDistribution(cases: CaseSummary[], key: keyof CaseSummary): DistributionEntry[] {
  const counts: Record<string, number> = {}
  for (const c of cases) {
    const val = String(c[key] || 'N/A')
    counts[val] = (counts[val] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function computeTendance(cases: CaseSummary[], key: keyof CaseSummary): TendancePoint[] {
  return cases
    .filter(c => c.date && typeof c[key] === 'number' && (c[key] as number) > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(c => ({ date: c.date, value: c[key] as number }))
}

function computeCorrelations(cases: CaseSummary[]): CorrelationEntry[] {
  const keys: { a: keyof CaseSummary; b: keyof CaseSummary }[] = [
    { a: 'dureeCEC', b: 'lactatesFin' },
    { a: 'dureeCEC', b: 'bilanNet' },
    { a: 'dureeCEC', b: 'pamMoyenne' },
    { a: 'age', b: 'dureeCEC' },
    { a: 'age', b: 'lactatesFin' },
    { a: 'poids', b: 'bilanNet' },
    { a: 'dureeClampage', b: 'lactatesFin' },
    { a: 'nbEvenements', b: 'dureeCEC' },
    { a: 'volumeCardio', b: 'bilanNet' },
    { a: 'debutCEC', b: 'finCEC' },
  ]
  return keys.map(({ a, b }) => {
    const x = cases.map(c => c[a] as number).filter(v => v > 0)
    const y = cases.map(c => c[b] as number).filter(v => v > 0)
    return { x: String(a), y: String(b), r: Math.round(pearsonCorrelation(x, y) * 100) / 100 }
  })
}

function computeRegressionLines(cases: CaseSummary[]) {
  const durees = cases.map(c => c.dureeCEC).filter(d => d > 0)
  const lactates = cases.map(c => c.lactatesFin).filter(l => l > 0)
  const bilans = cases.map(c => c.bilanNet)

  const n1 = Math.min(durees.length, lactates.length)
  const reg1 = linearRegression(durees.slice(0, n1), lactates.slice(0, n1))

  const n2 = Math.min(durees.length, bilans.length)
  const reg2 = linearRegression(durees.slice(0, n2), bilans.slice(0, n2))

  return {
    regressionDureeVsLactates: {
      ...reg1, label: 'Durée CEC → Lactates', color: '#f59e0b',
    } as RegressionLine,
    regressionBilanVsDuree: {
      ...reg2, label: 'Durée CEC → Bilan net', color: '#06b6d4',
    } as RegressionLine,
  }
}

function computeRiskScores(cases: CaseSummary[]): RiskScore[] {
  return cases.map(c => {
    const factors: string[] = []
    let score = 0

    if (c.age > 75) { score += 25; factors.push('Âge > 75 ans') }
    else if (c.age > 65) { score += 10; factors.push('Âge > 65 ans') }

    if (c.asa === 'IV' || c.asa === 'V') { score += 30; factors.push(`ASA ${c.asa}`) }
    else if (c.asa === 'III') { score += 15; factors.push('ASA III') }

    if (c.dureeCEC > 180) { score += 20; factors.push('CEC > 3h') }
    else if (c.dureeCEC > 120) { score += 10; factors.push('CEC > 2h') }

    if (c.lactatesFin > 4) { score += 20; factors.push('Lactates > 4 mmol/L') }
    else if (c.lactatesFin > 2) { score += 8; factors.push('Lactates > 2 mmol/L') }

    if (c.poids < 50 || c.poids > 110) { score += 10; factors.push('Poids extrême') }

    if (c.bilanNet < -2000) { score += 15; factors.push('Bilan < -2L') }
    else if (c.bilanNet < -1000) { score += 8; factors.push('Bilan < -1L') }

    const level: RiskScore['level'] = score >= 60 ? 'critique' : score >= 40 ? 'eleve' : score >= 20 ? 'modere' : 'faible'

    return {
      patientId: c.id,
      nom: '',
      prenom: '',
      date: c.date,
      score: Math.min(score, 100),
      level,
      factors,
    }
  }).sort((a, b) => b.score - a.score)
}

function computeMonthlyStats(cases: CaseSummary[]): MonthlyStats[] {
  const groups: Record<string, CaseSummary[]> = {}
  for (const c of cases) {
    if (!c.date) continue
    const month = c.date.slice(0, 7)
    if (!groups[month]) groups[month] = []
    groups[month].push(c)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, cs]) => ({
      month,
      count: cs.length,
      dureeMoyenne: Math.round(mean(cs.map(c => c.dureeCEC).filter(d => d > 0))),
      bilanMoyen: Math.round(mean(cs.map(c => c.bilanNet))),
    }))
}

function computeSurgeonStats(cases: CaseSummary[]): SurgeonStats[] {
  const groups: Record<string, CaseSummary[]> = {}
  for (const c of cases) {
    if (!groups[c.chirurgien]) groups[c.chirurgien] = []
    groups[c.chirurgien].push(c)
  }
  return Object.entries(groups)
    .map(([name, cs]) => ({
      name,
      totalCases: cs.length,
      dureeMoyenne: Math.round(mean(cs.map(c => c.dureeCEC).filter(d => d > 0))),
      bilanMoyen: Math.round(mean(cs.map(c => c.bilanNet))),
      lactatesMoyens: Math.round(mean(cs.map(c => c.lactatesFin).filter(l => l > 0)) * 10) / 10,
      tauxEvenements: Math.round(mean(cs.map(c => c.nbEvenements)) * 10) / 10,
    }))
    .sort((a, b) => b.totalCases - a.totalCases)
}

function computeParamCurves(cases: CaseSummary[]): ParamCurvePoint[] {
  const allCases = cases.filter(c => c.dureeCEC > 0)
  if (allCases.length === 0) return []

  const maxMinutes = Math.max(...allCases.map(c => c.dureeCEC))
  const steps = 20
  const stepSize = Math.ceil(maxMinutes / steps)

  const points: ParamCurvePoint[] = []
  for (let m = 0; m <= maxMinutes; m += stepSize) {
    points.push({ minute: m, debit: 0, pam: 0, temperature: 0, hct: 0, pao2: 0, hb: 0, lactates: 0, k: 0 })
  }

  return points
}

export function computeStatsGlobales(cases: CaseSummary[]): StatsGlobales {
  const durees = cases.map(c => c.dureeCEC).filter(d => d > 0)
  const bilans = cases.map(c => c.bilanNet)
  const lactates = cases.map(c => c.lactatesFin).filter(l => l > 0)
  const pams = cases.map(c => c.pamMoyenne).filter(p => p > 0)
  const hts = cases.map(c => c.htDebut).filter(h => h > 0)
  const ages = cases.map(c => c.age).filter(a => a > 0)
  const events = cases.map(c => c.nbEvenements)

  const { regressionDureeVsLactates, regressionBilanVsDuree } = computeRegressionLines(cases)
  const riskScores = computeRiskScores(cases)

  return {
    totalDossiers: cases.length,
    dureeCECMoyenne: Math.round(mean(durees)),
    dureeCECMediane: Math.round(median(durees)),
    dureeCECMin: durees.length > 0 ? Math.min(...durees) : 0,
    dureeCECMax: durees.length > 0 ? Math.max(...durees) : 0,
    dureeCECEcartType: Math.round(stdDev(durees)),
    bilanNetMoyen: Math.round(mean(bilans)),
    bilanNetEcartType: Math.round(stdDev(bilans)),
    lactatesMoyen: Math.round(mean(lactates) * 10) / 10,
    lactatesEcartType: Math.round(stdDev(lactates) * 10) / 10,
    pamMoyenne: Math.round(mean(pams)),
    pamEcartType: Math.round(stdDev(pams)),
    htMoyen: Math.round(mean(hts) * 10) / 10,
    ageMoyen: Math.round(mean(ages)),
    tauxEvenementsMoyen: Math.round(mean(events) * 10) / 10,
    repartitionTypes: computeDistribution(cases, 'type'),
    repartitionSexe: computeDistribution(cases, 'sexe'),
    repartitionASA: computeDistribution(cases, 'asa'),
    repartitionGroupeSanguin: computeDistribution(cases, 'groupeSanguin'),
    tendanceDureeCEC: computeTendance(cases, 'dureeCEC'),
    tendanceLactates: computeTendance(cases, 'lactatesFin'),
    tendanceBilanNet: computeTendance(cases, 'bilanNet'),
    tendancePAM: computeTendance(cases, 'pamMoyenne'),
    correlations: computeCorrelations(cases),
    regressionDureeVsLactates,
    regressionBilanVsDuree,
    riskScores,
    monthlyStats: computeMonthlyStats(cases),
    surgeonStats: computeSurgeonStats(cases),
    paramCurves: computeParamCurves(cases),
    scoreMoyen: riskScores.length > 0 ? Math.round(mean(riskScores.map(r => r.score))) : 0,
    nbRisqueEleve: riskScores.filter(r => r.level === 'eleve' || r.level === 'critique').length,
  }
}
