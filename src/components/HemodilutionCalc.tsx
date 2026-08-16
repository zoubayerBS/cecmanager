import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerHemodilution } from '../calculs'
import type { HemodilutionResult } from '../types'

export function HemodilutionCalc() {
  const [poids, setPoids] = useState(70)
  const [htPatient, setHtPatient] = useState(40)
  const [volumePrime, setVolumePrime] = useState(1500)
  const [result, setResult] = useState<HemodilutionResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerHemodilution(poids, htPatient, volumePrime))
  }

  return (
    <CalculatorLayout
      title="Hémodilution"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Volume circulant (VC)" value={result.vc.toFixed(0)} unit="mL" />
            <ResultItem label="Ht CEC prédit" value={result.htCec.toFixed(1)} unit="%" warning={result.htCec < 25} />
            <ResultItem label="Facteur de dilution" value={(result.df * 100).toFixed(1)} unit="%" />
          </>
        )
      }
    >
      <Input label="Poids" value={poids} onChange={setPoids} unit="kg" min={20} max={150} />
      <Input label="Ht patient" value={htPatient} onChange={setHtPatient} unit="%" min={10} max={60} />
      <Input label="Volume prime" value={volumePrime} onChange={setVolumePrime} unit="mL" min={500} max={3000} />
    </CalculatorLayout>
  )
}