import { useState, useEffect, useRef } from 'react'
import { useWorkflowStore } from '../store/useWorkflowStore'
import { Graphiques } from '../components/Graphiques'
import {
  User, Scissors, Wrench, ClipboardCheck, Activity,
  Droplets, FileText, ChevronRight, ChevronLeft,
  Plus, Trash2, Play, Square, Clock, X, FlaskConical,
  Beaker, HeartPulse, Thermometer, Wind, Zap, Lock, Unlock,
} from 'lucide-react'

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rand(min: number, max: number) { return Math.round((Math.random() * (max - min) + min) * 10) / 10 }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function fillRandomData(updatePatient: any, updateIntervention: any, updateMateriel: any, updateParametres: any, addEvenement: any, addBilanItem: any) {
  const noms = ['Dupont', 'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Leroy', 'Moreau', 'Simon', 'Laurent']
  const prenoms = ['Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Marie', 'Françoise', 'Catherine', 'Sylvie', 'Nathalie']
  const actes = ['PAC (Pontage coronarien)', 'PAC x3', 'Remplacement valve mitrale', 'Réparation valve aortique', 'CLOS (Closure of ASD/VSD)', 'Myxome atrial gauche', 'Transplantation cardiaque', 'Correction de Fallot']
  const chirurgiens = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Lefebvre', 'Moreau', 'Garcia']
  const anesthesistes = ['Dr Petit', 'Dr Durand', 'Dr Leroy', 'Dr Simon', 'Dr Michel']
  const perfusionnistes = ['Tech. Dupont', 'Tech. Robert', 'Tech. Richard', 'Tech. Boyer']
  const oxygateurs = ['Terumo CAPIOX SX25', 'Medos Hilite 7000', 'Sorin Inspire 4F', 'Maquet QUADROX-I']
  const canulesArt = ['18 Fr', '20 Fr', '22 Fr', '24 Fr']
  const canulesVein = ['23 Fr', '25 Fr', '27 Fr', '29/31 Fr bicave']
  const solutes = ['NaCl 0.9%', 'Ringer Lactate', 'Albumine 4%', 'Gélatine (Gelofusine)', 'Mannitol 20%']
  const events = ['Départ CEC', 'Clampage aortique', 'Héparine', 'Gaz du sang', 'CGR', 'Déclampage aortique', 'Noradrénaline', 'Weaning CEC', 'Fin CEC', 'Protamine', 'Hb de contrôle', 'PFC', 'ACT de contrôle', 'Dobutamine']
  const catsIn = ['Cristalloïdes', 'Colloïdes', 'Sang', 'FFP']
  const catsOut = ['Diurèse', 'UF', 'Pertes']

  updatePatient({
    nom: pick(noms), prenom: pick(prenoms),
    dateNaissance: `${1950 + randInt(0, 40)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`,
    poids: randInt(55, 100), taille: randInt(155, 190),
    sexe: pick(['M', 'F']) as 'M' | 'F',
    groupeSanguin: pick(['A+', 'A-', 'B+', 'B-', 'AB+', 'O+', 'O-']),
    numDossier: String(randInt(100000, 999999)),
    asa: pick(['I', 'II', 'III', 'IV']),
  })

  updateIntervention({
    date: new Date().toISOString().split('T')[0],
    type: pick(actes), chirurgien: pick(chirurgiens),
    anesthesiste: pick(anesthesistes), perfusionniste: pick(perfusionnistes),
    assistant: pick(chirurgiens),
  })

  const primeCount = randInt(2, 4)
  const primeComp = []
  const used = new Set<string>()
  for (let j = 0; j < primeCount; j++) {
    let s: string
    do { s = pick(solutes) } while (used.has(s))
    used.add(s)
    primeComp.push({ name: s, quantite: randInt(250, 1000) })
  }

  updateMateriel({
    oxygateur: pick(oxygateurs), circuit: '套装 Adulte',
    canuleArterielle: pick(canulesArt), canuleVeineuse: pick(canulesVein),
    primeComposition: primeComp,
  })

  updateParametres({
    debit: rand(3.5, 6.0), pam: randInt(55, 90),
    temperature: rand(35.0, 37.5), hct: rand(24, 38),
    sao2: rand(97, 100), svo2: rand(60, 85),
    pao2: rand(150, 300), pco2: rand(35, 45),
    ph: rand(7.30, 7.50), hb: rand(8, 14),
    k: rand(3.5, 5.5), lactates: rand(0.5, 3.5), glycemie: rand(4, 10),
  })

  const evtCount = randInt(4, 8)
  let hour = randInt(8, 10)
  let min = randInt(0, 30)
  const usedEvents = new Set<string>()
  for (let j = 0; j < evtCount; j++) {
    let evt: string
    do { evt = pick(events) } while (usedEvents.has(evt) && usedEvents.size < events.length)
    usedEvents.add(evt)
    addEvenement({ heure: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`, type: evt.toLowerCase(), description: evt })
    min += randInt(5, 25)
    if (min >= 60) { hour++; min -= 60 }
  }

  const entreeCount = randInt(3, 5)
  for (let j = 0; j < entreeCount; j++) {
    addBilanItem({ heure: `${String(randInt(8, 17)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`, type: 'entree', categorie: pick(catsIn), volume: randInt(100, 1000) })
  }
  const sortieCount = randInt(2, 4)
  for (let j = 0; j < sortieCount; j++) {
    addBilanItem({ heure: `${String(randInt(8, 17)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`, type: 'sortie', categorie: pick(catsOut), volume: randInt(50, 500) })
  }
}

export function StepPatient() {
  const { caseData, updatePatient, updateIntervention, updateMateriel, updateParametres, addEvenement, addBilanItem, completeStep, nextStep } = useWorkflowStore()
  const p = caseData.patient
  const valid = p.nom.trim() && p.prenom.trim() && p.poids > 0

  return (
    <div className="space-y-4">
      <Header icon={<User size={20} />} title="Identification" subtitle="Informations patient" />
      <Card>
        <Grid>
          <Input label="Nom" value={p.nom} onChange={(v) => updatePatient({ nom: v })} required />
          <Input label="Prénom" value={p.prenom} onChange={(v) => updatePatient({ prenom: v })} required />
          <DatePicker label="Né le" value={p.dateNaissance} onChange={(v) => updatePatient({ dateNaissance: v })} />
          <Input label="N° Dossier" value={p.numDossier} onChange={(v) => updatePatient({ numDossier: v })} />
          <Input label="Poids" type="number" value={p.poids} onChange={(v) => updatePatient({ poids: v })} unit="kg" />
          <Input label="Taille" type="number" value={p.taille} onChange={(v) => updatePatient({ taille: v })} unit="cm" />
          <Select label="Sexe" value={p.sexe} onChange={(v) => updatePatient({ sexe: v as 'M' | 'F' })} options={[{ value: 'M', label: 'Homme' }, { value: 'F', label: 'Femme' }]} />
          <Select label="Groupe sanguin" value={p.groupeSanguin} onChange={(v) => updatePatient({ groupeSanguin: v })} options={[
            { value: '', label: '—' },
            { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
            { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
            { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' },
          ]} />
          <Select label="ASA" value={p.asa} onChange={(v) => updatePatient({ asa: v })} options={[
            { value: '', label: '—' },
            { value: 'I', label: 'ASA I — Normal' },
            { value: 'II', label: 'ASA II — Légère' },
            { value: 'III', label: 'ASA III — Sévère' },
            { value: 'IV', label: 'ASA IV — Moribond' },
            { value: 'V', label: 'ASA V — Mourant' },
          ]} />
        </Grid>
      </Card>
      <button onClick={() => fillRandomData(updatePatient, updateIntervention, updateMateriel, updateParametres, addEvenement, addBilanItem)}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-300 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-colors">
        <FlaskConical size={14} /> Remplir avec des données de test
      </button>
      <Nav onPrev={null} onNext={() => { completeStep('patient'); nextStep() }} disabled={!valid} />
    </div>
  )
}

export function StepIntervention() {
  const { caseData, updateIntervention, completeStep, nextStep, prevStep } = useWorkflowStore()
  const i = caseData.intervention
  const valid = i.type.trim() && i.chirurgien.trim() && i.perfusionniste.trim()

  return (
    <div className="space-y-4">
      <Header icon={<Scissors size={20} />} title="Intervention" subtitle="Équipe et chirurgie" />
      <Card>
        <Grid>
          <DatePicker label="Date" value={i.date} onChange={(v) => updateIntervention({ date: v })} />
          <Input label="Type" value={i.type} onChange={(v) => updateIntervention({ type: v })} required placeholder="Taper pour rechercher…" suggestions={[
            'PAC (Pontage coronarien)',
            'PAC x3',
            'PAC x4',
            'Remplacement valve mitrale',
            'Réparation valve mitrale',
            'Remplacement valve aortique',
            'Réparation valve aortique',
            'Remplacement valve tricuspide',
            'CLOS (Closure of ASD/VSD)',
            'Myxome atrial gauche',
            'Myxome atrial droit',
            'Chirurgie de l\'aorte ascendante',
            'Chirurgie de l\'arc aortique',
            'Chirurgie de l\'aorte descendante',
            'Transplantation cardiaque',
            'Assistance ventriculaire (LVAD)',
            'ECMO',
            'Coronarographie interventionnelle',
            'TAVI',
            'Mitraclip',
            'Occlusion LAA (Watchman)',
            'Cardiomyopathie hypertrophique',
            'Switch artériel',
            'Correction de Fallot',
            'Shunt systemique-pulmonaire',
            'Coarctation de l\'aorte',
            'Autre',
          ]} />
          <Input label="Chirurgien" value={i.chirurgien} onChange={(v) => updateIntervention({ chirurgien: v })} required />
          <Input label="Anesthésiste" value={i.anesthesiste} onChange={(v) => updateIntervention({ anesthesiste: v })} />
          <Input label="Perfusionniste" value={i.perfusionniste} onChange={(v) => updateIntervention({ perfusionniste: v })} required />
          <Input label="Assistant" value={i.assistant} onChange={(v) => updateIntervention({ assistant: v })} />
        </Grid>
      </Card>
      <Nav onPrev={prevStep} onNext={() => { completeStep('intervention'); nextStep() }} disabled={!valid} />
    </div>
  )
}

export function StepMateriel() {
  const { caseData, updateMateriel, addPrimeItem, removePrimeItem, updatePrimeItem, completeStep, nextStep, prevStep } = useWorkflowStore()
  const m = caseData.materiel
  const valid = m.oxygateur.trim() && m.circuit.trim()
  const totalPrime = m.primeComposition.reduce((s, item) => s + (item.quantite || 0), 0)

  return (
    <div className="space-y-4">
      <Header icon={<Wrench size={20} />} title="Matériel" subtitle="Circuit et canules" />
      <Card>
        <Grid>
          <Input label="Oxygénateur" value={m.oxygateur} onChange={(v) => updateMateriel({ oxygateur: v })} required />
          <Input label="Circuit" value={m.circuit} onChange={(v) => updateMateriel({ circuit: v })} required />
          <Input label="Canule art." value={m.canuleArterielle} onChange={(v) => updateMateriel({ canuleArterielle: v })} placeholder="22 Fr" />
          <Input label="Canule veineuse" value={m.canuleVeineuse} onChange={(v) => updateMateriel({ canuleVeineuse: v })} placeholder="29/31 Fr" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Prime totale</label>
            <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-semibold tabular-nums">
              {totalPrime} <span className="text-[10px] text-gray-400 font-normal">mL</span>
            </div>
          </div>
        </Grid>
      </Card>

      {/* Composition du prime */}
      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Composition du prime</h3>
        <div className="space-y-2">
          {m.primeComposition.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex-1">
                <Input value={item.name} onChange={(v) => updatePrimeItem(idx, { name: v })} placeholder="Soluté…" suggestions={[
                  'NaCl 0.9%',
                  'Ringer Lactate',
                  'NaHCO₃ 8.4%',
                  'Mannitol 20%',
                  'Albumine 4%',
                  'Albumine 20%',
                  'Gélatine (Gelofusine)',
                  'HES (Voluven)',
                  'CaCl₂ 10%',
                  'KCl',
                  'MgSO₄',
                  'Bicarbonate 1,4%',
                  'Sang total',
                  'PFC (CGR)',
                  'Plasma frais congelé',
                  'Solution de cardioplégie',
                  'Dextrose 5%',
                  'Glucose 5%',
                ]} />
              </div>
              <div className="w-24 shrink-0">
                <Input type="number" value={item.quantite} onChange={(v) => updatePrimeItem(idx, { quantite: Number(v) })} unit="mL" />
              </div>
              <button onClick={() => removePrimeItem(idx)} className="shrink-0 p-2 text-gray-300 hover:text-red-500 transition-colors mt-0.5">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={() => addPrimeItem({ name: '', quantite: 0 })} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
            <Plus size={14} /> Ajouter un soluté
          </button>
        </div>
      </Card>

      <Nav onPrev={prevStep} onNext={() => { completeStep('materiel'); nextStep() }} disabled={!valid} />
    </div>
  )
}

export function StepPreCheck() {
  const { caseData, toggleChecklist, completeStep, nextStep, prevStep } = useWorkflowStore()
  const items = caseData.checklistPre
  const checked = items.filter((i) => i.checked).length
  const pct = Math.round((checked / items.length) * 100)

  return (
    <div className="space-y-4">
      <Header icon={<ClipboardCheck size={20} />} title="Pré-CEC" subtitle={`${checked}/${items.length}`} />
      <Card>
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-gray-500 tabular-nums">{pct}%</span>
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <label key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${item.checked ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
              <input type="checkbox" checked={item.checked} onChange={() => toggleChecklist('pre', item.id)} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-0 cursor-pointer" />
              <span className={`text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
            </label>
          ))}
        </div>
      </Card>
      <Nav onPrev={prevStep} onNext={() => { completeStep('pre-check'); nextStep() }} label="Démarrer CEC" />
    </div>
  )
}

export function StepCEC() {
  const { caseData, updateParametres, updateCardioplegie, addAdminCardio, removeAdminCardio, addEvenement, removeEvenement, startCEC, stopCEC, startClampage, stopClampage, completeStep, nextStep, prevStep } = useWorkflowStore()
  const p = caseData.parametres
  const cardio = caseData.cardioplegie
  const [noteModal, setNoteModal] = useState<{ evt: string; type: string } | null>(null)
  const [noteText, setNoteText] = useState('')

  const cecDuration = caseData.startTime
    ? Math.floor(((caseData.endTime ? new Date(caseData.endTime) : new Date()).getTime() - new Date(caseData.startTime).getTime()) / 60000)
    : 0

  const clampDuration = caseData.clampStartTime
    ? Math.floor(((caseData.clampEndTime ? new Date(caseData.clampEndTime) : new Date()).getTime() - new Date(caseData.clampStartTime).getTime()) / 60000)
    : 0

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`
  }

  const handleLongPress = (evt: string, type: string) => {
    setNoteText('')
    setNoteModal({ evt, type })
  }

  const confirmNote = () => {
    if (noteModal) {
      addEvenement({
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: noteModal.type, description: noteModal.evt, note: noteText.trim() || undefined,
      })
      setNoteModal(null)
      setNoteText('')
    }
  }

  return (
    <div className="space-y-4">
      <Header icon={<Activity size={20} />} title="CEC" subtitle={caseData.isRunning ? 'En cours' : 'Arrêtée'} />

      {/* Status bar */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${caseData.isRunning ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
        <div className="flex items-center gap-3">
          <HeartPulse size={18} className={caseData.isRunning ? 'animate-pulse' : ''} />
          <div>
            <span className="text-sm font-medium">{caseData.isRunning ? 'Perfusion active' : 'En attente'}</span>
            {caseData.startTime && (
              <span className="text-xs ml-2 opacity-70">
                {formatDuration(cecDuration)}
              </span>
            )}
          </div>
        </div>
        {!caseData.isRunning ? (
          <button onClick={startCEC} className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Play size={14} /> Démarrer
          </button>
        ) : (
          <button onClick={stopCEC} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            <Square size={14} /> Arrêter
          </button>
        )}
      </div>

      {/* Durées */}
      {(caseData.startTime || caseData.clampStartTime) && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-gray-200 p-3 text-center bg-white">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Durée CEC</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatDuration(cecDuration)}</p>
            {caseData.startTime && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {new Date(caseData.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {caseData.endTime && ` → ${new Date(caseData.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-center bg-white">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Durée clampage</p>
            <p className="text-xl font-bold mt-1 tabular-nums">{formatDuration(clampDuration)}</p>
            {caseData.clampStartTime && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {new Date(caseData.clampStartTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {caseData.clampEndTime && ` → ${new Date(caseData.clampEndTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Clampage control */}
      {caseData.isRunning && (
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${caseData.clampStartTime && !caseData.clampEndTime ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${caseData.clampStartTime && !caseData.clampEndTime ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium text-gray-700">
              {caseData.clampStartTime && !caseData.clampEndTime ? 'Clampage actif' : 'Clampage'}
            </span>
          </div>
          {!caseData.clampStartTime || caseData.clampEndTime ? (
            <button onClick={startClampage} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors">
              <Lock size={12} /> Clamp
            </button>
          ) : (
            <button onClick={stopClampage} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-50 transition-colors">
              <Unlock size={12} /> Déclamp
            </button>
          )}
        </div>
      )}

      {/* Cardioplégie */}
      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cardioplégie</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <Select label="Solution" value={cardio.type} onChange={(v) => updateCardioplegie({ type: v as any })}
            options={[
              { value: '', label: '—' },
              { value: 'sang_froide', label: 'Sang froide' },
              { value: 'sang_chaude', label: 'Sang normotherme' },
              { value: 'cristalloide_froide', label: 'Cristalloïde froide' },
              { value: 'del_nido', label: 'Del Nido' },
              { value: 'custodiol', label: 'Custodiol (Bretschneider)' },
              { value: 'st_thomas', label: 'St. Thomas' },
              { value: 'mixte', label: 'Mixte (froide + chaude)' },
            ]} />
          <Select label="Voie" value={cardio.voie} onChange={(v) => updateCardioplegie({ voie: v as any })}
            options={[
              { value: '', label: '—' },
              { value: 'anterograde', label: 'Antérograde' },
              { value: 'retrograde', label: 'Rétrograde' },
              { value: 'mixte', label: 'Mixte' },
            ]} />
          <Input label="Volume (mL)" type="number" value={cardio.volume} onChange={(v) => updateCardioplegie({ volume: Number(v) })} unit="mL" />
        </div>

        {/* Administrations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Administrations</p>
            <button onClick={() => {
              const vol = cardio.volume || 200
              const heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              addAdminCardio({ heure, volume: vol, type: cardio.type || 'antegrade' })
              addEvenement({ heure, type: 'cardioplégie', description: `Cardioplégie ${cardio.type || ''} ${vol}mL` })
            }} className="text-xs text-gray-500 hover:text-black font-medium px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors">
              + Admin
            </button>
          </div>
          {cardio.administrations.length > 0 && (
            <div className="space-y-1">
              {cardio.administrations.map((admin, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Clock size={12} className="text-gray-300" />
                  <span className="text-xs font-mono text-gray-400 w-12">{admin.heure}</span>
                  <span className="text-xs text-gray-500">{admin.type}</span>
                  <span className="text-xs font-semibold text-gray-700">{admin.volume} mL</span>
                  <button onClick={() => removeAdminCardio(idx)} className="ml-auto text-gray-300 hover:text-red-500">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <div className="text-right">
                <span className="text-xs text-gray-400">Total: </span>
                <span className="text-xs font-bold text-gray-700">{cardio.administrations.reduce((s, a) => s + a.volume, 0)} mL</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Paramètres */}
      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Paramètres</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Param icon={<Wind size={14} />} label="Débit" value={p.debit} onChange={(v) => updateParametres({ debit: v })} unit="L/min" step={0.1} gradient="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200" />
          <Param icon={<HeartPulse size={14} />} label="PAM" value={p.pam} onChange={(v) => updateParametres({ pam: v })} unit="mmHg" alert={p.pam < 60} gradient="bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-md shadow-rose-200" />
          <Param icon={<Thermometer size={14} />} label="Temp" value={p.temperature} onChange={(v) => updateParametres({ temperature: v })} unit="°C" step={0.1} gradient="bg-gradient-to-br from-cyan-400 to-cyan-500 text-white shadow-md shadow-cyan-200" />
          <Param icon={<Droplets size={14} />} label="Ht" value={p.hct} onChange={(v) => updateParametres({ hct: v })} unit="%" step={0.1} alert={p.hct < 25} gradient="bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md shadow-orange-200" />
          <Param icon={<Activity size={14} />} label="PaO₂" value={p.pao2} onChange={(v) => updateParametres({ pao2: v })} unit="mmHg" gradient="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md shadow-emerald-200" />
          <Param icon={<Zap size={14} />} label="Hb" value={p.hb} onChange={(v) => updateParametres({ hb: v })} unit="g/dL" step={0.1} alert={p.hb < 8} gradient="bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md shadow-purple-200" />
          <Param icon={<Beaker size={14} />} label="Lactates" value={p.lactates} onChange={(v) => updateParametres({ lactates: v })} unit="mmol/L" step={0.1} alert={p.lactates > 2} gradient="bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-200" />
          <Param icon={<Zap size={14} />} label="K⁺" value={p.k} onChange={(v) => updateParametres({ k: v })} unit="mmol/L" step={0.1} gradient="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white shadow-md shadow-indigo-200" />
        </div>
      </Card>

      {/* DO₂i */}
      {(() => {
        const surface = Math.sqrt((caseData.patient.poids * caseData.patient.taille) / 3600)
        const cao2 = (1.34 * p.hb * (p.sao2 / 100)) + (0.003 * p.pao2)
        const do2 = cao2 * p.debit * 10
        const do2i = surface > 0 ? do2 / surface : 0
        const alert = do2i < 300
        return (
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between border ${alert ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${alert ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <div>
                <span className="text-xs font-semibold text-gray-500">DO₂i</span>
                <span className="text-[10px] text-gray-400 ml-1.5">Delivery O₂ indexé</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold tabular-nums ${alert ? 'text-red-600' : 'text-gray-900'}`}>
                {do2i > 0 ? Math.round(do2i) : '—'}
              </span>
              <span className="text-[10px] text-gray-400 ml-1">mL/min/m²</span>
            </div>
          </div>
        )
      })()}

      {/* Graphiques */}
      <Graphiques history={caseData.paramHistory} />

      {/* Événements */}
      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Événements</h3>
        <div className="space-y-2">
          {[
            { cat: 'CEC', items: ['Départ CEC', 'Fin CEC', 'Clampage aortique', 'Déclampage aortique', 'Weaning CEC'] },
            { cat: 'Héparine', items: ['Héparine', 'ACT de contrôle', 'Protamine'] },
            { cat: 'Gaz & Labo', items: ['Gaz du sang', 'Hb de contrôle', 'Lactates', 'ACT'] },
            { cat: 'Transfusion', items: ['CGR', 'PFC', 'Plaquettes', 'Cryoprécipités', 'Albumine'] },
            { cat: 'Pharmacologie', items: ['Noradrénaline', 'Dobutamine', 'Milrinone', 'Nitroglycérine', 'Antifibrinolyse'] },
          ].map((group) => (
            <div key={group.cat}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{group.cat}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((evt) => (
                  <button key={evt}
                    onClick={() => addEvenement({
                      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                      type: evt.toLowerCase(), description: evt,
                    })}
                    onPointerDown={(e) => {
                      const timer = setTimeout(() => {
                        handleLongPress(evt, evt.toLowerCase())
                      }, 500)
                      const cancel = () => { clearTimeout(timer); e.currentTarget.removeEventListener('pointerup', cancel); e.currentTarget.removeEventListener('pointerleave', cancel) }
                      e.currentTarget.addEventListener('pointerup', cancel)
                      e.currentTarget.addEventListener('pointerleave', cancel)
                    }}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors select-none">
                    + {evt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {caseData.evenements.length > 0 && (
          <div className="relative mt-4 pt-4 border-t border-gray-100 max-h-64 overflow-y-auto">
            <div className="absolute left-[19px] top-4 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {[...caseData.evenements].map((evt, idx) => (
                <div key={evt.id} className="relative flex items-start gap-3 py-2.5 group">
                  <div className="relative z-10 w-10 shrink-0 flex justify-center">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ${
                      idx === caseData.evenements.length - 1 ? 'bg-black' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{evt.heure}</span>
                      <span className="text-sm font-medium text-gray-800">{evt.description}</span>
                    </div>
                    {evt.note && (
                      <p className="text-xs text-gray-500 mt-0.5 ml-[52px] italic">"{evt.note}"</p>
                    )}
                  </div>
                  <button onClick={() => removeEvenement(evt.id)} className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Nav onPrev={prevStep} onNext={() => { completeStep('cec'); nextStep() }} />

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{noteModal.evt}</p>
                <p className="text-xs text-gray-400">Ajouter une note</p>
              </div>
              <button onClick={() => setNoteModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Note optionnelle…"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:border-gray-400 focus:outline-none transition-colors"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmNote() } }}
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setNoteModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Sans note
              </button>
              <button onClick={confirmNote}
                className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function StepBilan() {
  const { caseData, addBilanItem, removeBilanItem, completeStep, nextStep, prevStep } = useWorkflowStore()
  const primeTotal = caseData.materiel.primeComposition.reduce((s, item) => s + (item.quantite || 0), 0)
  const entrees = caseData.bilan.filter((b) => b.type === 'entree').reduce((s, b) => s + b.volume, 0) + primeTotal
  const sorties = caseData.bilan.filter((b) => b.type === 'sortie').reduce((s, b) => s + b.volume, 0)

  const addQuick = (type: 'entree' | 'sortie', cat: string, vol: number) => {
    addBilanItem({ heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), type, categorie: cat, volume: vol })
  }

  return (
    <div className="space-y-4">
      <Header icon={<Droplets size={20} />} title="Bilan" subtitle="In / Out" />

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Entrées</p>
          <p className="text-2xl font-bold mt-1">{entrees}</p>
          <p className="text-[10px] text-gray-400">mL</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sorties</p>
          <p className="text-2xl font-bold mt-1">{sorties}</p>
          <p className="text-[10px] text-gray-400">mL</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${entrees - sorties >= 0 ? 'border-gray-200' : 'border-gray-200'}`}>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Bilan</p>
          <p className={`text-2xl font-bold mt-1 ${entrees - sorties < 0 ? 'text-red-600' : ''}`}>{entrees - sorties > 0 ? '+' : ''}{entrees - sorties}</p>
          <p className="text-[10px] text-gray-400">mL</p>
        </div>
      </div>

      {/* Priming auto */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-black" />
          <span className="text-sm text-gray-700">Priming (auto)</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">+{primeTotal} mL</span>
      </div>

      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ajouter</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-2">Entrées</p>
            <div className="flex flex-wrap gap-1.5">
              {[{ cat: 'Cristalloïdes', vol: 500 }, { cat: 'Colloïdes', vol: 500 }, { cat: 'Sang', vol: 250 }, { cat: 'FFP', vol: 250 }].map((q) => (
                <QuickAddBtn key={q.cat} cat={q.cat} defaultVol={q.vol} type="entree" onAdd={addQuick} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Sorties</p>
            <div className="flex flex-wrap gap-1.5">
              {[{ cat: 'Diurèse', vol: 100 }, { cat: 'UF', vol: 500 }, { cat: 'Pertes', vol: 200 }].map((q) => (
                <QuickAddBtn key={q.cat} cat={q.cat} defaultVol={q.vol} type="sortie" onAdd={addQuick} />
              ))}
            </div>
          </div>
        </div>
        {caseData.bilan.length > 0 && (
          <div className="mt-4 space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-3">
            {[...caseData.bilan].reverse().map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Clock size={12} className="text-gray-300" />
                <span className="text-xs text-gray-400 font-mono w-12">{item.heure}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" style={{ opacity: item.type === 'entree' ? 0.3 : 0.7 }} />
                <span className="text-sm text-gray-700 flex-1">{item.categorie}</span>
                <span className={`text-sm font-semibold tabular-nums ${item.type === 'entree' ? '' : 'text-red-600'}`}>
                  {item.type === 'entree' ? '+' : '-'}{item.volume}
                </span>
                <button onClick={() => removeBilanItem(item.id)} className="text-gray-300 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Nav onPrev={prevStep} onNext={() => { completeStep('bilan'); nextStep() }} label="Rapport final" />
    </div>
  )
}

export function StepRapport() {
  const { caseData, saveCase, prevStep, newCase } = useWorkflowStore()
  const [saved, setSaved] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!caseData.startTime) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [caseData.startTime])

  const cecDuration = caseData.startTime
    ? Math.floor(((caseData.endTime ? new Date(caseData.endTime).getTime() : now) - new Date(caseData.startTime).getTime()) / 60000)
    : -1

  const clampDuration = caseData.clampStartTime
    ? Math.floor(((caseData.clampEndTime ? new Date(caseData.clampEndTime).getTime() : now) - new Date(caseData.clampStartTime).getTime()) / 60000)
    : -1

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`
  }

  const handleSave = () => {
    saveCase()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePDF = async () => {
    const { exportPDF } = await import('../rapport/exportPDF')
    exportPDF(caseData)
  }

  return (
    <div className="space-y-4">
      <Header icon={<FileText size={20} />} title="Rapport" subtitle="Résumé et sauvegarde" />

      <Card>
        <div className="space-y-4">
          <Row label="Patient" value={`${caseData.patient.nom || '—'} ${caseData.patient.prenom || ''} — ${caseData.patient.poids} kg`} />
          <Row label="Intervention" value={`${caseData.intervention.type || '—'} — Dr ${caseData.intervention.chirurgien || '—'}`} />
          <Row label="Équipe" value={`${caseData.intervention.perfusionniste || '—'} / ${caseData.intervention.anesthesiste || '—'}`} />
          <Row label="Matériel" value={`${caseData.materiel.oxygateur || '—'} — ${caseData.materiel.canuleArterielle || '—'}`} />
          <Row label="Durée CEC" value={cecDuration >= 0 ? formatDuration(cecDuration) : '—'} />
          {clampDuration >= 0 && <Row label="Durée clampage" value={formatDuration(clampDuration)} />}
          <Row label="Événements" value={`${caseData.evenements.length} enregistrés`} />
          <Row label="Bilan" value={`In ${caseData.bilan.filter((b) => b.type === 'entree').reduce((s, b) => s + b.volume, 0)} / Out ${caseData.bilan.filter((b) => b.type === 'sortie').reduce((s, b) => s + b.volume, 0)} mL`} />
        </div>
      </Card>

      <div className="flex gap-2">
        <button onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} /> Retour
        </button>
        <button onClick={newCase} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          Nouveau
        </button>
        <button onClick={handlePDF} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <FileText size={15} /> PDF
        </button>
        <button onClick={handleSave} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-colors ${saved ? 'bg-green-600' : 'bg-black hover:bg-gray-800'}`}>
          {saved ? '✓ Sauvegardé' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}

// ─── UI Components ───────────────────────────────────────────

function Header({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
}

function DatePicker({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number)
      return new Date(y, m - 1, d)
    }
    return new Date()
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const startDay = firstDay === 0 ? 6 : firstDay - 1

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: startDay }, (_, i) => i)

  const selectedDate = value ? value.split('-').map(Number) : null

  const select = (d: number) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    onChange(`${year}-${mm}-${dd}`)
    setOpen(false)
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  const displayValue = value ? (() => {
    const [y, m, d] = value.split('-')
    return `${d}/${m}/${y}`
  })() : ''

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-medium text-gray-500">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-left flex items-center justify-between focus:border-gray-400 focus:bg-white focus:outline-none transition-colors">
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{displayValue || 'Sélectionner…'}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={16} className="text-gray-500" />
              </button>
              <span className="text-sm font-semibold text-gray-800">{monthNames[month]} {year}</span>
              <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            </div>
            {/* Jours */}
            <div className="grid grid-cols-7 gap-0.5">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} className="text-[10px] font-medium text-gray-400 text-center py-1">{d}</div>
              ))}
              {blanks.map((b) => <div key={`b${b}`} />)}
              {days.map((d) => {
                const isSelected = selectedDate && selectedDate[0] === year && selectedDate[1] - 1 === month && selectedDate[2] === d
                const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === d
                return (
                  <button key={d} type="button" onClick={() => select(d)}
                    className={`w-8 h-8 mx-auto rounded-lg text-xs font-medium transition-colors ${
                      isSelected ? 'bg-black text-white' : isToday ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    {d}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', unit, placeholder, required, suggestions }: {
  label?: string; value: string | number; onChange: (v: any) => void
  type?: string; unit?: string; placeholder?: string; required?: boolean; suggestions?: string[]
}) {
  const [open, setOpen] = useState(false)
  const strValue = String(value)
  const filtered = suggestions && strValue.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(strValue.toLowerCase()))
    : suggestions || []

  return (
    <div className="flex flex-col gap-1 relative">
      {label && <label className="text-xs font-medium text-gray-500">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      <div className="relative">
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => { onChange(type === 'number' ? Number(e.target.value) : e.target.value); if (suggestions) setOpen(true) }}
          onFocus={() => suggestions && setOpen(true)}
          className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:border-gray-400 focus:bg-white focus:outline-none transition-colors ${unit ? 'pr-10' : ''}`} />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">{unit}</span>}
      </div>
      {suggestions && open && filtered.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((s) => (
              <button key={s} type="button" onClick={() => { onChange(s); setOpen(false) }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${strValue === s ? 'bg-gray-100 font-medium' : ''}`}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-left flex items-center justify-between focus:border-gray-400 focus:bg-white focus:outline-none transition-colors">
        <span className={selected?.value ? 'text-gray-900' : 'text-gray-400'}>
          {selected?.label || 'Sélectionner…'}
        </span>
        <ChevronRight size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {options.map((o) => (
              <button key={o.value} type="button" onClick={() => handleSelect(o.value)}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${value === o.value ? 'bg-gray-100 font-medium' : ''}`}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Param({ icon, label, value, onChange, unit, step = 1, alert, gradient }: {
  icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void; unit: string; step?: number; alert?: boolean; gradient?: string
}) {
  const [swiping, setSwiping] = useState(false)
  const [swipeDelta, setSwipeDelta] = useState(0)
  const touchStart = useRef<{ y: number; value: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { y: e.touches[0].clientY, value }
    setSwiping(true)
    setSwipeDelta(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const delta = touchStart.current.y - e.touches[0].clientY
    const steps = Math.round(delta / 15)
    setSwipeDelta(steps * step)
    onChange(Math.round((touchStart.current.value + steps * step) * 10) / 10)
  }

  const handleTouchEnd = () => {
    touchStart.current = null
    setSwiping(false)
    setSwipeDelta(0)
  }

  return (
    <div className={`rounded-xl p-3 transition-all ${alert ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md shadow-red-200' : gradient || 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-white/80">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">{label}</span>
        {swiping && swipeDelta !== 0 && (
          <span className={`text-[9px] font-bold ml-auto ${swipeDelta > 0 ? 'text-white' : 'text-white/60'}`}>
            {swipeDelta > 0 ? '▲' : '▼'} {swipeDelta > 0 ? '+' : ''}{Math.round(swipeDelta * 10) / 10}
          </span>
        )}
      </div>
      <div className="relative">
        <input type="number" value={value} step={step} onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full text-xl font-bold bg-transparent border-none focus:outline-none tabular-nums pr-8 text-white placeholder-white/50" />
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-white/60">{unit}</span>
      </div>
      <div className="flex justify-center gap-0.5 mt-1">
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.round((value - step) * 10) / 10) }}
          className="w-7 h-5 flex items-center justify-center rounded bg-white/10 text-white/60 hover:bg-white/20 text-xs font-bold active:scale-95">−</button>
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.round((value + step) * 10) / 10) }}
          className="w-7 h-5 flex items-center justify-center rounded bg-white/10 text-white/60 hover:bg-white/20 text-xs font-bold active:scale-95">+</button>
      </div>
    </div>
  )
}

function Nav({ onPrev, onNext, disabled, label }: {
  onPrev: (() => void) | null; onNext: () => void; disabled?: boolean; label?: string
}) {
  return (
    <div className="flex gap-2">
      {onPrev ? (
        <button onClick={onPrev} className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} /> Retour
        </button>
      ) : <div />}
      <button onClick={onNext} disabled={disabled}
        className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium text-white transition-colors ${
          disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        }`}>
        {label || 'Continuer'} {!label && <ChevronRight size={16} />}
      </button>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-700 font-medium">{value}</span>
    </div>
  )
}

function QuickAddBtn({ cat, defaultVol, type, onAdd }: {
  cat: string; defaultVol: number; type: 'entree' | 'sortie'; onAdd: (type: 'entree' | 'sortie', cat: string, vol: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [customVol, setCustomVol] = useState(defaultVol)
  const timerRef = useState<number | null>(null)

  const startTimer = () => {
    const t = window.setTimeout(() => setEditing(true), 500)
    timerRef[0] = t
  }

  const cancelTimer = () => {
    if (timerRef[0]) clearTimeout(timerRef[0])
  }

  const handleAdd = (vol: number) => {
    onAdd(type, cat, vol)
    setEditing(false)
    setCustomVol(defaultVol)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
        <input type="number" value={customVol} onChange={(e) => setCustomVol(Number(e.target.value) || 0)} autoFocus
          className="w-16 text-xs font-medium bg-transparent border-none focus:outline-none tabular-nums" />
        <span className="text-[10px] text-gray-400">mL</span>
        <button onClick={() => handleAdd(customVol)} className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Plus size={12} />
        </button>
        <button onClick={() => setEditing(false)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => handleAdd(defaultVol)}
      onMouseDown={startTimer}
      onMouseUp={cancelTimer}
      onMouseLeave={cancelTimer}
      onTouchStart={startTimer}
      onTouchEnd={cancelTimer}
      className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors select-none"
    >
      <Plus size={12} className="inline -mt-0.5" /> {defaultVol} {cat}
    </button>
  )
}