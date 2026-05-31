import React, { useState } from 'react'

interface ResultHeroProps {
  label: string
  value: string
  comment?: string
  colorClass?: string
  infoTooltip?: string
}

export function ResultHero({ label, value, comment, colorClass = 'text-category-saving', infoTooltip }: ResultHeroProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="text-center py-12 px-6 bg-brand-pencil/5 rounded-[40px] border-2 border-brand-pencil/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-brand-pencil/30" />
      <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider sm:tracking-[0.2em] mb-4 leading-relaxed max-w-full" style={{ color: 'var(--c-muted)' }}>{label}</p>
      <p className={`text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tabular-nums font-serif tracking-tighter break-words ${colorClass}`}>{value}</p>
      {comment && (
        <div className="mt-6 flex flex-col items-center gap-2 relative">
          <div className="w-8 h-px" style={{ backgroundColor: 'var(--c-line)' }} />
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto relative group">
            <p className="text-xl sm:text-2xl font-hand" style={{ color: 'var(--c-ink-2)' }}>{comment}</p>
            {infoTooltip && (
              <span className="relative inline-block align-middle flex-shrink-0">
                <button
                  type="button"
                  className="w-4 h-4 rounded-full border text-[9px] flex items-center justify-center transition-colors focus:outline-none cursor-pointer font-sans"
                  style={{ borderColor: 'var(--c-line-strong)', color: 'var(--c-muted)' }}
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                  onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
                  aria-label="Mais informações"
                >
                  i
                </button>
                {open && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 text-xs rounded-xl z-50 leading-relaxed shadow-xl font-sans text-center"
                    style={{
                      backgroundColor: 'var(--c-surface)',
                      color: 'var(--c-ink)',
                      border: '1px solid var(--c-line)'
                    }}
                  >
                    {infoTooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-850 dark:border-t-stone-900" />
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
