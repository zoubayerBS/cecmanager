import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import { Menu, User, Mail, Shield, LogOut, ChevronRight, Save } from 'lucide-react'

export function ProfilePage({ onOpenSidebar, user }: { onOpenSidebar?: () => void; user: any }) {
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.auth.updateUser({ data: { name } })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      logger.error('Failed to update profile', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={onOpenSidebar}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600"
            aria-label="Menu">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Profil</h1>
            <p className="text-xs text-gray-400">Gérer mon compte</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Avatar & name */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{name || 'Utilisateur'}</h2>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Informations */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informations</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <User size={14} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500">Nom</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm text-gray-900 bg-transparent border-none focus:outline-none mt-0.5"
                  placeholder="Votre nom" />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <Mail size={14} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <Shield size={14} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500">Rôle</p>
                <p className="text-sm text-gray-900 mt-0.5">Perfusionniste</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sauvegarder */}
        <button onClick={handleSave} disabled={saving || saved}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-colors ${
            saved ? 'bg-green-600' : 'bg-black hover:bg-gray-800'
          }`}>
          <Save size={16} />
          {saved ? '✓ Sauvegardé' : saving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>

        {/* Déconnexion */}
        <button onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={16} />
          Déconnexion
        </button>

        {/* Version */}
        <p className="text-center text-[11px] text-gray-300 pt-2">
          CEC Manager v{__APP_VERSION__}
        </p>
      </div>
    </div>
  )
}