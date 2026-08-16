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
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>

      <button
        onClick={onCalculate}
        className="w-full mt-5 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
      >
        Calculer
      </button>

      {result && (
        <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
          {result}
        </div>
      )}
    </div>
  )
}