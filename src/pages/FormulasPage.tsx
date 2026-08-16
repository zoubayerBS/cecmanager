import { useState } from 'react'
import { ChevronRight, ChevronDown, Menu, Activity, Wind, Droplets, Baby, Thermometer, Zap } from 'lucide-react'
import { Hemodynamique, TransportO2, Hemodilution, Heparine, Pediatric, Ultrafiltration, GazSang } from '../components'

interface FormulaSectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FormulaSection({ icon, title, children, defaultOpen = false }: FormulaSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 shrink-0">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-800 flex-1 text-left">{title}</span>
        {open
          ? <ChevronDown size={16} className="text-gray-400" />
          : <ChevronRight size={16} className="text-gray-400" />
        }
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 pt-3">{children}</div>}
    </div>
  )
}

export function FormulasPage({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onOpenSidebar}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
            aria-label="Menu">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Formules</h1>
            <p className="text-xs text-gray-400">Calculs médicaux de perfusion</p>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-3">
        <FormulaSection icon={<Activity size={16} />} title="Hémodynamique" defaultOpen>
          <Hemodynamique />
        </FormulaSection>
        <FormulaSection icon={<Wind size={16} />} title="Transport O₂">
          <TransportO2 />
        </FormulaSection>
        <FormulaSection icon={<Droplets size={16} />} title="Hémodilution">
          <Hemodilution />
        </FormulaSection>
        <FormulaSection icon={<Zap size={16} />} title="Héparine / ACT">
          <Heparine />
        </FormulaSection>
        <FormulaSection icon={<Baby size={16} />} title="Pédiatrie">
          <Pediatric />
        </FormulaSection>
        <FormulaSection icon={<Droplets size={16} />} title="Ultrafiltration">
          <Ultrafiltration />
        </FormulaSection>
        <FormulaSection icon={<Thermometer size={16} />} title="Gaz du sang">
          <GazSang />
        </FormulaSection>
      </div>
    </div>
  )
}