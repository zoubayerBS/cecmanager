import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  icon: string
  children: ReactNode
  errors?: string[]
}

export function FormSection({ title, icon, children, errors }: FormSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">
        {errors && errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-red-600">{err}</p>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    </div>
  )
}