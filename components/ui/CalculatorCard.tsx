import React from 'react'

interface CalculatorCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function CalculatorCard({ title, subtitle, children }: CalculatorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {subtitle && <p className="text-sm italic text-stone-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
