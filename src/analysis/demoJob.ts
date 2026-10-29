/** Pre-seeded demo job with invented data for the "Sofort-Demo". */

import type { AnalysisResult } from './types'

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

// ── Pre-seeded Demo Jobs ──────────────────────────────────────────────────────
export const DEMO_JOBS: Record<string, AnalysisResult> = {
  'demo-logistik': {
    job_id: 'demo-logistik',
    company_name: 'Beispielbetrieb Logistik',
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
