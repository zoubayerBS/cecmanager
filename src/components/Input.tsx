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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}