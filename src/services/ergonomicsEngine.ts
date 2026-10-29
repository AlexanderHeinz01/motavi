/**
 * Ergonomics Analysis Engine & Store for Motavi.
 * Aggregation of the in-browser pose analysis (see poseAnalyzer.ts / reba.ts)
 * into the result format of backend/app/services/analyzer.py, local job store
 * and PDF report.
 */

import { jsPDF } from 'jspdf'
import { computeOverallReba, determineRebaLevel, REGION_KEYS } from './reba'
import type { ProgressFn } from './poseAnalyzer'

export { computeOverallReba, determineRebaLevel }

export interface BodyRegions {
  lumbar: number
  shoulder_l: number
  shoulder_r: number
  neck: number
  knee_l: number
  knee_r: number
  forearm: number
}

export interface MovementStats {
  pct: number
  minutes: number
}

export interface TimelinePoint {
  minute: number
  reba: number
}

export interface TimelineFrame {
  second: number
  movement: 'neutral' | 'bending' | 'overhead'
}

export interface CriticalFrame {
  rank: number
  second: number
  reba: number
  movement: string
  imageUrl: string
}

export interface ActionItem {
  priority: 'CRITICAL' | 'MEDIUM'
  region: string
  text: string
  reduction_pct?: number
}

export interface AnalysisResult {
  job_id: string
  worker_id?: string
  company_name?: string
  department?: string
  task_description?: string
  worker_height_cm?: number
  shift_duration_min: number
  reba_score: number
  reba_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  body_regions: Record<string, number>
  movements: Record<string, MovementStats>
  timeline: TimelinePoint[]
  timeline_frames: TimelineFrame[]
  critical_frames: CriticalFrame[]
  action_items: ActionItem[]
  analysis_info?: AnalysisInfo
}

/** How much of the video the measurement is based on. */
export interface AnalysisInfo {
  video_duration_sec: number
  sampled_frames: number
  detected_frames: number
  sample_interval_sec: number
  model: string
}

export interface JobRecord {
  job_id: string
  status: 'processing' | 'done' | 'error'
  result?: AnalysisResult
  error?: string
  progress?: number
  stage?: string
  createdAt: number
}

export function buildActionItems(regions: Record<string, number>, bend_pct: number, over_pct: number): ActionItem[] {
  const items: ActionItem[] = []

  const lumbar = regions.lumbar ?? 0
  if (lumbar > 5 && bend_pct > 0) {
    items.push({
      priority: 'CRITICAL',
      region: 'Lendenwirbel',
      text: `Erhöhter Rumpfbeuge-Anteil (${bend_pct.toFixed(0)} % der Schichtzeit). Arbeitshöhe auf Ellbogenniveau anpassen.`,
      reduction_pct: 40,
    })
  } else if (lumbar > 3) {
    items.push({
      priority: 'MEDIUM',
      region: 'Lendenwirbel',
      text: 'Moderate Lendenbelastung. Regelmäßige Entlastungspausen empfohlen.',
      reduction_pct: 20,
    })
  }

  const neck = regions.neck ?? 0
  if (neck > 4) {
    items.push({
      priority: 'CRITICAL',
      region: 'Nacken',
      text: 'Anhaltende Nackenbeugehaltung erkannt. Bildschirm- oder Materialhöhe prüfen.',
      reduction_pct: 35,
    })
  } else if (neck > 2) {
    items.push({
      priority: 'MEDIUM',
      region: 'Nacken',
      text: 'Nackenhaltung auffällig. Arbeitsoberfläche um 5–10 cm anheben.',
      reduction_pct: 15,
    })
  }

  const shoulder = Math.max(regions.shoulder_l ?? 0, regions.shoulder_r ?? 0)
  if (over_pct > 0 && (over_pct > 15 || shoulder > 6)) {
    items.push({
      priority: over_pct > 20 ? 'CRITICAL' : 'MEDIUM',
      region: 'Schulter',
      text: `Überkopfarbeit: ${over_pct.toFixed(0)} % der Schichtzeit. Arbeitsmittel in Greifhöhe bringen.`,
      reduction_pct: 50,
    })
  }

  if ((regions.forearm ?? 0) > 3.5) {
    items.push({
      priority: 'MEDIUM',
      region: 'Unterarm',
      text: 'Ungünstige Unterarmhaltung erkannt. Stützvorrichtungen prüfen.',
      reduction_pct: 25,
    })
  }

  // Stable sort: critical items first, original order kept within a priority
  items.sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'CRITICAL' ? -1 : 1))
  return items
}

