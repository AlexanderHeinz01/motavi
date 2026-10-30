import { Info, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import Icon from './Icon'

/** Note box (DESIGN_BRIEF §4): method or data protection, subtle background, small icon. */
export default function Hinweisbox({
  variant = 'methode',
  title,
  children,
}: {
  variant?: 'methode' | 'datenschutz'
  title?: string
  children: ReactNode
}) {
  return (
    <aside className="flex gap-3 rounded-card bg-page-subtle p-4 text-ink">
      <span className="mt-0.5 text-ink-muted">
        <Icon icon={variant === 'datenschutz' ? ShieldCheck : Info} size={18} />
      </span>
      <div className="t-body">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-ink-muted">{children}</div>
      </div>
    </aside>
  )
}
