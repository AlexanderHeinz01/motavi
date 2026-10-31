/** Result and job types of the ergonomics analysis. */

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
