/**
 * Motavi API layer.
 * Runs the analysis in the browser (MediaPipe, see services/poseAnalyzer.ts)
 * while keeping the interfaces of the former HTTP API used by the pages.
 */

import {
  processVideoJob,
  getStoredJob,
  saveStoredJob,
  generatePdfReport,
  type AnalysisResult,
} from '../services/ergonomicsEngine'

export interface UploadResponse {
  job_id: string
  status: string
}

export interface UploadMeta {
  company_name?: string
  department?: string
  task_description?: string
  shift_duration_min: number
  worker_height_cm?: number
}

export interface TimelineFrame {
  second: number
  movement: string
}

export interface CriticalFrame {
  rank: number
  second: number
  reba: number
  movement: string
  imageUrl?: string
  gcs_path?: string
}

export interface ActionItem {
  priority: 'CRITICAL' | 'MEDIUM'
  region: string
  text: string
  reduction_pct?: number
}

export { type AnalysisResult }

export interface AnalysisStatus {
  status: 'processing' | 'done' | 'error'
  result?: AnalysisResult
  error?: string
  progress?: number
  stage?: string
}

// Jobs whose analysis is running in this page; a "processing" job that is not
// in here was cut off by a reload or a closed tab.
const activeJobs = new Set<string>()

/**
 * Start the analysis of *file* in the browser. Resolves immediately with the
 * job id; progress and result are read via getAnalysisStatus().
 */
export async function uploadVideoWithProgress(
  file: File,
  onProgress: (pct: number) => void,
  meta: UploadMeta = { shift_duration_min: 480 },
): Promise<UploadResponse> {
  const jobId = 'job_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  const createdAt = Date.now()
  saveStoredJob({ job_id: jobId, status: 'processing', progress: 0, stage: 'Analyse wird vorbereitet…', createdAt })
  activeJobs.add(jobId)

  let lastPct = -1
  let lastStage = ''
  processVideoJob(jobId, meta, file, (pct, stage) => {
    const rounded = Math.floor(pct)
    if (rounded === lastPct && stage === lastStage) return
    lastPct = rounded
    lastStage = stage
    saveStoredJob({ job_id: jobId, status: 'processing', progress: rounded, stage, createdAt })
  })
    .then((result) => {
      saveStoredJob({ job_id: jobId, status: 'done', result, progress: 100, createdAt })
    })
    .catch((err) => {
      console.error('Analysis failed', err)
      saveStoredJob({
        job_id: jobId,
        status: 'error',
        error: err instanceof Error ? err.message : 'Bei der Analyse ist ein Fehler aufgetreten.',
        createdAt,
      })
    })
    .finally(() => activeJobs.delete(jobId))

  onProgress(100)
  return { job_id: jobId, status: 'processing' }
}

export async function getAnalysisStatus(jobId: string): Promise<AnalysisStatus> {
  const job = getStoredJob(jobId)
  if (!job) {
    return { status: 'error', error: `Job ${jobId} wurde nicht gefunden.` }
  }
  if (job.status === 'processing' && !activeJobs.has(jobId)) {
    const error =
      'Die Analyse wurde unterbrochen, weil die Seite neu geladen oder geschlossen wurde. ' +
      'Bitte das Video erneut hochladen und die Seite bis zum Ende geöffnet lassen.'
    saveStoredJob({ ...job, status: 'error', error })
    return { status: 'error', error }
  }
  return {
    status: job.status,
    result: job.result,
    error: job.error,
    progress: job.progress,
    stage: job.stage,
  }
}

export function getReportPdfUrl(jobId: string): string {
  return `#pdf-export-${jobId}`
}

export function downloadReport(result: AnalysisResult): void {
  generatePdfReport(result)
}

export function getFrameUrl(jobId: string, filename: string): string {
  const job = getStoredJob(jobId)
  if (job?.result?.critical_frames) {
    const num = parseInt(filename.replace(/\D/g, ''), 10)
    const frame = job.result.critical_frames.find(f => f.rank === num) || job.result.critical_frames[0]
    if (frame?.imageUrl) return frame.imageUrl
  }
  return ''
}
