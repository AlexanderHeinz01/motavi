import { Scale } from 'lucide-react'
import { partnerText } from '../content/komponenten'
import Icon from './Icon'

/** Recurring trust element "Herstellerneutral" (DESIGN_BRIEF §4): one sentence with icon. */
export default function Partnerhinweis({ text = partnerText.text }: { text?: string }) {
  return (
    <p className="t-body flex items-start gap-2 text-ink">
      <span className="mt-0.5 text-ink-muted">
        <Icon icon={Scale} size={18} />
      </span>
      <span>
        <span className="font-medium">{partnerText.titel}:</span> <span className="text-ink-muted">{text}</span>
      </span>
    </p>
  )
}
