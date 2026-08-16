interface InputProps {
  label: string
  value: number
  onChange: (value: number) => void
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export function Input({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
  placeholder
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-gray-400 focus:bg-white focus:outline-none transition-colors tabular-nums ${unit ? 'pr-10' : ''}`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}