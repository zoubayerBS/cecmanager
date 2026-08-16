import jsPDF from 'jspdf'
import type { CaseData } from '../store/useWorkflowStore'

function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m} min`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function exportPDF(c: CaseData): void {
  const doc = new jsPDF()
  const W = doc.internal.pageSize.getWidth()
  const LM = 14
  let y = 15

  const sectionTitle = (title: string) => {
    if (y > 260) { doc.addPage(); y = 15 }
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80)
    doc.text(title, LM, y)
    y += 5
    doc.setDrawColor(200)
    doc.setLineWidth(0.5)
    doc.line(LM, y, LM + doc.getTextWidth(title), y)
    y += 5
  }

  const row = (label: string, value: string) => {
    if (!value || value === '—' || value === '0' || value === '0 kg' || value === '0 cm') return
    if (y > 275) { doc.addPage(); y = 15 }
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120)
    doc.text(label, LM + 2, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30)
    doc.text(value, LM + 50, y)
    y += 4.2
  }

  // ── Header ──
  doc.setFillColor(0, 0, 0)
  doc.rect(0, 0, W, 32, 'F')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255)
  doc.text('RAPPORT CEC', LM, 14)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180)
  doc.text('Circulation Extracorporelle', LM, 20)
  doc.setTextColor(140)
  const patientLine = `${c.patient.nom} ${c.patient.prenom}`.trim() || '—'
  doc.text(`${patientLine}  ·  ${c.intervention.type || '—'}`, LM, 26)

  y = 40

  // ── Patient ──
  sectionTitle('PATIENT')
  row('Nom', c.patient.nom)
  row('Prénom', c.patient.prenom)
  row('Date de naissance', c.patient.dateNaissance ? formatDate(c.patient.dateNaissance) : '')
  row('Poids', c.patient.poids ? `${c.patient.poids} kg` : '')
  row('Taille', c.patient.taille ? `${c.patient.taille} cm` : '')
  row('Sexe', c.patient.sexe === 'M' ? 'Masculin' : 'Féminin')
  row('N° Dossier', c.patient.numDossier)
  row('Groupe sanguin', c.patient.groupeSanguin)
  row('ASA', c.patient.asa)
  y += 2

  // ── Intervention ──
  sectionTitle('INTERVENTION')
  row('Date', c.intervention.date ? formatDate(c.intervention.date) : '')
  row('Type', c.intervention.type)
  row('Chirurgien', c.intervention.chirurgien)
  row('Anesthésiste', c.intervention.anesthesiste)
  row('Perfusionniste', c.intervention.perfusionniste)
  row('Assistant', c.intervention.assistant)
  y += 2

  // ── Matériel ──
  sectionTitle('MATÉRIEL')
  row('Oxygénateur', c.materiel.oxygateur)
  row('Circuit', c.materiel.circuit)
  row('Canule artérielle', c.materiel.canuleArterielle)
  row('Canule veineuse', c.materiel.canuleVeineuse)
  const primeTotal = c.materiel.primeComposition.reduce((s, i) => s + (i.quantite || 0), 0)
  row('Prime totale', primeTotal > 0 ? `${primeTotal} mL` : '')
  if (c.materiel.primeComposition.length > 0) {
    const composition = c.materiel.primeComposition
      .filter(i => i.name && i.quantite > 0)
      .map(i => `${i.name} ${i.quantite}mL`)
      .join(', ')
    if (composition) row('Composition', composition)
  }
  y += 2

  // ── Durées ──
  sectionTitle('DURÉES')
  const cecMs = c.startTime
    ? ((c.endTime ? new Date(c.endTime).getTime() : Date.now()) - new Date(c.startTime).getTime())
    : 0
  const cecMin = Math.floor(cecMs / 60000)
  row('Départ CEC', c.startTime ? formatTime(c.startTime) : '')
  row('Fin CEC', c.endTime ? formatTime(c.endTime) : '')
  row('Durée CEC', cecMin > 0 ? formatDuration(cecMin) : '')
  row('Clampage', c.clampStartTime ? formatTime(c.clampStartTime) : '')
  row('Déclampage', c.clampEndTime ? formatTime(c.clampEndTime) : '')
  const clampMs = c.clampStartTime
    ? ((c.clampEndTime ? new Date(c.clampEndTime).getTime() : Date.now()) - new Date(c.clampStartTime).getTime())
    : 0
  const clampMin = Math.floor(clampMs / 60000)
  row('Durée clampage', clampMin > 0 ? formatDuration(clampMin) : '')
  y += 2

  // ── Paramètres ──
  sectionTitle('PARAMÈTRES DE PERFUSION')
  const p = c.parametres
  row('Débit', p.debit ? `${p.debit} L/min` : '')
  row('PAM', p.pam ? `${p.pam} mmHg` : '')
  row('Température', p.temperature ? `${p.temperature} °C` : '')
  row('Ht', p.hct ? `${p.hct} %` : '')
  row('SaO₂', p.sao2 ? `${p.sao2} %` : '')
  row('SvO₂', p.svo2 ? `${p.svo2} %` : '')
  row('Hb', p.hb ? `${p.hb} g/dL` : '')
  row('Lactates', p.lactates ? `${p.lactates} mmol/L` : '')
  row('K⁺', p.k ? `${p.k} mmol/L` : '')
  row('Glycémie', p.glycemie ? `${p.glycemie} mmol/L` : '')
  row('pH', p.ph ? String(p.ph) : '')
  row('pCO₂', p.pco2 ? `${p.pco2} mmHg` : '')
  row('pO₂', p.pao2 ? `${p.pao2} mmHg` : '')
  y += 2

  // ── Événements ──
  if (c.evenements.length > 0) {
    sectionTitle('CHRONOLOGIE')
    c.evenements.forEach((evt) => {
      if (y > 275) { doc.addPage(); y = 15 }
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(140)
      doc.text(evt.heure, LM + 2, y)
      doc.setFillColor(180, 180, 180)
      doc.rect(LM + 21, y - 2, 2, 2, 'F')
      doc.setTextColor(30)
      doc.text(evt.description, LM + 26, y)
      y += 4
    })
    y += 2
  }

  // ── Bilan ──
  const entrees = c.bilan.filter(b => b.type === 'entree')
  const sorties = c.bilan.filter(b => b.type === 'sortie')
  const totalEntrees = entrees.reduce((s, b) => s + b.volume, 0) + primeTotal
  const totalSorties = sorties.reduce((s, b) => s + b.volume, 0)

  sectionTitle('BILAN LIQUIEN')
  row('Entrées (hors prime)', entrees.length > 0 ? `${entrees.reduce((s, b) => s + b.volume, 0)} mL` : '')
  row('Priming', primeTotal > 0 ? `${primeTotal} mL` : '')
  row('Total entrées', totalEntrees > 0 ? `${totalEntrees} mL` : '')
  row('Total sorties', totalSorties > 0 ? `${totalSorties} mL` : '')
  row('Bilan net', `${totalEntrees - totalSorties} mL`)
  y += 2

  if (c.bilan.length > 0) {
    sectionTitle('DÉTAIL BILAN')
    c.bilan.forEach((b) => {
      if (y > 275) { doc.addPage(); y = 15 }
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(140)
      doc.text(b.heure, LM + 2, y)
      doc.setTextColor(30)
      doc.text(`${b.type === 'entree' ? '+' : '−'}${b.volume} mL  ${b.categorie}`, LM + 22, y)
      y += 4
    })
  }

  // ── Footer ──
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(170)
    doc.text(
      `CEC Manager  ·  ${patientLine}  ·  Page ${i}/${pageCount}`,
      W / 2, doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  const filename = `CEC_${c.patient.nom || 'Patient'}_${c.patient.prenom || ''}_${c.intervention.date || ''}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_')
  doc.save(filename)
}
