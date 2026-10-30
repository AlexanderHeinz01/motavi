/**
 * Motion between keyframes (DESIGN_BRIEF §2 and §7): cubic Hermite curves
 * with Catmull-Rom tangents, so the joints move smoothly through the
 * keyframes and only stop where a frame is marked "ruhe" (grip, place).
 */
import { ZEICHNUNG, type Keyframe } from './keyframes'
import type { Joint, Pose } from './pose'

const lerp = (a: number, b: number, u: number) => a + (b - a) * u

/** Segment of a cyclic keyframe list at cycle position t (0..1). */
function segment(frames: Keyframe[], t: number) {
  const n = frames.length
  const tt = ((t % 1) + 1) % 1
  let i = n - 1
  for (let k = 0; k < n; k++) if (frames[k].t <= tt) i = k
  const j = (i + 1) % n
  const t0 = frames[i].t
  const t1 = j === 0 ? 1 : frames[j].t
  return { i, j, u: (tt - t0) / (t1 - t0), dt: t1 - t0 }
}

/** Time of frame k, continued beyond the cycle borders. */
function zeit(frames: Keyframe[], k: number) {
  const n = frames.length
  const lap = Math.floor(k / n)
  return frames[((k % n) + n) % n].t + lap
}

function tangente(frames: Keyframe[], k: number, joint: Joint, axis: 0 | 1) {
  const n = frames.length
  const f = frames[((k % n) + n) % n]
  if (f.ruhe) return 0
  const prev = frames[(((k - 1) % n) + n) % n]
  const next = frames[(k + 1) % n]
  return (next.pose[joint][axis] - prev.pose[joint][axis]) / (zeit(frames, k + 1) - zeit(frames, k - 1))
}

function hermite(p0: number, m0: number, p1: number, m1: number, u: number, dt: number) {
  const u2 = u * u
  const u3 = u2 * u
  return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * dt * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * dt * m1
}

/** Normalised pose at cycle position t. */
export function poseAt(frames: Keyframe[], t: number): Pose {
  const { i, j, u, dt } = segment(frames, t)
  const out = {} as Pose
  for (const joint of Object.keys(frames[i].pose) as Joint[]) {
    const p0 = frames[i].pose[joint]
    const p1 = frames[j].pose[joint]
    out[joint] = [0, 1].map((axis) =>
      hermite(p0[axis], tangente(frames, i, joint, axis as 0 | 1), p1[axis], tangente(frames, i + 1, joint, axis as 0 | 1), u, dt),
    ) as [number, number]
  }
  return out
}

/** Trunk flexion in degrees at cycle position t (for the angle readout). */
export function rumpfAt(frames: Keyframe[], t: number): number {
  const { i, j, u } = segment(frames, t)
  const s = u * u * (3 - 2 * u)
  return lerp(frames[i].rumpf, frames[j].rumpf, s)
}

/** Normalised (0..1) to drawing coordinates (400 x 320). */
export const px = ([x, y]: [number, number]): [number, number] => [x * ZEICHNUNG.breite, y * ZEICHNUNG.hoehe]

export function toDrawing(pose: Pose): Pose {
  const out = {} as Pose
  for (const joint of Object.keys(pose) as Joint[]) out[joint] = px(pose[joint])
  return out
}

/** Deterministic small offsets, so the three cycles differ like real repetitions. */
export function streuung(zyklus: number, amplitude = 0.006): [number, number] {
  const r = (seed: number) => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
    return x - Math.floor(x) - 0.5
  }
  return [r(zyklus + 1) * 2 * amplitude, r(zyklus + 7) * 2 * amplitude]
}
