import React from 'react'

interface ResultHeroProps {
  label: string
  value: string
  comment?: string
  colorClass?: string
}

export function ResultHero({ label, value, comment, colorClass = 'text-category-saving' }: ResultHeroProps) {
  return (
    <div className="text-center py-10 px-6 bg-brand-pencil/5 rounded-[40px] border-2 border-brand-pencil/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-brand-pencil/30" />
      <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      <p className={`text-5xl sm:text-6xl font-bold tabular-nums font-serif tracking-tighter ${colorClass}`}>{value}</p>
      {comment && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="w-8 h-px bg-stone-200" />
          <p className="text-xl font-hand text-stone-500 max-w-xs">{comment}</p>
        </div>
      )}
    </div>
  )
}
