'use client'

import React, { useState } from 'react'
import { SimpleIncomeCalculator } from './calculators/SimpleIncomeCalculator'
import { IncomeCalculator }       from './calculators/IncomeCalculator'

export function IncomePageTabs() {
  const [tab, setTab] = useState<'simple' | 'full'>('simple')

  return (
    <div className="space-y-6">

      {/* Seletor de abas */}
      <div className="rounded-2xl border p-1 flex gap-1" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)', maxWidth: 480 }}>
        <button
          onClick={() => setTab('simple')}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          style={tab === 'simple'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          ⚡ Cálculo Rápido
        </button>
        <button
          onClick={() => setTab('full')}
          className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          style={tab === 'full'
            ? { background: 'var(--c-card-calm)', boxShadow: 'var(--c-shadow-card)', color: 'var(--c-ink)', border: '1px solid var(--c-line)' }
            : { color: 'var(--c-muted)', border: '1px solid transparent' }
          }
        >
          📊 Planejador Completo
        </button>
      </div>

      {/* Conteúdo */}
      {tab === 'simple' ? <SimpleIncomeCalculator /> : <IncomeCalculator />}
    </div>
  )
}
