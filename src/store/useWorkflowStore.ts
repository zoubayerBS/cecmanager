import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { saveCaseToDB, deleteCaseFromDB, fetchCases } from '../lib/cases'

// ===== Types =====
export type StepId = 'patient' | 'intervention' | 'materiel' | 'pre-check' | 'cec' | 'bilan' | 'rapport'

export interface Step {
  id: StepId
  label: string
  icon: string
  description: string
  completed: boolean
}

export interface PatientData {
  id: string
  nom: string
  prenom: string
  dateNaissance: string
  poids: number
  taille: number
  sexe: 'M' | 'F'
  groupeSanguin: string
  numDossier: string
  asa: string
}

export interface InterventionData {
  date: string
  type: string
  chirurgien: string
  anesthesiste: string
  perfusionniste: string
  assistant: string
}

export interface MaterielData {
  oxygateur: string
  circuit: string
  canuleArterielle: string
  canuleVeineuse: string
  volumePrime: number
  primeComposition: { name: string; quantite: number }[]
}

export interface ParametresData {
  debit: number
  pam: number
  temperature: number
  hct: number
  sao2: number
  svo2: number
  pao2: number
  pco2: number
  ph: number
  hb: number
  k: number
  lactates: number
  glycemie: number
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export interface BilanItem {
  id: string
  heure: string
  type: 'entree' | 'sortie'
  categorie: string
  volume: number
}

export interface Evenement {
  id: string
  heure: string
  type: string
  description: string
  note?: string
}

export interface ParamHistoryEntry {
  ts: string
  minute: number
  debit: number
  pam: number
  temperature: number
  hct: number
  pao2: number
  hb: number
  lactates: number
  k: number
}

export interface CardioplegieData {
  type: 'sang_froide' | 'sang_chaude' | 'cristalloide_froide' | 'del_nido' | 'custodiol' | 'st_thomas' | 'mixte' | ''
  voie: 'anterograde' | 'retrograde' | 'mixte' | ''
  volume: number
  concentration: string
  temperature: number
  arretAortique: boolean
  administrations: { heure: string; volume: number; type: string }[]
}

export interface CaseData {
  id: string
  patient: PatientData
  intervention: InterventionData
  materiel: MaterielData
  parametres: ParametresData
  cardioplegie: CardioplegieData
  checklistPre: ChecklistItem[]
  checklistPost: ChecklistItem[]
  bilan: BilanItem[]
  evenements: Evenement[]
  paramHistory: ParamHistoryEntry[]
  isRunning: boolean
  startTime: string | null
  endTime: string | null
  clampStartTime: string | null
  clampEndTime: string | null
  notes: string
}

// ===== Store =====
type ViewMode = 'dashboard' | 'workflow'

interface WorkflowStore {
  view: ViewMode
  steps: Step[]
  currentStep: StepId
  caseData: CaseData
  cases: CaseData[]

  goToDashboard: () => void
  goToStep: (step: StepId) => void
  nextStep: () => void
  prevStep: () => void
  completeStep: (step: StepId) => void

  updatePatient: (data: Partial<PatientData>) => void
  updateIntervention: (data: Partial<InterventionData>) => void
  updateMateriel: (data: Partial<MaterielData>) => void
  updateParametres: (data: Partial<ParametresData>) => void
  updateCardioplegie: (data: Partial<CardioplegieData>) => void
  addAdminCardio: (admin: { heure: string; volume: number; type: string }) => void
  removeAdminCardio: (index: number) => void
  addPrimeItem: (item: { name: string; quantite: number }) => void
  removePrimeItem: (index: number) => void
  updatePrimeItem: (index: number, data: { name?: string; quantite?: number }) => void
  toggleChecklist: (section: 'pre' | 'post', id: string) => void
  addBilanItem: (item: Omit<BilanItem, 'id'>) => void
  removeBilanItem: (id: string) => void
  addEvenement: (evt: Omit<Evenement, 'id'>) => void
  removeEvenement: (id: string) => void
  setNotes: (notes: string) => void

