import { useState, useRef, useEffect } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}

export function Select({ label, value, onChange, options }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-3 pr-10 text-lg text-left border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer"
        >
          {selected?.label || 'Sélectionner...'}
        </button>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {open && (
          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full px-4 py-3 text-lg text-left hover:bg-blue-50 transition-colors ${
                  opt.value === value ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}