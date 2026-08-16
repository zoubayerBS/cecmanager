interface FieldProps {
  label: string
  value: string | number
  onChange: (value: any) => void
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select'
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
  required?: boolean
  error?: string
  options?: { value: string; label: string }[]
  rows?: number
}

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  unit,
  min,
  max,
  step,
  placeholder,
  required,
  error,
  options,
  rows = 3
}: FieldProps) {
  const baseClass = `w-full px-4 py-3 text-base border-2 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClass} resize-none`}
        />
      ) : type === 'select' && options ? (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className={`${baseClass} ${unit ? 'pr-12' : ''}`}
          />
          {unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">
              {unit}
            </span>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}