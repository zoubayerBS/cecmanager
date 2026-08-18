import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { StatsGlobales } from '../types/stats'

interface StatsChirurgiensProps {
  stats: StatsGlobales
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#6366f1', '#ec4899', '#14b8a6']

export function StatsChirurgiens({ stats }: StatsChirurgiensProps) {
  const { surgeonStats } = stats
  const [metric, setMetric] = useState<'totalCases' | 'dureeMoyenne' | 'bilanMoyen' | 'lactatesMoyens'>('totalCases')

  if (surgeonStats.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Aucune donnée chirurgien</p>
      </div>
    )
  }

  const metricConfig = {
    totalCases: { label: 'Nombre de cas', unit: '' },
    dureeMoyenne: { label: 'Durée moyenne CEC', unit: ' min' },
    bilanMoyen: { label: 'Bilan net moyen', unit: ' mL' },
    lactatesMoyens: { label: 'Lactates moyens', unit: ' mmol/L' },
  }

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-[10px] text-gray-400 uppercase font-semibold mb-2">Performance par chirurgien</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(metricConfig) as (keyof typeof metricConfig)[]).map(key => (
              <button key={key} onClick={() => setMetric(key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${metric === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                {metricConfig[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={Math.max(200, surgeonStats.length * 36 + 40)}>
            <BarChart data={surgeonStats} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#374151' }} width={80} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(value) => [`${value}${metricConfig[metric].unit}`, metricConfig[metric].label]} />
              <Bar dataKey={metric} radius={[0, 4, 4, 0]}>
                {surgeonStats.map((_s, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] text-gray-400 uppercase font-semibold">Détails</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 font-medium text-gray-500">Chirurgien</th>
                <th className="text-right px-3 py-2 font-medium text-gray-500">Cas</th>
                <th className="text-right px-3 py-2 font-medium text-gray-500">Durée</th>
                <th className="text-right px-3 py-2 font-medium text-gray-500">Bilan</th>
                <th className="text-right px-3 py-2 font-medium text-gray-500">Lact.</th>
                <th className="text-right px-4 py-2 font-medium text-gray-500">Évén.</th>
              </tr>
            </thead>
            <tbody>
              {surgeonStats.map((s) => (
                <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">{s.name}</td>
                  <td className="text-right px-3 py-2 text-gray-700">{s.totalCases}</td>
                  <td className="text-right px-3 py-2 text-gray-700">{s.dureeMoyenne} min</td>
                  <td className="text-right px-3 py-2 text-gray-700">{s.bilanMoyen} mL</td>
                  <td className="text-right px-3 py-2 text-gray-700">{s.lactatesMoyens}</td>
                  <td className="text-right px-4 py-2 text-gray-700">{s.tauxEvenements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
