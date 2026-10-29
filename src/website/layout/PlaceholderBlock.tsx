import { placeholderText } from '../../content/site'

/** Marked placeholder for content that a later phase adds. */
export default function PlaceholderBlock({ planned, phase }: { planned: string[]; phase: string }) {
  return (
    <section
      aria-label={placeholderText.label}
      className="rounded-card border border-dashed border-line bg-page-subtle p-6 md:p-8"
    >
      <p className="t-label text-ink-muted">{placeholderText.label}</p>
      {planned.length > 0 && (
        <>
          <h2 className="t-h3 mt-3 text-ink">{placeholderText.plannedTitle}</h2>
          <ul className="t-body mt-4 list-disc space-y-2 pl-5 text-ink-muted">
            {planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      <p className="t-body mt-5 text-ink-muted">
        {placeholderText.phasePrefix} {phase}.
      </p>
    </section>
  )
}
