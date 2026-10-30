import { skelettText } from '../../content/skelett'
import { buecken } from './keyframes'
import { poseAt } from './motion'
import type { Joint, Pose } from './pose'
import Skeleton from './Skeleton'

const PHASEN = [0, 0.16, 0.34, 0.54, 0.7, 0.82]
const HOEHE = 96
const BREITE = 720

/**
 * Static variant for section dividers (DESIGN_BRIEF §2): six phases of the
 * lift cycle (bend, grip, lift, turn, place) side by side as a fine line
 * drawing, like a series photograph, on a dotted floor line.
 */
export default function SkelettTrenner() {
  const { frames } = buecken
  // Figure height in normalised units: head (y about 0.2) to floor (y about 0.94)
  const k = (HOEHE - 8) / (0.76 * 320)
  const schritt = BREITE / PHASEN.length
  const posen = PHASEN.map((phase, i) => {
    const p = poseAt(frames, phase)
    const out = {} as Pose
    for (const joint of Object.keys(p) as Joint[]) {
      out[joint] = [schritt * (i + 0.5) + (p[joint][0] - 0.42) * 400 * k, 4 + (p[joint][1] - 0.18) * 320 * k]
    }
    return out
  })
  return (
    <svg viewBox={`0 0 ${BREITE} ${HOEHE}`} className="mx-auto block h-auto w-full max-w-[720px]" role="img" aria-label={skelettText.trennerLabel}>
      <line x1="0" y1={HOEHE - 2} x2={BREITE} y2={HOEHE - 2} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="1 3" />
      {posen.map((pose, i) => (
        <Skeleton key={i} pose={pose} headR={13 * k * 1.4} jointR={2} />
      ))}
    </svg>
  )
}
