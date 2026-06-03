'use client'

import React, { useState } from 'react'
import { formatBRL, parseBRLInput } from '@/lib/formatters'

interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
  id: string
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = formatBRL,
  id,
}: SliderFieldProps) {
  const [rawInput, setRawInput] = useState('')
  const [focused, setFocused] = useState(false)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    setRawInput(String(value))
    e.target.select()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setRawInput(raw)
    const parsed = parseBRLInput(raw)
    if (parsed >= 0) {
      onChange(Math.max(min, Math.min(max, parsed || min)))
    }
  }

  const handleBlur = () => setFocused(false)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline gap-3">
        <label htmlFor={id} className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
          {label}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={focused ? rawInput : formatValue(value)}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          className="text-xl sm:text-2xl font-bold tabular-nums text-right bg-transparent border-b-2 focus:outline-none transition-colors"
          style={{
            color: 'var(--c-ink)',
            borderColor: focused ? 'var(--c-emerald)' : 'transparent',
            maxWidth: '12rem',
          }}
          aria-label={label}
        />
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        style={{ backgroundColor: 'var(--c-line)' }}
      />
      <div className="flex justify-between text-sm text-stone-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
}
