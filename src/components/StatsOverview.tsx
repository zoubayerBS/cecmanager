import { FolderOpen, Clock, Droplets, Users, Activity, Heart, Brain, AlertTriangle } from 'lucide-react'
import type { StatsGlobales } from '../types/stats'

interface StatsOverviewProps {
  stats: StatsGlobales
}

function formatDuree(minutes: number): string {
  if (minutes === 0) return '--'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const sexeF = stats.repartitionSexe.find(s => s.name === 'F')?.value || 0
  const sexeM = stats.repartitionSexe.find(s => s.name === 'M')?.value || 0
  const total = sexeM + sexeF
  const ratioMF = total > 0 ? `${Math.round((sexeM / total) * 100)}% / ${Math.round((sexeF / total) * 100)}%` : '--'

  const cards = [
    {
      icon: FolderOpen,
      label: 'Total dossiers',
      value: String(stats.totalDossiers),
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      icon: Clock,
      label: 'CEC moyenne',
      value: formatDuree(stats.dureeCECMoyenne),
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
    },
    {
      icon: Droplets,
      label: 'Bilan net moy.',
      value: stats.totalDossiers > 0 ? `${stats.bilanNetMoyen > 0 ? '+' : ''}${stats.bilanNetMoyen} mL` : '--',
      color: 'bg-cyan-50 text-cyan-600',
      iconBg: 'bg-cyan-100',
    },
    {
      icon: Users,
      label: 'Répartition H/F',
      value: ratioMF,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
    },
    {
      icon: Heart,
      label: 'Lactates moy.',
      value: stats.totalDossiers > 0 ? `${stats.lactatesMoyen} mmol/L` : '--',
      color: 'bg-red-50 text-red-600',
      iconBg: 'bg-red-100',
    },
    {
      icon: Activity,
      label: 'PAM moyenne',
      value: stats.totalDossiers > 0 ? `${stats.pamMoyenne} mmHg` : '--',
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      icon: Brain,
      label: 'Âge moyen',
      value: stats.totalDossiers > 0 ? `${stats.ageMoyen} ans` : '--',
      color: 'bg-indigo-50 text-indigo-600',
      iconBg: 'bg-indigo-100',
    },
    {
      icon: AlertTriangle,
      label: 'Score risque',
      value: stats.totalDossiers > 0 ? `${stats.scoreMoyen}/100` : '--',
      color: stats.scoreMoyen > 40 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600',
      iconBg: stats.scoreMoyen > 40 ? 'bg-orange-100' : 'bg-gray-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`${card.color} rounded-xl p-3`}>
          <div className={`w-7 h-7 ${card.iconBg} rounded-lg flex items-center justify-center mb-1.5`}>
            <card.icon size={14} />
          </div>
          <p className="text-lg font-bold leading-tight">{card.value}</p>
          <p className="text-[10px] opacity-70 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
