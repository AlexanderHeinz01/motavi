import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Force } from './Button'
import Icon from './Icon'

/** Benefit card (DESIGN_BRIEF §4): icon, title, text, link. */
export default function NutzenKarte({
  icon,
  title,
  text,
  link,
  force,
}: {
  icon: LucideIcon
  title: string
  text: string
  link?: { label: string; to: string }
  force?: Force
}) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-page p-6">
      <span className="text-data-ink">
        <Icon icon={icon} size={24} />
      </span>
      <h3 className="t-h3 mt-4 text-ink">{title}</h3>
      <p className="t-body mt-2 text-ink-muted">{text}</p>
      {link && (
        <Link
          to={link.to}
          data-force={force}
          className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 self-start pt-4 font-body text-[15px] font-medium text-primary underline-offset-4 is-hover:underline"
        >
          {link.label}
          <Icon icon={ArrowRight} size={16} />
        </Link>
      )}
    </div>
  )
}

/** Three cards side by side, stacked on mobile. */
export function NutzenKarten({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-3">{children}</div>
}
