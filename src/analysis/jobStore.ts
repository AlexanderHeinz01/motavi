/** Local job store: in-memory cache plus localStorage with pruning. */

import { DEMO_JOBS } from './demoJob'
import type { JobRecord } from './types'

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
