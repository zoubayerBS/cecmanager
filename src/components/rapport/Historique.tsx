import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { loadRapports, deleteRapport } from '../../rapport/storage'
import type { RapportCEC } from '../../rapport/types'

interface HistoriqueProps {
  onEdit: (id: string) => void
  onNew: () => void
}

export function Historique({ onEdit, onNew }: HistoriqueProps) {
  const [rapports, setRapports] = useState<RapportCEC[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRapports().then(setRapports)
  }, [])

  const filtered = rapports.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.identification.nom.toLowerCase().includes(q) ||
      r.identification.prenom.toLowerCase().includes(q) ||
      r.identification.typeIntervention.toLowerCase().includes(q) ||
      r.identification.chirurgien.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce rapport ?')) {
      await deleteRapport(id)
      setRapports(await loadRapports())
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un rapport..."
            className="w-full px-4 py-3 pl-10 text-base border-2 border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={onNew} className="px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all whitespace-nowrap">
          + Nouveau
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 text-lg">Aucun rapport trouvé</p>
          <button onClick={onNew} className="mt-4 px-6 py-3 text-base font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
            Créer un rapport
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 truncate">
                    {r.identification.nom} {r.identification.prenom}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                    {r.identification.typeIntervention}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                  <span>{format(new Date(r.identification.dateIntervention), "dd MMM yyyy", { locale: fr })}</span>
                  <span>Dr {r.identification.chirurgien}</span>
                  <span>{r.parametres.dureeCEC} min CEC</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(r.id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}