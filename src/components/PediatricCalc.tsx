import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerPediatric } from '../calculs'
import type { PediatricResult } from '../types'

export function PediatricCalc() {
  const [poids, setPoids] = useState(10)
  const [htPatient, setHtPatient] = useState(38)
  const [volumePrime, setVolumePrime] = useState(500)
  const [result, setResult] = useState<PediatricResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerPediatric(poids, htPatient, volumePrime))
  }

  return (
    <CalculatorLayout
      title="Pédiatrie"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Volume circulant (85 mL/kg)" value={result.vc.toFixed(0)} unit="mL" />
            <ResultItem label="Débit cible" value={result.debit.toFixed(2)} unit="L/min" />
            <ResultItem label="Ht CEC prédit" value={result.htCec.toFixed(1)} unit="%" warning={result.htCec < 25} />
            <ResultItem label="Dose héparine" value={`${result.doseHeparine.toFixed(0)} UI`} />
          </>
        )
      }
    >
      <Input label="Poids" value={poids} onChange={setPoids} unit="kg" min={2} max={40} step={0.5} />
      <Input label="Ht patient" value={htPatient} onChange={setHtPatient} unit="%" min={15} max={50} />
      <Input label="Volume prime" value={volumePrime} onChange={setVolumePrime} unit="mL" min={200} max={1500} />
    </CalculatorLayout>
  )
}