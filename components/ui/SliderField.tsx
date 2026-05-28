'use client'

import React from 'react'
import { formatBRL } from '@/lib/formatters'

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
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="text-base font-semibold" style={{ color: 'var(--c-muted)' }}>
          {label}
        </label>
        <span className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>
          {formatValue(value)}
        </span>
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
