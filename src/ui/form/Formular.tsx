/**
 * Form elements (DESIGN_BRIEF §3 "Formen" and §4 "Formular"):
 * labels always visible, 1 px --border-strong, hover --text-muted,
 * focus 2 px --primary plus focus ring, error 2 px --error-ink plus icon and
 * text below the field. Only on --bg or --bg-subtle.
 */
import { AlertCircle, Check, ChevronDown } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { formularText } from '../../content/komponenten'
import type { Force } from '../Button'
import Icon from '../Icon'

/** Field frame incl. states; 2 px via inset shadow, so the field does not shift. */
export const feldRahmen = (error?: string) =>
  [
    'rounded-btn border bg-page font-body text-[16px] text-ink transition-colors duration-150 ease-out',
    'disabled:cursor-not-allowed disabled:bg-page-subtle disabled:text-ink-muted',
    error
      ? 'border-error-ink shadow-[inset_0_0_0_1px_var(--error-ink)]'
      : 'border-line-strong is-hover:border-ink-muted is-focus:border-primary is-focus:shadow-[inset_0_0_0_1px_var(--primary)] disabled:is-hover:border-line-strong',
  ].join(' ')

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 font-body text-[14px] text-error-ink">
      <span className="mt-0.5">
        <Icon icon={AlertCircle} size={16} />
      </span>
      <span>
        <span className="sr-only">{formularText.fehlerPraefix} </span>
        {children}
      </span>
    </p>
  )
}

function Label({ htmlFor, label, optional }: { htmlFor: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-body text-[15px] font-medium text-ink">
      {label}
      {optional && <span className="ml-1 font-normal text-ink-muted">({formularText.optional})</span>}
    </label>
  )
}

function useFieldIds() {
  const id = useId()
  return { input: `${id}-feld`, error: `${id}-fehler`, hint: `${id}-hinweis` }
}

type Common = { label: string; hint?: string; error?: string; optional?: boolean; force?: Force }

export function TextField({ label, hint, error, optional, force, className = '', ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const ids = useFieldIds()
  return (
    <div className={className}>
      <Label htmlFor={ids.input} label={label} optional={optional} />
      {hint && <p id={ids.hint} className="mb-1.5 font-body text-[14px] text-ink-muted">{hint}</p>}
      <input
        id={ids.input}
        data-force={force}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && ids.hint, error && ids.error].filter(Boolean).join(' ') || undefined}
        className={`block min-h-[44px] w-full px-3 placeholder:text-ink-muted ${feldRahmen(error)}`}
        {...rest}
      />
      {error && <FieldError id={ids.error}>{error}</FieldError>}
    </div>
  )
}

export function TextareaField({ label, hint, error, optional, force, className = '', ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ids = useFieldIds()
  return (
    <div className={className}>
      <Label htmlFor={ids.input} label={label} optional={optional} />
      {hint && <p id={ids.hint} className="mb-1.5 font-body text-[14px] text-ink-muted">{hint}</p>}
      <textarea
        id={ids.input}
        data-force={force}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint && ids.hint, error && ids.error].filter(Boolean).join(' ') || undefined}
        className={`block w-full px-3 py-2.5 placeholder:text-ink-muted ${feldRahmen(error)}`}
        {...rest}
      />
      {error && <FieldError id={ids.error}>{error}</FieldError>}
    </div>
  )
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  force,
  options,
  className = '',
  ...rest
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  const ids = useFieldIds()
  return (
    <div className={className}>
      <Label htmlFor={ids.input} label={label} optional={optional} />
      {hint && <p id={ids.hint} className="mb-1.5 font-body text-[14px] text-ink-muted">{hint}</p>}
      <div className="relative">
        <select
          id={ids.input}
          data-force={force}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint && ids.hint, error && ids.error].filter(Boolean).join(' ') || undefined}
          className={`block min-h-[44px] w-full appearance-none pl-3 pr-10 ${feldRahmen(error)}`}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
          <Icon icon={ChevronDown} size={18} />
        </span>
      </div>
      {error && <FieldError id={ids.error}>{error}</FieldError>}
    </div>
  )
}

export function CheckboxField({
  label,
  error,
  force,
  className = '',
  ...rest
}: Omit<Common, 'optional' | 'hint'> & InputHTMLAttributes<HTMLInputElement>) {
  const ids = useFieldIds()
  return (
    <div className={className}>
      <label htmlFor={ids.input} className="group flex min-h-[44px] cursor-pointer items-start gap-3 py-2 font-body text-[15px] text-ink has-[:disabled]:cursor-not-allowed has-[:disabled]:text-ink-muted">
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
          <input
            id={ids.input}
            type="checkbox"
            data-force={force}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? ids.error : undefined}
            className={`peer h-5 w-5 appearance-none rounded-[4px] border bg-page transition-colors duration-150 ease-out checked:border-primary checked:bg-primary disabled:cursor-not-allowed disabled:bg-page-subtle disabled:checked:opacity-40 ${
              error
                ? 'border-error-ink shadow-[inset_0_0_0_1px_var(--error-ink)]'
                : 'border-line-strong is-hover:border-ink-muted'
            }`}
            {...rest}
          />
          <span className="pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex">
            <Icon icon={Check} size={14} />
          </span>
        </span>
        <span>{label}</span>
      </label>
      {error && <FieldError id={ids.error}>{error}</FieldError>}
    </div>
  )
}
