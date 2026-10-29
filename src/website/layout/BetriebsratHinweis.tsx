import { Link } from 'react-router-dom'
import { placeholderText } from '../../content/site'

/** Guideline 6: every page on capacity or automation links to /betriebsrat. */
export default function BetriebsratHinweis() {
  return (
    <p className="t-body text-ink-muted">
      {placeholderText.betriebsratHint}{' '}
      <Link to="/betriebsrat" className="text-primary underline underline-offset-4 hover:text-primary-hover">
        {placeholderText.betriebsratLink}
      </Link>
      .
    </p>
  )
}
