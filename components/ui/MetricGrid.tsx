import React from 'react'
import { MetricCard } from './MetricCard'

interface Metric {
  label: string
  value: string
  sublabel?: string
  colorClass?: string
}

interface MetricGridProps {
  metrics: Metric[]
}

export function MetricGrid({ metrics }: MetricGridProps) {
  const colClass = metrics.length === 4 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
  return (
    <div className={`grid gap-2 sm:gap-3 ${colClass}`}>
      {metrics.map((m, i) => (
        <MetricCard key={i} {...m} />
      ))}
    </div>
  )
}
