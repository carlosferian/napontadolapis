import React from 'react'

interface CalculatorCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function CalculatorCard({ title, subtitle, children }: CalculatorCardProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-brand-graphite card-shadow p-6 sm:p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pencil/5 -mr-8 -mt-8 rounded-full" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-brand-graphite font-serif tracking-tight">{title}</h1>
        {subtitle && <p className="text-stone-500 font-medium italic mt-1">{subtitle}</p>}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
