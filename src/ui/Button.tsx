import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'secondary' | 'text'
/** Styleguide only: show a state permanently */
export type Force = 'hover' | 'focus'

const base =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn font-body text-[15px] font-medium transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary px-5 text-white is-hover:bg-primary-hover disabled:is-hover:bg-primary',
  secondary: 'border border-line bg-page px-5 text-ink is-hover:border-ink disabled:is-hover:border-line',
  text: 'px-1 text-primary underline-offset-4 is-hover:underline disabled:is-hover:no-underline',
}

export const buttonClass = (variant: ButtonVariant = 'primary', className = '') =>
  `${base} ${variants[variant]} ${className}`

/** Button (DESIGN_BRIEF §4): primary, secondary, text; min. 44 px, visible focus. */
export default function Button({
  variant = 'primary',
  force,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; force?: Force; children: ReactNode }) {
  return (
    <button type={type} data-force={force} className={buttonClass(variant, className)} {...rest}>
      {children}
    </button>
  )
}

/** Link with button styling, for navigation targets. */
export function ButtonLinkBase({
  to,
  variant = 'primary',
  force,
  className = '',
  children,
}: {
  to: string
  variant?: ButtonVariant
  force?: Force
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} data-force={force} className={buttonClass(variant, className)}>
      {children}
    </Link>
  )
}
