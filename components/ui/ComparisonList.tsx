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
    <div className="bg-white rounded-2xl border border-stone-100 p-5">
      <h3 className="text-sm font-medium text-stone-500 mb-4">{title}</h3>
      <div className="space-y-3">
        {comparisons.map((c, i) => {
          const qty = (monthlyAmount / c.value).toFixed(1).replace('.', ',')
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.icon}</span>
                <span className="text-sm text-stone-600">{c.label}</span>
              </div>
              <span className="text-sm font-semibold text-stone-800">
                {qty} {c.unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
