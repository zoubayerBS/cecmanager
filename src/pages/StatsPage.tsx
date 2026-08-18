import { useMemo } from 'react'
import { Menu, BarChart3, TrendingUp, Activity, GitBranch, Shield, Clock, Users } from 'lucide-react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { summarizeCase, computeStatsGlobales } from '../calculs/stats'
import { StatsOverview } from '../components/StatsOverview'
import { StatsTendance } from '../components/StatsTendance'
import { StatsDistribution } from '../components/StatsDistribution'
import { StatsCorrelation } from '../components/StatsCorrelation'
import { StatsPredictive } from '../components/StatsPredictive'
import { StatsRisque } from '../components/StatsRisque'
import { StatsTemps } from '../components/StatsTemps'
import { StatsChirurgiens } from '../components/StatsChirurgiens'

interface StatsPageProps {
  onOpenSidebar?: () => void
}

function SectionHeader({ icon: Icon, label }: { icon: typeof BarChart3; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-1">
      <Icon size={16} className="text-gray-400" />
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  )
}

export function StatsPage({ onOpenSidebar }: StatsPageProps) {
  const cases = useWorkflowStore(s => s.cases)

  const stats = useMemo(() => {
    const summaries = cases.map(summarizeCase)
    return computeStatsGlobales(summaries)
  }, [cases])

  if (cases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={onOpenSidebar}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
              aria-label="Menu">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Statistiques</h1>
              <p className="text-xs text-gray-400">Tendances & analyse</p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Aucun dossier</p>
            <p className="text-xs text-gray-400 mt-1">Créez des dossiers CEC pour voir vos statistiques</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onOpenSidebar}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
            aria-label="Menu">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Statistiques</h1>
            <p className="text-xs text-gray-400">{stats.totalDossiers} dossier{stats.totalDossiers > 1 ? 's' : ''} analysé{stats.totalDossiers > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-2 pb-20">
        <StatsOverview stats={stats} />

        <SectionHeader icon={TrendingUp} label="Tendances" />
        <StatsTendance stats={stats} />

        <SectionHeader icon={Activity} label="Répartitions" />
        <StatsDistribution stats={stats} />

        <SectionHeader icon={GitBranch} label="Corrélations" />
        <StatsCorrelation stats={stats} />

        <SectionHeader icon={TrendingUp} label="Prédictions" />
        <StatsPredictive stats={stats} />

        <SectionHeader icon={Shield} label="Analyse de risque" />
        <StatsRisque stats={stats} />

        <SectionHeader icon={Clock} label="Activité temporelle" />
        <StatsTemps stats={stats} />

        <SectionHeader icon={Users} label="Par chirurgien" />
        <StatsChirurgiens stats={stats} />
      </div>
    </div>
  )
}
