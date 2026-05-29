import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface Comparison {
  icon: React.ComponentType<any> | string
  label: string
  value: number
  unit: string
  explanation?: string
}

interface ComparisonListProps {
  monthlyAmount: number
  comparisons: Comparison[]
  title?: string
}

function ComparisonItem({ comparison, monthlyAmount }: { comparison: Comparison; monthlyAmount: number }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const qty = (monthlyAmount / comparison.value).toFixed(1).replace('.', ',')
  const IconComponent = comparison.icon

  return (
    <div 
      className="flex items-center justify-between p-2.5 -mx-2.5 rounded-xl hover:bg-stone-500/5 transition-colors relative group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(v => !v)}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--c-copper-soft)', color: 'var(--c-copper)' }}>
          {typeof IconComponent === 'string' ? (
            <span className="text-lg">{IconComponent}</span>
          ) : (
            <IconComponent size={18} className="transition-transform group-hover:scale-110 duration-200" />
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium" style={{ color: 'var(--c-ink-2)' }}>{comparison.label}</span>
          {comparison.explanation && (
            <HelpCircle 
              size={13} 
              className="opacity-40 group-hover:opacity-80 transition-opacity cursor-help"
              style={{ color: 'var(--c-muted)' }}
            />
          )}
        </div>
      </div>
      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-ink)' }}>
        {qty} {comparison.unit}
      </span>

      {/* Tooltip */}
      {comparison.explanation && showTooltip && (
        <div 
          className="absolute left-4 bottom-full mb-2 w-64 p-3 text-xs rounded-xl z-50 shadow-xl leading-relaxed font-sans"
          style={{
            backgroundColor: 'var(--c-surface)',
            color: 'var(--c-ink)',
            border: '1px solid var(--c-line)',
            transform: 'translateY(-2px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--c-copper)' }}>Como calculamos?</p>
          <p className="opacity-90" style={{ color: 'var(--c-ink-2)' }}>
            {comparison.explanation}
          </p>
          <p className="text-[10px] mt-1.5 border-t pt-1" style={{ borderColor: 'var(--c-line)', color: 'var(--c-muted)' }}>
            Custo unitário base: R$ {comparison.value.toFixed(2).replace('.', ',')}
          </p>
          <div className="absolute top-full left-4 border-[6px] border-transparent" style={{ borderTopColor: 'var(--c-line)' }} />
          <div className="absolute top-full left-[17px] border-[5px] border-transparent" style={{ borderTopColor: 'var(--c-surface)' }} />
        </div>
      )}
    </div>
  )
}

export function ComparisonList({ monthlyAmount, comparisons, title = 'Com esse valor você pagaria' }: ComparisonListProps) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--c-card-calm)', border: '1px solid var(--c-line)' }}>
      <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--c-muted)' }}>{title}</h3>
      <div className="space-y-3">
        {comparisons.map((c, i) => (
          <ComparisonItem key={i} comparison={c} monthlyAmount={monthlyAmount} />
        ))}
      </div>
    </div>
  )
}

