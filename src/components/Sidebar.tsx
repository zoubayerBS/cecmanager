import { X, BookOpen, Home, User, Settings, LogOut, Activity } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  view: 'dashboard' | 'workflow' | 'formulas' | 'profile'
  onNavigate: (view: 'dashboard' | 'workflow' | 'formulas' | 'profile') => void
  onLogout: () => void
  userName?: string
}

export function Sidebar({ isOpen, onClose, view, onNavigate, onLogout, userName }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Fermer le menu"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
              onClick={() => { onNavigate('dashboard'); onClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => { onNavigate('formulas'); onClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                view === 'formulas'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen size={20} />
              <span>Formules</span>
            </button>

            <button
              onClick={() => { onNavigate('profile'); onClose() }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                view === 'profile'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} />
              <span>Profil</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span>Paramètres</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Compte</p>
            </div>
            {userName && (
              <p className="px-3 text-sm font-medium text-gray-900 mb-1">{userName}</p>
            )}
            <button
              onClick={() => { onLogout(); onClose() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}