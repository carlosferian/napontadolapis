import React from 'react'

interface ResultHeroProps {
  label: string
  value: string
  comment?: string
  colorClass?: string
}

export function ResultHero({ label, value, comment, colorClass = 'text-red-500' }: ResultHeroProps) {
  return (
    <div className="text-center py-6 px-4 bg-stone-50 rounded-2xl border border-stone-100">
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`number-hero ${colorClass}`}>{value}</p>
      {comment && (
        <p className="text-sm italic text-stone-400 mt-2">{comment}</p>
      )}
    </div>
  )
}
