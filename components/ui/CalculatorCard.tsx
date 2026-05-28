import React from 'react'

interface CalculatorCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function CalculatorCard({ title, subtitle, children }: CalculatorCardProps) {
  return (
    <div className="calm-card p-6 sm:p-8 space-y-8 relative overflow-hidden" style={{ border: '2px solid var(--c-line-strong)' }}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--c-emerald-soft)] -mr-8 -mt-8 rounded-full" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold font-serif tracking-tight" style={{ color: 'var(--c-ink)' }}>{title}</h1>
        {subtitle && <p className="font-medium italic mt-1" style={{ color: 'var(--c-muted)' }}>{subtitle}</p>}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
