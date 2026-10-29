/**
 * Motavi API layer.
 * Works seamlessly with local browser-authoritative ergonomics engine
 * while maintaining the exact interfaces expected by the frontend.
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
}

export function uploadVideoWithProgress(
  file: File,
  onProgress: (pct: number) => void,
  meta: UploadMeta = { shift_duration_min: 480 },
): Promise<UploadResponse> {
  return new Promise((resolve) => {
    const jobId = 'job_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)

    // Initial job record
    saveStoredJob({
      job_id: jobId,
      status: 'processing',
      createdAt: Date.now(),
    })

    // Simulate progress animation smoothly
    let p = 0
    const interval = setInterval(() => {
      p += 15
      if (p >= 100) {
        clearInterval(interval)
        onProgress(100)

        // Run analysis in background
        processVideoJob(jobId, meta, file).then((result) => {
          saveStoredJob({
            job_id: jobId,
            status: 'done',
            result,
            createdAt: Date.now(),
          })
        }).catch((err) => {
          saveStoredJob({
            job_id: jobId,
            status: 'error',
            error: err instanceof Error ? err.message : 'Analysefehler',
            createdAt: Date.now(),
          })
        })

        resolve({ job_id: jobId, status: 'processing' })
      } else {
        onProgress(p)
      }
    }, 120)
  })
}

export async function getAnalysisStatus(jobId: string): Promise<AnalysisStatus> {
  const job = getStoredJob(jobId)
  if (!job) {
    // If not found in store, create a simulated job or error
    return { status: 'error', error: `Job ${jobId} wurde nicht gefunden.` }
  }
  return {
    status: job.status,
    result: job.result,
    error: job.error,
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
