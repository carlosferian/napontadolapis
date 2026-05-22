'use client'

import React, { useState } from 'react'
import { CalculatorCard } from '@/components/ui/CalculatorCard'
import { SliderField } from '@/components/ui/SliderField'
import { ResultHero } from '@/components/ui/ResultHero'
import { MetricGrid } from '@/components/ui/MetricGrid'
import { ComparisonList } from '@/components/ui/ComparisonList'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ShareCardBase } from '@/components/share/ShareCard'
import { compoundMonthly } from '@/lib/calculations/compound'
import { formatBRL } from '@/lib/formatters'
import { comments } from '@/lib/contextualComments'
import { RATES } from '@/config/rates'

const comparisons = [
  { icon: '🛒', label: 'Semanas de mercado', value: 800 / 4, unit: 'semanas' },
  { icon: '📱', label: 'Mensalidades de celular', value: 60, unit: 'meses' },
  { icon: '✈️', label: 'Passagens SP→RJ', value: 350, unit: 'passagens' },
  { icon: '📚', label: 'Livros por mês', value: 45, unit: 'livros' },
]

export function BetsCalculator() {
  const [monthly, setMonthly] = useState(300)
  const [months, setMonths] = useState(12)

  const totalSpent = monthly * months
  const projection5y = monthly * 60
  const invested5y = compoundMonthly(monthly, 5, RATES.selic)
  const difference = invested5y - projection5y

  return (
    <div className="space-y-4">
      <CalculatorCard title="Calculadora de Apostas" subtitle="Sem julgamento. Só os números.">
        <SliderField
          id="monthly-bet"
          label="Valor apostado por mês"
          value={monthly}
          min={50}
          max={5000}
          step={50}
          onChange={setMonthly}
        />
        <SliderField
          id="months-bet"
          label="Há quantos meses aposta"
          value={months}
          min={1}
          max={60}
          step={1}
          onChange={setMonths}
          formatValue={(v) => `${v} ${v === 1 ? 'mês' : 'meses'}`}
        />
      </CalculatorCard>

      <div role="region" aria-live="polite" aria-label="Resultado do cálculo" className="space-y-4">
        <ResultHero
          label="O que saiu do seu bolso"
          value={formatBRL(totalSpent)}
          comment={comments.apostasTotal(totalSpent)}
          colorClass="text-red-500"
        />

        <SectionDivider label="Projeção em 5 anos" />

        <MetricGrid
          metrics={[
            { label: 'No ritmo atual', value: formatBRL(projection5y), sublabel: '5 anos apostando', colorClass: 'text-red-500' },
            { label: 'Se investido na Selic', value: formatBRL(invested5y), sublabel: `${(RATES.selic * 100).toFixed(2)}% a.a.`, colorClass: 'text-emerald-600' },
            { label: 'Diferença', value: formatBRL(difference), sublabel: 'a favor do investimento', colorClass: 'text-amber-500' },
          ]}
        />

        <SectionDivider label={`Com R$ ${monthly}/mês você pagaria`} />

        <ComparisonList monthlyAmount={monthly} comparisons={comparisons} />

        <div className="bg-stone-50 rounded-2xl p-4">
          <p className="text-xs text-stone-400 mb-3 text-center">Compartilhe o resultado</p>
          <div className="overflow-x-auto">
            <ShareCardBase
              id="bets-share-card"
              eyebrow="meus gastos com apostas"
              mainValue={formatBRL(monthly) + '/mês'}
              mainLabel="valor apostado mensalmente"
              metrics={[
                { label: 'já perdi', value: formatBRL(totalSpent) },
                { label: 'em 5 anos', value: formatBRL(projection5y) },
                { label: 'se investido', value: formatBRL(invested5y) },
                { label: 'diferença', value: '+' + formatBRL(difference) },
              ]}
              footer="a conta chegou faz tempo."
              bgColor="#1c1917"
              accentColor="#e8a838"
            />
          </div>
          <div className="mt-3">
            <ShareButtons cardId="bets-share-card" filename="apostas" />
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Selic utilizada: {(RATES.selic * 100).toFixed(2)}% a.a. — {RATES.lastUpdated}. Valores são estimativas.
        </p>
      </div>
    </div>
  )
}
