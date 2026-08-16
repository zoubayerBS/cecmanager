import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerUltrafiltration } from '../calculs'
import type { UltrafiltrationResult } from '../types'

export function UltrafiltrationCalc() {
  const [hctActuel, setHctActuel] = useState(22)
  const [hctCible, setHctCible] = useState(30)
  const [volCircuit, setVolCircuit] = useState(2000)
  const [debitUF, setDebitUF] = useState(500)
  const [result, setResult] = useState<UltrafiltrationResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerUltrafiltration(hctActuel, hctCible, volCircuit, debitUF))
  }

  return (
    <CalculatorLayout
      title="Ultrafiltration"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Volume à retirer" value={result.volRetirer.toFixed(0)} unit="mL" />
            <ResultItem label="Durée estimée" value={result.temps.toFixed(1)} unit="min" />
            <ResultItem label="Ht final" value={result.htFinal.toFixed(1)} unit="%" warning={result.htFinal > 40} />
          </>
        )
      }
    >
      <Input label="Ht actuel" value={hctActuel} onChange={setHctActuel} unit="%" min={15} max={45} />
      <Input label="Ht cible" value={hctCible} onChange={setHctCible} unit="%" min={20} max={50} />
      <Input label="Vol. circuit" value={volCircuit} onChange={setVolCircuit} unit="mL" min={1000} max={5000} />
      <Input label="Débit UF" value={debitUF} onChange={setDebitUF} unit="mL/min" min={100} max={2000} />
    </CalculatorLayout>
  )
}