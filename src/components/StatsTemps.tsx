import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatsGlobales } from '../types/stats'

interface StatsTempsProps {
  stats: StatsGlobales
}

export function StatsTemps({ stats }: StatsTempsProps) {
  const { monthlyStats } = stats
  const [metric, setMetric] = useState<'count' | 'duree' | 'bilan'>('count')

  if (monthlyStats.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Pas assez de données temporelles</p>
      </div>
    )
  }

  const maxCount = Math.max(...monthlyStats.map(m => m.count))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400">Total mois</p>
          <p className="text-lg font-bold text-gray-900">{monthlyStats.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400">Pic/mois</p>
          <p className="text-lg font-bold text-gray-900">{maxCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400">Moy/mois</p>
          <p className="text-lg font-bold text-gray-900">{Math.round(monthlyStats.reduce((s, m) => s + m.count, 0) / monthlyStats.length)}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">Activité mensuelle</p>
          <div className="flex gap-1.5">
            {([['count', 'Cas/mois'], ['duree', 'Durée moy.'], ['bilan', 'Bilan moy.']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setMetric(key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${metric === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              {metric === 'count' && <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Nombre de cas" />}
              {metric === 'duree' && <Bar dataKey="dureeMoyenne" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Durée moy. (min)" />}
              {metric === 'bilan' && <Bar dataKey="bilanMoyen" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Bilan moy. (mL)" />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
