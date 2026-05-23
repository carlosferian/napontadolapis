import React from 'react'

interface MetricCardProps {
  label: string
  value: string
  sublabel?: string
  colorClass?: string
}

export function MetricCard({ label, value, sublabel, colorClass = 'text-brand-graphite' }: MetricCardProps) {
  return (
    <div className="bg-stone-50/50 rounded-2xl p-5 border border-stone-200 text-center flex flex-col justify-center min-h-[120px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      <p className={`text-2xl font-bold tabular-nums font-serif ${colorClass}`}>{value}</p>
      {sublabel && <p className="text-xs font-hand text-stone-500 mt-2 text-lg leading-none">{sublabel}</p>}
    </div>
  )
}
