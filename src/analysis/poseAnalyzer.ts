/**
 * In-browser video analysis with the MediaPipe Pose Landmarker.
 *
 * Port of the pipeline in motavi-backend/backend/app/services/analyzer.py:
 * sample frames → pose landmarks → REBA subscores and movement class per
 * frame → top-3 critical frames with the head region masked. The video is
 * decoded locally and never leaves the browser.
 */
import { PoseLandmarker } from '@mediapipe/tasks-vision'
import wasmLoaderPath from '@mediapipe/tasks-vision/vision_wasm_internal.js?url'
import wasmBinaryPath from '@mediapipe/tasks-vision/vision_wasm_internal.wasm?url'
import {
  classifyMovement,
  computeOverallReba,
  rebaSubscores,
  type Landmark,
  type Movement,
  type RegionScores,
} from './reba'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/' +
  'pose_landmarker_full/float16/1/pose_landmarker_full.task'
export const MODEL_NAME = 'MediaPipe Pose Landmarker (full)'

// Sampling: up to 5 frames per second, at most MAX_SAMPLES frames per video
const MIN_INTERVAL_SEC = 0.2
const MAX_SAMPLES = 1500
// Frames are downscaled to this edge length before detection
const MAX_ANALYSIS_EDGE = 1280
const CRITICAL_FRAME_WIDTH = 640
const CRITICAL_FRAME_COUNT = 3
// Critical frames must be this far apart so they show different moments
const CRITICAL_FRAME_MIN_GAP_SEC = 3
const SEEK_TIMEOUT_MS = 15_000

export interface PoseSample {
  second: number
  movement: Movement
  reba: number
  scores: RegionScores
}

export interface CapturedFrame {
  second: number
  reba: number
  movement: Movement
  imageUrl: string
}

export interface PoseAnalysis {
  samples: PoseSample[]
  sampledFrames: number
  durationSec: number
  intervalSec: number
  criticalFrames: CapturedFrame[]
}

export type ProgressFn = (pct: number, stage: string) => void

const FORMAT_HINT =
  'Bitte das Video als MP4 (H.264) oder WebM speichern und erneut hochladen.'

// ── Model ─────────────────────────────────────────────────────────────────────

let landmarkerPromise: Promise<PoseLandmarker> | null = null

function getLandmarker(): Promise<PoseLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarker().catch((err) => {
      landmarkerPromise = null
      throw err
    })
  }
  return landmarkerPromise
}

/**
 * True if WebGL runs on a real GPU. With a software renderer (SwiftShader,
 * llvmpipe – e.g. VMs or blocklisted drivers) the GPU delegate is far slower
 * than the WebAssembly CPU path.
 */
function hasHardwareGpu(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER))
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
  } catch {
    return false
  }
}

async function createLandmarker(): Promise<PoseLandmarker> {
  const fileset = { wasmLoaderPath, wasmBinaryPath }
  const delegates: ('GPU' | 'CPU')[] = hasHardwareGpu() ? ['GPU', 'CPU'] : ['CPU']
  let lastError: unknown
  for (const delegate of delegates) {
    try {
      return await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: 'IMAGE',
        numPoses: 1,
      })
    } catch (err) {
      lastError = err
    }
  }
  console.error('Pose model could not be loaded', lastError)
  throw new Error(
    'Das KI-Modell für die Bewegungsanalyse konnte nicht geladen werden. ' +
      'Bitte Internetverbindung prüfen und erneut versuchen.',
  )
}

// ── Video helpers ─────────────────────────────────────────────────────────────

function waitForEvent(video: HTMLVideoElement, event: string, errorMessage: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer)
      video.removeEventListener(event, onEvent)
      video.removeEventListener('error', onError)
    }
    const onEvent = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(new Error(errorMessage))
    }
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(errorMessage))
    }, SEEK_TIMEOUT_MS)
    video.addEventListener(event, onEvent)
    video.addEventListener('error', onError)
  })
}

async function openVideo(video: HTMLVideoElement, url: string): Promise<number> {
  const unreadable = `Das Video kann von diesem Browser nicht gelesen werden. ${FORMAT_HINT}`
  const loaded = waitForEvent(video, 'loadeddata', unreadable)
  video.src = url
  await loaded
  if (!video.videoWidth || !video.videoHeight) throw new Error(unreadable)

  let duration = video.duration
  if (!Number.isFinite(duration) || duration <= 0) {
    // Some WebM files carry no duration header: seek to the end to resolve it.
    const seeked = waitForEvent(video, 'seeked', unreadable)
    video.currentTime = 1e9
    await seeked
    duration = video.duration
  }
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(unreadable)
  return duration
}

