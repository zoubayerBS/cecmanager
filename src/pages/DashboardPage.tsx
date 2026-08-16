import { useState, useEffect, useRef, useCallback } from 'react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import {
  Activity, Plus, Trash2, User, Scissors, Calendar,
  ChevronRight, Search, FolderOpen,
} from 'lucide-react'
import type { CaseData } from '../store/useWorkflowStore'

const PAGE_SIZE = 5

export function DashboardPage() {
  const { cases, loadCase, deleteCase, newCase, fetchCases } = useWorkflowStore()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCases().finally(() => setLoading(false))
  }, [])

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.patient.nom.toLowerCase().includes(q) || c.patient.prenom.toLowerCase().includes(q) || c.intervention.type.toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(0) }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setTouchDelta(0)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return
    setTouchDelta(e.touches[0].clientX - touchStart)
  }, [touchStart])

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta) > 50) {
      if (touchDelta < 0 && page < totalPages - 1) setPage((p) => p + 1)
      if (touchDelta > 0 && page > 0) setPage((p) => p - 1)
    }
    setTouchStart(null)
    setTouchDelta(0)
  }, [touchDelta, page, totalPages])

  const handleNew = () => {
    newCase()
  }

  const handleLoad = (id: string) => {
    loadCase(id)
  }

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteCase(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity size={32} className="mx-auto text-gray-300 animate-spin mb-3" />
          <p className="text-sm text-gray-400">Chargement des dossiers…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">CEC Manager</h1>
              <p className="text-xs text-gray-400">{cases.length} dossier{cases.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={16} /> Nouveau
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        {cases.length > 0 && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Rechercher un patient, un acte…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-gray-400 focus:outline-none transition-colors" />
          </div>
        )}

        {/* Liste des cas */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm mb-4">
              {cases.length === 0 ? 'Aucun dossier pour le moment' : 'Aucun résultat'}
            </p>
            {cases.length === 0 && (
              <button onClick={handleNew}
                className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                <Plus size={16} /> Créer le premier dossier
              </button>
            )}
          </div>
        ) : (
          <div ref={containerRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            className="touch-pan-y">
            <div style={{ transform: `translateX(${touchDelta * 0.3}px)`, transition: touchStart ? 'none' : 'transform 0.2s' }}>
              {paged.map((c, i) => (
                <div key={c.id}>
                  <CaseCard caseData={c} onLoad={() => handleLoad(c.id)} onDelete={() => handleDelete(c.id)}
                    isConfirmDelete={confirmDelete === c.id} />
                  {i < paged.length - 1 && <br />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`rounded-full transition-all ${
                  i === page ? 'w-5 h-2 bg-black' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                }`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CaseCard({ caseData: c, onLoad, onDelete, isConfirmDelete }: {
  caseData: CaseData; onLoad: () => void; onDelete: () => void; isConfirmDelete: boolean
}) {
  const patient = c.patient
  const intervention = c.intervention
  const eventsCount = c.evenements.length
  const bilanEntrees = c.bilan.filter((b) => b.type === 'entree').reduce((s, b) => s + b.volume, 0)
  const bilanSorties = c.bilan.filter((b) => b.type === 'sortie').reduce((s, b) => s + b.volume, 0)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors group">
      <div className="flex items-start justify-between">
        <button onClick={onLoad} className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {patient.nom || 'Sans nom'} {patient.prenom}
              </h3>
              <p className="text-xs text-gray-400">
                {intervention.type || 'Acte non renseigné'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-12 text-xs text-gray-400">
            {intervention.date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {intervention.date}
              </span>
            )}
            {intervention.chirurgien && (
              <span className="flex items-center gap-1">
                <Scissors size={12} /> Dr {intervention.chirurgien}
              </span>
            )}
            {eventsCount > 0 && (
              <span>{eventsCount} événement{eventsCount > 1 ? 's' : ''}</span>
            )}
          </div>
          {(bilanEntrees > 0 || bilanSorties > 0) && (
            <div className="flex items-center gap-3 mt-2 ml-12 text-[11px] text-gray-400">
              <span>In {bilanEntrees} mL</span>
              <span>Out {bilanSorties} mL</span>
              <span className={bilanEntrees - bilanSorties >= 0 ? 'text-gray-500' : 'text-red-500'}>
                Bilan {bilanEntrees - bilanSorties > 0 ? '+' : ''}{bilanEntrees - bilanSorties} mL
              </span>
            </div>
          )}
        </button>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={onDelete}
            className={`p-2 rounded-lg transition-colors ${isConfirmDelete ? 'bg-red-50 text-red-600' : 'text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'}`}>
            <Trash2 size={14} />
          </button>
          <button onClick={onLoad} className="p-2 text-gray-300 hover:text-black hover:bg-gray-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      {isConfirmDelete && (
        <p className="text-xs text-red-500 mt-2 ml-12">Appuyez à nouveau pour confirmer</p>
      )}
    </div>
  )
}