  startCEC: () => void
  stopCEC: () => void
  startClampage: () => void
  stopClampage: () => void
  saveCase: () => void
  loadCase: (id: string) => void
  deleteCase: (id: string) => void
  fetchCases: () => Promise<void>
  newCase: () => void
}

const STEPS: Step[] = [
  { id: 'patient', label: 'Patient', icon: '👤', description: 'Identification', completed: false },
  { id: 'intervention', label: 'Intervention', icon: '🔪', description: 'Équipe & Chirurgie', completed: false },
  { id: 'materiel', label: 'Matériel', icon: '🔧', description: 'Circuit & Canules', completed: false },
  { id: 'pre-check', label: 'Pré-CEC', icon: '✅', description: 'Check-list', completed: false },
  { id: 'cec', label: 'CEC', icon: '🫀', description: 'Perfusion active', completed: false },
  { id: 'bilan', label: 'Bilan', icon: '💧', description: 'In/Out & Fin', completed: false },
  { id: 'rapport', label: 'Rapport', icon: '📄', description: 'Export & Sauvegarde', completed: false },
]

function createNewCase(): CaseData {
  return {
    id: uuidv4(),
    patient: {
      id: uuidv4(),
      nom: '', prenom: '', dateNaissance: '', poids: 70, taille: 170,
      sexe: 'M', groupeSanguin: '', numDossier: '', asa: '',
    },
    intervention: {
      date: new Date().toISOString().split('T')[0],
      type: '', chirurgien: '', anesthesiste: '', perfusionniste: '', assistant: '',
    },
    materiel: {
      oxygateur: '', circuit: '', canuleArterielle: '', canuleVeineuse: '',
      volumePrime: 1500, primeComposition: [{ name: 'NaCl 0.9%', quantite: 1000 }],
    },
    parametres: {
      debit: 4.5, pam: 70, temperature: 37, hct: 30, sao2: 100, svo2: 75,
      pao2: 200, pco2: 40, ph: 7.40, hb: 12, k: 4.0, lactates: 1.0, glycemie: 6.0,
    },
    cardioplegie: {
      type: '', voie: '', volume: 0, concentration: '', temperature: 4,
      arretAortique: false, administrations: [],
    },
    checklistPre: [
      { id: '1', label: 'Patient identifié, consentement vérifié', checked: false },
      { id: '2', label: 'ACT basale mesuré', checked: false },
      { id: '3', label: 'Héparine dose préparée (300 UI/kg)', checked: false },
      { id: '4', label: 'Circuit vérifié, absence d\'air', checked: false },
      { id: '5', label: 'Oxygénateur fonctionnel', checked: false },
      { id: '6', label: 'Canules prêtes et vérifiées', checked: false },
      { id: '7', label: 'Sang de réserve disponible', checked: false },
      { id: '8', label: 'Protamine dose estimée', checked: false },
      { id: '9', label: 'Température cible définie', checked: false },
      { id: '10', label: 'Moniteurs configurés', checked: false },
    ],
    checklistPost: [
      { id: '1', label: 'Héparine neutralisée', checked: false },
      { id: '2', label: 'ACT de retour < 130 sec', checked: false },
      { id: '3', label: 'Sang restitutionné', checked: false },
      { id: '4', label: 'Circuit déconnecté, compté', checked: false },
      { id: '5', label: 'Canules retirées', checked: false },
      { id: '6', label: 'Bilan final vérifié', checked: false },
      { id: '7', label: 'Rapport complété', checked: false },
    ],
    bilan: [],
    evenements: [],
    paramHistory: [],
    isRunning: false,
    startTime: null,
    endTime: null,
    clampStartTime: null,
    clampEndTime: null,
    notes: '',
  }
}

function migrateCase(c: any): CaseData {
  const def = createNewCase()
  return {
    ...def,
    ...c,
    patient: { ...def.patient, ...(c.patient || {}) },
    intervention: { ...def.intervention, ...(c.intervention || {}) },
    materiel: { ...def.materiel, ...(c.materiel || {}), primeComposition: c.materiel?.primeComposition || def.materiel.primeComposition },
    parametres: { ...def.parametres, ...(c.parametres || {}) },
    cardioplegie: { ...def.cardioplegie, ...(c.cardioplegie || {}), administrations: c.cardioplegie?.administrations || [] },
    checklistPre: c.checklistPre || def.checklistPre,
    checklistPost: c.checklistPost || def.checklistPost,
    bilan: c.bilan || [],
    evenements: c.evenements || [],
    paramHistory: c.paramHistory || [],
    isRunning: c.isRunning ?? false,
    startTime: c.startTime ?? null,
    endTime: c.endTime ?? null,
    clampStartTime: c.clampStartTime ?? null,
    clampEndTime: c.clampEndTime ?? null,
    notes: c.notes ?? '',
  }
}

const STEP_ORDER: StepId[] = ['patient', 'intervention', 'materiel', 'pre-check', 'cec', 'bilan', 'rapport']

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  view: 'dashboard',
  steps: STEPS,
  currentStep: 'patient',
  caseData: createNewCase(),
  cases: [],

