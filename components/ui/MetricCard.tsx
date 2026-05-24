import React from 'react'

interface MetricCardProps {
  label: string
  value: string
  sublabel?: string
  colorClass?: string
}

export function MetricCard({ label, value, sublabel, colorClass = 'text-brand-graphite' }: MetricCardProps) {
  return (
    <div className="bg-stone-50/50 rounded-xl sm:rounded-2xl border border-stone-200 min-w-0
                    flex items-center justify-between gap-2 px-4 py-3
                    sm:flex-col sm:justify-center sm:text-center sm:px-5 sm:py-5 sm:min-h-[120px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 leading-tight flex-1 sm:flex-none sm:mb-2">{label}</p>
      <div className="flex flex-col items-end sm:items-center">
        <p className={`text-xl font-bold tabular-nums font-serif leading-tight whitespace-nowrap sm:text-2xl ${colorClass}`}>{value}</p>
        {sublabel && <p className="hidden sm:block text-xs text-stone-500 mt-2 leading-none">{sublabel}</p>}
      </div>
    </div>
  )
}
