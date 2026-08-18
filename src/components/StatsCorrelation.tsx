import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StatsGlobales, CorrelationEntry } from '../types/stats'

interface StatsCorrelationProps {
  stats: StatsGlobales
}

const LABELS: Record<string, string> = {
  dureeCEC: 'Durée CEC', lactatesFin: 'Lactates', bilanNet: 'Bilan net',
  pamMoyenne: 'PAM moy.', age: 'Âge', poids: 'Poids',
  dureeClampage: 'Durée clamp', nbEvenements: 'Nb événements',
  volumeCardio: 'Volume cardio', debutCEC: 'PAM début', finCEC: 'PAM fin',
}

function getColor(r: number): string {
  const abs = Math.abs(r)
  if (abs > 0.7) return r > 0 ? '#22c55e' : '#ef4444'
  if (abs > 0.4) return r > 0 ? '#86efac' : '#fca5a5'
  return '#d1d5db'
}

function CorrelationMatrix({ correlations }: { correlations: CorrelationEntry[] }) {
  const labels = Array.from(new Set(correlations.flatMap(c => [c.x, c.y])))

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Matrice de corrélation</p>
        <p className="text-[10px] text-gray-400 mt-1">r de Pearson · vert = positif, rouge = négatif</p>
      </div>
      <div className="px-2 pb-2 overflow-x-auto">
        <div className="grid gap-px" style={{ gridTemplateColumns: `60px repeat(${labels.length}, 1fr)` }}>
          <div />
          {labels.map(l => (
            <div key={l} className="text-center text-[8px] text-gray-400 font-medium px-0.5 truncate" title={LABELS[l] || l}>
              {(LABELS[l] || l).slice(0, 6)}
            </div>
          ))}
          {labels.map(x => (
            <>
              <div key={`label-${x}`} className="text-[9px] text-gray-500 font-medium flex items-center pr-1 truncate" title={LABELS[x] || x}>
                {(LABELS[x] || x).slice(0, 8)}
              </div>
              {labels.map(y => {
                if (x === y) return <div key={`${x}-${y}`} className="bg-gray-100 rounded-sm" />
                const entry = correlations.find(c => (c.x === x && c.y === y) || (c.x === y && c.y === x))
                const r = entry?.r ?? 0
                return (
                  <div key={`${x}-${y}`} className="rounded-sm flex items-center justify-center"
                    style={{ backgroundColor: getColor(r), opacity: 0.3 + Math.abs(r) * 0.7 }}
                    title={`${LABELS[x] || x} ↔ ${LABELS[y] || y}: r=${r.toFixed(2)}`}>
                    <span className="text-[8px] font-bold text-gray-700">{r.toFixed(2)}</span>
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScatterPair({ correlations, stats }: { correlations: CorrelationEntry[]; stats: StatsGlobales }) {
  const strongest = [...correlations].sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
  const top3 = strongest.slice(0, 3)

  return (
    <div className="space-y-3">
      {top3.map(c => {
        const xVals = stats.tendanceDureeCEC.map(t => t.value)
        const yKey = c.y as keyof StatsGlobales
        const yData = (stats[yKey] as { value: number }[]) || []
        const yVals = yData.map((t: { value: number }) => t.value)
        const n = Math.min(xVals.length, yVals.length)
        const data = xVals.slice(0, n).map((x, i) => ({ x, y: yVals[i] }))

        return (
          <div key={`${c.x}-${c.y}`} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700">{LABELS[c.x] || c.x} → {LABELS[c.y] || c.y}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: getColor(c.r), color: Math.abs(c.r) > 0.4 ? 'white' : '#374151' }}>
                r = {c.r.toFixed(2)}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="x" type="number" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <YAxis dataKey="y" type="number" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: 10, borderRadius: 6, border: '1px solid #e5e7eb' }}
                  formatter={(value) => [Number(value).toFixed(1), '']} />
                <Scatter data={data} fill={c.r > 0 ? '#3b82f6' : '#ef4444'} fillOpacity={0.5} r={3} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  )
}

export function StatsCorrelation({ stats }: StatsCorrelationProps) {
  const [view, setView] = useState<'matrix' | 'scatter'>('matrix')

  if (stats.correlations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">Pas assez de données pour les corrélations</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        <button onClick={() => setView('matrix')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${view === 'matrix' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
          Matrice
        </button>
        <button onClick={() => setView('scatter')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${view === 'scatter' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
          Top 3 scatter
        </button>
      </div>

      {view === 'matrix' ? (
        <CorrelationMatrix correlations={stats.correlations} />
      ) : (
        <ScatterPair correlations={stats.correlations} stats={stats} />
      )}
    </div>
  )
}
