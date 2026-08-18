import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = 'https://yffdlkbjxgjurvesmcxf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_2Bp9qbSruaCXfnrlkAJTcw_b2kLuSdF'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZmRsa2JqeGdqdXJ2ZXNtY3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg4MzU5OCwiZXhwIjoyMTAyNDU5NTk4fQ.SIKtGNz7nhHBlPg0KaBGfi5ycLu1NPM5I-URu6uw_3c'
const TEST_EMAIL = 'test@cec.com'
const TEST_PASSWORD = 'Test1234!'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rand(min, max) { return Math.round((Math.random() * (max - min) + min) * 10) / 10 }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomDate(startYear, endYear) {
  const y = randInt(startYear, endYear)
  const m = String(randInt(1, 12)).padStart(2, '0')
  const d = String(randInt(1, 28)).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const NOMS = ['Dupont','Martin','Bernard','Dubois','Thomas','Robert','Leroy','Moreau','Simon','Laurent','Michel','Lefebvre','Lambert','Bonnet','François','Martinez','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Lefèvre','Garnier','Chevalier','Legrand','Gauthier','Pascal','Morin','Mercier','Petit','Brun','Garcia']
const PRENOMS_M = ['Jean','Pierre','Michel','André','Philippe','Jacques','François','Bernard','Henri','Louis','Robert','Marcel','Claude','Paul','Georges','Raymond','Lucien','René','Albert','Maurice','Gérard','Yves','Thierry','Patrick','Daniel','Christophe','Alain','Stéphane','Olivier','David']
const PRENOMS_F = ['Marie','Françoise','Catherine','Sylvie','Nathalie','Monique','Isabelle','Martine','Josette','Nicole','Suzanne','Micheline','Claire','Hélène','Anne','Marguerite','Jacqueline','Colette','Denise','Yvette','Ginette','Liliane','Madeleine','Régine','Christiane','Simone','Lucienne','Paulette','Raymonde','Brigitte']
const ACTES = ['PAC (Pontage coronarien)','PAC x3','PAC x4','Remplacement valve mitrale','Réparation valve mitrale','Remplacement valve aortique','Réparation valve aortique','Remplacement valvulaire triple','CLOS (ASD/VSD)','Myxome atrial gauche','Transplantation cardiaque','Correction de Fallot','TAVI','Switch artériel','Coarctation aortique','Anévrisme aortique ascendant','Endocardite infectieuse','Sténose mitrale','Insuffisance tricuspide','Patching ombilical']
const CHIRURGIENS = ['Dr Martin','Dr Bernard','Dr Dubois','Dr Thomas','Dr Lefebvre','Dr Moreau','Dr Garcia','Dr Petit','Dr Durand','Dr Leroy']
const ANESTHESISTES = ['Dr Simon','Dr Michel','Dr Laurent','Dr Robert','Dr Richard','Dr Boyer','Dr Garnier','Dr Bonnet']
const PERFUSIONNISTES = ['Tech. Dupont','Tech. Robert','Tech. Richard','Tech. Boyer','Tech. Lambert','Tech. Morel','Tech. Girard','Tech. André']
const OXYGATEURS = ['Terumo CAPIOX SX25','Terumo CAPIOX SX25R','Medos Hilite 7000','Medos Hilite 3000','Sorin Inspire 4F','Sorin Inspire 6','Maquet QUADROX-I','Maquet QUADROX Pediatric']
const CANULES_ART = ['18 Fr','20 Fr','21 Fr','22 Fr','23 Fr','24 Fr']
const CANULES_VEIN = ['21 Fr','23 Fr','25 Fr','27 Fr','29/31 Fr bicave','25/29 Fr bicave']
const SOLUTES = ['NaCl 0.9%','Ringer Lactate','Albumine 4%','Albumine 20%','Gélatine (Gelofusine)','Mannitol 20%','NaHCO3 8.4%','CaCl2 10%','KCl 15%']
const EVENTS_CEC = ['Départ CEC','Clampage aortique','Déclampage aortique','Weaning CEC','Fin CEC']
const EVENTS_HEPARINE = ['Héparine initiale','Héparine supplémentaire','Protamine']
const EVENTS_GAZ = ['Gaz du sang','ACT de contrôle','Hb de contrôle','Gaz de contrôle']
const EVENTS_TRANSFUSION = ['CGR','PFC','Plaquettes','CCD','Néo-Cohem']
const EVENTS_PHARMA = ['Noradrénaline','Dobutamine','Nitroglycérine','Magnésium','Insuline']
const CATS_IN = ['Cristalloïdes','Colloïdes','Sang','FFP','Plaquettes']
const CATS_OUT = ['Diurèse','UF','Pertes sanguines']
const TYPES_CARDIO = ['sang_froide','cristalloide_froide','del_nido','custodiol','st_thomas','mixte']
const VOIES_CARDIO = ['anterograde','retrograde','mixte']

function generateParamHistory(startTime, dureeCEC) {
  const entries = []
  const nbEntries = Math.min(dureeCEC, randInt(8, 20))
  for (let i = 0; i < nbEntries; i++) {
    const minute = Math.round((i / nbEntries) * dureeCEC)
    const ts = new Date(new Date(startTime).getTime() + minute * 60000).toISOString()
    entries.push({
      ts, minute,
      debit: rand(3.0, 6.0), pam: randInt(55, 90), temperature: rand(34.0, 37.5),
      hct: rand(22, 38), pao2: rand(150, 350), hb: rand(7, 14),
      lactates: rand(0.5, 4.0), k: rand(3.5, 5.5),
    })
  }
  return entries
}

function generateOneCase(userId) {
  const id = uuidv4()
  const patientId = uuidv4()
  const sexe = pick(['M', 'F'])
  const poids = randInt(45, 120)
  const taille = randInt(145, 195)
  const dateIntervention = randomDate(2023, 2026)
  const startTime = new Date(`${dateIntervention}T${String(randInt(8, 14)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}:00`).toISOString()
  const dureeCEC = randInt(30, 280)
  const endTime = new Date(new Date(startTime).getTime() + dureeCEC * 60000).toISOString()
  const dureeClampage = randInt(20, Math.min(dureeCEC - 10, 200))
  const clampStartTime = new Date(new Date(startTime).getTime() + randInt(5, 30) * 60000).toISOString()
  const clampEndTime = new Date(new Date(clampStartTime).getTime() + dureeClampage * 60000).toISOString()

  const allEvents = [...EVENTS_CEC, ...EVENTS_HEPARINE, ...EVENTS_GAZ, ...EVENTS_TRANSFUSION, ...EVENTS_PHARMA]
  const nbEvents = randInt(3, 8)
  const selectedEvents = []
  const usedEvt = new Set()
  for (let i = 0; i < nbEvents; i++) {
    let evt
    let attempts = 0
    do { evt = pick(allEvents); attempts++ } while (usedEvt.has(evt) && attempts < 20)
    usedEvt.add(evt)
    selectedEvents.push(evt)
  }
  selectedEvents.sort()

  let hour = randInt(8, 14)
  let min = randInt(0, 59)
  const evenements = selectedEvents.map(evt => {
    const h = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    min += randInt(3, 25)
    if (min >= 60) { hour++; min -= 60 }
    if (hour > 20) hour = randInt(8, 14)
    return { id: uuidv4(), heure: h, type: evt.toLowerCase(), description: evt, note: Math.random() > 0.85 ? 'Note de test' : undefined }
  })

  const bilan = []
  for (let i = 0; i < randInt(2, 5); i++) {
    bilan.push({ id: uuidv4(), heure: `${String(randInt(8, 18)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`, type: 'entree', categorie: pick(CATS_IN), volume: randInt(100, 1500) })
  }
  for (let i = 0; i < randInt(2, 4); i++) {
    bilan.push({ id: uuidv4(), heure: `${String(randInt(8, 18)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`, type: 'sortie', categorie: pick(CATS_OUT), volume: randInt(50, 800) })
  }

  const primeComp = []
  const usedSol = new Set()
  for (let i = 0; i < randInt(2, 5); i++) {
    let s
    do { s = pick(SOLUTES) } while (usedSol.has(s))
    usedSol.add(s)
    primeComp.push({ name: s, quantite: randInt(200, 1000) })
  }

  const administrations = []
  for (let i = 0; i < randInt(1, 5); i++) {
    administrations.push({ heure: `${String(randInt(8, 16)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}`, volume: randInt(100, 500), type: pick(['Bolus', 'Infusion', 'Réinjection']) })
  }

  const caseData = {
    id, patient: {
      id: patientId, nom: pick(NOMS), prenom: sexe === 'M' ? pick(PRENOMS_M) : pick(PRENOMS_F),
      dateNaissance: randomDate(1940, 2010), poids, taille, sexe,
      groupeSanguin: pick(['A+','A-','B+','B-','AB+','O+','O-']),
      numDossier: String(randInt(100000, 999999)), asa: pick(['I','II','III','IV','V']),
    },
    intervention: {
      date: dateIntervention, type: pick(ACTES), chirurgien: pick(CHIRURGIENS),
      anesthesiste: pick(ANESTHESISTES), perfusionniste: pick(PERFUSIONNISTES), assistant: pick(CHIRURGIENS),
    },
    materiel: {
      oxygateur: pick(OXYGATEURS), circuit: pick(['套装 Adulte','套装 Pediatric','套装 Neonatal']),
      canuleArterielle: pick(CANULES_ART), canuleVeineuse: pick(CANULES_VEIN),
      volumePrime: randInt(1000, 2500), primeComposition: primeComp,
    },
    parametres: {
      debit: rand(3.0, 6.5), pam: randInt(50, 95), temperature: rand(33.0, 37.5),
      hct: rand(20, 40), sao2: rand(95, 100), svo2: rand(55, 85),
      pao2: rand(120, 400), pco2: rand(30, 50), ph: rand(7.25, 7.55),
      hb: rand(6, 15), k: rand(3.0, 6.0), lactates: rand(0.3, 5.0), glycemie: rand(3.5, 12),
    },
    cardioplegie: {
      type: pick(TYPES_CARDIO), voie: pick(VOIES_CARDIO), volume: randInt(200, 1500),
      concentration: pick(['KCl 20 mEq/L','KCl 30 mEq/L','MgSO4 1g/L','']),
      temperature: rand(4, 20), arretAortique: Math.random() > 0.3, administrations,
    },
    checklistPre: [
      { id: '1', label: 'Patient identifié, consentement vérifié', checked: true },
      { id: '2', label: 'ACT basale mesuré', checked: true },
      { id: '3', label: 'Héparine dose préparée (300 UI/kg)', checked: Math.random() > 0.1 },
      { id: '4', label: "Circuit vérifié, absence d'air", checked: true },
      { id: '5', label: 'Oxygénateur fonctionnel', checked: true },
      { id: '6', label: 'Canules prêtes et vérifiées', checked: true },
      { id: '7', label: 'Sang de réserve disponible', checked: Math.random() > 0.2 },
      { id: '8', label: 'Protamine dose estimée', checked: Math.random() > 0.15 },
      { id: '9', label: 'Température cible définie', checked: true },
      { id: '10', label: 'Moniteurs configurés', checked: true },
    ],
    checklistPost: [
      { id: '1', label: 'Héparine neutralisée', checked: true },
      { id: '2', label: 'ACT de retour < 130 sec', checked: true },
      { id: '3', label: 'Sang restitutionné', checked: Math.random() > 0.1 },
      { id: '4', label: 'Circuit déconnecté, compté', checked: true },
      { id: '5', label: 'Canules retirées', checked: true },
      { id: '6', label: 'Bilan final vérifié', checked: Math.random() > 0.05 },
      { id: '7', label: 'Rapport complété', checked: Math.random() > 0.1 },
    ],
    bilan, evenements,
    paramHistory: generateParamHistory(startTime, dureeCEC),
    isRunning: false, startTime, endTime, clampStartTime, clampEndTime,
    notes: Math.random() > 0.7 ? 'Notes de test pour vérification du dossier.' : '',
  }

  return { id, user_id: userId, data: caseData }
}

async function main() {
  console.log('1. Création du user test via admin API...')
  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const existing = users?.users?.find(u => u.email === TEST_EMAIL)

  let userId

  if (existing) {
    console.log('   User déjà existant, ID:', existing.id)
    userId = existing.id
    // Confirm email and reset password
    await supabaseAdmin.auth.admin.updateUserById(userId, { password: TEST_PASSWORD, email_confirm: true })
    console.log('   Email confirmé + mot de passe réinitialisé')
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'User Test' }
    })
    if (error) { console.error('   Erreur création:', error.message); process.exit(1) }
    console.log('   User créé! ID:', data.user.id)
    userId = data.user.id
  }

  console.log('\n1b. Connexion avec le user...')
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  })
  if (loginErr) { console.error('   Erreur login:', loginErr.message); process.exit(1) }
  console.log('   Session active! User ID:', loginData.user.id)

  await seedCases(loginData.user.id)
}

async function seedCases(userId) {
  console.log(`\n2. Suppression des anciens cas pour ce user...`)
  const { error: delErr } = await supabase.from('cases').delete().eq('user_id', userId)
  if (delErr) console.log('   (pas de cas à supprimer:', delErr.message, ')')

  console.log('3. Génération de 200 cas...')
  const rows = []
  for (let i = 0; i < 200; i++) {
    rows.push(generateOneCase(userId))
    if ((i + 1) % 50 === 0) console.log(`   ${i + 1}/200`)
  }

  console.log('4. Insertion dans Supabase (batchs de 50)...')
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    const { error } = await supabase.from('cases').insert(batch)
    if (error) {
      console.error(`   Erreur batch ${i}:`, error.message)
      process.exit(1)
    }
    console.log(`   ${Math.min(i + 50, rows.length)}/200 insérés`)
  }

  console.log('\n✅ Terminé!')
  console.log(`   Email:    ${TEST_EMAIL}`)
  console.log(`   Password: ${TEST_PASSWORD}`)
  console.log(`   200 cas insérés`)
}

main().catch(err => { console.error('Erreur:', err); process.exit(1) })
