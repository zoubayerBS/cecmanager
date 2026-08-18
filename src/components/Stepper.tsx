import { useState } from 'react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'patient', label: 'Patient', num: 1 },
  { id: 'intervention', label: 'Intervention', num: 2 },
  { id: 'materiel', label: 'Matériel', num: 3 },
  { id: 'pre-check', label: 'Pré-CEC', num: 4 },
  { id: 'cec', label: 'CEC', num: 5 },
  { id: 'bilan', label: 'Bilan', num: 6 },
  { id: 'rapport', label: 'Rapport', num: 7 },
] as const

export function Stepper() {
  const steps = useWorkflowStore(s => s.steps)
  const currentStep = useWorkflowStore(s => s.currentStep)
  const goToStep = useWorkflowStore(s => s.goToStep)
  const [menuOpen, setMenuOpen] = useState(false)

  const currentIdx = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav className="border-b border-gray-100 bg-white">
      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg hover:bg-gray-100">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentIdx ? 'bg-black' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const step = steps.find((s) => s.id === item.id)!
            const idx = steps.indexOf(step)
            return (
              <button key={item.id} onClick={() => { goToStep(item.id); setMenuOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  step.id === currentStep ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  idx < currentIdx || step.completed ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}>{idx < currentIdx || step.completed ? '✓' : item.num}</span>
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-0 px-4">
        {NAV_ITEMS.map((item) => {
          const step = steps.find((s) => s.id === item.id)!
          const idx = steps.indexOf(step)
          const active = step.id === currentStep
          const done = idx < currentIdx || step.completed
          return (
            <button key={item.id} onClick={() => goToStep(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
                active ? 'border-black font-medium' : done ? 'border-transparent text-gray-600 hover:text-black' : 'border-transparent text-gray-300'
              }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                done || active ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
              }`}>{done ? '✓' : item.num}</span>
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}