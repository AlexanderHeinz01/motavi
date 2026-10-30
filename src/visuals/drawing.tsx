/**
 * Building blocks in the style of a technical drawing (DESIGN_BRIEF §6):
 * grid paper, reduced workplace line drawings, trajectory, reach envelope,
 * dimension line, angle arc. All in the 400 x 320 drawing space.
 */

const MONO = 'var(--font-mono)'

/** Fine grid paper background; `id` must be unique on the page. */
export function GridPaper({ id, width = 400, height = 320 }: { id: string; width?: number; height?: number }) {
  return (
    <>
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--border)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${id})`} />
    </>
  )
}

/** Workbench at hip height with a parts bin; floor line. */
export function Workbench() {
  return (
    <g stroke="var(--text-muted)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="20" y1="304" x2="390" y2="304" />
      <path d="M236 184H392" />
      <path d="M246 184V304M382 184V304" />
      <path d="M246 214H382" strokeWidth={1} />
      {/* parts bin */}
      <path d="M326 184V156H380V184" />
      <path d="M332 156L336 148H370L374 156" strokeWidth={1} />
      {/* placed part */}
      <rect x="252" y="170" width="22" height="14" rx="2" />
    </g>
  )
}

/** Low bin on the floor (for the bending pose). */
export function FloorBin() {
  return (
    <g stroke="var(--text-muted)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="20" y1="304" x2="390" y2="304" />
      <path d="M226 304V256H304V304" />
      <path d="M232 256L236 248H294L298 256" strokeWidth={1} />
    </g>
  )
}

/** Trajectory of the hand between bin and placing point. */
export function Trajectory({ color = 'var(--data-ink)' }: { color?: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round">
      <path d="M352 152C334 96 284 96 264 136" strokeDasharray="1 5" />
      <path d="M262 142C286 178 330 176 350 160" strokeDasharray="6 4" opacity="0.7" />
      <path d="M258 128l6 8 2-10" strokeLinejoin="round" />
      <circle cx="352" cy="152" r="3" fill={color} stroke="none" />
    </g>
  )
}

/** Reach envelope around the shoulder (favourable grip range). */
export function ReachEnvelope({ cx = 184, cy = 106, r = 96 }: { cx?: number; cy?: number; r?: number }) {
  const point = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]
  const [x1, y1] = point(-35)
  const [x2, y2] = point(65)
  return (
    <path
      d={`M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`}
      fill="none"
      stroke="var(--text-muted)"
      strokeWidth={1}
      strokeDasharray="3 4"
    />
  )
}

/** Horizontal dimension line with ticks and a mono label above it. */
export function DimensionLine({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g stroke="var(--text)" strokeWidth={1} fill="none">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 6} x2={x1} y2={y + 6} />
      <line x1={x2} y1={y - 6} x2={x2} y2={y + 6} />
      <path d={`M${x1 + 7} ${y - 3}L${x1} ${y}L${x1 + 7} ${y + 3}M${x2 - 7} ${y - 3}L${x2} ${y}L${x2 - 7} ${y + 3}`} />
      <text
        x={(x1 + x2) / 2}
        y={y - 9}
        textAnchor="middle"
        fill="var(--text)"
        stroke="none"
        style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500 }}
      >
        {label}
      </text>
    </g>
  )
}

/** Angle arc at a joint, e.g. trunk inclination. */
export function AngleArc({ cx, cy, r, from, to, label, color = 'var(--risk-ink)' }: {
  cx: number
  cy: number
  r: number
  from: number
  to: number
  label: string
  color?: string
}) {
  const p = (deg: number) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]
  const [x1, y1] = p(from)
  const [x2, y2] = p(to)
  return (
    <g>
      <line x1={cx} y1={cy} x2={cx} y2={cy - r - 14} stroke="var(--text-muted)" strokeWidth={1} strokeDasharray="3 3" />
      <path d={`M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`} fill="none" stroke={color} strokeWidth={1.5} />
      {/* label left of the vertical reference, clear of the figure */}
      <text x={cx - 8} y={cy - r + 6} textAnchor="end" fill="var(--text)" style={{ fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
        {label}
      </text>
    </g>
  )
}
