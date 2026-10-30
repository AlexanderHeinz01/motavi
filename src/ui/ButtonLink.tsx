import type { ReactNode } from 'react'
import { ButtonLinkBase, type ButtonVariant, type Force } from './Button'

/** Link styled as a button: min. 44 px high, visible focus (DESIGN_BRIEF §4). */
export default function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
  force,
}: {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  force?: Force
}) {
  return (
    <ButtonLinkBase to={to} variant={variant} className={className} force={force}>
      {children}
    </ButtonLinkBase>
  )
}
