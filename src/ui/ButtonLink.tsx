import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'text'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover px-5',
  secondary: 'border border-line bg-page text-ink hover:border-ink px-5',
  text: 'text-primary underline-offset-4 hover:underline px-1',
}

/** Link styled as a button: min. 44 px high, visible focus (DESIGN_BRIEF §4). */
export default function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string
  children: ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-btn font-body text-[15px] font-medium transition-colors duration-200 ease-out ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
