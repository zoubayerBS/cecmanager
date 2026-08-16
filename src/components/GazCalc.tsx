import { useState } from 'react'
import { Input, Select, ResultItem, CalculatorLayout } from '../components'
import { calculerGaz, regleSimple } from '../calculs'
import type { GazResult } from '../types'

export function GazCalc() {
  const [ph, setPh] = useState(7.40)
  const [pco2, setPco2] = useState(40)
  const [pao2, setPao2] = useState(150)
  const [temp, setTemp] = useState(37)
  const [mode, setMode] = useState<'alpha' | 'phstat'>('alpha')
  const [result, setResult] = useState<GazResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerGaz(ph, pco2, pao2, temp, mode))
  }

  const deltaT = 37 - temp
  const regle = regleSimple(deltaT)

  return (
    <CalculatorLayout
      title="Gaz du sang - Correction température"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Mode" value={result.mode} />
            <ResultItem label="pH corrigé" value={result.phCorrige.toFixed(3)} />
            <ResultItem label="pCO₂ corrigé" value={result.pco2Corrige.toFixed(1)} unit="mmHg" />
            <ResultItem label="pO₂ corrigé" value={result.pao2Corrige.toFixed(1)} unit="mmHg" />
            {temp < 37 && (
              <>
                <div className="border-t border-blue-200 my-2 pt-2">
                  <p className="text-sm text-gray-500 mb-2">Règle simple (ΔT = {deltaT.toFixed(1)}°C) :</p>
                </div>
                <ResultItem label="ΔpCO₂" value={`${regle.pco2.toFixed(1)} mmHg`} />
                <ResultItem label="ΔpH" value={`+${regle.ph.toFixed(3)}`} />
                <ResultItem label="ΔpO₂" value={`${regle.pao2.toFixed(0)} mmHg`} />
              </>
            )}
          </>
        )
      }
    >
      <Input label="pH mesuré" value={ph} onChange={setPh} step={0.01} min={6.8} max={7.8} />
      <Input label="pCO₂" value={pco2} onChange={setPco2} unit="mmHg" min={10} max={100} />
      <Input label="pO₂" value={pao2} onChange={setPao2} unit="mmHg" min={10} max={600} />
      <Input label="Température" value={temp} onChange={setTemp} step={0.1} unit="°C" min={15} max={40} />
      <Select
        label="Mode"
        value={mode}
        onChange={(v) => setMode(v as 'alpha' | 'phstat')}
        options={[
          { value: 'alpha', label: 'Alpha-stat (37°C)' },
          { value: 'phstat', label: 'pH-stat (T° patient)' }
        ]}
      />
    </CalculatorLayout>
  )
}