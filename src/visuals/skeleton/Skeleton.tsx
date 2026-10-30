import { BONES, type Pose } from './pose'

const HEAD_R = 13

/**
 * Anonymised movement skeleton: joints as circles, connections as 1.5 px
 * lines (DESIGN_BRIEF §2). The head is an outline only, never a face.
 */
export default function Skeleton({
  pose,
  color = 'var(--data-ink)',
  background = 'var(--bg)',
  headR = HEAD_R,
  jointR = 3.5,
}: {
  pose: Pose
  color?: string
  /** Smaller for the static divider poses */
  headR?: number
  jointR?: number
  /** Fill of the joint circles, matches the ground. */
  background?: string
}) {
  // Neck line ends at the head outline, so the head does not float
  const [hx, hy] = pose.head
  const [nx, ny] = pose.neck
  const len = Math.hypot(nx - hx, ny - hy) || 1
  const edge = [hx + ((nx - hx) / len) * headR, hy + ((ny - hy) / len) * headR]
  return (
    <g stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none">
      {BONES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={pose[a][0]} y1={pose[a][1]} x2={pose[b][0]} y2={pose[b][1]} />
      ))}
      <line x1={nx} y1={ny} x2={edge[0]} y2={edge[1]} />
      <circle cx={hx} cy={hy} r={headR} />
      {Object.entries(pose)
        .filter(([joint]) => joint !== 'head')
        .map(([joint, [x, y]]) => (
          <circle key={joint} cx={x} cy={y} r={jointR} fill={background} />
        ))}
    </g>
  )
}
