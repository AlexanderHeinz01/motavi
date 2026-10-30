import type { CSSProperties, ReactNode } from 'react'
import { empfehlungen, improveThenAutomateSegments, vorrangigLabel, type Path } from '../content/empfehlungen'

export type Single = Exclude<Path, 'improve-then-automate'>
type Variant = 'ruhig' | 'kraeftig'

export const TOKEN: Record<Single, string> = {
  improve: '--path-improve',
  automate: '--path-automate',
  keep: '--path-keep',
}

/** Line icons, 1.5 px stroke, in the path colour (DESIGN_BRIEF §4). */
export function PathIcon({ path }: { path: Single }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (path === 'improve') {
    // rising line: better design of the workflow
    return (
      <svg {...common}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    )
  }
  if (path === 'automate') {
    // gear
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    )
  }
  // keep: check mark, a good result
  return (
    <svg {...common}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

function Segment({ path, variant, children, size }: { path: Single; variant: Variant; children: ReactNode; size: 'md' | 'lg' }) {
  const color = `var(${TOKEN[path]})`
  const style: CSSProperties =
    variant === 'kraeftig'
      ? { background: color, color: 'var(--on-path)' }
      : {
          // "ruhig": 12 % tint, text inherits the surrounding text colour,
          // the path colour carries icon and 1 px border
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid ${color}`,
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
 * "ruhig" (default): tint, text in the surrounding text colour.
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
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="sr-only">{empfehlungen[path]}</span>
      {path === 'improve-then-automate' ? (
        <span className="inline-flex flex-wrap items-center gap-1.5" aria-hidden="true">
          <Segment path="improve" variant={variant} size={size}>
            {improveThenAutomateSegments.first}
          </Segment>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 6h15M11 1l5 5-5 5" />
          </svg>
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
