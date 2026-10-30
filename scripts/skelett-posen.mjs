/**
 * Generates the keyframes of the skeleton visual (DESIGN_BRIEF §2, phase D2)
 * and writes src/visuals/skeleton/keyframes.ts.
 *
 * Poses are set up in a small 3D model with fixed bone lengths (metres):
 * trunk flexion and rotation, pelvis shift, arm and leg IK towards hand and
 * foot targets. The result is projected orthographically at a 3/4 angle and
 * stored as 2D joint positions normalised to 0..1 of the 400 x 320 drawing.
 *
 *   node scripts/skelett-posen.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const W = 400
const H = 320
const SCALE = 128 // px per metre (keep GREIFWEITE in SkelettAnimation.tsx in sync)
const ORIGIN_X = 168 // drawing x of the pelvis when standing
const FLOOR = 300 // drawing y of the floor
// Camera angle, 3/4 view: in front of the person is right in the drawing, her
// right side lies to the left (things she turns to appear behind her)
const YAW = (40 * Math.PI) / 180

// Body dimensions in metres
const B = {
  pelvis: 0.95,
  hipHalf: 0.09,
  thigh: 0.45,
  shank: 0.46,
  trunk: 0.5,
  head: 0.2,
  shoulderHalf: 0.18,
  shoulderDrop: 0.04,
  upperArm: 0.3,
  forearm: 0.28,
  ankleHalf: 0.11,
}

const rad = (d) => (d * Math.PI) / 180
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const len = (a) => Math.hypot(...a)
const norm = (a) => mul(a, 1 / (len(a) || 1))

/** Rotation about the vertical axis; positive = turn to the right (towards -z). */
const yaw = (v, t) => [v[0] * Math.cos(t) + v[2] * Math.sin(t), v[1], -v[0] * Math.sin(t) + v[2] * Math.cos(t)]
/** Forward flexion about the z axis. */
const flex = (v, a) => [v[0] * Math.cos(a) + v[1] * Math.sin(a), -v[0] * Math.sin(a) + v[1] * Math.cos(a), v[2]]

/** Two-bone IK: returns [middle joint, end point actually reached]. */
function ik(root, target, a, b, pole) {
  const d0 = sub(target, root)
  const d = Math.min(len(d0), a + b - 1e-4)
  const u = norm(d0)
  const cosB = (a * a + d * d - b * b) / (2 * a * d)
  const beta = Math.acos(Math.max(-1, Math.min(1, cosB)))
  const v = norm(sub(pole, mul(u, dot(pole, u))))
  const mid = add(root, add(mul(u, a * Math.cos(beta)), mul(v, a * Math.sin(beta))))
  const end = add(root, mul(u, d))
  return [mid, add(mid, mul(norm(sub(end, mid)), b))]
}

/**
 * One pose. p: pelvis offset [x, dy, z], flexion and rotation of the trunk in
 * degrees, head flexion, hand targets in metres.
 */
function pose({ pelvis = [0, 0], flexion = 8, rotation = 0, headFlex = 10, handR, handL }) {
  const P = [pelvis[0], B.pelvis + pelvis[1], pelvis[2] ?? 0]
  const pelvisYaw = rad(rotation) * 0.4
  const trunkYaw = rad(rotation)
  const a = rad(flexion)
  const hipR = add(P, yaw([0, 0, -B.hipHalf], pelvisYaw))
  const hipL = add(P, yaw([0, 0, B.hipHalf], pelvisYaw))
  const ankleR = [0.02, 0.06, -B.ankleHalf]
  const ankleL = [-0.04, 0.06, B.ankleHalf]
  const [kneeR] = ik(hipR, ankleR, B.thigh, B.shank, [1, 0, -0.1])
  const [kneeL] = ik(hipL, ankleL, B.thigh, B.shank, [1, 0, 0.1])
  const neck = add(P, yaw(flex([0, B.trunk, 0], a), trunkYaw))
  const head = add(neck, yaw(flex([0, B.head, 0], a + rad(headFlex)), trunkYaw))
  const shoulderR = add(neck, yaw(flex([0, -B.shoulderDrop, -B.shoulderHalf], a), trunkYaw))
  const shoulderL = add(neck, yaw(flex([0, -B.shoulderDrop, B.shoulderHalf], a), trunkYaw))
  const [elbowR, wristR] = ik(shoulderR, handR, B.upperArm, B.forearm, [-0.3, -1, -0.5])
  const [elbowL, wristL] = ik(shoulderL, handL, B.upperArm, B.forearm, [-0.3, -1, 0.5])
  const reach = Math.max(len(sub(wristR, handR)), len(sub(wristL, handL)))
  return {
    reach,
    joints: { head, neck, shoulderL, shoulderR, elbowL, elbowR, wristL, wristR, hipL, hipR, kneeL, kneeR, ankleL, ankleR },
  }
}

