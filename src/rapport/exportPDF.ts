import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { RapportCEC } from './types'

export async function exportPDF(rapport: RapportCEC): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 15

  // QR Code
  const qrData = JSON.stringify({ id: rapport.id, date: rapport.createdAt })
  const qrDataUrl = await QRCode.toDataURL(qrData, { width: 80, margin: 1 })
  doc.addImage(qrDataUrl, 'PNG', pageWidth - 30, y, 18, 18)

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('RAPPORT CEC', 14, y + 8)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text('Circulation Extracorporelle', 14, y + 14)
  doc.text(`Créé le ${format(new Date(rapport.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}`, 14, y + 19)
  doc.text(`Modifié le ${format(new Date(rapport.updatedAt), "dd MMM yyyy à HH:mm", { locale: fr })}`, 14, y + 24)

  y += 30
  doc.setDrawColor(200)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  const addSection = (title: string, fields: [string, string][]) => {
    if (y > 260) { doc.addPage(); y = 15 }
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30)
    doc.text(title, 14, y)
    y += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60)
    fields.forEach(([label, value]) => {
      if (value && value !== '0' && value !== '0 mmHg' && value !== '0 mL' && value !== '0 min' && value !== '0 sec' && value !== '0 UI' && value !== '0 mg' && value !== '0 mmol/L') {
        doc.text(`${label} : ${value}`, 20, y)
        y += 4.5
      }
    })
    y += 3
  }

  const ident = rapport.identification
  addSection('IDENTIFICATION PATIENT', [
    ['Nom', ident.nom],
    ['Prénom', ident.prenom],
    ['Date naissance', ident.dateNaissance],
    ['Poids', `${ident.poids} kg`],
    ['Taille', `${ident.taille} cm`],
    ['Sexe', ident.sexe === 'M' ? 'Masculin' : 'Féminin'],
    ['N° Dossier', ident.numDossier || ''],
    ['Groupe sanguin', ident.groupeSanguin || ''],
  ])

  addSection('INTERVENTION', [
    ['Date', ident.dateIntervention],
    ['Type', ident.typeIntervention],
    ['Chirurgien', ident.chirurgien],
    ['Anesthésiste', ident.anesthesiste],
    ['Opérateur', ident.operateur || ''],
  ])

  addSection('ÉQUIPE', [
    ['Perfusionniste', rapport.equipe.perfusionniste],
    ['Assistance', rapport.equipe.assistance || ''],
    ['Chirurgien assistant', rapport.equipe.cirurgienAssistant || ''],
    ['Infirmier', rapport.equipe.infirmier || ''],
  ])

  addSection('MATÉRIEL', [
    ['Oxygénateur', rapport.materiel.oxygateur],
    ['Circuit', rapport.materiel.circuit],
    ['Canule artérielle', rapport.materiel.canuleArterielle],
    ['Canule veineuse', rapport.materiel.canuleVeineuse],
    ['Canule aspiration', rapport.materiel.canuleAspiration || ''],
    ['Filtre', rapport.materiel.filtre || ''],
    ['Volume prime', `${rapport.materiel.volumePrime} mL`],
  ])

  const p = rapport.parametres
  addSection('PARAMÈTRES DE PERFUSION', [
    ['Débit initial', `${p.debitInitial} L/min`],
    ['Débit max', `${p.debitMax} L/min`],
    ['PAM moyenne', `${p.pamMoyenne} mmHg`],
    ['Température', `${p.temperature} °C`],
    ['Mode', p.modeTemperature],
    ['Ht début', `${p.hctDebut} %`],
    ['Ht fin', p.hctFin ? `${p.hctFin} %` : ''],
    ['Durée CEC', `${p.dureeCEC} min`],
    ['Durée clampage', p.dureeClampage ? `${p.dureeClampage} min` : ''],
    ['Durée arrêt circ.', p.dureeCircArrest ? `${p.dureeCircArrest} min` : ''],
  ])

  const b = rapport.bilan
  addSection('BILAN LIQUIEN', [
    ['Volume initial', `${b.volumeInitial} mL`],
    ['Cristalloïdes', `${b.cristalloides} mL`],
    ['Colloïdes', `${b.colloides} mL`],
    ['Sang (CGR)', `${b.sang} mL`],
    ['FFP', `${b.ffp} mL`],
    ['Plaquettes', `${b.plaquettes} mL`],
    ['Diurèse', `${b.diurese} mL`],
    ['Ultrafiltration', `${b.ultrafiltration} mL`],
    ['Pertes sanguines', `${b.pertesSanguines} mL`],
    ['Volume retour', `${b.volumeRetour} mL`],
  ])

  const a = rapport.anticoagulation
  addSection('ANTICOAGULATION', [
    ['Dose init. héparine', `${a.doseInitialeHeperine} UI/kg`],
    ['ACT début', `${a.actDebut} sec`],
    ['ACT cible', `${a.actCible} sec`],
    ['ACT fin', a.actFin ? `${a.actFin} sec` : ''],
    ['HC début', a.hcDebut ? `${a.hcDebut} UI/mL` : ''],
    ['HC fin', a.hcFin ? `${a.hcFin} UI/mL` : ''],
    ['Dose protamine', `${a.doseProtamine} mg`],
  ])

  addSection('MÉDICAMENTS', [
    ['Antifibrinolytique', rapport.medicaments.antifibrinolytique || ''],
    ['Vasopresseurs', rapport.medicaments.vasopresseurs || ''],
    ['Autres', rapport.medicaments.autres || ''],
  ])

  const g = rapport.gaz
  addSection('GAZ DU SANG - DÉBUT', [
    ['Mode', g.modeGaz === 'alpha-stat' ? 'Alpha-stat' : 'pH-stat'],
    ['pH', g.phDebut ? String(g.phDebut) : ''],
    ['pCO₂', g.pco2Debut ? `${g.pco2Debut} mmHg` : ''],
    ['pO₂', g.pao2Debut ? `${g.pao2Debut} mmHg` : ''],
    ['Lactates', g.lactatesDebut ? `${g.lactatesDebut} mmol/L` : ''],
    ['Hb', g.hbDebut ? `${g.hbDebut} g/dL` : ''],
  ])

  addSection('GAZ DU SANG - FIN', [
    ['pH', g.phFin ? String(g.phFin) : ''],
    ['pCO₂', g.pco2Fin ? `${g.pco2Fin} mmHg` : ''],
    ['pO₂', g.pao2Fin ? `${g.pao2Fin} mmHg` : ''],
    ['Lactates', g.lactatesFin ? `${g.lactatesFin} mmol/L` : ''],
    ['Hb', g.hbFin ? `${g.hbFin} g/dL` : ''],
  ])

  if (rapport.incidents.commentaires) {
    addSection('INCIDENTS & COMPLICATIONS', [
      [rapport.incidents.commentaires, ''],
    ])
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `CEC Calculator - Rapport ${rapport.id.slice(0, 8)} - Page ${i}/${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`CEC_${ident.nom}_${ident.prenom}_${ident.dateIntervention}.pdf`)
}