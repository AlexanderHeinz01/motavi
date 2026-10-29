import type { ReactNode } from 'react'
import type { PageContent } from '../../content/types'
import BetriebsratHinweis from './BetriebsratHinweis'
import PageHeader from './PageHeader'
import PlaceholderBlock from './PlaceholderBlock'

/** Phase 1 page: heading, introduction and a marked placeholder for the planned sections. */
export default function PlaceholderPage({ content, children }: { content: PageContent; children?: ReactNode }) {
  return (
    <div className="site-container site-section">
      <PageHeader
        label={content.label}
        accent={content.accent}
        title={content.title}
        intro={content.intro}
        pilot={content.pilot}
      />
      {children && <div className="mt-8 max-w-[800px]">{children}</div>}
      <div className="mt-12 max-w-[800px]">
        <PlaceholderBlock planned={content.planned} phase={content.phase} />
      </div>
      {content.betriebsratLink && (
        <div className="mt-8 max-w-[800px]">
          <BetriebsratHinweis />
        </div>
      )}
    </div>
  )
}
