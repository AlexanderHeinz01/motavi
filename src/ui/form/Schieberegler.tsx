import { useId, useState, type CSSProperties } from 'react'
import type { Force } from '../Button'

/**
 * Slider with value display (DESIGN_BRIEF §4). Native range input, so it is
 * keyboard operable (arrows, Home, End, Page keys) and announced with its value.
 */
export default function Schieberegler({
  label,
  min,
  max,
  step = 1,
  value: controlled,
  defaultValue,
  onChange,
  einheit,
  format = (v) => String(v),
  disabled,
  force,
}: {
  label: string
  min: number
  max: number
  step?: number
  value?: number
  defaultValue?: number
  onChange?: (v: number) => void
  einheit?: string
  format?: (v: number) => string
  disabled?: boolean
  force?: Force
}) {
  const id = useId()
  const [own, setOwn] = useState(defaultValue ?? min)
  const value = controlled ?? own
  const fill = `${((value - min) / (max - min)) * 100}%`
  const anzeige = `${format(value)}${einheit ? ` ${einheit}` : ''}`
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-body text-[15px] font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="shrink-0 whitespace-nowrap font-mono text-[15px] font-medium text-ink">
          {anzeige}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        data-force={force}
        aria-valuetext={anzeige}
        onChange={(e) => {
          const v = Number(e.target.value)
          setOwn(v)
          onChange?.(v)
        }}
        className="motavi-range"
        style={{ '--fill': fill } as CSSProperties}
      />
    </div>
  )
}
