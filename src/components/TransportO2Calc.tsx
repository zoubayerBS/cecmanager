import { useState } from 'react'
import { Input, ResultItem, CalculatorLayout } from '../components'
import { calculerTransportO2 } from '../calculs'
import type { TransportO2Result } from '../types'

export function TransportO2Calc() {
  const [hb, setHb] = useState(12)
  const [sao2, setSao2] = useState(100)
  const [pao2, setPao2] = useState(200)
  const [svo2, setSvo2] = useState(75)
  const [debit, setDebit] = useState(4.5)
  const [sca, setSca] = useState(1.8)
  const [result, setResult] = useState<TransportO2Result | null>(null)

  const handleCalculate = () => {
    setResult(calculerTransportO2(hb, sao2, pao2, svo2, debit, sca))
  }

  return (
    <CalculatorLayout
      title="Transport d'Oxygène"
      onCalculate={handleCalculate}
      result={
        result && (
          <>
            <ResultItem label="CaO₂ (contenu artériel O₂)" value={result.cao2.toFixed(2)} unit="mL/dL" />
            <ResultItem
              label="DO₂ (débit O₂)"
              value={result.do2.toFixed(0)}
              unit="mL/min"
              warning={result.do2i < 270}
            />
            <ResultItem
              label="DO₂i (débit O₂ indexé)"
              value={result.do2i.toFixed(0)}
              unit="mL/min/m²"
              warning={result.do2i < 270}
            />
            <ResultItem label="VO₂ (consommation O₂)" value={result.vo2.toFixed(0)} unit="mL/min" />
            <ResultItem label="O₂ER (taux extraction)" value={(result.o2er * 100).toFixed(1)} unit="%" />
          </>
        )
      }
    >
      <Input label="Hémoglobine" value={hb} onChange={setHb} unit="g/dL" min={3} max={20} step={0.1} />
      <Input label="SaO₂ (saturation artériel)" value={sao2} onChange={setSao2} unit="%" min={50} max={100} />
      <Input label="PaO₂" value={pao2} onChange={setPao2} unit="mmHg" min={20} max={600} />
      <Input label="SvO₂ (saturation veineuse)" value={svo2} onChange={setSvo2} unit="%" min={30} max={100} />
      <Input label="Débit pompe (Q)" value={debit} onChange={setDebit} unit="L/min" step={0.1} min={0.5} max={8} />
      <Input label="SCA" value={sca} onChange={setSca} unit="m²" step={0.01} min={0.3} max={3} />
    </CalculatorLayout>
  )
}