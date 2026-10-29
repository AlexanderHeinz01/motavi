import { pilot } from '../../content/pilot'
import { site } from '../../content/site'
import PlaceholderPage from '../layout/PlaceholderPage'

export default function PilotPage() {
  return (
    <PlaceholderPage content={pilot}>
      <p className="t-body-lg text-ink">
        {pilot.contactLead}{' '}
        <a
          href={`mailto:${site.contactEmail}`}
          className="text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          {site.contactEmail}
        </a>
      </p>
    </PlaceholderPage>
  )
}
