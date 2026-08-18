import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatsGlobales, TendancePoint } from '../types/stats'

interface StatsTendanceProps {
  stats: StatsGlobales
}

type TendanceKey = 'dureeCEC' | 'lactates' | 'bilanNet' | 'pam'

const TENDANCE_CONFIG: Record<TendanceKey, { label: string; unit: string; color: string; data: (s: StatsGlobales) => TendancePoint[] }> = {
  dureeCEC: { label: 'Durée CEC', unit: 'min', color: '#8b5cf6', data: s => s.tendanceDureeCEC },
  lactates: { label: 'Lactates', unit: 'mmol/L', color: '#f59e0b', data: s => s.tendanceLactates },
  bilanNet: { label: 'Bilan net', unit: 'mL', color: '#06b6d4', data: s => s.tendanceBilanNet },
  pam: { label: 'PAM moyenne', unit: 'mmHg', color: '#ef4444', data: s => s.tendancePAM },
}

export function StatsTendance({ stats }: StatsTendanceProps) {
  const [selected, setSelected] = useState<TendanceKey>('dureeCEC')
  const config = TENDANCE_CONFIG[selected]
  const data = config.data(stats)

  if (data.length < 2) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Pas assez de données pour afficher les tendances</p>
        <p className="text-xs text-gray-300 mt-1">Au moins 2 dossiers avec dates requis</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tendances</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(TENDANCE_CONFIG) as TendanceKey[]).map(key => (
            <button key={key} onClick={() => setSelected(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selected === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {TENDANCE_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} width={40} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(value) => [`${String(value)} ${config.unit}`, config.label]}
            />
            <Line type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">Min</p>
          <p className="text-xs font-bold">{Math.min(...data.map(d => d.value))} {config.unit}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">Moy</p>
          <p className="text-xs font-bold">{Math.round(data.reduce((s, d) => s + d.value, 0) / data.length * 10) / 10} {config.unit}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">Max</p>
          <p className="text-xs font-bold">{Math.max(...data.map(d => d.value))} {config.unit}</p>
        </div>
      </div>
    </div>
  )
}
