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
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState('')

  function startEdit() {
    setEditVal(String(value))
    setEditing(true)
  }

  function commit(raw: string) {
    const parsed = parseBRLInput(raw)
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(Math.max(min, parsed || min))
    }
    setEditing(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline gap-3">
        <label htmlFor={id} className="text-base font-semibold flex-1" style={{ color: 'var(--c-muted)' }}>
          {label}
        </label>

        {editing ? (
          <input
            type="number"
            inputMode="decimal"
            autoFocus
            value={editVal}
            min={min}
            step={step}
            onChange={e => setEditVal(e.target.value)}
            onBlur={() => commit(editVal)}
            onKeyDown={e => e.key === 'Enter' && commit(editVal)}
            className="text-xl sm:text-2xl font-bold tabular-nums text-right bg-transparent border-b-2 focus:outline-none"
            style={{
              color: 'var(--c-ink)',
              borderColor: 'var(--c-emerald)',
              maxWidth: '12rem',
            }}
            aria-label={label}
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="group text-xl sm:text-2xl font-bold tabular-nums text-right relative"
            style={{ color: 'var(--c-ink)' }}
            title="Toque para digitar um valor personalizado"
            aria-label={`${label}: ${formatValue(value)}. Toque para editar.`}
          >
            {formatValue(value)}
            <span
              className="absolute -bottom-4 right-0 text-xs font-normal text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              aria-hidden="true"
            >
              ✎ clique para digitar
            </span>
          </button>
        )}
      </div>

      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={e => onChange(Number(e.target.value))}
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
        <span className="flex items-center gap-1">
          {value > max && (
            <span className="text-emerald-500 font-medium text-xs">↑ digitado acima</span>
          )}
          {formatValue(max)}
        </span>
      </div>

      {value > max && (
        <p className="text-xs text-emerald-600" style={{ marginTop: '-4px' }}>
          Valor fora do intervalo do slider — toque no número acima para ajustar.
        </p>
      )}
    </div>
  )
}
