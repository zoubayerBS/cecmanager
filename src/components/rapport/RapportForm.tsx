import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { RapportCECSchema } from '../../rapport/types'
import type { RapportCEC } from '../../rapport/types'
import { useAutoSave } from '../../hooks/useAutoSave'
import { getRapport } from '../../rapport/storage'
import { FormSection } from './FormSection'
import { Field } from './Field'

const today = format(new Date(), 'yyyy-MM-dd')

function createEmptyRapport(): RapportCEC {
  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    identification: {
      nom: '', prenom: '', dateNaissance: '', poids: 70, taille: 170,
      sexe: 'M', dateIntervention: today, typeIntervention: '', chirurgien: '', anesthesiste: '',
    },
    equipe: { perfusionniste: '' },
    materiel: {
      oxygateur: '', circuit: '', canuleArterielle: '', canuleVeineuse: '',
      volumePrime: 1500,
    },
    parametres: {
      debitInitial: 4.5, debitMax: 5, pamMoyenne: 70, temperature: 37,
      modeTemperature: 'normothermie', hctDebut: 30, dureeCEC: 0,
    },
    bilan: {
      volumeInitial: 0, cristalloides: 0, colloides: 0, sang: 0, ffp: 0,
      plaquettes: 0, autreTransfusion: 0, diurese: 0, ultrafiltration: 0,
      pertesSanguines: 0, volumeRetour: 0,
    },
    anticoagulation: {
      doseInitialeHeperine: 300, actDebut: 0, actCible: 480, doseProtamine: 0,
    },
    medicaments: {},
    gaz: { modeGaz: 'alpha-stat' },
    incidents: {},
  }
}

interface RapportFormProps {
  rapportId?: string | null
  onSave: () => void
}