// ── Illustrated frames for the pre-seeded demo job only ──────────────────────
function generateCriticalFrameImage(
  second: number,
  reba: number,
  movement: string,
  rank: number
): string {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 360
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Background industrial workspace gradient
  const grad = ctx.createLinearGradient(0, 0, 640, 360)
  grad.addColorStop(0, '#131b2e')
  grad.addColorStop(0.5, '#1e293b')
  grad.addColorStop(1, '#0f172a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 640, 360)

  // Workstation outline (conveyor/shelf)
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3
  ctx.strokeRect(50, 220, 240, 110)
  ctx.fillStyle = '#1e293b'
  ctx.fillRect(52, 222, 236, 106)

  // Subtle floor grid
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1
  for (let y = 260; y <= 360; y += 20) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(640, y)
    ctx.stroke()
  }

  // Draw worker stick figure representing the movement
  const px = 420
  const py = 120

  ctx.strokeStyle = '#38bdf8'
  ctx.fillStyle = '#38bdf8'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (movement === 'overhead') {
    // Torso upright, arms reaching way up
    ctx.beginPath()
    ctx.moveTo(px, py + 40)
    ctx.lineTo(px, py + 130) // torso
    ctx.stroke()

    // Arms reaching up above head
    ctx.beginPath()
    ctx.moveTo(px, py + 50)
    ctx.lineTo(px - 30, py + 10)
    ctx.lineTo(px - 45, py - 30) // Left arm overhead
    ctx.moveTo(px, py + 50)
    ctx.lineTo(px + 25, py + 15)
    ctx.lineTo(px + 40, py - 25) // Right arm overhead
    ctx.stroke()

    // Legs
    ctx.beginPath()
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px - 20, py + 190)
    ctx.lineTo(px - 25, py + 230)
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px + 20, py + 190)
    ctx.lineTo(px + 25, py + 230)
    ctx.stroke()
  } else if (movement === 'bending') {
    // Torso heavily inclined forward
    ctx.beginPath()
    ctx.moveTo(px, py + 130) // hips
    ctx.lineTo(px - 60, py + 70) // shoulders bent down forward
    ctx.stroke()

    // Arms reaching down to floor/conveyor
    ctx.beginPath()
    ctx.moveTo(px - 60, py + 70)
    ctx.lineTo(px - 90, py + 120)
    ctx.lineTo(px - 110, py + 160)
    ctx.stroke()

    // Legs bent slightly
    ctx.beginPath()
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px - 15, py + 180)
    ctx.lineTo(px - 10, py + 230)
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px + 20, py + 180)
    ctx.lineTo(px + 25, py + 230)
    ctx.stroke()
  } else {
    // Neutral standing
    ctx.beginPath()
    ctx.moveTo(px, py + 40)
    ctx.lineTo(px, py + 130)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px, py + 50)
    ctx.lineTo(px - 25, py + 85)
    ctx.lineTo(px - 20, py + 120)
    ctx.moveTo(px, py + 50)
    ctx.lineTo(px + 25, py + 85)
    ctx.lineTo(px + 20, py + 120)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px - 15, py + 180)
    ctx.lineTo(px - 15, py + 230)
    ctx.moveTo(px, py + 130)
    ctx.lineTo(px + 15, py + 180)
    ctx.lineTo(px + 15, py + 230)
    ctx.stroke()
  }

  // Anonymization box (as performed in analyzer.py _anonymise_frame)
  // Opaque grey box over head region
  const headX = movement === 'bending' ? px - 90 : px - 25
  const headY = movement === 'bending' ? py + 40 : py + 5
  ctx.fillStyle = 'rgb(80, 80, 80)'
  ctx.fillRect(headX, headY, 50, 45)
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.strokeRect(headX, headY, 50, 45)

  // Video timestamp overlay (top left)
  const mm = String(Math.floor(second / 60)).padStart(2, '0')
  const ss = String(Math.round(second % 60)).padStart(2, '0')
  const label = `${mm}:${ss} · REBA ${reba.toFixed(1)}`

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(10, 15, 230, 36)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 18px "JetBrains Mono", monospace'
  ctx.fillText(label, 20, 40)

  // Critical badge (top right)
  ctx.fillStyle = '#e63946'
  ctx.fillRect(520, 15, 110, 32)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 13px Inter, sans-serif'
  ctx.fillText(`FRAME #${rank}`, 535, 36)

  return canvas.toDataURL('image/jpeg', 0.85)
}

// ── In-Memory & LocalStorage Store ───────────────────────────────────────────
const STORAGE_PREFIX = 'motavi_job_'
const memoryJobs = new Map<string, JobRecord>()

