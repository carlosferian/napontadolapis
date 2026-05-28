import React from 'react'

interface ResultHeroProps {
  label: string
  value: string
  comment?: string
  colorClass?: string
}

export function ResultHero({ label, value, comment, colorClass = 'text-category-saving' }: ResultHeroProps) {
  return (
    <div className="text-center py-12 px-6 bg-brand-pencil/5 rounded-[40px] border-2 border-brand-pencil/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-brand-pencil/30" />
      <p className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--c-muted)' }}>{label}</p>
      <p className={`text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums font-serif tracking-tighter ${colorClass}`}>{value}</p>
      {comment && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="w-8 h-px" style={{ backgroundColor: 'var(--c-line)' }} />
          <p className="text-xl sm:text-2xl font-hand max-w-sm" style={{ color: 'var(--c-muted)' }}>{comment}</p>
        </div>
      )}
    </div>
  )
}
