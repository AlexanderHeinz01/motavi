/**
 * REBA scoring from MediaPipe pose landmarks.
 *
 * Port of motavi-backend/backend/app/services/analyzer.py (_reba_subscores,
 * _overall_reba, _classify_movement). Thresholds, region weights and the
 * 1–10 scale are unchanged. Three angle definitions differ from the backend
 * because the backend's versions do not measure what REBA defines:
 *
 *  - Upper arm: angle between upper arm and trunk (shoulder→hip). The backend
 *    measures against the shoulder line, so a relaxed hanging arm reads 90°
 *    and always lands in the highest band.
 *  - Neck: angle between trunk axis and the shoulder→ear axis. The backend
 *    uses the nose against the vertical, so turning the head sideways reads
 *    as strong neck flexion.
 *  - Lower arm: elbow flexion (180° − interior angle), 60–100° is optimal.
 */

export interface Landmark {
  x: number
  y: number
  visibility?: number
}

export type Movement = 'neutral' | 'bending' | 'overhead'

export interface RegionScores {
  lumbar: number
  shoulder_l: number
  shoulder_r: number
  neck: number
  knee_l: number
  knee_r: number
  forearm: number
}

export type RebaLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'

// Max possible value per region (normalisation to the 1–10 scale)
export const REGION_MAX: RegionScores = {
  lumbar: 8.0,
  shoulder_l: 7.2,
  shoulder_r: 8.0,
  neck: 6.5,
  knee_l: 6.175,
  knee_r: 6.5,
  forearm: 4.5,
}

const REGION_WEIGHTS: RegionScores = {
  lumbar: 0.3,
  neck: 0.2,
  shoulder_l: 0.1,
  shoulder_r: 0.1,
  knee_l: 0.1,
  knee_r: 0.1,
  forearm: 0.1,
}

export const REGION_KEYS = Object.keys(REGION_MAX) as (keyof RegionScores)[]

// MediaPipe pose landmark indices
const L_EAR = 7
const R_EAR = 8
const L_SHOULDER = 11
const R_SHOULDER = 12
const L_ELBOW = 13
const R_ELBOW = 14
const L_WRIST = 15
const R_WRIST = 16
const L_HIP = 23
const R_HIP = 24
const L_KNEE = 25
const R_KNEE = 26
const L_ANKLE = 27
const R_ANKLE = 28

type Vec = [number, number]

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]]
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]
const mid = (a: Vec, b: Vec): Vec => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
const deg = (rad: number) => (rad * 180) / Math.PI

/** Angle in degrees at vertex b formed by rays b→a and b→c. */
export function angleAt(a: Vec, b: Vec, c: Vec): number {
  const ba = sub(a, b)
  const bc = sub(c, b)
  const denom = Math.hypot(ba[0], ba[1]) * Math.hypot(bc[0], bc[1]) + 1e-8
  const cos = Math.min(1, Math.max(-1, (ba[0] * bc[0] + ba[1] * bc[1]) / denom))
  return deg(Math.acos(cos))
}

/** Inclination of a vector against the image vertical, in degrees. */
function verticalAngle(v: Vec): number {
  return deg(Math.atan2(Math.abs(v[0]), Math.abs(v[1]) + 1e-8))
}

/** Per-region REBA subscores. Landmarks are normalised; w/h is the frame size in px. */
export function rebaSubscores(lm: Landmark[], w: number, h: number): RegionScores {
  const pt = (i: number): Vec => [lm[i].x * w, lm[i].y * h]

  const lShoulder = pt(L_SHOULDER)
  const rShoulder = pt(R_SHOULDER)
  const lHip = pt(L_HIP)
  const rHip = pt(R_HIP)
  const midShoulder = mid(lShoulder, rShoulder)
  const midHip = mid(lHip, rHip)

  // Trunk (lumbar)
  const trunkAngle = verticalAngle(sub(midHip, midShoulder))
  const lumbar = trunkAngle < 5 ? 1.0 : trunkAngle < 20 ? 2.5 : trunkAngle < 45 ? 5.5 : 8.0

  // Neck: trunk axis extended above the shoulders vs. shoulder→ear midpoint
  const trunkUp = add(midShoulder, sub(midShoulder, midHip))
  const neckAngle = angleAt(trunkUp, midShoulder, mid(pt(L_EAR), pt(R_EAR)))
  const neck = neckAngle < 10 ? 1.0 : neckAngle < 20 ? 3.0 : 6.5

  // Upper arm: angle between upper arm and trunk (shoulder→hip)
  const armAngle = Math.max(
    angleAt(lHip, lShoulder, pt(L_ELBOW)),
    angleAt(rHip, rShoulder, pt(R_ELBOW)),
  )
  const shoulder = armAngle < 20 ? 1.5 : armAngle < 45 ? 3.0 : armAngle < 90 ? 5.5 : 8.0

  // Lower arm: elbow flexion, 60–100° is the neutral REBA band
  const elbowAngle = Math.max(
    angleAt(lShoulder, pt(L_ELBOW), pt(L_WRIST)),
    angleAt(rShoulder, pt(R_ELBOW), pt(R_WRIST)),
  )
  const elbowFlexion = 180 - elbowAngle
  const forearm = elbowFlexion >= 60 && elbowFlexion <= 100 ? 1.5 : 4.5

  // Knee flexion
  const kneeFlex = Math.max(
    180 - angleAt(lHip, pt(L_KNEE), pt(L_ANKLE)),
    180 - angleAt(rHip, pt(R_KNEE), pt(R_ANKLE)),
  )
  const knee = kneeFlex < 30 ? 1.0 : kneeFlex < 60 ? 3.5 : 6.5

  return {
    lumbar,
    shoulder_l: shoulder * 0.9,
    shoulder_r: shoulder,
    neck,
    knee_l: knee * 0.95,
    knee_r: knee,
    forearm,
  }
}

/** Weighted combination → overall score on the 1–10 scale. */
export function computeOverallReba(subscores: Partial<Record<keyof RegionScores, number>>): number {
  let raw = 0
  for (const k of REGION_KEYS) {
    raw += (REGION_WEIGHTS[k] * (subscores[k] ?? 1.0)) / REGION_MAX[k]
  }
  return Number((1.0 + raw * 9.0).toFixed(2))
}

export function determineRebaLevel(score: number): RebaLevel {
  if (score <= 4) return 'LOW'
  if (score <= 6) return 'MEDIUM'
  if (score <= 8) return 'HIGH'
  return 'VERY_HIGH'
}

/**
 * Movement class from normalised landmarks (smaller y = higher in the image).
 * Overhead: wrist at/above shoulder height (+0.05 tolerance for the lifting
 * phase) or elbow above the shoulder line. Bending: trunk inclined > 20°.
 */
export function classifyMovement(lm: Landmark[]): Movement {
  const overhead =
    lm[R_WRIST].y < lm[R_SHOULDER].y + 0.05 ||
    lm[L_WRIST].y < lm[L_SHOULDER].y + 0.05 ||
    lm[R_ELBOW].y < lm[R_SHOULDER].y ||
    lm[L_ELBOW].y < lm[L_SHOULDER].y
  if (overhead) return 'overhead'

  const dx = (lm[L_SHOULDER].x + lm[R_SHOULDER].x) / 2 - (lm[L_HIP].x + lm[R_HIP].x) / 2
  const dy = (lm[L_SHOULDER].y + lm[R_SHOULDER].y) / 2 - (lm[L_HIP].y + lm[R_HIP].y) / 2
  return deg(Math.atan2(Math.abs(dx), Math.abs(dy))) > 20 ? 'bending' : 'neutral'
}
