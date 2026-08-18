import { useState, useEffect } from 'react'
import { useWorkflowStore } from './store/useWorkflowStore'
import { Stepper } from './components/Stepper'
import { Sidebar } from './components/Sidebar'
import { Activity, ArrowLeft, LogOut } from 'lucide-react'
import { DashboardPage } from './pages/DashboardPage'
import { FormulasPage } from './pages/FormulasPage'
import { ProfilePage } from './pages/ProfilePage'
import { AuthPage } from './pages/AuthPage'
import { isLoggedIn, logout, getCurrentUser, onAuthChange } from './lib/supabase'
import { useSessionTimeout } from './hooks/useSessionTimeout'
import {
  StepPatient,
  StepIntervention,
  StepMateriel,
  StepPreCheck,
  StepCEC,
  StepBilan,
  StepRapport,
} from './pages/Steps'

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { view, currentStep, caseData, goToDashboard, goToFormulas, goToProfile, saveCase } = useWorkflowStore()

  useEffect(() => {
    isLoggedIn().then((v) => {
      setAuthenticated(v)
      if (v) getCurrentUser().then(setUser)
    })

    const { data } = onAuthChange((session) => {
      setAuthenticated(!!session)
      if (session) {
        getCurrentUser().then(setUser)
      } else {
        setUser(null)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await logout()
    setAuthenticated(false)
    setUser(null)
  }

  useSessionTimeout(handleLogout)

  const userName = user?.user_metadata?.name

  const handleNavigate = (targetView: 'dashboard' | 'workflow' | 'formulas' | 'profile') => {
    if (targetView === 'dashboard') goToDashboard()
    else if (targetView === 'formulas') goToFormulas()
    else if (targetView === 'profile') goToProfile()
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return <AuthPage onAuth={() => { setAuthenticated(true); getCurrentUser().then(setUser) }} />
  }

  if (view === 'dashboard') {
    return (
      <div>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          view={view}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={userName}
        />
        <DashboardPage onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    )
  }

  if (view === 'formulas') {
    return (
      <div>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          view={view}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={userName}
        />
        <FormulasPage onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    )
  }

  if (view === 'profile') {
    return (
      <div>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          view={view}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={userName}
        />
        <ProfilePage onOpenSidebar={() => setSidebarOpen(true)} user={user} />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'patient': return <StepPatient />
      case 'intervention': return <StepIntervention />
      case 'materiel': return <StepMateriel />
      case 'pre-check': return <StepPreCheck />
      case 'cec': return <StepCEC />
      case 'bilan': return <StepBilan />
      case 'rapport': return <StepRapport />
      default: return <StepPatient />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userName}
      />

      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => { saveCase(); goToDashboard() }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 bg-black rounded-lg flex items-center justify-center"
            aria-label="Ouvrir le menu"
          >
            <Activity size={16} className="text-white" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {caseData.patient.nom || 'Nouveau dossier'} {caseData.patient.prenom}
            </h1>
            <p className="text-[11px] text-gray-400">
              {user?.user_metadata?.name || caseData.intervention.type || 'Dossier en cours'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {caseData.isRunning && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-medium text-green-700">CEC en cours</span>
            </div>
          )}
          <button onClick={handleLogout} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut size={16} className="text-gray-400" />
          </button>
        </div>
      </header>

      <Stepper />

      <main className="p-4 max-w-2xl mx-auto pb-8">
        {renderStep()}
      </main>
    </div>
  )
}