export function RapportForm({ rapportId, onSave }: RapportFormProps) {
  const [rapport, setRapport] = useState<RapportCEC>(createEmptyRapport())
  const [loading, setLoading] = useState(!!rapportId)

  useEffect(() => {
    if (rapportId) {
      getRapport(rapportId).then((found) => {
        if (found) setRapport(found)
        setLoading(false)
      })
    }
  }, [rapportId])

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const { saveNow } = useAutoSave(rapport)

  const updateSection = <T,>(section: keyof RapportCEC, field: keyof T, value: any) => {
    setRapport((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value },
      updatedAt: new Date().toISOString(),
    }))
  }

  const validate = (): boolean => {
    const result = RapportCECSchema.safeParse(rapport)
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (!fieldErrors[path]) fieldErrors[path] = []
        fieldErrors[path].push(issue.message)
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSave = () => {
    if (validate()) {
      saveNow()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      onSave()
    }
  }

  const id = rapport.identification

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse">
          Sauvegardé !
        </div>
      )}

      <FormSection title="Identification Patient & Intervention" icon="🏥" errors={errors['identification']}>
        <Field label="Nom" value={id.nom} onChange={(v) => updateSection('identification', 'nom', v)} required error={errors['identification.nom']?.[0]} />
        <Field label="Prénom" value={id.prenom} onChange={(v) => updateSection('identification', 'prenom', v)} required />
        <Field label="Date de naissance" type="date" value={id.dateNaissance} onChange={(v) => updateSection('identification', 'dateNaissance', v)} required />
        <Field label="Poids" type="number" value={id.poids} onChange={(v) => updateSection('identification', 'poids', v)} unit="kg" min={1} max={300} required />
        <Field label="Taille" type="number" value={id.taille} onChange={(v) => updateSection('identification', 'taille', v)} unit="cm" min={30} max={250} required />
        <Field label="Sexe" type="select" value={id.sexe} onChange={(v) => updateSection('identification', 'sexe', v)} options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]} required />
        <Field label="N° Dossier" value={id.numDossier || ''} onChange={(v) => updateSection('identification', 'numDossier', v)} placeholder="Optionnel" />
        <Field label="Groupe sanguin" value={id.groupeSanguin || ''} onChange={(v) => updateSection('identification', 'groupeSanguin', v)} placeholder="Ex: A+" />
        <Field label="Date intervention" type="date" value={id.dateIntervention} onChange={(v) => updateSection('identification', 'dateIntervention', v)} required />
        <Field label="Type d'intervention" value={id.typeIntervention} onChange={(v) => updateSection('identification', 'typeIntervention', v)} required />
        <Field label="Chirurgien" value={id.chirurgien} onChange={(v) => updateSection('identification', 'chirurgien', v)} required />
        <Field label="Anesthésiste" value={id.anesthesiste} onChange={(v) => updateSection('identification', 'anesthesiste', v)} required />
        <Field label="Opérateur" value={id.operateur || ''} onChange={(v) => updateSection('identification', 'operateur', v)} />
      </FormSection>

      <FormSection title="Équipe Chirurgicale" icon="👥">
        <Field label="Perfusionniste" value={rapport.equipe.perfusionniste} onChange={(v) => updateSection('equipe', 'perfusionniste', v)} required />
        <Field label="Assistance" value={rapport.equipe.assistance || ''} onChange={(v) => updateSection('equipe', 'assistance', v)} />
        <Field label="Chirurgien assistant" value={rapport.equipe.cirurgienAssistant || ''} onChange={(v) => updateSection('equipe', 'cirurgienAssistant', v)} />
        <Field label="Infirmier" value={rapport.equipe.infirmier || ''} onChange={(v) => updateSection('equipe', 'infirmier', v)} />
      </FormSection>

      <FormSection title="Matériel" icon="🔧">
        <Field label="Oxygénateur" value={rapport.materiel.oxygateur} onChange={(v) => updateSection('materiel', 'oxygateur', v)} required />
        <Field label="Circuit" value={rapport.materiel.circuit} onChange={(v) => updateSection('materiel', 'circuit', v)} required />
        <Field label="Canule artérielle" value={rapport.materiel.canuleArterielle} onChange={(v) => updateSection('materiel', 'canuleArterielle', v)} required />
        <Field label="Canule veineuse" value={rapport.materiel.canuleVeineuse} onChange={(v) => updateSection('materiel', 'canuleVeineuse', v)} required />
        <Field label="Canule aspiration" value={rapport.materiel.canuleAspiration || ''} onChange={(v) => updateSection('materiel', 'canuleAspiration', v)} />
        <Field label="Filtre" value={rapport.materiel.filtre || ''} onChange={(v) => updateSection('materiel', 'filtre', v)} />
        <Field label="Cardiotomie" value={rapport.materiel.cardiotomie || ''} onChange={(v) => updateSection('materiel', 'cardiotomie', v)} />
        <Field label="Volume prime" type="number" value={rapport.materiel.volumePrime} onChange={(v) => updateSection('materiel', 'volumePrime', v)} unit="mL" required />
        <div className="sm:col-span-2">
          <Field label="Autres" type="textarea" value={rapport.materiel.autres || ''} onChange={(v) => updateSection('materiel', 'autres', v)} rows={2} />
        </div>
      </FormSection>

      <FormSection title="Paramètres de Perfusion" icon="⚙️">
        <Field label="Débit initial" type="number" value={rapport.parametres.debitInitial} onChange={(v) => updateSection('parametres', 'debitInitial', v)} unit="L/min" step={0.1} />
        <Field label="Débit max" type="number" value={rapport.parametres.debitMax} onChange={(v) => updateSection('parametres', 'debitMax', v)} unit="L/min" step={0.1} />
        <Field label="PAM moyenne" type="number" value={rapport.parametres.pamMoyenne} onChange={(v) => updateSection('parametres', 'pamMoyenne', v)} unit="mmHg" />
        <Field label="Température" type="number" value={rapport.parametres.temperature} onChange={(v) => updateSection('parametres', 'temperature', v)} unit="°C" step={0.1} />
        <Field label="Mode température" type="select" value={rapport.parametres.modeTemperature} onChange={(v) => updateSection('parametres', 'modeTemperature', v)} options={[
          { value: 'normothermie', label: 'Normothermie' },
          { value: 'hypothermie', label: 'Hypothermie' },
          { value: 'refroidissement', label: 'Refroidissement' },
          { value: 'rechauffement', label: 'Réchauffement' },
        ]} />
        <Field label="Ht début" type="number" value={rapport.parametres.hctDebut} onChange={(v) => updateSection('parametres', 'hctDebut', v)} unit="%" min={0} max={100} />
        <Field label="Ht fin" type="number" value={rapport.parametres.hctFin || 0} onChange={(v) => updateSection('parametres', 'hctFin', v)} unit="%" min={0} max={100} />
        <Field label="Durée CEC" type="number" value={rapport.parametres.dureeCEC} onChange={(v) => updateSection('parametres', 'dureeCEC', v)} unit="min" required />
        <Field label="Durée clampage" type="number" value={rapport.parametres.dureeClampage || 0} onChange={(v) => updateSection('parametres', 'dureeClampage', v)} unit="min" />
        <Field label="Durée arrêt circ." type="number" value={rapport.parametres.dureeCircArrest || 0} onChange={(v) => updateSection('parametres', 'dureeCircArrest', v)} unit="min" />
      </FormSection>

      <FormSection title="Bilan Liquidien" icon="💧">
        <Field label="Volume initial" type="number" value={rapport.bilan.volumeInitial} onChange={(v) => updateSection('bilan', 'volumeInitial', v)} unit="mL" />
        <Field label="Cristalloïdes" type="number" value={rapport.bilan.cristalloides} onChange={(v) => updateSection('bilan', 'cristalloides', v)} unit="mL" />
        <Field label="Colloïdes" type="number" value={rapport.bilan.colloides} onChange={(v) => updateSection('bilan', 'colloides', v)} unit="mL" />
        <Field label="Sang (CGR)" type="number" value={rapport.bilan.sang} onChange={(v) => updateSection('bilan', 'sang', v)} unit="mL" />
        <Field label="FFP" type="number" value={rapport.bilan.ffp} onChange={(v) => updateSection('bilan', 'ffp', v)} unit="mL" />
        <Field label="Plaquettes" type="number" value={rapport.bilan.plaquettes} onChange={(v) => updateSection('bilan', 'plaquettes', v)} unit="mL" />
        <Field label="Autre transfusion" type="number" value={rapport.bilan.autreTransfusion} onChange={(v) => updateSection('bilan', 'autreTransfusion', v)} unit="mL" />
        <Field label="Diurèse" type="number" value={rapport.bilan.diurese} onChange={(v) => updateSection('bilan', 'diurese', v)} unit="mL" />
        <Field label="Ultrafiltration" type="number" value={rapport.bilan.ultrafiltration} onChange={(v) => updateSection('bilan', 'ultrafiltration', v)} unit="mL" />
        <Field label="Pertes sanguines" type="number" value={rapport.bilan.pertesSanguines} onChange={(v) => updateSection('bilan', 'pertesSanguines', v)} unit="mL" />
        <Field label="Volume retour" type="number" value={rapport.bilan.volumeRetour} onChange={(v) => updateSection('bilan', 'volumeRetour', v)} unit="mL" />
      </FormSection>

      <FormSection title="Anticoagulation & Médicaments" icon="💊">
        <Field label="Dose init. héparine" type="number" value={rapport.anticoagulation.doseInitialeHeperine} onChange={(v) => updateSection('anticoagulation', 'doseInitialeHeperine', v)} unit="UI/kg" />
        <Field label="ACT début" type="number" value={rapport.anticoagulation.actDebut} onChange={(v) => updateSection('anticoagulation', 'actDebut', v)} unit="sec" />
        <Field label="ACT cible" type="number" value={rapport.anticoagulation.actCible} onChange={(v) => updateSection('anticoagulation', 'actCible', v)} unit="sec" />
        <Field label="ACT fin" type="number" value={rapport.anticoagulation.actFin || 0} onChange={(v) => updateSection('anticoagulation', 'actFin', v)} unit="sec" />
        <Field label="HC début" type="number" value={rapport.anticoagulation.hcDebut || 0} onChange={(v) => updateSection('anticoagulation', 'hcDebut', v)} unit="UI/mL" step={0.1} />
        <Field label="HC fin" type="number" value={rapport.anticoagulation.hcFin || 0} onChange={(v) => updateSection('anticoagulation', 'hcFin', v)} unit="UI/mL" step={0.1} />
        <Field label="Dose protamine" type="number" value={rapport.anticoagulation.doseProtamine} onChange={(v) => updateSection('anticoagulation', 'doseProtamine', v)} unit="mg" />
        <div className="sm:col-span-2">
          <Field label="Antifibrinolytique" value={rapport.medicaments.antifibrinolytique || ''} onChange={(v) => updateSection('medicaments', 'antifibrinolytique', v)} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Vasopresseurs" value={rapport.medicaments.vasopresseurs || ''} onChange={(v) => updateSection('medicaments', 'vasopresseurs', v)} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Autres médicaments" type="textarea" value={rapport.medicaments.autres || ''} onChange={(v) => updateSection('medicaments', 'autres', v)} rows={2} />
        </div>
      </FormSection>

      <FormSection title="Gaz du Sang & Biologie" icon="🩸">
        <Field label="Mode gaz" type="select" value={rapport.gaz.modeGaz} onChange={(v) => updateSection('gaz', 'modeGaz', v)} options={[
          { value: 'alpha-stat', label: 'Alpha-stat' },
          { value: 'phstat', label: 'pH-stat' },
        ]} />
        <div />
        <p className="sm:col-span-2 text-sm font-medium text-gray-500 border-b border-gray-100 pb-1">Début CEC</p>
        <Field label="pH" type="number" value={rapport.gaz.phDebut || 0} onChange={(v) => updateSection('gaz', 'phDebut', v)} step={0.01} />
        <Field label="pCO₂" type="number" value={rapport.gaz.pco2Debut || 0} onChange={(v) => updateSection('gaz', 'pco2Debut', v)} unit="mmHg" />
        <Field label="pO₂" type="number" value={rapport.gaz.pao2Debut || 0} onChange={(v) => updateSection('gaz', 'pao2Debut', v)} unit="mmHg" />
        <Field label="HCO₃" type="number" value={rapport.gaz.hco3Debut || 0} onChange={(v) => updateSection('gaz', 'hco3Debut', v)} unit="mmol/L" />
        <Field label="BE" type="number" value={rapport.gaz.beDebut || 0} onChange={(v) => updateSection('gaz', 'beDebut', v)} unit="mmol/L" />
        <Field label="Lactates" type="number" value={rapport.gaz.lactatesDebut || 0} onChange={(v) => updateSection('gaz', 'lactatesDebut', v)} unit="mmol/L" step={0.1} />
        <Field label="K⁺" type="number" value={rapport.gaz.kDebut || 0} onChange={(v) => updateSection('gaz', 'kDebut', v)} unit="mmol/L" step={0.1} />
        <Field label="Ca²⁺" type="number" value={rapport.gaz.caDebut || 0} onChange={(v) => updateSection('gaz', 'caDebut', v)} unit="mmol/L" step={0.01} />
        <Field label="Hb" type="number" value={rapport.gaz.hbDebut || 0} onChange={(v) => updateSection('gaz', 'hbDebut', v)} unit="g/dL" step={0.1} />
        <Field label="Glycémie" type="number" value={rapport.gaz.glycDebut || 0} onChange={(v) => updateSection('gaz', 'glycDebut', v)} unit="mmol/L" step={0.1} />
        <p className="sm:col-span-2 text-sm font-medium text-gray-500 border-b border-gray-100 pb-1 pt-2">Fin CEC</p>
        <Field label="pH" type="number" value={rapport.gaz.phFin || 0} onChange={(v) => updateSection('gaz', 'phFin', v)} step={0.01} />
        <Field label="pCO₂" type="number" value={rapport.gaz.pco2Fin || 0} onChange={(v) => updateSection('gaz', 'pco2Fin', v)} unit="mmHg" />
        <Field label="pO₂" type="number" value={rapport.gaz.pao2Fin || 0} onChange={(v) => updateSection('gaz', 'pao2Fin', v)} unit="mmHg" />
        <Field label="HCO₃" type="number" value={rapport.gaz.hco3Fin || 0} onChange={(v) => updateSection('gaz', 'hco3Fin', v)} unit="mmol/L" />
        <Field label="BE" type="number" value={rapport.gaz.beFin || 0} onChange={(v) => updateSection('gaz', 'beFin', v)} unit="mmol/L" />
        <Field label="Lactates" type="number" value={rapport.gaz.lactatesFin || 0} onChange={(v) => updateSection('gaz', 'lactatesFin', v)} unit="mmol/L" step={0.1} />
        <Field label="K⁺" type="number" value={rapport.gaz.kFin || 0} onChange={(v) => updateSection('gaz', 'kFin', v)} unit="mmol/L" step={0.1} />
        <Field label="Ca²⁺" type="number" value={rapport.gaz.caFin || 0} onChange={(v) => updateSection('gaz', 'caFin', v)} unit="mmol/L" step={0.01} />
        <Field label="Hb" type="number" value={rapport.gaz.hbFin || 0} onChange={(v) => updateSection('gaz', 'hbFin', v)} unit="g/dL" step={0.1} />
        <Field label="Glycémie" type="number" value={rapport.gaz.glycFin || 0} onChange={(v) => updateSection('gaz', 'glycFin', v)} unit="mmol/L" step={0.1} />
      </FormSection>

      <FormSection title="Incidents & Complications" icon="⚠️">
        <div className="sm:col-span-2">
          <Field type="textarea" label="Incidents, complications, commentaires" value={rapport.incidents.commentaires || ''} onChange={(v) => updateSection('incidents', 'commentaires', v)} rows={5} placeholder="Décrire les incidents éventuels..." />
        </div>
      </FormSection>

      <div className="flex gap-3 sticky bottom-4">
        <button onClick={handleSave} className="flex-1 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg">
          Sauvegarder le rapport
        </button>
      </div>
    </div>
  )
}