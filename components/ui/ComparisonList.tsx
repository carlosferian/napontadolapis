import React from 'react'

interface Comparison {
  icon: string
  label: string
  value: number
  unit: string
}

interface ComparisonListProps {
  monthlyAmount: number
  comparisons: Comparison[]
  title?: string
}

export function ComparisonList({ monthlyAmount, comparisons, title = 'Com esse valor você pagaria' }: ComparisonListProps) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
      <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--c-muted)' }}>{title}</h3>
      <div className="space-y-3">
        {comparisons.map((c, i) => {
          const qty = (monthlyAmount / c.value).toFixed(1).replace('.', ',')
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.icon}</span>
                <span className="text-sm" style={{ color: 'var(--c-muted)' }}>{c.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--c-ink)' }}>
                {qty} {c.unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
