import { z } from 'zod'

// ===== Identification Patient =====
export const IdentificationSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  dateNaissance: z.string().min(1, 'Date de naissance requise'),
  poids: z.number().min(1, 'Poids requis').max(300),
  taille: z.number().min(30, 'Taille requise').max(250),
  sexe: z.enum(['M', 'F']),
  groupeSanguin: z.string().optional(),
  numDossier: z.string().optional(),
  dateIntervention: z.string().min(1, 'Date requise'),
  typeIntervention: z.string().min(1, 'Type d\'intervention requis'),
  chirurgien: z.string().min(1, 'Chirurgien requis'),
  anesthesiste: z.string().min(1, 'Anesthésiste requis'),
  operateur: z.string().optional(),
})
export type Identification = z.infer<typeof IdentificationSchema>

// ===== Équipe =====
export const EquipeSchema = z.object({
  perfusionniste: z.string().min(1, 'Perfusionniste requis'),
  assistance: z.string().optional(),
  cirurgienAssistant: z.string().optional(),
  infirmier: z.string().optional(),
})
export type Equipe = z.infer<typeof EquipeSchema>

// ===== Matériel =====
export const MaterielSchema = z.object({
  oxygateur: z.string().min(1, 'Oxygénateur requis'),
  circuit: z.string().min(1, 'Circuit requis'),
  canuleArterielle: z.string().min(1, 'Canule artérielle requise'),
  canuleVeineuse: z.string().min(1, 'Canule veineuse requise'),
  canuleAspiration: z.string().optional(),
  filtre: z.string().optional(),
  cardiotomie: z.string().optional(),
  volumePrime: z.number().min(0, 'Volume prime requis'),
  autres: z.string().optional(),
})
export type Materiel = z.infer<typeof MaterielSchema>

// ===== Paramètres Perfusion =====
export const ParametresPerfusionSchema = z.object({
  debitInitial: z.number().min(0),
  debitMax: z.number().min(0),
  pamMoyenne: z.number().min(0),
  temperature: z.number(),
  modeTemperature: z.enum(['normothermie', 'hypothermie', 'refroidissement', 'rechauffement']),
  hctDebut: z.number().min(0).max(100),
  hctFin: z.number().min(0).max(100).optional(),
  nbAjoutsHeparine: z.number().optional(),
  dureeCEC: z.number().min(0, 'Durée CEC requise'),
  dureeClampage: z.number().optional(),
  dureeCircArrest: z.number().optional(),
})
export type ParametresPerfusion = z.infer<typeof ParametresPerfusionSchema>

// ===== Bilan Liquidien =====
export const BilanLiquidienSchema = z.object({
  volumeInitial: z.number().min(0),
  cristalloides: z.number().min(0),
  colloides: z.number().min(0),
  sang: z.number().min(0),
  ffp: z.number().min(0),
  plaquettes: z.number().min(0),
  autreTransfusion: z.number().min(0),
  diurese: z.number().min(0),
  ultrafiltration: z.number().min(0),
  pertesSanguines: z.number().min(0),
  volumeRetour: z.number().min(0),
  bilanFinal: z.number().optional(),
})
export type BilanLiquidien = z.infer<typeof BilanLiquidienSchema>

// ===== Anticoagulation =====
export const AnticoagulationSchema = z.object({
  doseInitialeHeperine: z.number().min(0),
  actDebut: z.number().min(0),
  actCible: z.number().min(0),
  actFin: z.number().optional(),
  doseSupplementaire: z.number().optional(),
  hcDebut: z.number().optional(),
  hcFin: z.number().optional(),
  doseProtamine: z.number().min(0),
  protocole: z.string().optional(),
})
export type Anticoagulation = z.infer<typeof AnticoagulationSchema>

// ===== Médicaments =====
export const MedicamentsSchema = z.object({
  antifibrinolytique: z.string().optional(),
  doseAntifibrinolytique: z.string().optional(),
  vasopresseurs: z.string().optional(),
  vasodilatateurs: z.string().optional(),
  autres: z.string().optional(),
})
export type Medicaments = z.infer<typeof MedicamentsSchema>

// ===== Gaz du sang =====
export const GazSchema = z.object({
  phDebut: z.number().min(6).max(8).optional(),
  pco2Debut: z.number().min(0).optional(),
  pao2Debut: z.number().min(0).optional(),
  hco3Debut: z.number().min(0).optional(),
  beDebut: z.number().optional(),
  lactatesDebut: z.number().min(0).optional(),
  phFin: z.number().min(6).max(8).optional(),
  pco2Fin: z.number().min(0).optional(),
  pao2Fin: z.number().min(0).optional(),
  hco3Fin: z.number().min(0).optional(),
  beFin: z.number().optional(),
  lactatesFin: z.number().min(0).optional(),
  kDebut: z.number().optional(),
  kFin: z.number().optional(),
  caDebut: z.number().optional(),
  caFin: z.number().optional(),
  hbDebut: z.number().min(0).optional(),
  hbFin: z.number().min(0).optional(),
  glycDebut: z.number().optional(),
  glycFin: z.number().optional(),
  modeGaz: z.enum(['alpha-stat', 'phstat']),
})
export type Gaz = z.infer<typeof GazSchema>

// ===== Incidents =====
export const IncidentsSchema = z.object({
  incidents: z.array(z.object({
    heure: z.string(),
    description: z.string(),
    action: z.string(),
    gravite: z.enum(['mineur', 'modere', 'grave']),
  })).optional(),
  commentaires: z.string().optional(),
})
export type Incidents = z.infer<typeof IncidentsSchema>

// ===== Rapport Complet =====
export const RapportCECSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  identification: IdentificationSchema,
  equipe: EquipeSchema,
  materiel: MaterielSchema,
  parametres: ParametresPerfusionSchema,
  bilan: BilanLiquidienSchema,
  anticoagulation: AnticoagulationSchema,
  medicaments: MedicamentsSchema,
  gaz: GazSchema,
  incidents: IncidentsSchema,
})
export type RapportCEC = z.infer<typeof RapportCECSchema>