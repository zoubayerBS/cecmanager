import type { Tab, TabConfig } from '../types'

interface TabsProps {
  tabs: TabConfig[]
  activeTab: Tab
  onChange: (tab: Tab) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <nav className="flex overflow-x-auto bg-white border-b border-gray-200 px-3 py-2 gap-2 sticky top-0 z-50">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === id
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          <span className="text-lg">{icon}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  )
}