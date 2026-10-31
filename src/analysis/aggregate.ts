/**
 * Aggregation of the in-browser pose analysis (poseAnalyzer.ts / reba.ts)
 * into the result format of backend/app/services/analyzer.py.
 */

import { determineRebaLevel, REGION_KEYS } from './reba'
import type { ProgressFn } from './poseAnalyzer'
import type { ActionItem, AnalysisResult, CriticalFrame, TimelinePoint } from './types'

export function buildActionItems(regions: Record<string, number>, bend_pct: number, over_pct: number): ActionItem[] {
  const items: ActionItem[] = []

  const lumbar = regions.lumbar ?? 0
  if (lumbar > 5 && bend_pct > 0) {
    items.push({
      priority: 'CRITICAL',
      region: 'Lendenwirbel',
      text: `Erhöhter Rumpfbeuge-Anteil (${bend_pct.toFixed(0)} % der Schichtzeit). Arbeitshöhe auf Ellbogenniveau anpassen.`,
    })
  } else if (lumbar > 3) {
    items.push({
      priority: 'MEDIUM',
      region: 'Lendenwirbel',
      text: 'Moderate Lendenbelastung. Regelmäßige Entlastungspausen empfohlen.',
    })
  }

  const neck = regions.neck ?? 0
  if (neck > 4) {
    items.push({
      priority: 'CRITICAL',
      region: 'Nacken',
      text: 'Anhaltende Nackenbeugehaltung erkannt. Bildschirm- oder Materialhöhe prüfen.',
    })
  } else if (neck > 2) {
    items.push({
      priority: 'MEDIUM',
      region: 'Nacken',
      text: 'Nackenhaltung auffällig. Arbeitsoberfläche anheben, bis der Blick ohne Beugen des Nackens auf das Werkstück fällt.',
    })
  }

  const shoulder = Math.max(regions.shoulder_l ?? 0, regions.shoulder_r ?? 0)
  if (over_pct > 0 && (over_pct > 15 || shoulder > 6)) {
    items.push({
      priority: over_pct > 20 ? 'CRITICAL' : 'MEDIUM',
      region: 'Schulter',
      text: `Überkopfarbeit: ${over_pct.toFixed(0)} % der Schichtzeit. Arbeitsmittel in Greifhöhe bringen.`,
    })
  }

  if ((regions.forearm ?? 0) > 3.5) {
    items.push({
      priority: 'MEDIUM',
      region: 'Unterarm',
      text: 'Ungünstige Unterarmhaltung erkannt. Stützvorrichtungen prüfen.',
    })
  }

  // Stable sort: critical items first, original order kept within a priority
  items.sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'CRITICAL' ? -1 : 1))
  return items
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
