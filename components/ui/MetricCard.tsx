import React from 'react'

interface MetricCardProps {
  label: string
  value: string
  sublabel?: string
  colorClass?: string
}

export function MetricCard({ label, value, sublabel, colorClass = 'text-brand-graphite' }: MetricCardProps) {
  const displayColorClass = colorClass === 'text-brand-graphite' ? '' : colorClass
  return (
    <div className="rounded-xl sm:rounded-2xl min-w-0
                    flex items-center justify-between gap-2 px-4 py-3
                    sm:flex-col sm:justify-center sm:text-center sm:px-5 sm:py-5 sm:min-h-[120px]"
         style={{ backgroundColor: 'var(--c-surface)', border: '1px solid var(--c-line)' }}>
      <p className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-tight flex-1 sm:flex-none sm:mb-2" style={{ color: 'var(--c-muted)' }}>{label}</p>
      <div className="flex flex-col items-end sm:items-center">
        <p className={`text-xl font-bold tabular-nums font-serif leading-tight whitespace-nowrap sm:text-2xl ${displayColorClass}`}
           style={displayColorClass ? undefined : { color: 'var(--c-ink)' }}>{value}</p>
        {sublabel && <p className="hidden sm:block text-xs sm:text-sm mt-2 leading-none" style={{ color: 'var(--c-muted)' }}>{sublabel}</p>}
      </div>
    </div>
  )
}
