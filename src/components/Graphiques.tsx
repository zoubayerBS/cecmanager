import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ParamHistoryEntry } from '../store/useWorkflowStore'

interface GraphiquesProps {
  history: ParamHistoryEntry[]
}

type ParamKey = 'pam' | 'pao2' | 'temperature' | 'hct' | 'hb' | 'lactates' | 'k' | 'debit'

interface ParamConfig {
  key: ParamKey
  label: string
  unit: string
  color: string
}

const PARAMS: ParamConfig[] = [
  { key: 'pam', label: 'PAM', unit: 'mmHg', color: '#f43f5e' },
  { key: 'pao2', label: 'PaO₂', unit: 'mmHg', color: '#10b981' },
  { key: 'temperature', label: 'Temp', unit: '°C', color: '#06b6d4' },
  { key: 'hct', label: 'Ht', unit: '%', color: '#f97316' },
  { key: 'hb', label: 'Hb', unit: 'g/dL', color: '#a855f7' },
  { key: 'lactates', label: 'Lactates', unit: 'mmol/L', color: '#eab308' },
  { key: 'k', label: 'K⁺', unit: 'mmol/L', color: '#6366f1' },
  { key: 'debit', label: 'Débit', unit: 'L/min', color: '#3b82f6' },
]

const PRESETS: { label: string; keys: ParamKey[] }[] = [
  { label: 'Hémodynamique', keys: ['pam', 'debit', 'pao2'] },
  { label: 'Respiration', keys: ['temperature', 'hct', 'hb'] },
  { label: 'Métabolisme', keys: ['lactates', 'k'] },
  { label: 'Tout', keys: PARAMS.map(p => p.key) },
]

export function Graphiques({ history }: GraphiquesProps) {
  const [selected, setSelected] = useState<ParamKey[]>(['pam', 'pao2', 'temperature'])

  if (history.length < 2) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Pas assez de données pour afficher les courbes</p>
        <p className="text-xs text-gray-300 mt-1">Modifiez les paramètres pendant la CEC pour enregistrer l'historique</p>
      </div>
    )
  }

  const toggle = (key: ParamKey) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const data = history.map(h => ({
    minute: h.minute,
    ...PARAMS.reduce((acc, p) => ({ ...acc, [p.key]: h[p.key] }), {} as Record<string, number>),
  }))

  const activeParams = PARAMS.filter(p => selected.includes(p.key))

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Paramètres dans le temps</p>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESETS.map(preset => (
            <button key={preset.label}
              onClick={() => setSelected(preset.keys)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                JSON.stringify([...selected].sort()) === JSON.stringify([...preset.keys].sort())
                  ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {preset.label}
            </button>
          ))}
        </div>

        {/* Toggle params */}
        <div className="flex flex-wrap gap-1.5">
          {PARAMS.map(p => (
            <button key={p.key} onClick={() => toggle(p.key)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors border ${
                selected.includes(p.key)
                  ? 'border-transparent text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
              style={selected.includes(p.key) ? { backgroundColor: p.color } : {}}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="minute" tick={{ fontSize: 10, fill: '#9ca3af' }} label={{ value: 'min', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} width={35} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(value: any, name: any) => {
                const p = PARAMS.find(pp => pp.key === name)
                return [`${value} ${p?.unit || ''}`, p?.label || name]
              }}
              labelFormatter={(v) => `${v} min`}
            />
            {activeParams.map(p => (
              <Line key={p.key} type="monotone" dataKey={p.key} stroke={p.color}
                strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex flex-wrap gap-3">
        {activeParams.map(p => (
          <div key={p.key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] text-gray-500">{p.label} ({p.unit})</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {activeParams.slice(0, 4).map(p => {
          const values = history.map(h => h[p.key])
          const min = Math.min(...values)
          const max = Math.max(...values)
          const last = values[values.length - 1]
          return (
            <div key={p.key} className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: p.color }} />
              <p className="text-[10px] text-gray-400">{p.label}</p>
              <p className="text-xs font-bold tabular-nums">{last} <span className="text-[9px] text-gray-400 font-normal">{p.unit}</span></p>
              <p className="text-[9px] text-gray-400">{min}–{max}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
