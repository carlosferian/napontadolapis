import React from 'react'

interface MetricCardProps {
  label: string
  value: string
  sublabel?: string
  colorClass?: string
}

export function MetricCard({ label, value, sublabel, colorClass = 'text-stone-900' }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${colorClass}`}>{value}</p>
      {sublabel && <p className="text-xs text-stone-400 mt-1">{sublabel}</p>}
    </div>
  )
}