async function seekTo(video: HTMLVideoElement, second: number): Promise<void> {
  if (Math.abs(video.currentTime - second) < 1e-3 && video.readyState >= 2) return
  const seeked = waitForEvent(video, 'seeked', `Das Video konnte nicht vollständig gelesen werden. ${FORMAT_HINT}`)
  video.currentTime = second
  await seeked
}

// ── Critical frames ───────────────────────────────────────────────────────────

/**
 * Snapshot of the current frame with an opaque grey box over the head region
 * (top 38 % of the person's height + 20 px padding, as in the backend's
 * _anonymise_frame) and a timestamp / REBA label.
 */
function captureFrame(
  source: HTMLCanvasElement,
  lm: Landmark[],
  videoWidth: number,
  videoHeight: number,
  second: number,
  reba: number,
): string {
  const outW = Math.min(CRITICAL_FRAME_WIDTH, source.width)
  const outH = Math.round((source.height * outW) / source.width)
  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.drawImage(source, 0, 0, outW, outH)

  // Fall back to all landmarks if none passes the visibility threshold, so a
  // detected person is never left unmasked.
  const visible = lm.filter((p) => (p.visibility ?? 0) > 0.3)
  const pts = visible.length ? visible : lm
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const top = Math.min(...ys)
  const bottom = Math.max(...ys)
  const padX = 20 / videoWidth
  const padY = 20 / videoHeight
  const boxLeft = Math.max(0, Math.min(...xs) - padX) * outW
  const boxRight = Math.min(1, Math.max(...xs) + padX) * outW
  const boxTop = Math.max(0, top - padY) * outH
  const boxBottom = Math.min(1, top + 0.38 * (bottom - top) + padY) * outH
  ctx.fillStyle = 'rgb(80, 80, 80)'
  ctx.fillRect(boxLeft, boxTop, boxRight - boxLeft, boxBottom - boxTop)

  const mm = String(Math.floor(second / 60)).padStart(2, '0')
  const ss = String(Math.floor(second % 60)).padStart(2, '0')
  const label = `${mm}:${ss} · REBA ${reba.toFixed(1)}`
  ctx.font = 'bold 18px Inter, sans-serif'
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(10, 12, ctx.measureText(label).width + 20, 32)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(label, 20, 34)

  return canvas.toDataURL('image/jpeg', 0.8)
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export async function analyzeVideo(file: File, onProgress: ProgressFn): Promise<PoseAnalysis> {
  onProgress(0, 'KI-Modell wird geladen…')
  const landmarker = await getLandmarker()

  onProgress(4, 'Video wird geöffnet…')
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'

  try {
    const durationSec = await openVideo(video, url)
    const scale = Math.min(1, MAX_ANALYSIS_EDGE / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Der Browser unterstützt keine Bildverarbeitung (Canvas).')

    const intervalSec = Math.max(MIN_INTERVAL_SEC, durationSec / MAX_SAMPLES)
    const count = Math.max(1, Math.ceil(durationSec / intervalSec - 1e-6))
    const times = Array.from({ length: count }, (_, i) => Number((i * intervalSec).toFixed(3)))

    const samples: PoseSample[] = []
    // Top frames by REBA, highest first; on ties the earlier frame wins.
    const critical: CapturedFrame[] = []

    for (let i = 0; i < times.length; i++) {
      const second = times[i]
      await seekTo(video, second)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const lm = landmarker.detect(canvas).landmarks[0]

      if (lm) {
        const scores = rebaSubscores(lm, canvas.width, canvas.height)
        const reba = computeOverallReba(scores)
        const movement = classifyMovement(lm)
        samples.push({ second: Number(second.toFixed(1)), movement, reba, scores })

        // A nearby frame with an equal or higher score wins; a weaker nearby
        // frame is replaced by this one.
        const nearby = critical.filter((c) => Math.abs(c.second - second) < CRITICAL_FRAME_MIN_GAP_SEC)
        const weakest = critical[CRITICAL_FRAME_COUNT - 1]
        const qualifies = nearby.length
          ? nearby.every((c) => c.reba < reba)
          : !weakest || reba > weakest.reba
        if (qualifies) {
          for (const c of nearby) critical.splice(critical.indexOf(c), 1)
          const frame: CapturedFrame = {
            second: Number(second.toFixed(1)),
            reba,
            movement,
            imageUrl: captureFrame(canvas, lm, video.videoWidth, video.videoHeight, second, reba),
          }
          const at = critical.findIndex((c) => c.reba < reba)
          critical.splice(at === -1 ? critical.length : at, 0, frame)
          critical.length = Math.min(critical.length, CRITICAL_FRAME_COUNT)
        }
      }

      if (i % 3 === 0 || i === times.length - 1) {
        onProgress(5 + (90 * (i + 1)) / times.length, `Bild ${i + 1} von ${times.length} wird analysiert…`)
      }
    }

    return { samples, sampledFrames: times.length, durationSec, intervalSec, criticalFrames: critical }
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
