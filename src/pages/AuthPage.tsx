import { useState } from 'react'
import { Activity, Mail, Lock, User, ArrowRight, Eye, EyeOff, Stethoscope } from 'lucide-react'
import { login, register } from '../lib/supabase'

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score, label: 'Faible', color: 'bg-red-500' }
  if (score <= 2) return { score, label: 'Moyen', color: 'bg-orange-500' }
  if (score <= 3) return { score, label: 'Correct', color: 'bg-yellow-500' }
  if (score <= 4) return { score, label: 'Fort', color: 'bg-green-500' }
  return { score, label: 'Très fort', color: 'bg-green-600' }
}

interface AuthPageProps {
  onAuth: () => void
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        const strength = getPasswordStrength(password)
        if (strength.score < 2) {
          setError('Le mot de passe est trop faible. Utilisez 8+ caractères avec majuscules, chiffres et symboles.')
          setLoading(false)
          return
        }
      }
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name)
      }
      onAuth()
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CEC Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Dossier médical de perfusion</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            Connexion
          </button>
          <button onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            Inscription
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              {mode === 'login' ? <Lock size={18} className="text-gray-600" /> : <User size={18} className="text-gray-600" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
              </h2>
              <p className="text-xs text-gray-400">
                {mode === 'login' ? 'Connectez-vous à votre espace' : 'Rejoignez l\'équipe'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" required autoFocus
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-gray-400 focus:bg-white focus:outline-none transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse email" required autoFocus={mode === 'login'}
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-gray-400 focus:bg-white focus:outline-none transition-colors" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required minLength={6}
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-gray-400 focus:bg-white focus:outline-none transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'register' && password.length > 0 && (() => {
                const strength = getPasswordStrength(password)
                return (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.score ? strength.color : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400">Force: {strength.label}</p>
                  </div>
                )
              })()}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Chargement…
                </span>
              ) : (
                <>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-300 mt-6">
          <Activity size={12} className="inline -mt-0.5" /> CEC Manager — Perfusio
        </p>
      </div>
    </div>
  )
}