export function getStoredJob(jobId: string): JobRecord | null {
  const cached = memoryJobs.get(jobId)
  if (cached) return cached
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${jobId}`)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read job from localStorage', err)
  }
  return null
}

/** Remove the oldest finished jobs (never the demo) to free localStorage space. */
function pruneOldestJobs(keepJobId: string, count: number): number {
  const jobs: { key: string; createdAt: number }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(STORAGE_PREFIX) || key === `${STORAGE_PREFIX}${keepJobId}`) continue
    if (DEMO_JOBS[key.slice(STORAGE_PREFIX.length)]) continue
    try {
      jobs.push({ key, createdAt: JSON.parse(localStorage.getItem(key) || '{}').createdAt ?? 0 })
    } catch {
      jobs.push({ key, createdAt: 0 })
    }
  }
  jobs.sort((a, b) => a.createdAt - b.createdAt)
  const removed = jobs.slice(0, count)
  removed.forEach((j) => localStorage.removeItem(j.key))
  return removed.length
}

export function saveStoredJob(record: JobRecord): void {
  memoryJobs.set(record.job_id, record)
  const key = `${STORAGE_PREFIX}${record.job_id}`
  const value = JSON.stringify(record)
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      localStorage.setItem(key, value)
      return
    } catch (err) {
      // Quota exceeded: drop the oldest analyses and retry.
      if (pruneOldestJobs(record.job_id, 3) === 0) {
        console.error('Failed to save job to localStorage', err)
        return
      }
    }
  }
}

// ── Pre-seeded Demo Jobs ──────────────────────────────────────────────────────
const DEMO_JOBS: Record<string, AnalysisResult> = {
  'demo-logistik': {
    job_id: 'demo-logistik',
    company_name: 'DHL Supply Chain',
    department: 'Logistikzentrum Halle A',
    task_description: 'Kommissionierung von Paketen bis 15kg auf Paletten',
    shift_duration_min: 480,
    worker_height_cm: 182,
    reba_score: 7.2,
    reba_level: 'HIGH',
    body_regions: {
      lumbar: 6.8,
      shoulder_l: 4.2,
      shoulder_r: 5.6,
      neck: 4.8,
      knee_l: 3.5,
      knee_r: 3.8,
      forearm: 3.2,
    },
    movements: {
      bending: { pct: 36.5, minutes: 175.2 },
      overhead: { pct: 14.8, minutes: 71.0 },
      neutral: { pct: 48.7, minutes: 233.8 },
    },
    timeline: [
      { minute: 0, reba: 6.4 },
      { minute: 1, reba: 7.8 },
      { minute: 2, reba: 8.2 },
      { minute: 3, reba: 6.9 },
      { minute: 4, reba: 7.5 },
      { minute: 5, reba: 6.8 },
    ],
    timeline_frames: Array.from({ length: 90 }, (_, i) => ({
      second: i * 2,
      movement: (i % 5 === 0 || i % 7 === 0) ? 'bending' : (i % 6 === 0 ? 'overhead' : 'neutral'),
    })),
    critical_frames: [
      {
        rank: 1,
        second: 42,
        reba: 8.4,
        movement: 'bending',
        imageUrl: generateCriticalFrameImage(42, 8.4, 'bending', 1),
      },
      {
        rank: 2,
        second: 84,
        reba: 8.0,
        movement: 'overhead',
        imageUrl: generateCriticalFrameImage(84, 8.0, 'overhead', 2),
      },
      {
        rank: 3,
        second: 126,
        reba: 7.6,
        movement: 'bending',
        imageUrl: generateCriticalFrameImage(126, 7.6, 'bending', 3),
      },
    ],
    action_items: [
      {
        priority: 'CRITICAL',
        region: 'Lendenwirbel',
        text: 'Erhöhter Rumpfbeuge-Anteil (37 % der Schichtzeit). Arbeitshöhe auf Palettenebene mittels Scherenhubtisch anheben.',
        reduction_pct: 40,
      },
      {
        priority: 'CRITICAL',
        region: 'Nacken',
        text: 'Anhaltende Nackenbeugehaltung erkannt. Barcode-Scanner und Anzeigeterminal um 15 cm höher positionieren.',
        reduction_pct: 35,
      },
      {
        priority: 'MEDIUM',
        region: 'Schulter',
        text: 'Überkopfarbeit: 15 % der Schichtzeit beim Erreichen der obersten Regalebene. Podest oder Greifhilfen einsetzen.',
        reduction_pct: 30,
      },
    ],
  },
}

// Seed demo job in localStorage immediately
if (typeof window !== 'undefined') {
  for (const [id, res] of Object.entries(DEMO_JOBS)) {
    saveStoredJob({
      job_id: id,
      status: 'done',
      result: res,
      createdAt: Date.now(),
    })
  }
}

// ── Video Processing Pipeline ────────────────────────────────────────────────
export const NO_PERSON_DETECTED =
  'In dem Video wurde keine Person erkannt. Bitte ein Video verwenden, in dem die ' +
  'arbeitende Person gut sichtbar ist (möglichst ganzer Körper, ausreichend Licht). ' +
  'Falls das Video normal abspielbar ist, kann auch das Format die Ursache sein: ' +
  'bitte als MP4 (H.264) oder WebM speichern.'

const mean = (vals: number[]) => vals.reduce((a, b) => a + b, 0) / vals.length

/**
 * Analyse a video in the browser and aggregate it into an AnalysisResult
 * (same structure and rules as _aggregate in analyzer.py).
 */
export async function processVideoJob(
  jobId: string,
  meta: {
    company_name?: string
    department?: string
    task_description?: string
    shift_duration_min: number
    worker_height_cm?: number
  },
  file: File,
  onProgress: ProgressFn = () => {},
): Promise<AnalysisResult> {
  // Loaded on demand so MediaPipe is not part of the initial page bundle
  const { analyzeVideo, MODEL_NAME } = await import('./poseAnalyzer')
  const analysis = await analyzeVideo(file, onProgress)
  const sampled = analysis.samples
  if (!sampled.length) throw new Error(NO_PERSON_DETECTED)

  onProgress(97, 'Ergebnis wird zusammengestellt…')

  const shiftMin = meta.shift_duration_min || Math.max(1, Math.floor(analysis.durationSec / 60))
  const roundedReba = Number(mean(sampled.map((s) => s.reba)).toFixed(1))

  const regionAvgs: Record<string, number> = {}
  for (const k of REGION_KEYS) {
    regionAvgs[k] = Number(mean(sampled.map((s) => s.scores[k])).toFixed(1))
  }

  const n = sampled.length
  const bendPct = Number(((sampled.filter((s) => s.movement === 'bending').length / n) * 100).toFixed(1))
  const overPct = Number(((sampled.filter((s) => s.movement === 'overhead').length / n) * 100).toFixed(1))
  const neutPct = Number(Math.max(0, 100 - bendPct - overPct).toFixed(1))
  const minutes = (pct: number) => Number(((shiftMin * pct) / 100).toFixed(1))

  const byMinute = new Map<number, number[]>()
  for (const s of sampled) {
    const m = Math.floor(s.second / 60)
    byMinute.set(m, [...(byMinute.get(m) ?? []), s.reba])
  }
  const timeline: TimelinePoint[] = [...byMinute.entries()]
    .sort(([a], [b]) => a - b)
    .map(([minute, vals]) => ({ minute, reba: Number(mean(vals).toFixed(1)) }))

  const criticalFrames: CriticalFrame[] = analysis.criticalFrames.map((f, idx) => ({
    rank: idx + 1,
    second: f.second,
    reba: f.reba,
    movement: f.movement,
    imageUrl: f.imageUrl,
  }))

  return {
    job_id: jobId,
    company_name: meta.company_name || undefined,
    department: meta.department || undefined,
    task_description: meta.task_description || undefined,
    shift_duration_min: shiftMin,
    worker_height_cm: meta.worker_height_cm,
    reba_score: roundedReba,
    reba_level: determineRebaLevel(roundedReba),
    body_regions: regionAvgs,
    movements: {
      bending: { pct: bendPct, minutes: minutes(bendPct) },
      overhead: { pct: overPct, minutes: minutes(overPct) },
      neutral: { pct: neutPct, minutes: minutes(neutPct) },
    },
    timeline,
    timeline_frames: sampled.map((s) => ({ second: s.second, movement: s.movement })),
    critical_frames: criticalFrames,
    action_items: buildActionItems(regionAvgs, bendPct, overPct),
    analysis_info: {
      video_duration_sec: Number(analysis.durationSec.toFixed(1)),
      sampled_frames: analysis.sampledFrames,
      detected_frames: n,
      sample_interval_sec: Number(analysis.intervalSec.toFixed(2)),
      model: MODEL_NAME,
    },
  }
}

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
  doc.text('Erstellt durch Motavi Video-Ergonomie System · DSGVO-konform anonymisiert · Motavi Inc.', 15, 285)

  doc.save(`Motavi-Report-${result.job_id.slice(0, 8)}.pdf`)
}
