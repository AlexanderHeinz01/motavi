/** Fine dotted divider between sections (DESIGN_BRIEF §3 "Formen"): 1 px dots, 4 px apart. */
export default function Trennlinie() {
  return (
    <svg className="block h-[2px] w-full" aria-hidden="true" preserveAspectRatio="none">
      <line x1="0" y1="1" x2="100%" y2="1" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="1 3" />
    </svg>
  )
}
