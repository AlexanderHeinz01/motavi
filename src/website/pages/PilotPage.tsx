import { pilot } from '../../content/pilot'
import { site } from '../../content/site'
import PageHeader from '../layout/PageHeader'
import PilotFormular from '../sections/pilot/PilotFormular'

/** /pilot (WEBSITE_PLAN Phase 6). */
export default function PilotPage() {
  return (
    <div className="site-container site-section">
      <PageHeader label={pilot.label} accent={pilot.accent} title={pilot.title} intro={pilot.intro} />
      <div className="mt-12 max-w-[800px]">
        <PilotFormular />
      </div>
      <p className="t-body mt-10 text-ink-muted">
        <a href={`mailto:${site.contactEmail}`} className="text-primary underline underline-offset-4">
          {site.contactEmail}
        </a>
      </p>
    </div>
  )
}
