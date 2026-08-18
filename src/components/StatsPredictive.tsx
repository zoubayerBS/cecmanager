import { useState } from 'react'
import { Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts'
import type { StatsGlobales, RegressionLine } from '../types/stats'

interface StatsPredictiveProps {
  stats: StatsGlobales
}

type PredKey = 'dureeLactates' | 'dureeBilan'

const PRED_CONFIG: Record<PredKey, { label: string; xLabel: string; yLabel: string; color: string; reg: (s: StatsGlobales) => RegressionLine }> = {
  dureeLactates: { label: 'Durée CEC → Lactates', xLabel: 'Durée CEC (min)', yLabel: 'Lactates (mmol/L)', color: '#f59e0b', reg: s => s.regressionDureeVsLactates },
  dureeBilan: { label: 'Durée CEC → Bilan net', xLabel: 'Durée CEC (min)', yLabel: 'Bilan net (mL)', color: '#06b6d4', reg: s => s.regressionBilanVsDuree },
}

function ScatterWithRegression({ stats, configKey }: { stats: StatsGlobales; configKey: PredKey }) {
  const config = PRED_CONFIG[configKey]
  const reg = config.reg(stats)
  const tendance = configKey === 'dureeLactates' ? stats.tendanceDureeCEC : stats.tendanceDureeCEC
  const yKey = configKey === 'dureeLactates' ? 'tendanceLactates' : 'tendanceBilanNet'

  const xVals = tendance.map(t => t.value)
  const yVals = stats[yKey].map(t => t.value)
  const n = Math.min(xVals.length, yVals.length)
  const scatterData = xVals.slice(0, n).map((x, i) => ({ x, y: yVals[i] }))

  const xMin = Math.min(...xVals)
  const xMax = Math.max(...xVals)
  const regLine = [
    { x: xMin, y: Math.max(0, reg.slope * xMin + reg.intercept) },
    { x: xMax, y: Math.max(0, reg.slope * xMax + reg.intercept) },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{config.label}</p>
        <p className="text-xs text-gray-500">
          R² = {reg.r2.toFixed(3)} · {reg.slope > 0 ? '+' : ''}{reg.slope.toFixed(4)}x + {reg.intercept.toFixed(1)}
        </p>
      </div>
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="x" type="number" name={config.xLabel} tick={{ fontSize: 10, fill: '#9ca3af' }} label={{ value: config.xLabel, position: 'insideBottom', offset: -5, fontSize: 10, fill: '#9ca3af' }} />
            <YAxis dataKey="y" type="number" name={config.yLabel} tick={{ fontSize: 10, fill: '#9ca3af' }} width={50} label={{ value: config.yLabel, angle: -90, position: 'insideLeft', offset: 20, fontSize: 10, fill: '#9ca3af' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Scatter data={scatterData} fill={config.color} fillOpacity={0.6} r={4} />
            <Line data={regLine} type="linear" dataKey="y" stroke={config.color} strokeWidth={2} strokeDasharray="5 5" dot={false} legendType="none" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">Pente</p>
          <p className="text-xs font-bold">{reg.slope > 0 ? '+' : ''}{reg.slope.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">R²</p>
          <p className="text-xs font-bold">{reg.r2.toFixed(3)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-gray-400">Interprétation</p>
          <p className="text-xs font-bold">{reg.r2 > 0.5 ? 'Forte' : reg.r2 > 0.2 ? 'Modérée' : 'Faible'}</p>
        </div>
      </div>
    </div>
  )
}

export function StatsPredictive({ stats }: StatsPredictiveProps) {
  const [selected, setSelected] = useState<PredKey>('dureeLactates')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(PRED_CONFIG) as PredKey[]).map(key => (
          <button key={key} onClick={() => setSelected(key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selected === key ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {PRED_CONFIG[key].label}
          </button>
        ))}
      </div>

      <ScatterWithRegression stats={stats} configKey={selected} />
    </div>
  )
}
