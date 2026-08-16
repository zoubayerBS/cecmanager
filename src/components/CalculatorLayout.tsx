import type { ReactNode } from 'react'

interface CalculatorLayoutProps {
  title: string
  children: ReactNode
  result?: ReactNode
  onCalculate: () => void
}

export function CalculatorLayout({
  title,
  children,
  result,
  onCalculate
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>

      <button
        onClick={onCalculate}
        className="w-full py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all"
      >
        Calculer
      </button>

      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-0">
          {result}
        </div>
      )}
    </div>
  )
}