/** Orthographic 3/4 projection, normalised to the 400 x 320 drawing. */
function project([x, y, z]) {
  const X = x * Math.cos(YAW) + z * Math.sin(YAW)
  return [(ORIGIN_X + SCALE * X) / W, (FLOOR - SCALE * y) / H]
}

const round = (v) => Math.round(v * 1000) / 1000
const project2 = (p) => project(p).map(round)

// ---------------------------------------------------------------------------
// Scene 1 (hero): take a part from a low bin to the right behind the person
// (trunk rotation, flexion up to 45 degrees), place it on the bench in front.
const bench = { y: 0.9, x0: 0.36, x1: 0.84, z0: 0.25, z1: -0.25 }
const stand = { x0: -0.16, x1: 0.16, z0: -0.5, z1: -0.82, y: 0.62, rim: 0.8 }
const binGrip = [0.0, 0.7, -0.64]
const place = [0.46, 0.93, -0.02]

const greifen = [
  { t: 0, p: { flexion: 12, headFlex: 18, handR: [0.4, 0.97, -0.08], handL: [0.4, 0.96, 0.14] } },
  { t: 0.14, p: { flexion: 18, rotation: 34, headFlex: 14, handR: [0.18, 0.98, -0.42], handL: [0.3, 0.98, 0.08] } },
  { t: 0.28, p: { pelvis: [-0.02, -0.03, -0.06], flexion: 38, rotation: 74, headFlex: 18, handR: [0.04, 0.8, -0.6], handL: [0.12, 0.9, -0.12] } },
  { t: 0.36, ruhe: true, p: { pelvis: [-0.03, -0.05, -0.08], flexion: 45, rotation: 82, headFlex: 20, handR: binGrip, handL: [0.12, 0.84, -0.22] } },
  { t: 0.44, ruhe: true, p: { pelvis: [-0.03, -0.05, -0.08], flexion: 45, rotation: 82, headFlex: 20, handR: binGrip, handL: [0.12, 0.84, -0.22] } },
  { t: 0.58, p: { pelvis: [0, -0.02, -0.04], flexion: 22, rotation: 36, headFlex: 14, handR: [0.16, 1.02, -0.4], handL: [0.28, 0.98, 0.0] } },
  { t: 0.72, p: { flexion: 16, rotation: 6, headFlex: 20, handR: [0.44, 1.0, -0.04], handL: [0.42, 0.98, 0.12] } },
  { t: 0.8, ruhe: true, p: { flexion: 18, headFlex: 24, handR: place, handL: [0.44, 0.94, 0.12] } },
  { t: 0.86, ruhe: true, p: { flexion: 18, headFlex: 24, handR: place, handL: [0.44, 0.94, 0.12] } },
]

// Scene 2 (health page): bend to a bin on the floor in front, lift, turn and
// place the part on a bench to the right of the person.
const floorBin = { x0: 0.34, x1: 0.66, z0: 0.18, z1: -0.14, y: 0.32 }
const bench2 = { y: 0.9, x0: -0.35, x1: 0.15, z0: -0.45, z1: -0.85 }
const bueckenGrip = [0.44, 0.4, -0.05]
const bueckenGripL = [0.44, 0.4, 0.12]
const ablage = [-0.02, 0.95, -0.56]
const bueckenRest = [0.18, 0.86, -0.12]
const bueckenRestL = [0.16, 0.86, 0.16]

