import { useId } from 'react'
import { DimensionLine, GridPaper, ReachEnvelope, Trajectory, Workbench } from './drawing'
import Skeleton from './skeleton/Skeleton'
import { reachPose } from './skeleton/pose'

/**
 * Technical drawing: skeleton at the workbench with trajectory of the hand,
 * reach envelope and cycle time (DESIGN_BRIEF §2 and §6).
 */
export default function MessZeichnung({
  ariaLabel,
  cycleLabel,
  annotated = true,
}: {
  ariaLabel: string
  cycleLabel: string
  annotated?: boolean
}) {
  const grid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 400 320" className="h-auto w-full" role="img" aria-label={ariaLabel}>
      <GridPaper id={`grid-${grid}`} />
      <Workbench />
      {annotated && <ReachEnvelope />}
      <Skeleton pose={reachPose} />
      <Trajectory />
      {annotated && <DimensionLine x1={244} x2={372} y={40} label={cycleLabel} />}
    </svg>
  )
}
