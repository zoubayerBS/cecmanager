import { z } from 'zod'

export const PatientSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().max(200).optional(),
  prenom: z.string().max(200).optional(),
  dateNaissance: z.string().max(10).optional(),
  poids: z.number().min(0).max(300),
  taille: z.number().min(0).max(250),
  sexe: z.enum(['M', 'F']),
  groupeSanguin: z.string().max(10).optional(),
  numDossier: z.string().max(50).optional(),
  asa: z.string().max(10).optional(),
})

export const InterventionSchema = z.object({
  date: z.string().max(10).optional(),
  type: z.string().max(200).optional(),
  chirurgien: z.string().max(200).optional(),
  anesthesiste: z.string().max(200).optional(),
  perfusionniste: z.string().max(200).optional(),
  assistant: z.string().max(200).optional(),
})

export const MaterielSchema = z.object({
  oxygateur: z.string().max(200).optional(),
  circuit: z.string().max(200).optional(),
  canuleArterielle: z.string().max(50).optional(),
  canuleVeineuse: z.string().max(50).optional(),
  volumePrime: z.number().min(0).max(10000),
  primeComposition: z.array(z.object({
    name: z.string().max(200),
    quantite: z.number().min(0).max(10000),
  })),
})

export const ParametresSchema = z.object({
  debit: z.number().min(0).max(20),
  pam: z.number().min(0).max(200),
  temperature: z.number().min(15).max(42),
  hct: z.number().min(0).max(100),
  sao2: z.number().min(0).max(100),
  svo2: z.number().min(0).max(100),
  pao2: z.number().min(0).max(600),
  pco2: z.number().min(0).max(100),
  ph: z.number().min(6).max(8),
  hb: z.number().min(0).max(25),
  k: z.number().min(0).max(10),
  lactates: z.number().min(0).max(50),
  glycemie: z.number().min(0).max(50),
})

export const EvenementSchema = z.object({
  id: z.string().uuid(),
  heure: z.string().max(5),
  type: z.string().max(100),
  description: z.string().max(500),
  note: z.string().max(2000).optional(),
})

export const BilanItemSchema = z.object({
  id: z.string().uuid(),
  heure: z.string().max(5),
  type: z.enum(['entree', 'sortie']),
  categorie: z.string().max(100),
  volume: z.number().min(0).max(50000),
})

export function sanitizeString(input: string, maxLen: number): string {
  return input.replace(/[<>"'&]/g, '').slice(0, maxLen)
}