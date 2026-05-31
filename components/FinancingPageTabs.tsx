'use client'

import React, { useState } from 'react'
import { QuickConsorcioCalculator }    from './calculators/QuickConsorcioCalculator'
import { FinancingComparisonCalculator } from './calculators/FinancingComparisonCalculator'

export function FinancingPageTabs() {
  const [tab, setTab] = useState<'quick' | 'full'>('quick')

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-1 flex gap-1" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)', maxWidth: 480 }}>
        <button
          onClick={() => setTab('quick')}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          style={tab === 'quick'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          ⚡ Quem Vence?
        </button>
        <button
          onClick={() => setTab('full')}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          style={tab === 'full'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          📊 Análise Completa
        </button>
      </div>

      {tab === 'quick' ? <QuickConsorcioCalculator /> : <FinancingComparisonCalculator />}
    </div>
  )
}
