/** PDF report of an analysis result (jsPDF). */

import { jsPDF } from 'jspdf'
import type { AnalysisResult } from './types'

// ── PDF Report Generator (Matches report.py + Motavi CI) ────────────────────
export function generatePdfReport(result: AnalysisResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Colors
  const purple = '#6C3AED'
  const dark = '#111111'
  const gray = '#6B7280'
  const lightGray = '#F3F4F6'

  // Header band
  doc.setFillColor(17, 17, 17)
  doc.rect(0, 0, 210, 30, 'F')

  doc.setFillColor(108, 58, 237)
  doc.roundedRect(15, 8, 14, 14, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('M', 19, 18)

  doc.setFontSize(18)
  doc.text('MOTAVI', 35, 17)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text('Ergonomie-Analysebericht · DIN EN ISO 10075 / ArbSchG §5', 35, 23)

  // Document metadata box
  doc.setFillColor(249, 250, 251)
  doc.roundedRect(15, 36, 180, 28, 2, 2, 'F')
  doc.setDrawColor(229, 231, 235)
  doc.roundedRect(15, 36, 180, 28, 2, 2, 'S')

  doc.setFontSize(9)
  doc.setTextColor(107, 114, 128)
  doc.text('UNTERNEHMEN:', 20, 44)
  doc.text('BEREICH:', 20, 51)
  doc.text('AUFGABE:', 20, 58)

  doc.setTextColor(17, 17, 17)
  doc.setFont('helvetica', 'bold')
  doc.text(result.company_name || 'Standard-Erhebung', 55, 44)
  doc.text(result.department || 'Produktionsbereich', 55, 51)
  doc.text(result.task_description || 'Tätigkeitszyklus', 55, 58)

  doc.setTextColor(107, 114, 128)
  doc.setFont('helvetica', 'normal')
  doc.text('SCHICHTDAUER:', 130, 44)
  doc.text('JOB-ID:', 130, 51)
  doc.text('DATUM:', 130, 58)

  doc.setTextColor(17, 17, 17)
  doc.setFont('helvetica', 'bold')
  doc.text(`${result.shift_duration_min} min`, 165, 44)
  doc.text(result.job_id.slice(0, 10), 165, 51)
  doc.text(new Date().toLocaleDateString('de-DE'), 165, 58)

  // Overall REBA Score Display
  doc.setFillColor(245, 243, 255)
  doc.roundedRect(15, 70, 85, 44, 3, 3, 'F')
  doc.setDrawColor(108, 58, 237)
  doc.roundedRect(15, 70, 85, 44, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(108, 58, 237)
  doc.setFont('helvetica', 'bold')
  doc.text('GESAMT REBA-SCORE', 22, 80)

  doc.setFontSize(36)
  const scoreCol = result.reba_score <= 4 ? [34, 197, 94] : result.reba_score <= 6 ? [234, 179, 8] : [230, 57, 70]
  doc.setTextColor(scoreCol[0], scoreCol[1], scoreCol[2])
  doc.text(result.reba_score.toFixed(1), 22, 102)

  doc.setFontSize(11)
  doc.setTextColor(17, 17, 17)
  const levelText = result.reba_score <= 4 ? 'Niedriges Risiko' : result.reba_score <= 6 ? 'Mittleres Risiko' : 'Hohes Handlungsrisiko'
  doc.text(levelText, 52, 98)

  // Movement summary box
  doc.setFillColor(249, 250, 251)
  doc.roundedRect(110, 70, 85, 44, 3, 3, 'F')
  doc.setDrawColor(229, 231, 235)
  doc.roundedRect(110, 70, 85, 44, 3, 3, 'S')

  doc.setFontSize(10)
  doc.setTextColor(17, 17, 17)
  doc.setFont('helvetica', 'bold')
  doc.text('BEWEGUNGSANTEILE (8h EXTRAPOLATION)', 115, 80)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(230, 57, 70)
  doc.text(`● Bücken: ${result.movements.bending.pct.toFixed(1)} % (${result.movements.bending.minutes.toFixed(0)} min)`, 115, 90)
  doc.setTextColor(234, 179, 8)
  doc.text(`● Überkopf: ${result.movements.overhead.pct.toFixed(1)} % (${result.movements.overhead.minutes.toFixed(0)} min)`, 115, 98)
  doc.setTextColor(0, 180, 216)
  doc.text(`● Schulter neutral: ${result.movements.neutral.pct.toFixed(1)} % (${result.movements.neutral.minutes.toFixed(0)} min)`, 115, 106)

  // Body region details
  doc.setFontSize(12)
  doc.setTextColor(17, 17, 17)
  doc.setFont('helvetica', 'bold')
  doc.text('Körperregionen-Belastungswerte (REBA-Subscores)', 15, 126)

  const regionNames: Record<string, string> = {
    lumbar: 'Lendenwirbelsäule (Trunk)',
    shoulder_l: 'Schulter links (Upper Arm L)',
    shoulder_r: 'Schulter rechts (Upper Arm R)',
    neck: 'Halswirbelsäule / Nacken (Neck)',
    forearm: 'Unterarme / Handgelenke (Forearm)',
    knee_l: 'Knie / Beine links (Leg L)',
    knee_r: 'Knie / Beine rechts (Leg R)',
  }

  let yPos = 134
  doc.setFontSize(9)
  doc.setFillColor(240, 240, 240)
  doc.rect(15, yPos - 5, 180, 7, 'F')
  doc.setTextColor(100, 100, 100)
  doc.text('Körperregion', 20, yPos)
  doc.text('REBA Subscore', 120, yPos)
  doc.text('Risikobewertung', 155, yPos)
  yPos += 7

  for (const [key, label] of Object.entries(regionNames)) {
    const val = result.body_regions[key] ?? 1.0
    const isHigh = val > 4.5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(17, 17, 17)
    doc.text(label, 20, yPos)
    doc.setFont('helvetica', 'bold')
    doc.text(val.toFixed(1), 125, yPos)
    if (isHigh) {
      doc.setTextColor(230, 57, 70)
      doc.text('Erfordert Maßnahmen', 155, yPos)
    } else {
      doc.setTextColor(34, 197, 94)
      doc.text('Akzeptabler Bereich', 155, yPos)
    }
    yPos += 6
  }

  // Recommended Action Items
  yPos += 6
  doc.setFontSize(12)
  doc.setTextColor(17, 17, 17)
  doc.setFont('helvetica', 'bold')
  doc.text('Priorisierte Handlungsfelder & Ergonomische Empfehlungen', 15, yPos)
  yPos += 8

  result.action_items.forEach((item, idx) => {
    doc.setFillColor(item.priority === 'CRITICAL' ? 254 : 254, item.priority === 'CRITICAL' ? 242 : 252, item.priority === 'CRITICAL' ? 242 : 232)
    doc.roundedRect(15, yPos, 180, 14, 2, 2, 'F')
    doc.setDrawColor(item.priority === 'CRITICAL' ? 230 : 234, item.priority === 'CRITICAL' ? 57 : 179, item.priority === 'CRITICAL' ? 70 : 8)
    doc.roundedRect(15, yPos, 180, 14, 2, 2, 'S')

    doc.setFontSize(8)
    doc.setTextColor(item.priority === 'CRITICAL' ? 230 : 202, 57, 70)
    doc.setFont('helvetica', 'bold')
    doc.text(`[${item.priority}] ${item.region.toUpperCase()}`, 20, yPos + 5)

    doc.setFontSize(8.5)
    doc.setTextColor(17, 17, 17)
    doc.setFont('helvetica', 'normal')
    doc.text(item.text, 20, yPos + 10)

    if (item.reduction_pct) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 197, 94)
      doc.text(`-${item.reduction_pct}% Belastung`, 160, yPos + 8)
    }
    yPos += 18
  })

  // Footer note
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Erstellt durch Motavi Video-Ergonomie System · anonymisiert · Motavi Inc.', 15, 285)

  doc.save(`Motavi-Report-${result.job_id.slice(0, 8)}.pdf`)
}
