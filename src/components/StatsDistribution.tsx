import { useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatsGlobales, DistributionEntry } from '../types/stats'

interface StatsDistributionProps {
  stats: StatsGlobales
}

type DistKey = 'types' | 'sexe' | 'asa' | 'groupeSanguin'

const DIST_CONFIG: Record<DistKey, { label: string; data: (s: StatsGlobales) => DistributionEntry[] }> = {
  types: { label: 'Type d\'intervention', data: s => s.repartitionTypes },
  sexe: { label: 'Répartition sexe', data: s => s.repartitionSexe },
  asa: { label: 'Score ASA', data: s => s.repartitionASA },
  groupeSanguin: { label: 'Groupe sanguin', data: s => s.repartitionGroupeSanguin },
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#6366f1', '#ec4899', '#14b8a6']

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{value} dossier{value > 1 ? 's' : ''}</p>
    </div>
  )
}

export function StatsDistribution({ stats }: StatsDistributionProps) {
  const [selected, setSelected] = useState<DistKey>('types')
  const config = DIST_CONFIG[selected]
  const data = config.data(stats)

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Aucune donnée disponible</p>
      </div>
    )
  }

  const usePie = selected === 'sexe' || data.length <= 5

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Répartitions</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(DIST_CONFIG) as DistKey[]).map(key => (
            <button key={key} onClick={() => setSelected(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selected === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {DIST_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          {usePie ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false} style={{ fontSize: 11 }}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-[10px] text-gray-500">{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
