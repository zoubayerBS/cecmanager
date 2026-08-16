import { DebitCalc } from './DebitCalc'
import { SCACalc } from './SCACalc'
import { RVSCalc } from './RVSCalc'

export function Hemodynamique() {
  return (
    <div className="space-y-4">
      <DebitCalc />
      <SCACalc />
      <RVSCalc />
    </div>
  )
}