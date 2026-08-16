import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerDebit } from '../calculs'
import type { DebitResult } from '../types'

export function DebitCalc() {
  const [debit, setDebit] = useState(4.5)
  const [sca, setSca] = useState(1.8)
  const [result, setResult] = useState<DebitResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerDebit(debit, sca))
  }

  return (
    <CalculatorLayout
      title="Débits & Indexation"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Index cardiaque" value={result.ic.toFixed(2)} unit="L/min/m²" warning={result.ic < 2.2} />
            <ResultItem label="Débit indexé" value={result.debitIndexe.toFixed(2)} unit="L/min/m²" />
          </>
        )
      }
    >
      <Input label="Débit pompe" value={debit} onChange={setDebit} unit="L/min" step={0.1} min={0.5} max={8} />
      <Input label="SCA" value={sca} onChange={setSca} unit="m²" step={0.01} min={0.3} max={3} />
    </CalculatorLayout>
  )
}