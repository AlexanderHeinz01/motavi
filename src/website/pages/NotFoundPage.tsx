import { notFound } from '../../content/site'
import ButtonLink from '../../ui/ButtonLink'
import PageHeader from '../layout/PageHeader'

export default function NotFoundPage() {
  return (
    <div className="site-container site-section">
      <PageHeader label={notFound.label} accent="data-ink" title={notFound.title} intro={notFound.intro} />
      <div className="mt-8">
        <ButtonLink to="/" variant="secondary">
          {notFound.back}
        </ButtonLink>
      </div>
    </div>
  )
}
