import type { LucideIcon } from 'lucide-react'

/**
 * Line icon from Lucide (ISC licence), 1.5 px stroke, decorative
 * (DESIGN_BRIEF §4 "Icons"). No other icon set is mixed in.
 */
export default function Icon({ icon: Glyph, size = 16, className }: { icon: LucideIcon; size?: number; className?: string }) {
  return <Glyph size={size} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" focusable="false" className={className} />
}
