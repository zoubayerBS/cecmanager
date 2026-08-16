import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerSCA } from '../calculs'
import type { ScaResult } from '../types'

export function SCACalc() {
  const [taille, setTaille] = useState(170)
  const [poids, setPoids] = useState(70)
  const [result, setResult] = useState<ScaResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerSCA(taille, poids))
  }

  return (
    <CalculatorLayout
      title="Surface Corporelle (SCA)"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Mosteller" value={result.mosteller.toFixed(3)} unit="m²" />
            <ResultItem label="DuBois" value={result.dubois.toFixed(3)} unit="m²" />
            <ResultItem label="Haycock" value={result.haycock.toFixed(3)} unit="m²" />
            <ResultItem label="Boyd" value={result.boyd.toFixed(3)} unit="m²" />
          </>
        )
      }
    >
      <Input label="Taille" value={taille} onChange={setTaille} unit="cm" min={50} max={220} />
      <Input label="Poids" value={poids} onChange={setPoids} unit="kg" min={2} max={200} />
    </CalculatorLayout>
  )
}