const buecken = [
  { t: 0, p: { flexion: 6, handR: bueckenRest, handL: bueckenRestL } },
  { t: 0.16, p: { pelvis: [-0.1, -0.06], flexion: 48, headFlex: 10, handR: [0.4, 0.72, -0.06], handL: [0.4, 0.72, 0.12] } },
  { t: 0.3, ruhe: true, p: { pelvis: [-0.16, -0.14], flexion: 70, headFlex: 6, handR: bueckenGrip, handL: bueckenGripL } },
  { t: 0.38, ruhe: true, p: { pelvis: [-0.16, -0.14], flexion: 70, headFlex: 6, handR: bueckenGrip, handL: bueckenGripL } },
  { t: 0.54, p: { pelvis: [-0.06, -0.02], flexion: 30, headFlex: 12, handR: [0.36, 0.8, -0.1], handL: [0.36, 0.8, 0.08] } },
  { t: 0.68, p: { pelvis: [0, 0, -0.04], flexion: 14, rotation: 50, headFlex: 16, handR: [0.12, 1.05, -0.5], handL: [0.22, 1.05, -0.32] } },
  { t: 0.78, ruhe: true, p: { pelvis: [0, 0, -0.06], flexion: 20, rotation: 66, headFlex: 20, handR: ablage, handL: [0.1, 0.95, -0.46] } },
  { t: 0.84, ruhe: true, p: { pelvis: [0, 0, -0.06], flexion: 20, rotation: 66, headFlex: 20, handR: ablage, handL: [0.1, 0.95, -0.46] } },
]

function build(name, frames) {
  return frames.map((f) => {
    const { reach, joints } = pose(f.p)
    if (reach > 0.02) console.warn(`${name} t=${f.t}: hand misses target by ${(reach * 100).toFixed(1)} cm`)
    return {
      t: f.t,
      ...(f.ruhe ? { ruhe: true } : {}),
      rumpf: f.p.flexion,
      pose: Object.fromEntries(Object.entries(joints).map(([k, v]) => [k, project2(v)])),
    }
  })
}

/** Projected outline of a horizontal rectangle (bench top, bin rim) as a 2D x range. */
const xRange = (x0, x1, z0, z1) => {
  const xs = [project([x0, 0, z0])[0], project([x1, 0, z1])[0], project([x0, 0, z1])[0], project([x1, 0, z0])[0]]
  return [round(Math.min(...xs)), round(Math.max(...xs))]
}
const yAt = (y) => round(project([0, y, 0])[1])

const szenen = {
  greifen: {
    frames: build('greifen', greifen),
    szene: {
      boden: yAt(0),
      tisch: { x: xRange(bench.x0, bench.x1, bench.z0, bench.z1), y: yAt(bench.y) },
      behaelter: { x: xRange(stand.x0, stand.x1, stand.z0, stand.z1), y: [yAt(stand.y), yAt(stand.rim)] },
      ablage: project2(place),
      griff: project2(binGrip),
    },
  },
  buecken: {
    frames: build('buecken', buecken),
    szene: {
      boden: yAt(0),
      tisch: { x: xRange(bench2.x0, bench2.x1, bench2.z0, bench2.z1), y: yAt(bench2.y) },
      behaelter: { x: xRange(floorBin.x0, floorBin.x1, floorBin.z0, floorBin.z1), y: [yAt(0), yAt(floorBin.y)] },
      ablage: project2(ablage),
      griff: project2(bueckenGrip),
    },
  },
}

const header = `/**
 * Keyframes of the skeleton visual (DESIGN_BRIEF §2, phase D2).
 * GENERATED by scripts/skelett-posen.mjs, do not edit by hand.
 *
 * Joint positions are normalised to 0..1 of the 400 x 320 drawing (x to the
 * right, y downwards). t is the share of one cycle (0..1, the cycle loops back
 * to the first frame). ruhe: the joint speed is zero here (grip, place).
 * rumpf: trunk flexion in degrees, for the angle readout.
 */
import type { Joint } from './pose'

export interface Keyframe {
  t: number
  ruhe?: boolean
  rumpf: number
  pose: Record<Joint, [number, number]>
}

export interface Szene {
  boden: number
  tisch: { x: [number, number]; y: number }
  behaelter: { x: [number, number]; y: [number, number] }
  ablage: [number, number]
  griff: [number, number]
}

export const ZEICHNUNG = { breite: ${W}, hoehe: ${H} } as const
`
const body = Object.entries(szenen)
  .map(
    ([name, s]) =>
      `export const ${name}: { frames: Keyframe[]; szene: Szene } = ${JSON.stringify(s)}\n`,
  )
  .join('\n')

const out = fileURLToPath(new URL('../src/visuals/skeleton/keyframes.ts', import.meta.url))
writeFileSync(out, `${header}\n${body}`)
console.log('geschrieben:', out)
