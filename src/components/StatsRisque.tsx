import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { StatsGlobales, RiskScore } from '../types/stats'

interface StatsRisqueProps {
  stats: StatsGlobales
}

const LEVEL_CONFIG: Record<RiskScore['level'], { color: string; bg: string; icon: typeof Shield; label: string }> = {
  faible: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Faible' },
  modere: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle, label: 'Modéré' },
  eleve: { color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertTriangle, label: 'Élevé' },
  critique: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Critique' },
}

function RiskBar({ score, level }: { score: number; level: RiskScore['level'] }) {
  const config = LEVEL_CONFIG[level]
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`${config.color.replace('text-', 'bg-')} h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[10px] font-bold ${config.color} w-8 text-right`}>{score}</span>
    </div>
  )
}

export function StatsRisque({ stats }: StatsRisqueProps) {
  const { riskScores, scoreMoyen, nbRisqueEleve, totalDossiers } = stats

  const byLevel = {
    faible: riskScores.filter(r => r.level === 'faible').length,
    modere: riskScores.filter(r => r.level === 'modere').length,
    eleve: riskScores.filter(r => r.level === 'eleve').length,
    critique: riskScores.filter(r => r.level === 'critique').length,
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Score moyen</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{scoreMoyen}<span className="text-sm text-gray-400">/100</span></p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Risque élevé+</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{nbRisqueEleve}<span className="text-sm text-gray-400">/{totalDossiers}</span></p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-[10px] text-gray-400 uppercase font-semibold mb-3">Répartition des risques</p>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          {(Object.entries(byLevel) as [RiskScore['level'], number][]).map(([level, count]) => {
            const pct = totalDossiers > 0 ? (count / totalDossiers) * 100 : 0
            if (pct === 0) return null
            const cfg = LEVEL_CONFIG[level]
            return <div key={level} className={`${cfg.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${pct}%` }} title={`${cfg.label}: ${count}`} />
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {(Object.entries(byLevel) as [RiskScore['level'], number][]).map(([level, count]) => {
            const cfg = LEVEL_CONFIG[level]
            return (
              <div key={level} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${cfg.color.replace('text-', 'bg-')}`} />
                <span className="text-[10px] text-gray-500">{cfg.label} ({count})</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Top 10 patients à risque</p>
        </div>
        <div className="divide-y divide-gray-100">
          {riskScores.slice(0, 10).map((r, i) => {
            const config = LEVEL_CONFIG[r.level]
            const Icon = config.icon
            return (
              <div key={r.patientId} className="px-4 py-2.5 flex items-center gap-3">
                <span className="text-[10px] text-gray-400 w-4 font-medium">#{i + 1}</span>
                <div className={`w-7 h-7 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={14} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    Patient #{r.patientId.slice(0, 8)} · {r.date}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {r.factors.length > 0 ? r.factors.join(' · ') : 'Aucun facteur'}
                  </p>
                </div>
                <RiskBar score={r.score} level={r.level} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
