interface ResultItemProps {
  label: string
  value: string
  unit?: string
  warning?: boolean
}

export function ResultItem({ label, value, unit, warning }: ResultItemProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${warning ? 'text-orange-500' : 'text-gray-700'}`}>
        {value}
        {unit && <span className="text-[10px] text-gray-400 font-normal ml-1">{unit}</span>}
      </span>
    </div>
  )
}