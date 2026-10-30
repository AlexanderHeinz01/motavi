import type { Accent } from '../content/types'

/** Category label: dot in a data colour plus mono uppercase text (DESIGN_BRIEF §3, "Formen"). */
export default function KategorieLabel({
  children,
  accent = 'data-ink',
  inverse = false,
}: {
  children: string
  accent?: Accent
  inverse?: boolean
}) {
  return (
    <p className={`t-label flex items-center gap-2 ${inverse ? 'text-white/70' : 'text-ink-muted'}`}>
      <span aria-hidden="true" style={{ color: `var(--${accent})` }}>
        ●
      </span>
      {children}
    </p>
  )
}
