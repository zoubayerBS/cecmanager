import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerHeparine } from '../calculs'
import type { HeparineResult } from '../types'

export function HeparineCalc() {
  const [poids, setPoids] = useState(70)
  const [actCible, setActCible] = useState(480)
  const [actActuel, setActActuel] = useState(0)
  const [hcMesuree, setHcMesuree] = useState(2.0)
  const [result, setResult] = useState<HeparineResult | null>(null)

  const handleCalculate = () => {
    setResult(calculerHeparine(poids, actCible, actActuel, hcMesuree))
  }

  return (
    <CalculatorLayout
      title="Héparine / ACT / Protamine"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="Dose héparine initiale" value={`${result.doseInit.toFixed(0)} UI`} />
            {actActuel > 0 && actActuel < actCible && (
              <ResultItem label="Dose supplémentaire" value={`${result.doseSupp.toFixed(0)} UI`} warning />
            )}
            <ResultItem label="Protamine (ratio fixe 1:1)" value={`${result.protamineFixe.toFixed(0)} mg`} />
            <ResultItem label="Protamine (HC mesurée)" value={`${result.protamineHC.toFixed(0)} mg`} />
          </>
        )
      }
    >
      <Input label="Poids" value={poids} onChange={setPoids} unit="kg" min={20} max={150} />
      <Input label="ACT cible" value={actCible} onChange={setActCible} unit="sec" min={300} max={600} />
      <Input label="ACT actuel" value={actActuel} onChange={setActActuel} unit="sec" placeholder="0 = pas encore mesuré" />
      <Input label="HC mesurée (HMS)" value={hcMesuree} onChange={setHcMesuree} unit="UI/mL" step={0.1} min={0} max={6} />
    </CalculatorLayout>
  )
}