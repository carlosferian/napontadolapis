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
  return (
    <div className={`grid gap-3 ${metrics.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {metrics.map((m, i) => (
        <MetricCard key={i} {...m} />
      ))}
    </div>
  )
}
