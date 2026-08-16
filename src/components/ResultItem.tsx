interface ResultItemProps {
  label: string
  value: string
  unit?: string
  warning?: boolean
}

export function ResultItem({ label, value, unit, warning }: ResultItemProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-blue-200 last:border-b-0">
      <span className="text-gray-700">{label}</span>
      <span className={`text-lg font-semibold ${warning ? 'text-orange-500' : 'text-blue-600'}`}>
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </span>
    </div>
  )
}