import { ArrowRight, Check, Cog, TrendingUp, type LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { empfehlungen, improveThenAutomateSegments, vorrangigLabel, type Path } from '../content/empfehlungen'
import Icon from './Icon'

export type Single = Exclude<Path, 'improve-then-automate'>
type Variant = 'ruhig' | 'kraeftig'

export const TOKEN: Record<Single, string> = {
  improve: '--path-improve',
  automate: '--path-automate',
  keep: '--path-keep',
}

/** Icon per path (Lucide): rising line, gear, check mark (a good result). */
const PATH_ICON: Record<Single, LucideIcon> = { improve: TrendingUp, automate: Cog, keep: Check }

/** Line icon of a path, 1.5 px stroke, coloured by the caller (DESIGN_BRIEF §4). */
export function PathIcon({ path, size = 16 }: { path: Single; size?: number }) {
  return <Icon icon={PATH_ICON[path]} size={size} />
}

function Segment({ path, variant, children, size }: { path: Single; variant: Variant; children: ReactNode; size: 'md' | 'lg' }) {
  const color = `var(${TOKEN[path]})`
  const style: CSSProperties =
    variant === 'kraeftig'
      ? { background: color, color: 'var(--on-path)' }
      : {
          // "ruhig": 12 % tint, text in --text (set here, not inherited, so it
          // also switches inside .surface-inverse); the path colour carries
          // icon and 1 px border
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid ${color}`,
          color: 'var(--text)',
        }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-btn font-body font-medium ${
        size === 'lg' ? 'px-4 py-2 text-[17px]' : 'px-3 py-1.5 text-[14px]'
      }`}
      style={style}
    >
      <span style={variant === 'ruhig' ? { color } : undefined} className="inline-flex">
        <PathIcon path={path} />
      </span>
      {children}
    </span>
  )
}

/**
 * Recommendation label (DESIGN_BRIEF §3 and §4).
 * "ruhig" (default): tint, text in --text.
 * "kraeftig": full path fill, only for the one main statement (head of the Steckbrief).
 */
export default function EmpfehlungsLabel({
  path,
  variant = 'ruhig',
  size = 'md',
  vorrangig = false,
}: {
  path: Path
  variant?: Variant
  size?: 'md' | 'lg'
  vorrangig?: boolean
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-ink">
      <span className="sr-only">{empfehlungen[path]}</span>
      {path === 'improve-then-automate' ? (
        <span className="inline-flex flex-wrap items-center gap-1.5" aria-hidden="true">
          <Segment path="improve" variant={variant} size={size}>
            {improveThenAutomateSegments.first}
          </Segment>
          <Icon icon={ArrowRight} size={18} />
          <Segment path="automate" variant={variant} size={size}>
            {improveThenAutomateSegments.second}
          </Segment>
        </span>
      ) : (
        <span aria-hidden="true">
          <Segment path={path} variant={variant} size={size}>
            {empfehlungen[path]}
          </Segment>
        </span>
      )}
      {vorrangig && <span className="t-label rounded-full border border-current px-2 py-0.5">{vorrangigLabel}</span>}
    </span>
  )
}