  goToDashboard: () => set({ view: 'dashboard' }),
  goToStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get()
    const idx = STEP_ORDER.indexOf(currentStep)
    if (idx < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[idx + 1] })
    }
  },
  
  prevStep: () => {
    const { currentStep } = get()
    const idx = STEP_ORDER.indexOf(currentStep)
    if (idx > 0) {
      set({ currentStep: STEP_ORDER[idx - 1] })
    }
  },
  
  completeStep: (step) => set((s) => ({
    steps: s.steps.map((st) => st.id === step ? { ...st, completed: true } : st)
  })),

  updatePatient: (data) => set((s) => ({
    caseData: { ...s.caseData, patient: { ...s.caseData.patient, ...data } }
  })),
  updateIntervention: (data) => set((s) => ({
    caseData: { ...s.caseData, intervention: { ...s.caseData.intervention, ...data } }
  })),
  updateMateriel: (data) => set((s) => ({
    caseData: { ...s.caseData, materiel: { ...s.caseData.materiel, ...data } }
  })),
  updateParametres: (data) => set((s) => {
    const newParams = { ...s.caseData.parametres, ...data }
    const shouldRecord = s.caseData.isRunning && s.caseData.startTime
    let paramHistory = s.caseData.paramHistory
    if (shouldRecord) {
      const now = new Date()
      const minute = Math.floor((now.getTime() - new Date(s.caseData.startTime!).getTime()) / 60000)
      const entry: ParamHistoryEntry = {
        ts: now.toISOString(),
        minute,
        debit: newParams.debit,
        pam: newParams.pam,
        temperature: newParams.temperature,
        hct: newParams.hct,
        pao2: newParams.pao2,
        hb: newParams.hb,
        lactates: newParams.lactates,
        k: newParams.k,
      }
      paramHistory = [...paramHistory, entry]
    }
    return { caseData: { ...s.caseData, parametres: newParams, paramHistory } }
  }),
  updateCardioplegie: (data) => set((s) => ({
    caseData: { ...s.caseData, cardioplegie: { ...s.caseData.cardioplegie, ...data } }
  })),
  addAdminCardio: (admin) => set((s) => ({
    caseData: {
      ...s.caseData,
      cardioplegie: { ...s.caseData.cardioplegie, administrations: [...s.caseData.cardioplegie.administrations, admin] },
      bilan: [...s.caseData.bilan, { id: uuidv4(), heure: admin.heure, type: 'entree' as const, categorie: 'Cardioplégie', volume: admin.volume }],
    }
  })),
  removeAdminCardio: (index) => set((s) => {
    const admin = s.caseData.cardioplegie.administrations[index]
    const cardioBilan = s.caseData.bilan.filter(b => !(b.categorie === 'Cardioplégie' && b.heure === admin?.heure && b.volume === admin?.volume))
    return {
      caseData: {
        ...s.caseData,
        cardioplegie: { ...s.caseData.cardioplegie, administrations: s.caseData.cardioplegie.administrations.filter((_, i) => i !== index) },
        bilan: cardioBilan,
      }
    }
  }),
  addPrimeItem: (item) => set((s) => ({
    caseData: { ...s.caseData, materiel: { ...s.caseData.materiel, primeComposition: [...s.caseData.materiel.primeComposition, item] } }
  })),
  removePrimeItem: (index) => set((s) => ({
    caseData: { ...s.caseData, materiel: { ...s.caseData.materiel, primeComposition: s.caseData.materiel.primeComposition.filter((_, i) => i !== index) } }
  })),
  updatePrimeItem: (index, data) => set((s) => ({
    caseData: { ...s.caseData, materiel: { ...s.caseData.materiel, primeComposition: s.caseData.materiel.primeComposition.map((item, i) => i === index ? { ...item, ...data } : item) } }
  })),

  toggleChecklist: (section, id) => set((s) => ({
    caseData: {
      ...s.caseData,
      [section === 'pre' ? 'checklistPre' : 'checklistPost']:
        (section === 'pre' ? s.caseData.checklistPre : s.caseData.checklistPost).map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
    }
  })),

  addBilanItem: (item) => set((s) => ({
    caseData: { ...s.caseData, bilan: [...s.caseData.bilan, { ...item, id: uuidv4() }] }
  })),
  removeBilanItem: (id) => set((s) => ({
    caseData: { ...s.caseData, bilan: s.caseData.bilan.filter((i) => i.id !== id) }
  })),

  addEvenement: (evt) => set((s) => ({
    caseData: { ...s.caseData, evenements: [...s.caseData.evenements, { ...evt, id: uuidv4() }] }
  })),
  removeEvenement: (id) => set((s) => ({
    caseData: { ...s.caseData, evenements: s.caseData.evenements.filter((e) => e.id !== id) }
  })),

  setNotes: (notes) => set((s) => ({
    caseData: { ...s.caseData, notes }
  })),

  startCEC: () => {
    const now = new Date().toISOString()
    const heure = new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    set((s) => ({
      caseData: {
        ...s.caseData,
        isRunning: true,
        startTime: now,
        endTime: null,
        evenements: [...s.caseData.evenements, { id: uuidv4(), heure, type: 'départ cec', description: 'Départ CEC' }],
      }
    }))
  },
  stopCEC: () => {
    const now = new Date().toISOString()
    const heure = new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    set((s) => ({
      caseData: {
        ...s.caseData,
        isRunning: false,
        endTime: now,
        clampStartTime: null,
        clampEndTime: null,
        evenements: [...s.caseData.evenements, { id: uuidv4(), heure, type: 'fin cec', description: 'Fin CEC' }],
      }
    }))
  },

  startClampage: () => {
    const now = new Date().toISOString()
    const heure = new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    set((s) => ({
      caseData: {
        ...s.caseData,
        clampStartTime: now,
        clampEndTime: null,
        evenements: [...s.caseData.evenements, { id: uuidv4(), heure, type: 'clampage aortique', description: 'Clampage aortique' }],
      }
    }))
  },
  stopClampage: () => {
    const now = new Date().toISOString()
    const heure = new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    set((s) => ({
      caseData: {
        ...s.caseData,
        clampEndTime: now,
        evenements: [...s.caseData.evenements, { id: uuidv4(), heure, type: 'déclampage aortique', description: 'Déclampage aortique' }],
      }
    }))
  },

  saveCase: async () => {
    const { caseData, cases } = get()
    try {
      await saveCaseToDB(caseData)
      const idx = cases.findIndex((c) => c.id === caseData.id)
      const updated = idx >= 0 ? cases.map((c) => c.id === caseData.id ? caseData : c) : [caseData, ...cases]
      set({ cases: updated })
    } catch (err) {
      console.error('Failed to save case:', err)
    }
  },

  loadCase: (id) => {
    const { cases } = get()
    const found = cases.find((c) => c.id === id)
    if (found) set({ caseData: migrateCase(found), currentStep: 'patient', view: 'workflow', steps: STEPS.map((s) => ({ ...s, completed: false })) })
  },

  newCase: () => set({
    caseData: createNewCase(),
    currentStep: 'patient',
    view: 'workflow',
    steps: STEPS.map((s) => ({ ...s, completed: false })),
  }),

  deleteCase: async (id) => {
    try {
      await deleteCaseFromDB(id)
      const { cases } = get()
      set({ cases: cases.filter((c) => c.id !== id) })
    } catch (err) {
      console.error('Failed to delete case:', err)
    }
  },

  fetchCases: async () => {
    try {
      const cases = await fetchCases()
      set({ cases: cases.map(migrateCase) })
    } catch (err) {
      console.error('Failed to fetch cases:', err)
    }
  },
}))