import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Patient {
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
  EuroSCORE: string
}

export interface Intervention {
  date: string
  type: string
  chirurgien: string
  anesthesiste: string
  perfusionniste: string
  cirurgienAssistant: string
  infirmier: string
}

export interface MaterielCEC {
  oxygateur: string
  circuit: string
  canuleArterielle: string
  canuleVeineuse: string
  canuleAspiration: string
  filtre: string
  cardiotomie: string
  volumePrime: number
  primeComposition: { name: string; quantite: number }[]
}

export interface Parametres {
  debit: number
  pam: number
  temperature: number
  modeTemp: 'normothermie' | 'hypothermie' | 'rechauffement'
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

export interface BilanItem {
  id: string
  heure: string
  type: 'entree' | 'sortie'
  categorie: string
  description: string
  volume: number
}

export interface Evenement {
  id: string
  heure: string
  type: 'heparine' | 'clampage' | 'declampage' | 'arce' | 'reprise' | 'gaz' | 'transfusion' | 'medicament' | 'incident' | 'autre'
  description: string
  details: string
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  who: string
}

export interface CaseState {
  patient: Patient
  intervention: Intervention
  materiel: MaterielCEC
  parametres: Parametres
  bilan: BilanItem[]
  evenements: Evenement[]
  checklistPre: ChecklistItem[]
  checklistPost: ChecklistItem[]
  dureeCEC: number
  dureeClampage: number
  dureeArrest: number
  isRunning: boolean
  startTime: string | null

  updatePatient: (data: Partial<Patient>) => void
  updateIntervention: (data: Partial<Intervention>) => void
  updateMateriel: (data: Partial<MaterielCEC>) => void
  updateParametres: (data: Partial<Parametres>) => void
  addBilanItem: (item: Omit<BilanItem, 'id'>) => void
  removeBilanItem: (id: string) => void
  addEvenement: (evt: Omit<Evenement, 'id'>) => void
  removeEvenement: (id: string) => void
  toggleChecklist: (section: 'pre' | 'post', id: string) => void
  startCEC: () => void
  stopCEC: () => void
  reset: () => void
}

const defaultPatient: Patient = {
  id: uuidv4(),
  nom: '', prenom: '', dateNaissance: '', poids: 70, taille: 170,
  sexe: 'M', groupeSanguin: '', numDossier: '', asa: '', EuroSCORE: '',
}

const defaultIntervention: Intervention = {
  date: new Date().toISOString().split('T')[0],
  type: '', chirurgien: '', anesthesiste: '', perfusionniste: '',
  cirurgienAssistant: '', infirmier: '',
}

const defaultMateriel: MaterielCEC = {
  oxygateur: '', circuit: '', canuleArterielle: '', canuleVeineuse: '',
  canuleAspiration: '', filtre: '', cardiotomie: '', volumePrime: 1500,
      primeComposition: [{ name: 'NaCl 0.9%', quantite: 1000 }],
}

const defaultParametres: Parametres = {
  debit: 4.5, pam: 70, temperature: 37, modeTemp: 'normothermie',
  hct: 30, sao2: 100, svo2: 75, pao2: 200, pco2: 40, ph: 7.40,
  hb: 12, k: 4.0, lactates: 1.0, glycemie: 6.0,
}

const defaultChecklistPre: ChecklistItem[] = [
  { id: '1', label: 'Patient identifié, consentement vérifié', checked: false, who: 'Chirurgien' },
  { id: '2', label: 'ACT basale mesuré', checked: false, who: 'Perfusionniste' },
  { id: '3', label: 'Héparine dose préparée (300 UI/kg)', checked: false, who: 'Anesthésiste' },
  { id: '4', label: 'Circuit vérifié, absence d\'air', checked: false, who: 'Perfusionniste' },
  { id: '5', label: 'Oxygénateur fonctionnel, gaz configurés', checked: false, who: 'Perfusionniste' },
  { id: '6', label: 'Canules prêtes et vérifiées', checked: false, who: 'Chirurgien' },
  { id: '7', label: 'Sang de réserve disponible', checked: false, who: 'Infirmier' },
  { id: '8', label: 'Protamine dose estimée', checked: false, who: 'Perfusionniste' },
  { id: '9', label: 'Température cible définie', checked: false, who: 'Équipe' },
  { id: '10', label: 'Moniteurs configurés (SvO₂, ScO₂)', checked: false, who: 'Perfusionniste' },
]

const defaultChecklistPost: ChecklistItem[] = [
  { id: '1', label: 'Héparine neutralisée (protamine administée)', checked: false, who: 'Perfusionniste' },
  { id: '2', label: 'ACT de retour < 130 sec', checked: false, who: 'Perfusionniste' },
  { id: '3', label: 'Sang restitutionné au patient', checked: false, who: 'Perfusionniste' },
  { id: '4', label: 'Circuit déconnecté, compté', checked: false, who: 'Infirmier' },
  { id: '5', label: 'Canules retirées, hémostase', checked: false, who: 'Chirurgien' },
  { id: '6', label: 'Bilan final vérifié', checked: false, who: 'Perfusionniste' },
  { id: '7', label: 'Rapport complété et signé', checked: false, who: 'Perfusionniste' },
]

export const useCaseStore = create<CaseState>((set) => ({
  patient: defaultPatient,
  intervention: defaultIntervention,
  materiel: defaultMateriel,
  parametres: defaultParametres,
  bilan: [],
  evenements: [],
  checklistPre: defaultChecklistPre,
  checklistPost: defaultChecklistPost,
  dureeCEC: 0,
  dureeClampage: 0,
  dureeArrest: 0,
  isRunning: false,
  startTime: null,

  updatePatient: (data) => set((s) => ({ patient: { ...s.patient, ...data } })),
  updateIntervention: (data) => set((s) => ({ intervention: { ...s.intervention, ...data } })),
  updateMateriel: (data) => set((s) => ({ materiel: { ...s.materiel, ...data } })),
  updateParametres: (data) => set((s) => ({ parametres: { ...s.parametres, ...data } })),
  
  addBilanItem: (item) => set((s) => ({
    bilan: [...s.bilan, { ...item, id: uuidv4() }]
  })),
  removeBilanItem: (id) => set((s) => ({
    bilan: s.bilan.filter((i) => i.id !== id)
  })),
  
  addEvenement: (evt) => set((s) => ({
    evenements: [...s.evenements, { ...evt, id: uuidv4() }]
  })),
  removeEvenement: (id) => set((s) => ({
    evenements: s.evenements.filter((e) => e.id !== id)
  })),
  
  toggleChecklist: (section, id) => set((s) => ({
    [section === 'pre' ? 'checklistPre' : 'checklistPost']:
      (section === 'pre' ? s.checklistPre : s.checklistPost).map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
  })),
  
  startCEC: () => set({ isRunning: true, startTime: new Date().toISOString() }),
  stopCEC: () => set((s) => ({
    isRunning: false,
    dureeCEC: s.startTime ? Math.round((Date.now() - new Date(s.startTime).getTime()) / 60000) : 0
  })),
  reset: () => set({
    patient: defaultPatient,
    intervention: { ...defaultIntervention, date: new Date().toISOString().split('T')[0] },
    materiel: defaultMateriel,
    parametres: defaultParametres,
    bilan: [],
    evenements: [],
    checklistPre: defaultChecklistPre,
    checklistPost: defaultChecklistPost,
    dureeCEC: 0, dureeClampage: 0, dureeArrest: 0,
    isRunning: false, startTime: null,
  }),
}))