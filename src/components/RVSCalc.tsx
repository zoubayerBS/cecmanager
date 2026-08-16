import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerRVS } from '../calculs'
import type { RvsResult } from '../types'

export function RVSCalc() {
  const [pam, setPam] = useState(70)
  const [pvs, setPvs] = useState(5)
  const [debit, setDebit] = useState(4.5)
  const [result, setResult] = useState<RvsResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerRVS(pam, pvs, debit))
  }

  return (
    <CalculatorLayout
      title="Résistances Vasculaires Systémiques"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="RVS (formule complète)" value={result.rvs.toFixed(0)} unit="dyn·s/cm⁵" />
            <ResultItem label="RVS (simplifié)" value={result.rvsSimplifie.toFixed(0)} unit="dyn·s/cm⁵" />
            <ResultItem label="Interprétation" value={result.rvs > 1200 ? 'Élevé' : result.rvs < 800 ? 'Bas' : 'Normal'} warning={result.rvs > 1200 || result.rvs < 800} />
          </>
        )
      }
    >
      <Input label="PAM" value={pam} onChange={setPam} unit="mmHg" min={20} max={150} />
      <Input label="PVS (PAPm)" value={pvs} onChange={setPvs} unit="mmHg" min={0} max={40} />
      <Input label="Débit pompe (Q)" value={debit} onChange={setDebit} unit="L/min" step={0.1} min={0.5} max={8} />
    </CalculatorLayout>
  )
}